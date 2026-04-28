#!/usr/bin/env python3
"""
Actualiza el índice de búsqueda y ALL_IDS en index.html
a partir de los JSON presentes en bidiso_resultados_layout/.

Uso:
    python3 actualizar_indice.py
"""
import json, os, sys, glob, re

BASE    = os.path.dirname(os.path.abspath(__file__))
LAYOUT  = os.path.join(BASE, 'bidiso_resultados_layout')
IDX_ALL = os.path.join(BASE, 'search_index_pages.json')
IDX_1   = os.path.join(BASE, 'search_index_pages_1.json')
IDX_2   = os.path.join(BASE, 'search_index_pages_2.json')
HTML    = os.path.join(BASE, 'index.html')


# ── extracción de texto (igual que build_index_pages.py) ──────────────────────

def page_num(file_path):
    m = re.search(r'-(\d+)\.\w+$', file_path or '')
    return int(m.group(1)) if m else 0


def extract_text_from_content(content):
    try:
        elements = json.loads(content)
        return ' '.join(el.get('text', '') for el in elements if el.get('text'))
    except Exception:
        content = content.replace('“', '"').replace('”', '"')
        hits = re.findall(r'"text"\s*:\s*"((?:[^"\\]|\\.)*)"', content)
        for m in re.findall(r'"bbox\)\):\s*(?:[,\[]*"?)([^"{}]{2,})"?\}', content):
            m = m.strip(' ,[]"')
            if m:
                hits.append(m)
        _skip = re.compile(r'too blurry|cannot read|can\'t read|not legible|illegible', re.I)
        for m in re.findall(r'"bbox\*\*:\s*"?\*\*([^*"{}]{2,})\*\*', content):
            if not _skip.search(m):
                hits.append(m.strip(' .*'))
        for m in re.findall(r'"bbox\*\*:\s*-\s*([^*"{}]{3,?}?)(?:\*\*)?["}]', content):
            if not _skip.search(m):
                hits.append(m.strip())
        for m in re.findall(r'"bbox\*\*:\s*\["(-?[^"{}]{2,})"', content):
            if not _skip.search(m):
                hits.append(m.strip())
        for m in re.findall(r'"category"\s*:\s*"Text"\s*,\s*"\*\*(-?[^*"{}]{2,})\*\*"', content):
            if not _skip.search(m):
                hits.append(m.strip())
        return ' '.join(hits)


def extract_pages(data):
    items = []
    for pd in sorted(data, key=lambda p: page_num(p.get('file', ''))):
        pn   = page_num(pd.get('file', ''))
        text = ''
        raw  = pd.get('text', '')
        if raw:
            try:
                choices = json.loads(raw)
                content = choices[0]['choices'][0]['message']['content']
                text    = extract_text_from_content(content)
            except Exception:
                pass
        items.append([pn, text])
    return items


# ── paso 1: construir índice completo ─────────────────────────────────────────

def build_index():
    files = sorted(glob.glob(os.path.join(LAYOUT, '*.json')))
    total = len(files)
    if not total:
        print(f'No se encontraron JSONs en {LAYOUT}')
        sys.exit(1)

    index = {}
    errors = []
    for i, path in enumerate(files, 1):
        doc_id = os.path.splitext(os.path.basename(path))[0]
        try:
            with open(path, encoding='utf-8') as f:
                data = json.load(f)
            index[doc_id] = extract_pages(data)
        except Exception as e:
            index[doc_id] = []
            errors.append(f'  [!] {doc_id}: {e}')

        if i % 100 == 0 or i == total:
            print(f'\r  {i}/{total} ({i*100//total}%)', end='', flush=True)

    print()
    for err in errors:
        print(err, file=sys.stderr)

    with open(IDX_ALL, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, separators=(',', ':'))

    mb = os.path.getsize(IDX_ALL) / 1024 / 1024
    pages_total = sum(len(v) for v in index.values())
    print(f'  → {IDX_ALL}  ({mb:.1f} MB, {len(index)} docs, {pages_total} páginas)')
    return index


# ── paso 2: dividir en dos partes ─────────────────────────────────────────────

def split_index(index):
    keys  = list(index.keys())
    mid   = len(keys) // 2
    part1 = {k: index[k] for k in keys[:mid]}
    part2 = {k: index[k] for k in keys[mid:]}

    for path, part in [(IDX_1, part1), (IDX_2, part2)]:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(part, f, ensure_ascii=False, separators=(',', ':'))
        mb = os.path.getsize(path) / 1024 / 1024
        print(f'  → {os.path.basename(path)}  ({mb:.1f} MB, {len(part)} docs)')


# ── paso 3: actualizar ALL_IDS en index.html ──────────────────────────────────

def update_all_ids(index):
    ids_sorted = sorted(index.keys(), key=lambda x: int(x))
    ids_str    = ', '.join(f'"{i}"' for i in ids_sorted)
    new_line   = f'const ALL_IDS = [{ids_str}];'

    with open(HTML, encoding='utf-8') as f:
        html = f.read()

    new_html, n = re.subn(r'const ALL_IDS = \[.*?\];', new_line, html, flags=re.DOTALL)
    if n == 0:
        print('  [!] No se encontró ALL_IDS en index.html — revisa el patrón')
        return

    with open(HTML, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f'  → index.html  (ALL_IDS: {len(ids_sorted)} IDs)')


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    print('1/3  Construyendo índice de páginas…')
    index = build_index()

    print('2/3  Dividiendo en dos partes…')
    split_index(index)

    print('3/3  Actualizando ALL_IDS en index.html…')
    update_all_ids(index)

    print('\nHecho.')


if __name__ == '__main__':
    main()
