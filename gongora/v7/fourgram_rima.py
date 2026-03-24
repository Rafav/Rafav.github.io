#!/usr/bin/env python3
"""
4-grama sobre palabras de rima invertidas.
Análisis estilométrico de hábito fonológico por corpus.
"""

import csv
import unicodedata
import math
from collections import defaultdict, Counter

# ── Normalización ────────────────────────────────────────────────────────────

TILDE_MAP = str.maketrans(
    'áéíóúüÁÉÍÓÚÜ',
    'aeiouuAEIOUU'
)

def normaliza(word: str) -> str:
    """Minúsculas, elimina diacríticos excepto ü/diéresis de cómputo."""
    w = word.strip().lower()
    # Preservamos la posición de la diéresis (cuenta sílaba) antes de quitar tildes
    w = w.translate(TILDE_MAP)
    return w

def fourgram(word: str) -> str:
    """4-grama sobre la cadena invertida: captura sílaba tónica sin morfema."""
    n = normaliza(word)
    if len(n) < 4:
        return n[::-1].ljust(4, '_')   # padding para palabras cortas
    return n[::-1][:4]

# ── Lectura del CSV ───────────────────────────────────────────────────────────

def leer_csv(path: str):
    sonetos = defaultdict(list)   # (corpus, soneto_n) → [(verso_n, estrofa, ultima_palabra)]
    with open(path, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            corpus     = row['corpus'].strip('"')
            soneto_n   = row['soneto_n'].strip('"')
            verso_n    = int(row['verso_n'].strip('"'))
            estrofa    = row['estrofa'].strip('"')
            ultima     = row['ultima_palabra'].strip('"')
            sonetos[(corpus, soneto_n)].append((verso_n, estrofa, ultima))
    return sonetos

# ── Array de sufijos (SA) sobre 4-gramas concatenados ────────────────────────

def construir_sa_corpus(sonetos: dict, corpus_target: str):
    """
    Concatena los 4-gramas de todos los sonetos del corpus en una sola cadena
    de tokens separados por '$' (centinela). Devuelve:
      - tokens: list[str]
      - sa: list[int]  (índices ordenados lexicográficamente)
      - origen: list[tuple]  (corpus, soneto_n, verso_n) para cada token
    """
    tokens = []
    origen = []
    for (corpus, soneto_n), versos in sorted(sonetos.items()):
        if corpus != corpus_target:
            continue
        for verso_n, estrofa, palabra in sorted(versos):
            fg = fourgram(palabra)
            tokens.append(fg)
            origen.append((corpus, soneto_n, verso_n, estrofa, palabra, fg))
        tokens.append('$')
        origen.append((corpus, soneto_n, -1, '', '$', '$'))

    # SA: índices que ordenan todos los sufijos de la lista de tokens
    sa = sorted(range(len(tokens)), key=lambda i: tokens[i:])
    return tokens, sa, origen

# ── Histograma de 4-gramas por corpus ────────────────────────────────────────

def histograma_corpus(sonetos: dict, corpus_target: str) -> Counter:
    hist = Counter()
    for (corpus, _), versos in sonetos.items():
        if corpus != corpus_target:
            continue
        for _, _, palabra in versos:
            hist[fourgram(palabra)] += 1
    return hist

def histograma_por_soneto(sonetos: dict, corpus_target: str) -> dict:
    """Un histograma de 4-gramas por soneto individual."""
    por_soneto = {}
    for (corpus, soneto_n), versos in sonetos.items():
        if corpus != corpus_target:
            continue
        h = Counter(fourgram(p) for _, _, p in versos)
        por_soneto[soneto_n] = h
    return por_soneto

# ── Distancia coseno ──────────────────────────────────────────────────────────

def coseno(h1: Counter, h2: Counter) -> float:
    vocab = set(h1) | set(h2)
    dot   = sum(h1.get(k, 0) * h2.get(k, 0) for k in vocab)
    n1    = math.sqrt(sum(v*v for v in h1.values()))
    n2    = math.sqrt(sum(v*v for v in h2.values()))
    if n1 == 0 or n2 == 0:
        return 1.0
    return 1.0 - dot / (n1 * n2)

def jsd(h1: Counter, h2: Counter) -> float:
    """Jensen-Shannon divergence (base 2), simétrica y acotada [0,1]."""
    vocab = set(h1) | set(h2)
    t1, t2 = sum(h1.values()), sum(h2.values())
    if t1 == 0 or t2 == 0:
        return 1.0
    p = {k: h1.get(k, 0) / t1 for k in vocab}
    q = {k: h2.get(k, 0) / t2 for k in vocab}
    m = {k: (p[k] + q[k]) / 2 for k in vocab}
    def kl(a, b):
        return sum(a[k] * math.log2(a[k] / b[k]) for k in vocab if a[k] > 0 and b[k] > 0)
    return (kl(p, m) + kl(q, m)) / 2

# ── Exclusividad de 4-gramas por corpus ──────────────────────────────────────

def fourgrams_exclusivos(histogramas: dict) -> dict:
    """
    Para cada corpus, 4-gramas que aparecen en él pero NO en ningún otro.
    """
    exclusivos = {}
    for corpus, hist in histogramas.items():
        otros = set()
        for c2, h2 in histogramas.items():
            if c2 != corpus:
                otros |= set(h2.keys())
        excl = {k: v for k, v in hist.items() if k not in otros}
        exclusivos[corpus] = Counter(excl)
    return exclusivos

# ── Clasificación de sonetos sin_asignar ──────────────────────────────────────

def clasificar_sin_asignar(sonetos: dict, corpora_ref: list) -> list:
    """
    Para cada soneto sin_asignar, calcula distancia coseno y JSD
    respecto al histograma agregado de cada corpus de referencia.
    Devuelve ranking de similitud.
    """
    refs = {c: histograma_corpus(sonetos, c) for c in corpora_ref}

    resultados = []
    for (corpus, soneto_n), versos in sorted(sonetos.items()):
        if corpus != 'sin_asignar':
            continue
        h_soneto = Counter(fourgram(p) for _, _, p in versos)
        fila = {'soneto': soneto_n, 'fg': dict(h_soneto)}
        for c, href in refs.items():
            fila[f'cos_{c}']  = round(coseno(h_soneto, href), 4)
            fila[f'jsd_{c}']  = round(jsd(h_soneto, href), 4)
        # Ranking por coseno
        ranking_cos = sorted(corpora_ref, key=lambda c: fila[f'cos_{c}'])
        fila['mas_cercano_cos'] = ranking_cos[0]
        fila['ranking_cos'] = ranking_cos
        resultados.append(fila)
    return resultados

# ── Impresión ─────────────────────────────────────────────────────────────────

def tabla(titulo, filas, cols, fmt=None):
    print(f"\n{'═'*70}")
    print(f"  {titulo}")
    print('═'*70)
    anchos = [max(len(str(c)), max(len(str(f.get(c,'') if isinstance(f,dict) else f[i]))
              for f in filas)) for i, c in enumerate(cols)]
    cabecera = '  '.join(str(c).ljust(a) for c, a in zip(cols, anchos))
    print(cabecera)
    print('─'*70)
    for fila in filas:
        if isinstance(fila, dict):
            vals = [fila.get(c, '') for c in cols]
        else:
            vals = list(fila)
        print('  '.join(str(v).ljust(a) for v, a in zip(vals, anchos)))

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    PATH = '/mnt/user-data/uploads/ultimas_palabras.csv'
    sonetos = leer_csv(PATH)

    corpora = sorted(set(c for c, _ in sonetos.keys()))
    print(f"\nCorpora detectados: {corpora}")
    print(f"Sonetos totales: {len(sonetos)}")

    # 1. Histogramas por corpus
    histogramas = {c: histograma_corpus(sonetos, c) for c in corpora}

    # 2. Top-10 4-gramas por corpus
    print(f"\n{'═'*70}")
    print("  TOP-10 4-GRAMAS POR CORPUS (frecuencia absoluta)")
    print('═'*70)
    for c in corpora:
        top = histogramas[c].most_common(10)
        print(f"\n  [{c}]  ({sum(histogramas[c].values())} tokens)")
        for fg, n in top:
            barra = '█' * n
            # Deshacer el 4-grama para mostrar ejemplos
            ejemplos = []
            for (corp, son), versos in sonetos.items():
                if corp != c:
                    continue
                for _, _, p in versos:
                    if fourgram(p) == fg and p not in ejemplos:
                        ejemplos.append(p)
                        if len(ejemplos) == 3:
                            break
                if len(ejemplos) == 3:
                    break
            ej_str = ', '.join(ejemplos)
            print(f"    {fg}  {n:3d}  {barra[:30]}  ← {ej_str}")

    # 3. Matriz de distancias coseno entre corpora
    print(f"\n{'═'*70}")
    print("  MATRIZ DISTANCIA COSENO (histogramas de corpus completos)")
    print('═'*70)
    print(f"{'':15}", end='')
    for c in corpora:
        print(f"{c:15}", end='')
    print()
    print('─'*70)
    for c1 in corpora:
        print(f"{c1:15}", end='')
        for c2 in corpora:
            d = coseno(histogramas[c1], histogramas[c2])
            print(f"{d:.4f}         ", end='')
        print()

    # 4. Matriz JSD
    print(f"\n{'═'*70}")
    print("  MATRIZ JENSEN-SHANNON DIVERGENCE")
    print('═'*70)
    print(f"{'':15}", end='')
    for c in corpora:
        print(f"{c:15}", end='')
    print()
    print('─'*70)
    for c1 in corpora:
        print(f"{c1:15}", end='')
        for c2 in corpora:
            d = jsd(histogramas[c1], histogramas[c2])
            print(f"{d:.4f}         ", end='')
        print()

    # 5. 4-gramas exclusivos por corpus
    exclusivos = fourgrams_exclusivos(histogramas)
    print(f"\n{'═'*70}")
    print("  4-GRAMAS EXCLUSIVOS POR CORPUS (no aparecen en ningún otro)")
    print('═'*70)
    for c in corpora:
        excl = exclusivos[c].most_common(8)
        if excl:
            print(f"\n  [{c}]")
            for fg, n in excl:
                ejemplos = []
                for (corp, son), versos in sonetos.items():
                    if corp != c:
                        continue
                    for _, _, p in versos:
                        if fourgram(p) == fg and p not in ejemplos:
                            ejemplos.append(p)
                            if len(ejemplos) == 3:
                                break
                    if len(ejemplos) == 3:
                        break
                ej_str = ', '.join(ejemplos)
                print(f"    {fg}  n={n}  ← {ej_str}")
        else:
            print(f"\n  [{c}]  (ninguno exclusivo)")

    # 6. Clasificación de sin_asignar
    corpora_ref = ['segura_A', 'segura_B', 'dudoso', 'contraejemplo']
    resultados = clasificar_sin_asignar(sonetos, corpora_ref)

    print(f"\n{'═'*70}")
    print("  CLASIFICACIÓN DE SONETOS sin_asignar")
    print("  (distancia coseno respecto al histograma agregado de cada corpus)")
    print('═'*70)
    print(f"  {'soneto':8}", end='')
    for c in corpora_ref:
        print(f"  cos_{c[:8]:10}", end='')
    print(f"  {'más cercano':15}")
    print('─'*70)
    for r in resultados:
        print(f"  {r['soneto']:8}", end='')
        for c in corpora_ref:
            print(f"  {r[f'cos_{c}']:.4f}      ", end='')
        mc = r['mas_cercano_cos']
        print(f"  → {mc}")

    # 7. Resumen cuantitativo
    conteo = Counter(r['mas_cercano_cos'] for r in resultados)
    print(f"\n{'═'*70}")
    print("  RESUMEN: sin_asignar → corpus más cercano (por coseno)")
    print('═'*70)
    total = len(resultados)
    for c, n in conteo.most_common():
        barra = '█' * n
        print(f"  {c:20}  {n:3d}/{total}  {barra}")

    # 8. SA demo: búsqueda de 4-grama específico en todo el corpus
    print(f"\n{'═'*70}")
    print("  DEMO SA: apariciones de 4-gramas más frecuentes en todo el corpus")
    print('═'*70)
    todos = Counter()
    for h in histogramas.values():
        todos.update(h)

    for fg, _ in todos.most_common(5):
        apariciones = defaultdict(list)
        for (corpus, soneto_n), versos in sonetos.items():
            for verso_n, estrofa, palabra in versos:
                if fourgram(palabra) == fg:
                    apariciones[corpus].append((soneto_n, verso_n, palabra))
        distrib = {c: len(v) for c, v in apariciones.items()}
        print(f"\n  4-grama '{fg}':  {dict(distrib)}")
        # Mostrar un par de ejemplos por corpus
        for corpus, casos in sorted(apariciones.items()):
            ejemplos = [f"{p}(s{s}v{v})" for s, v, p in casos[:3]]
            print(f"    {corpus:20} {', '.join(ejemplos)}")


if __name__ == '__main__':
    main()
