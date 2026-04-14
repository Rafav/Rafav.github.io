#!/usr/bin/env python3
"""
Genera search_index_pages.json: {id: [[pageNum, text], ...]} ordenado por página.
Permite búsqueda global con navegación directa a la página exacta del resultado.

Uso:
    python3 build_index_pages.py
"""
import json, os, sys, glob, re

LAYOUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bidiso_resultados_layout')
OUT_FILE   = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'search_index_pages.json')


def page_num(file_path):
    m = re.search(r'-(\d+)\.\w+$', file_path or '')
    return int(m.group(1)) if m else 0


def extract_text_from_content(content):
    """Extrae texto de content: primero JSON estricto, luego regex como fallback."""
    try:
        elements = json.loads(content)
        return ' '.join(el.get('text', '') for el in elements if el.get('text'))
    except Exception:
        # Normalizar comillas tipográficas antes de aplicar regex
        content = content.replace('\u201c', '"').replace('\u201d', '"')
        # Fallback primario: valores de "text" en entradas bien formadas
        hits = re.findall(r'"text"\s*:\s*"((?:[^"\\]|\\.)*)"', content)
        # Fallback secundario: entradas con bbox roto que contienen texto recuperable
        # Patrón bbox)): → {"bbox)): texto"} o {"bbox)): ["texto"}
        for m in re.findall(r'"bbox\)\):\s*(?:[,\[]*"?)([^"{}]{2,})"?\}', content):
            m = m.strip(' ,[]"')
            if m:
                hits.append(m)
        # Patrón bbox**: → {"bbox**: "**texto**"} o {"bbox**: - texto**"}
        # Excluir mensajes de error del modelo ("too blurry", "cannot read", etc.)
        _skip = re.compile(r'too blurry|cannot read|can\'t read|not legible|illegible', re.I)
        for m in re.findall(r'"bbox\*\*:\s*"?\*\*([^*"{}]{2,})\*\*', content):
            if not _skip.search(m):
                hits.append(m.strip(' .*'))
        for m in re.findall(r'"bbox\*\*:\s*-\s*([^*"{}]{3,?}?)(?:\*\*)?["}]', content):
            if not _skip.search(m):
                hits.append(m.strip())
        # Patrón bbox**: con array → {"bbox**: ["texto"]}
        for m in re.findall(r'"bbox\*\*:\s*\["(-?[^"{}]{2,})"', content):
            if not _skip.search(m):
                hits.append(m.strip())
        # Patrón "category": "Text" con clave **texto** → {"bbox":[...],"category":"Text","**texto**"}
        for m in re.findall(r'"category"\s*:\s*"Text"\s*,\s*"\*\*(-?[^*"{}]{2,})\*\*"', content):
            if not _skip.search(m):
                hits.append(m.strip())
        return ' '.join(hits)


def extract_pages(data):
    """Devuelve [[pageNum, texto], ...] ordenado por número de página."""
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


def main():
    files = sorted(glob.glob(os.path.join(LAYOUT_DIR, '*.json')))
    total = len(files)
    if not total:
        print(f'No se encontraron JSONs en {LAYOUT_DIR}')
        sys.exit(1)

    index = {}
    for i, path in enumerate(files, 1):
        doc_id = os.path.splitext(os.path.basename(path))[0]
        try:
            with open(path, encoding='utf-8') as f:
                data = json.load(f)
            index[doc_id] = extract_pages(data)
        except Exception as e:
            index[doc_id] = []
            print(f'  [!] {doc_id}: {e}', file=sys.stderr)

        if i % 100 == 0 or i == total:
            print(f'\r  {i}/{total} ({i*100//total}%)', end='', flush=True)

    print()
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, separators=(',', ':'))

    size_mb = os.path.getsize(OUT_FILE) / 1024 / 1024
    total_pages = sum(len(v) for v in index.values())
    print(f'Índice guardado: {OUT_FILE}  ({size_mb:.1f} MB, {len(index)} docs, {total_pages} páginas)')


if __name__ == '__main__':
    main()
