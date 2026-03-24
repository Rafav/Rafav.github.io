#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_pendientes.py

Genera gongora_pendientes_escansion.csv con la escansion automatica
de todos los sonetos del TXT OBVIL que NO estan ya en el CSV curado.

Formato identico a gongora_escansion_curada.csv:
  "corpus";"soneto_n";"año";"incipit";"verso_n";"texto";"patron_binario";"sil_metricas";"sinalefas";"estrofa";"fuente_xml"
"""

import csv
import sys
import os

# Asegurar que podemos importar desde el directorio del script
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'v6'))

from gongora_attribution_v52 import parse_corpus, analyze_verse


def load_curated_sonnet_numbers(csv_path):
    """Lee el CSV curado y devuelve el set de soneto_n (como int)."""
    nums = set()
    with open(csv_path, encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';', quotechar='"')
        header = next(reader)
        col_idx = header.index('soneto_n')
        for row in reader:
            if row:
                nums.add(int(row[col_idx]))
    return nums


def estrofa_label(verso_n):
    """Versos 1-8: cuarteto, 9-14: terceto."""
    return "cuarteto" if verso_n <= 8 else "terceto"


def corpus_label(section):
    """Mapea la seccion del parser al nombre de corpus del CSV."""
    return {"A": "segura_A", "B": "segura_B", "D": "dudoso"}[section]


def main():
    base = os.path.dirname(os.path.abspath(__file__))
    txt_path = os.path.join(base, 'gongora_obra-poetica.txt')
    csv_curado = os.path.join(base, 'gongora_escansion_curada.csv')
    csv_out = os.path.join(base, 'gongora_pendientes_escansion.csv')

    # 1. Cargar sonetos ya curados
    curados = load_curated_sonnet_numbers(csv_curado)
    print(f"[1] Sonetos en CSV curado: {len(curados)}")

    # 2. Parsear corpus completo
    A, B, D = parse_corpus(txt_path, date_split=1610)

    # Etiquetar cada soneto con su corpus
    all_sonnets = []
    for s in A:
        s['_corpus'] = 'A'
        all_sonnets.append(s)
    for s in B:
        s['_corpus'] = 'B'
        all_sonnets.append(s)
    for s in D:
        s['_corpus'] = 'D'
        all_sonnets.append(s)

    total_txt = len(all_sonnets)
    print(f"[2] Sonetos en TXT (14 versos): {total_txt} (A={len(A)}, B={len(B)}, D={len(D)})")

    # 3. Filtrar los pendientes
    pendientes = [s for s in all_sonnets if s['n'] not in curados]
    print(f"[3] Sonetos pendientes (nuevos): {len(pendientes)}")

    if not pendientes:
        print("No hay sonetos pendientes. No se genera CSV.")
        return

    # 4. Generar escansion y escribir CSV
    rows_written = 0
    with open(csv_out, 'w', encoding='utf-8', newline='') as f:
        # Escribir header
        f.write('"corpus";"soneto_n";"año";"incipit";"verso_n";"texto";"patron_binario";"sil_metricas";"sinalefas";"estrofa";"fuente_xml"\n')

        for sonnet in sorted(pendientes, key=lambda s: s['n']):
            corpus = corpus_label(sonnet['_corpus'])
            year = str(sonnet['y']) if sonnet.get('y') else ""
            incipit = sonnet['v'][0] if sonnet['v'] else ""

            for vi, verso_text in enumerate(sonnet['v'], start=1):
                result = analyze_verse(verso_text)

                patron = ''.join(str(b) for b in result['pattern'])
                sil_met = str(result['s'])
                sinalefas = str(result['sin'])
                estrofa = estrofa_label(vi)
                inc_field = incipit if vi == 1 else ""

                # Escribir con todos los campos entrecomillados y ; como delimitador
                fields = [
                    corpus,
                    str(sonnet['n']),
                    year,
                    inc_field,
                    str(vi),
                    verso_text,
                    patron,
                    sil_met,
                    sinalefas,
                    estrofa,
                    "OBVIL_auto"
                ]
                line = ';'.join(f'"{field}"' for field in fields)
                f.write(line + '\n')
                rows_written += 1

    print(f"\n{'='*60}")
    print(f"  RESUMEN")
    print(f"{'='*60}")
    print(f"  Sonetos en CSV curado:      {len(curados)}")
    print(f"  Sonetos en TXT (total):     {total_txt}")
    print(f"  Sonetos pendientes (nuevos): {len(pendientes)}")
    print(f"  Filas escritas:             {rows_written}")
    print(f"  Archivo generado:           {csv_out}")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
