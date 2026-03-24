#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════════
  gongora_v7.py — Atribución prosódica flexible

  Permite seleccionar cualquier combinación de subcorpus como referencia
  y evaluar cualquier otra combinación contra ella.

  Subcorpus disponibles: A (segura_A), B (segura_B), S (sin_asignar), D (dudoso)

  Uso:
    python3 gongora_v7.py escansion.csv --ref A+B+S --eval D
    python3 gongora_v7.py escansion.csv --ref A --eval B,D --also B
    python3 gongora_v7.py escansion.csv --ref A+B --eval S,D --also A,B
    python3 gongora_v7.py escansion.csv --ref B+S --eval A,D --also B,S

  Opciones:
    --ref   Subcorpus de referencia (default: A+B+S). Usar + para fusionar.
    --eval  Subcorpus a evaluar (default: D). Usar , para evaluar varios.
    --also  Distancias adicionales a subgrupos (default: ninguno).
            Cada subgrupo genera su propio centroide y distancia en la tabla.
    --html  Fichero HTML de salida (default: gongora_v7.html)
    --json  Fichero JSON de salida (default: gongora_v7.json)

  Vector: 33 rasgos prosódicos (sin entonación; alineado con gongora_attribution_v52.py)
  Dependencias: solo stdlib

  Autor: R. Vidal / Claude
  Fecha: marzo 2026
════════════════════════════════════════════════════════════════════════════════
"""

import csv, math, json, random, argparse, sys, re
from collections import Counter


# ══════════════════════════════════════════════════════════════════════════════
# LECTURA
# ══════════════════════════════════════════════════════════════════════════════

CORPUS_MAP = {
    'A': 'segura_A',
    'B': 'segura_B',
    'S': 'sin_asignar',
    'D': 'dudoso',
}

CORPUS_COLORS = {
    'A': '#c084fc',  # violeta
    'B': '#60a5fa',  # azul
    'S': '#22d3ee',  # cyan
    'D': '#f97316',  # naranja
}

CORPUS_STYLES = {
    'A': 'circle',
    'B': 'circle',
    'S': 'rect',
    'D': 'triangle',
}


def load_csv(filepath):
    """Lee CSV y devuelve dict de subcorpus: {'A': [...], 'B': [...], 'S': [...], 'D': [...]}"""
    with open(filepath, encoding='utf-8-sig') as f:
        first_line = f.readline()
        f.seek(0)
        delim = ';' if ';' in first_line else ','
        reader = csv.DictReader(f, delimiter=delim, quotechar='"')
        rows = list(reader)

    if not rows:
        print("ERROR: CSV vacio.", file=sys.stderr); sys.exit(1)

    for row in rows:
        for k in list(row.keys()):
            if k is None:
                row.pop(k); continue
            clean_k = k.strip().strip('\ufeff').strip('"')
            if clean_k != k:
                row[clean_k] = row.pop(k)

    required = {'corpus', 'soneto_n', 'verso_n', 'patron_binario', 'sil_metricas'}
    available = {k.strip('"') for k in rows[0].keys()}
    missing = required - available
    if missing:
        print(f"ERROR: Faltan columnas: {missing}", file=sys.stderr); sys.exit(1)

    # Agrupar por soneto
    raw_sonnets = {}
    for row in rows:
        corpus = row.get('corpus', '').strip()
        sn = row.get('soneto_n', '').strip()
        key = (corpus, sn)
        if key not in raw_sonnets:
            raw_sonnets[key] = []
        raw_sonnets[key].append(row)

    # Reverse map
    rev_map = {v: k for k, v in CORPUS_MAP.items()}

    subcorpora = {'A': [], 'B': [], 'S': [], 'D': []}
    for (corpus_label, sn), verses in raw_sonnets.items():
        tag = rev_map.get(corpus_label)
        if tag is None:
            print(f"  AVISO: corpus '{corpus_label}' soneto #{sn}, ignorado.", file=sys.stderr)
            continue

        verses.sort(key=lambda r: int(r.get('verso_n', 0)))
        year_str = verses[0].get('año', '').strip()
        year = int(year_str) if year_str.isdigit() else None
        inc = verses[0].get('texto', '')[:50] if verses else '?'

        verse_data = []
        for v in verses:
            pat_str = v.get('patron_binario', '').strip()
            pattern = [int(c) for c in pat_str if c in '01']
            sil_str = v.get('sil_metricas', '').strip()
            sil = int(sil_str) if sil_str.isdigit() else len(pattern)
            sin_str = v.get('sinalefas', '').strip()
            sin = int(sin_str) if sin_str.isdigit() else 0
            texto = v.get('texto', '').strip()
            lit = sum(1 for c in texto if c.isalpha())
            ent = 2 if '?' in texto or '¿' in texto else (1 if '!' in texto or '¡' in texto else 0)
            # Extraer última palabra del verso (para 4-gramas de rima)
            words = [w for w in re.sub(r'[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]', ' ', texto).split() if w]
            ultima = words[-1] if words else ''
            verse_data.append({'pattern': pattern, 's': sil, 'sin': sin, 'lit': lit, 'ent': ent, 'rima': ultima})

        sonnet = {'n': int(sn), 'y': year, 'inc': inc, 'tag': tag, 'verses': verse_data}

        if len(verse_data) != 14:
            print(f"  AVISO: #{sn} ({tag}) tiene {len(verse_data)} versos", file=sys.stderr)

        subcorpora[tag].append(sonnet)

    for tag in 'ABSD':
        print(f"[CSV] {tag}: {len(subcorpora[tag])} sonetos")

    return subcorpora


def parse_group_spec(spec):
    """Parsea 'A+B+S' → ['A','B','S'] o 'S,D' → ['S','D']"""
    # + para fusionar (referencia), , para listar (eval/also)
    parts = []
    for p in spec.replace('+', ',').split(','):
        p = p.strip().upper()
        if p and p in CORPUS_MAP:
            parts.append(p)
        elif p:
            print(f"AVISO: subcorpus '{p}' no reconocido, ignorado.", file=sys.stderr)
    return parts


# ══════════════════════════════════════════════════════════════════════════════
# 4-GRAMAS DE RIMA
# ══════════════════════════════════════════════════════════════════════════════

_TILDE_MAP = str.maketrans('áéíóúüÁÉÍÓÚÜ', 'aeiouuAEIOUU')

def _normaliza_rima(word):
    return word.strip().lower().translate(_TILDE_MAP)

def fourgram(word):
    """4-grama sobre la cadena invertida: captura terminación fonológica."""
    n = _normaliza_rima(word)
    if len(n) < 4:
        return n[::-1].ljust(4, '_')
    return n[::-1][:4]

_PARTIC_RE = re.compile(r'(?:ado|idos?|adas?|ido)$', re.IGNORECASE)


# ══════════════════════════════════════════════════════════════════════════════
# RASGOS (33 dimensiones: 28 prosódicas + 5 léxicas de rima)
# ══════════════════════════════════════════════════════════════════════════════

def dft_amplitudes(signal):
    N = len(signal)
    amps = []
    for k in range(N):
        re_k = sum(signal[n] * math.cos(2 * math.pi * k * n / N) for n in range(N))
        im_k = sum(-signal[n] * math.sin(2 * math.pi * k * n / N) for n in range(N))
        amps.append(math.sqrt(re_k**2 + im_k**2))
    return amps

def autocorrelation(signal, max_lag=14):
    n = len(signal)
    if n < 2:
        return [0.0] * max_lag
    mean = sum(signal) / n
    centered = [v - mean for v in signal]
    variance = sum(v * v for v in centered)
    if variance == 0:
        return [0.0] * max_lag
    result = []
    for lag in range(max_lag):
        if lag == 0:
            result.append(1.0)
        else:
            s = sum(centered[i] * centered[i + lag] for i in range(n - lag))
            result.append(s / variance)
    return result

def extract_features(sonnet):
    """
    Vector de 33 rasgos: 28 prosódicos + 5 léxicos de rima.
      [0-4]   FFT acentual
      [5-11]  Autocorrelación lags 2-8
      [12]    Media sinalefas
      [13-21] Perfil acentual pos 1-9
      [22-25] FFT longitud literal
      [26]    Media longitud literal
      [27]    Std longitud literal
      [28]    Diversidad de 4-gramas de rima (tipos/14)
      [29]    Entropía de Shannon del histograma de 4-gramas
      [30]    Longitud media de palabra-rima (caracteres)
      [31]    Proporción de rimas con terminación participial (-ado/-ido/-ada/-ida)
      [32]    Longitud media de la base del 4-grama (sin padding, señal culto/popular)
    """
    verses = sonnet['verses']
    patterns_11 = [v['pattern'] for v in verses if v['s'] == 11 and len(v['pattern']) == 11]
    n_endec = sum(1 for v in verses if v['s'] == 11)

    fft_mean = [0.0] * 5
    if patterns_11:
        all_amps = [dft_amplitudes(p)[:5] for p in patterns_11]
        fft_mean = [sum(a[i] for a in all_amps) / len(all_amps) for i in range(5)]

    signal = []
    for i, v in enumerate(verses):
        signal.extend(v['pattern'])
        if i < len(verses) - 1:
            signal.append(0)
    ac = autocorrelation(signal, 14)

    accent_profile = [0.0] * 11
    if patterns_11:
        for p in patterns_11:
            for j in range(11):
                accent_profile[j] += p[j]
        accent_profile = [a / len(patterns_11) for a in accent_profile]

    sin_counts = [v.get('sin', 0) for v in verses]
    mean_sinalefas = sum(sin_counts) / len(sin_counts) if sin_counts else 0.0

    lit_lens = [v.get('lit', 0) for v in verses]
    fft_lit = dft_amplitudes(lit_lens) if len(lit_lens) == 14 else [0.0] * 14
    fft_lit_f1_f4 = fft_lit[1:5]

    mean_lit = sum(lit_lens) / len(lit_lens) if lit_lens else 0
    std_lit = math.sqrt(sum((x - mean_lit)**2 for x in lit_lens) / len(lit_lens)) if lit_lens else 0

    # ent_vals se calcula para el dict de retorno pero NO entra en el vector
    ent_vals = [v.get('ent', 0) for v in verses]

    # ── 4-gramas de rima (dims 28-32) ───────────────────────────────────
    rimas = [v.get('rima', '') for v in verses]
    rimas_validas = [r for r in rimas if r]
    n_rimas = len(rimas_validas) or 1

    fg_list = [fourgram(r) for r in rimas_validas]
    fg_counter = Counter(fg_list)

    # dim 28: diversidad (tipos únicos / total)
    rima_diversidad = len(fg_counter) / n_rimas if fg_list else 0

    # dim 29: entropía de Shannon
    rima_entropia = 0.0
    if fg_list:
        total = len(fg_list)
        for count in fg_counter.values():
            p = count / total
            if p > 0:
                rima_entropia -= p * math.log2(p)

    # dim 30: longitud media de palabra-rima
    rima_len_media = sum(len(r) for r in rimas_validas) / n_rimas if rimas_validas else 0

    # dim 31: proporción de terminaciones participiales (-ado, -ido, -ada, -ida)
    rima_pct_partic = sum(1 for r in rimas_validas if _PARTIC_RE.search(r)) / n_rimas if rimas_validas else 0

    # dim 32: longitud media de la base normalizada (sin padding)
    rima_base_media = sum(len(_normaliza_rima(r)) for r in rimas_validas) / n_rimas if rimas_validas else 0

    feature_vector = (
        fft_mean[:5] +          # dims 0-4:   FFT acentual
        ac[2:9] +               # dims 5-11:  autocorrelación lags 2-8
        [mean_sinalefas] +      # dim 12:     sinalefas
        accent_profile[:9] +    # dims 13-21: perfil acentual pos 1-9
        fft_lit_f1_f4 +         # dims 22-25: FFT longitud literal
        [mean_lit] +            # dim 26:     media longitud literal
        [std_lit] +             # dim 27:     std longitud literal
        [rima_diversidad] +     # dim 28:     diversidad 4-gramas rima
        [rima_entropia] +       # dim 29:     entropía 4-gramas rima
        [rima_len_media] +      # dim 30:     longitud media palabra-rima
        [rima_pct_partic] +     # dim 31:     % terminación participial
        [rima_base_media]       # dim 32:     longitud base normalizada
    )

    return {
        'n': sonnet['n'], 'y': sonnet.get('y'), 'ne': n_endec,
        'tag': sonnet.get('tag', '?'),
        'fft': fft_mean, 'ac': ac, 'ap': accent_profile,
        'f': feature_vector, 'inc': sonnet['inc'],
        'lit': lit_lens, 'ent': ent_vals,
        'rimas': rimas_validas, 'fg': fg_list,
    }


# ══════════════════════════════════════════════════════════════════════════════
# MAHALANOBIS + PCA
# ══════════════════════════════════════════════════════════════════════════════

def centroid(features):
    n = len(features); d = len(features[0])
    return [sum(f[i] for f in features) / n for i in range(d)]

def covariance_matrix(features, mu):
    n = len(features); d = len(mu)
    cov = [[0.0] * d for _ in range(d)]
    for f in features:
        diff = [f[i] - mu[i] for i in range(d)]
        for i in range(d):
            for j in range(d):
                cov[i][j] += diff[i] * diff[j] / n
    for i in range(d):
        cov[i][i] += 1e-4
    return cov

def matrix_inverse(M):
    n = len(M)
    aug = [row[:] + [1.0 if i == j else 0.0 for j in range(n)] for i, row in enumerate(M)]
    for col in range(n):
        max_row = max(range(col, n), key=lambda r: abs(aug[r][col]))
        aug[col], aug[max_row] = aug[max_row], aug[col]
        pivot = aug[col][col]
        if abs(pivot) < 1e-12:
            aug[col][col] += 1e-6; pivot = aug[col][col]
        for j in range(2 * n):
            aug[col][j] /= pivot
        for row in range(n):
            if row != col:
                factor = aug[row][col]
                for j in range(2 * n):
                    aug[row][j] -= factor * aug[col][j]
    return [row[n:] for row in aug]

def mahalanobis_distance(x, mu, cov_inv):
    d = len(x)
    diff = [x[i] - mu[i] for i in range(d)]
    temp = [sum(diff[j] * cov_inv[j][i] for j in range(d)) for i in range(d)]
    val = sum(diff[i] * temp[i] for i in range(d))
    return math.sqrt(max(0, val))

def pca_2d(features_list):
    n = len(features_list); d = len(features_list[0])
    mu = [sum(f[i] for f in features_list) / n for i in range(d)]
    centered = [[f[i] - mu[i] for i in range(d)] for f in features_list]
    cov = [[sum(c[i] * c[j] for c in centered) / n for j in range(d)] for i in range(d)]

    def power_iteration(mat, deflation_vec=None):
        random.seed(42)
        v = [random.gauss(0, 1) for _ in range(d)]
        norm = math.sqrt(sum(x * x for x in v))
        v = [x / norm for x in v]
        for _ in range(300):
            mv = [sum(mat[i][j] * v[j] for j in range(d)) for i in range(d)]
            if deflation_vec:
                dot = sum(mv[i] * deflation_vec[i] for i in range(d))
                mv = [mv[i] - dot * deflation_vec[i] for i in range(d)]
            norm = math.sqrt(sum(x * x for x in mv))
            if norm < 1e-12:
                return v, 0
            v = [x / norm for x in mv]
        eigenvalue = sum(sum(cov[i][j] * v[j] for j in range(d)) * v[i] for i in range(d))
        return v, eigenvalue

    pc1, ev1 = power_iteration(cov)
    pc2, ev2 = power_iteration(cov, deflation_vec=pc1)
    total_var = sum(cov[i][i] for i in range(d))
    var_explained = ((ev1 + ev2) / total_var * 100) if total_var > 0 else 0
    projections = []
    for c in centered:
        x = sum(c[i] * pc1[i] for i in range(d))
        y = sum(c[i] * pc2[i] for i in range(d))
        projections.append((x, y))
    return projections, var_explained


# ══════════════════════════════════════════════════════════════════════════════
# PIPELINE
# ══════════════════════════════════════════════════════════════════════════════

def build_model(feats):
    """Construye centroide + inversa de covarianza + calibración interna."""
    mu = centroid(feats)
    cov_inv = matrix_inverse(covariance_matrix(feats, mu))
    dists = sorted([mahalanobis_distance(f, mu, cov_inv) for f in feats])
    p95 = dists[int(0.95 * len(dists))]
    p99 = dists[int(0.99 * len(dists))]
    med = dists[len(dists) // 2]
    return {'mu': mu, 'cov_inv': cov_inv, 'p95': p95, 'p99': p99, 'med': med, 'dists': dists}


def run_analysis(subcorpora, ref_tags, eval_tags, also_tags):
    """
    Ejecuta el análisis:
      - ref_tags: ['A','B','S'] → corpus de referencia fusionado
      - eval_tags: ['D'] → sonetos a evaluar
      - also_tags: ['A','B'] → distancias adicionales a estos subgrupos
    """
    ref_label = '+'.join(ref_tags)
    eval_label = ','.join(eval_tags)
    also_label = ','.join(also_tags) if also_tags else '—'

    print(f"\n[Config] REF={ref_label} | EVAL={eval_label} | ALSO={also_label}")

    # ── Extraer rasgos de todos los subcorpus ────────────────────────────
    all_results = {}  # tag → list of feature dicts
    for tag in 'ABSD':
        all_results[tag] = [extract_features(s) for s in subcorpora[tag]]

    # ── Construir REF ────────────────────────────────────────────────────
    ref_results = []
    for t in ref_tags:
        ref_results.extend(all_results[t])
    feats_ref = [r['f'] for r in ref_results]
    nR = len(feats_ref)

    if nR < 5:
        print("ERROR: Corpus de referencia demasiado pequeño.", file=sys.stderr)
        sys.exit(1)

    model_ref = build_model(feats_ref)

    print(f"[REF] {ref_label}: {nR} sonetos")
    print(f"[REF] Mediana={model_ref['med']:.2f} P95={model_ref['p95']:.2f} P99={model_ref['p99']:.2f}")

    # ── Modelos adicionales (--also) ─────────────────────────────────────
    also_models = {}
    for t in also_tags:
        feats_t = [r['f'] for r in all_results[t]]
        if len(feats_t) < 5:
            print(f"  AVISO: {t} tiene solo {len(feats_t)} sonetos, modelo inestable.", file=sys.stderr)
        if feats_t:
            also_models[t] = build_model(feats_t)
            print(f"[ALSO] {t}: {len(feats_t)} sonetos, Med={also_models[t]['med']:.2f} P95={also_models[t]['p95']:.2f}")

    # ── Evaluar ──────────────────────────────────────────────────────────
    eval_results = []
    for t in eval_tags:
        eval_results.extend(all_results[t])
    feats_eval = [r['f'] for r in eval_results]

    p95 = model_ref['p95']
    p99 = model_ref['p99']

    print(f"\n{'═'*100}")
    also_headers = ''.join(f" {'d('+t+')':>8}" for t in also_tags)
    closer_hdr = ' →' if also_tags else ''
    print(f"  {'#':>4} {'Tag':>3} {'Año':>5} {'d('+ref_label+')':>10}{also_headers}{closer_hdr} {'Vered.':>14}  Incipit")
    print(f"  {'─'*95}")

    eval_out = []
    for r in eval_results:
        f = r['f']
        d_ref = mahalanobis_distance(f, model_ref['mu'], model_ref['cov_inv'])
        verdict = "COMPATIBLE" if d_ref <= p95 else ("ATIPICO" if d_ref <= p99 else "MUY ATIPICO")

        entry = {
            'n': r['n'], 'y': r['y'], 'tag': r['tag'], 'inc': r['inc'], 'ne': r['ne'],
            'dref': round(d_ref, 2), 'v': verdict,
        }

        # Distancias adicionales
        also_dists = {}
        for t in also_tags:
            if t in also_models:
                also_dists[t] = round(mahalanobis_distance(f, also_models[t]['mu'], also_models[t]['cov_inv']), 2)
        entry['also'] = also_dists

        # Closer to which subgroup
        if also_dists:
            closer = min(also_dists, key=also_dists.get)
            entry['closer'] = closer
        else:
            entry['closer'] = ''

        eval_out.append(entry)

        yr = str(r['y']) if r['y'] else '?'
        also_vals = ''.join(f" {also_dists[t]:>8.2f}" if t in also_dists else f" {'—':>8}" for t in also_tags)
        closer_val = f" {entry['closer']:>1}" if entry['closer'] else ''
        print(f"  {r['n']:>4} {r['tag']:>3} {yr:>5} {d_ref:>10.2f}{also_vals}{closer_val} {verdict:>14}  {r['inc'][:35]}")

    # ── Distancias internas REF ──────────────────────────────────────────
    ref_dists = []
    for r in ref_results:
        d = mahalanobis_distance(r['f'], model_ref['mu'], model_ref['cov_inv'])
        ref_dists.append({'n': r['n'], 'tag': r['tag'], 'd': round(d, 2), 'inc': r['inc']})

    outliers = [rd for rd in ref_dists if rd['d'] > p95]
    if outliers:
        print(f"\n[Outliers REF] {len(outliers)} sonetos superan P95:")
        for o in sorted(outliers, key=lambda x: -x['d']):
            print(f"  #{o['n']:>4} ({o['tag']}) d={o['d']:.2f}  {o['inc'][:40]}")

    # ── PCA ───────────────────────────────────────────────────────────────
    all_feats_pca = feats_ref + feats_eval
    projections, var_explained = pca_2d(all_feats_pca)
    print(f"\n[PCA] Varianza explicada: {var_explained:.1f}%")

    # Separar proyecciones por tag
    proj_by_tag = {t: [] for t in 'ABSD'}
    num_by_tag = {t: [] for t in 'ABSD'}
    inc_by_tag = {t: [] for t in 'ABSD'}

    idx = 0
    for r in ref_results:
        p = (round(projections[idx][0], 4), round(projections[idx][1], 4))
        proj_by_tag[r['tag']].append(p)
        num_by_tag[r['tag']].append(r['n'])
        inc_by_tag[r['tag']].append(r['inc'][:30])
        idx += 1
    for r in eval_results:
        p = (round(projections[idx][0], 4), round(projections[idx][1], 4))
        proj_by_tag[r['tag']].append(p)
        num_by_tag[r['tag']].append(r['n'])
        inc_by_tag[r['tag']].append(r['inc'][:30])
        idx += 1

    # ── Perfiles medios del REF ──────────────────────────────────────────
    ap_ref = [0.0] * 11
    ac_ref = [0.0] * 14
    fft_ref = [0.0] * 5
    if ref_results:
        for r in ref_results:
            for j in range(11): ap_ref[j] += r['ap'][j]
            for l in range(14): ac_ref[l] += r['ac'][l]
            for k in range(5): fft_ref[k] += r['fft'][k]
        ap_ref = [round(x / nR, 3) for x in ap_ref]
        ac_ref = [round(x / nR, 4) for x in ac_ref]
        fft_ref = [round(x / nR, 3) for x in fft_ref]

    # Resumen
    comp = sum(1 for e in eval_out if e['v'] == 'COMPATIBLE')
    atip = sum(1 for e in eval_out if e['v'] == 'ATIPICO')
    muy = sum(1 for e in eval_out if 'MUY' in e['v'])
    print(f"\n[Resumen] Compatibles: {comp} | Atipicos: {atip} | Muy atipicos: {muy}")

    return {
        'ref_label': ref_label, 'eval_label': eval_label,
        'also_tags': also_tags,
        'eval': eval_out, 'ref_dists': ref_dists,
        'p95': model_ref['p95'], 'p99': model_ref['p99'], 'med': model_ref['med'],
        've': round(var_explained, 1),
        'ref_tags': ref_tags, 'eval_tags': eval_tags,
        'nR': nR, 'nE': len(eval_out),
        'counts': {t: len(subcorpora[t]) for t in 'ABSD'},
        'proj': proj_by_tag, 'nums': num_by_tag, 'incs': inc_by_tag,
        'ap_ref': ap_ref, 'ac_ref': ac_ref, 'fft_ref': fft_ref,
        'idREF': [round(x, 2) for x in model_ref['dists']],
        'also_models': {t: {'p95': m['p95'], 'p99': m['p99'], 'med': m['med']}
                        for t, m in also_models.items()},
    }


# ══════════════════════════════════════════════════════════════════════════════
# HTML
# ══════════════════════════════════════════════════════════════════════════════

def generate_html_interactive(all_features, output_path):
    """
    Genera HTML interactivo: embebe vectores de rasgos y computa
    Mahalanobis + PCA en JavaScript. El usuario selecciona REF/EVAL/ALSO
    con checkboxes y todo se recalcula al instante.
    """
    # Preparar datos para embeber
    sonnets_json = []
    for r in all_features:
        sonnets_json.append({
            'n': r['n'], 'y': r['y'], 'tag': r['tag'], 'ne': r['ne'],
            'inc': r['inc'][:50], 'f': [round(x, 6) for x in r['f']],
            'ap': [round(x, 4) for x in r['ap']],
            'ac': [round(x, 4) for x in r['ac']],
            'fft': [round(x, 3) for x in r['fft']],
        })

    data_json = json.dumps(sonnets_json, ensure_ascii=False)

    html = """<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<title>Góngora v7 — Atribución prosódica interactiva</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,serif;background:#0f172a;color:#e2e8f0;padding:24px}
h1{font-size:22px;color:#f97316;margin-bottom:6px}
h2{font-size:17px;color:#60a5fa;margin:24px 0 10px;border-bottom:1px solid #334155;padding-bottom:5px}
.sub{font-size:12px;color:#94a3b8;margin-bottom:20px;line-height:1.6}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}
.card{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px}
.kpi{text-align:center}.kpi .v{font-size:26px;font-weight:800}.kpi .l{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-top:3px}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#1e293b;color:#94a3b8;font-weight:600;text-align:left;padding:7px 8px;border-bottom:1px solid #334155;cursor:pointer}
th:hover{color:#f97316}
td{padding:6px 8px;border-bottom:1px solid #334155}tr:hover{background:#1e293b88}
.chc{position:relative;height:380px;margin:10px 0}
.note{background:#0f172a;border-left:3px solid #f97316;padding:10px 14px;margin:10px 0;font-size:11px;color:#94a3b8;line-height:1.7}
h3{font-size:14px;color:#c084fc;margin:12px 0 6px}
.ctrl{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px;margin-bottom:16px}
.ctrl label{display:inline-flex;align-items:center;gap:5px;margin-right:14px;font-size:13px;cursor:pointer}
.ctrl input[type=checkbox]{accent-color:#f97316;width:16px;height:16px}
.ctrl-group{margin-bottom:10px}
.ctrl-group span{font-weight:700;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-right:10px;min-width:50px;display:inline-block}
.btn{background:#f97316;color:#0f172a;border:none;padding:8px 20px;border-radius:6px;font-weight:700;font-size:13px;cursor:pointer;margin-top:6px}
.btn:hover{background:#fb923c}
.tag-A{color:#c084fc}.tag-B{color:#60a5fa}.tag-S{color:#22d3ee}.tag-D{color:#f97316}
#status{font-size:12px;color:#4ade80;margin-top:8px}
</style></head><body>

<h1>Atribución prosódica v7 &mdash; Sonetos de Góngora</h1>
<div class="sub">33 rasgos prosódicos &middot; Mahalanobis &middot; PCA &middot; Selección interactiva de corpus</div>

<div class="ctrl">
<div class="ctrl-group">
  <span>REF</span>
  <label class="tag-A"><input type="checkbox" id="ref_A" checked> A (segura pre-1610)</label>
  <label class="tag-B"><input type="checkbox" id="ref_B" checked> B (segura post-1610)</label>
  <label class="tag-S"><input type="checkbox" id="ref_S" checked> S (sin asignar)</label>
  <label class="tag-D"><input type="checkbox" id="ref_D"> D (dudosos)</label>
</div>
<div class="ctrl-group">
  <span>EVAL</span>
  <label class="tag-A"><input type="checkbox" id="eval_A"> A</label>
  <label class="tag-B"><input type="checkbox" id="eval_B"> B</label>
  <label class="tag-S"><input type="checkbox" id="eval_S"> S</label>
  <label class="tag-D"><input type="checkbox" id="eval_D" checked> D</label>
</div>
<div class="ctrl-group">
  <span>ALSO</span>
  <label class="tag-A"><input type="checkbox" id="also_A"> d(A)</label>
  <label class="tag-B"><input type="checkbox" id="also_B"> d(B)</label>
  <label class="tag-S"><input type="checkbox" id="also_S"> d(S)</label>
  <label class="tag-D"><input type="checkbox" id="also_D"> d(D)</label>
</div>
<button class="btn" onclick="recompute()">Recalcular</button>
<span id="status"></span>
</div>

<div class="grid" style="grid-template-columns:repeat(6,1fr)" id="kpis"></div>

<h2>1. Mapa prosódico (PCA 2D)</h2>
<div class="note">Círculos = referencia. Triángulos = evaluados (verde=compatible, naranja=atípico, rojo=muy atípico).</div>
<div class="chc" style="height:520px"><canvas id="pca"></canvas></div>

<h2>2. Evaluados</h2>
<div id="eval-info" class="note"></div>
<div style="overflow-x:auto"><table id="eval-table"><thead id="eval-thead"></thead><tbody id="eval-tbody"></tbody></table></div>

<h2>3. Outliers internos del corpus de referencia</h2>
<div class="note">Sonetos del propio REF que superan P95.</div>
<table><thead><tr><th>#</th><th>Tag</th><th>d(REF)</th><th>Incipit</th></tr></thead><tbody id="out-tbody"></tbody></table>

<h2>4. Perfiles del corpus de referencia</h2>
<div class="grid">
<div class="card"><h3>Distribución acentual</h3><div class="chc" style="height:260px"><canvas id="acc"></canvas></div></div>
<div class="card"><h3>Autocorrelación (lags 2–13)</h3><div class="chc" style="height:260px"><canvas id="acr"></canvas></div></div>
</div>
<div class="grid">
<div class="card"><h3>Espectro FFT</h3><div class="chc" style="height:260px"><canvas id="fft"></canvas></div></div>
<div class="card"><h3>Distancias internas</h3><div class="chc" style="height:260px"><canvas id="dst"></canvas></div></div>
</div>

<script>
const DATA=""" + data_json + """;
const TAGS=['A','B','S','D'];
const TCOLOR={A:'#c084fc',B:'#60a5fa',S:'#22d3ee',D:'#f97316'};
const D=DATA[0].f.length; // 28

// ── Álgebra lineal ──────────────────────────────────────────────────────
function centroid(feats){
  const n=feats.length,mu=new Float64Array(D);
  for(const f of feats) for(let i=0;i<D;i++) mu[i]+=f[i];
  for(let i=0;i<D;i++) mu[i]/=n;
  return mu;
}
function covMatrix(feats,mu){
  const n=feats.length,C=[];
  for(let i=0;i<D;i++){C[i]=new Float64Array(D);}
  for(const f of feats){
    const d=new Float64Array(D);
    for(let i=0;i<D;i++) d[i]=f[i]-mu[i];
    for(let i=0;i<D;i++) for(let j=0;j<D;j++) C[i][j]+=d[i]*d[j]/n;
  }
  for(let i=0;i<D;i++) C[i][i]+=1e-4;
  return C;
}
function matInverse(M){
  const n=M.length;
  const a=M.map((r,i)=>{const row=new Float64Array(2*n);for(let j=0;j<n;j++)row[j]=r[j];row[n+i]=1;return row;});
  for(let c=0;c<n;c++){
    let mx=c;for(let r=c+1;r<n;r++)if(Math.abs(a[r][c])>Math.abs(a[mx][c]))mx=r;
    [a[c],a[mx]]=[a[mx],a[c]];
    let p=a[c][c];if(Math.abs(p)<1e-12){a[c][c]+=1e-6;p=a[c][c];}
    for(let j=0;j<2*n;j++)a[c][j]/=p;
    for(let r=0;r<n;r++)if(r!==c){const f=a[r][c];for(let j=0;j<2*n;j++)a[r][j]-=f*a[c][j];}
  }
  return a.map(r=>{const inv=new Float64Array(n);for(let j=0;j<n;j++)inv[j]=r[n+j];return inv;});
}
function mahal(x,mu,ci){
  const d=new Float64Array(D);
  for(let i=0;i<D;i++) d[i]=x[i]-mu[i];
  const t=new Float64Array(D);
  for(let i=0;i<D;i++) for(let j=0;j<D;j++) t[i]+=d[j]*ci[j][i];
  let v=0;for(let i=0;i<D;i++) v+=d[i]*t[i];
  return Math.sqrt(Math.max(0,v));
}
function buildModel(feats){
  const mu=centroid(feats),ci=matInverse(covMatrix(feats,mu));
  const ds=feats.map(f=>mahal(f,mu,ci)).sort((a,b)=>a-b);
  const p95=ds[Math.floor(.95*ds.length)],p99=ds[Math.floor(.99*ds.length)],med=ds[Math.floor(ds.length/2)];
  return {mu,ci,p95,p99,med,ds};
}
function pca2d(feats){
  const n=feats.length;
  const mu=centroid(feats);
  const c=feats.map(f=>{const r=new Float64Array(D);for(let i=0;i<D;i++)r[i]=f[i]-mu[i];return r;});
  const cov=[];for(let i=0;i<D;i++){cov[i]=new Float64Array(D);for(let j=0;j<D;j++){let s=0;for(const v of c)s+=v[i]*v[j];cov[i][j]=s/n;}}
  function powerIter(defl){
    let v=new Float64Array(D);for(let i=0;i<D;i++)v[i]=Math.sin(i*2.3+1.7);
    let nm=Math.sqrt(v.reduce((s,x)=>s+x*x,0));for(let i=0;i<D;i++)v[i]/=nm;
    for(let it=0;it<300;it++){
      const mv=new Float64Array(D);for(let i=0;i<D;i++)for(let j=0;j<D;j++)mv[i]+=cov[i][j]*v[j];
      if(defl){let dt=0;for(let i=0;i<D;i++)dt+=mv[i]*defl[i];for(let i=0;i<D;i++)mv[i]-=dt*defl[i];}
      nm=Math.sqrt(mv.reduce((s,x)=>s+x*x,0));if(nm<1e-12)return{v,ev:0};
      for(let i=0;i<D;i++)v[i]=mv[i]/nm;
    }
    let ev=0;for(let i=0;i<D;i++){let s=0;for(let j=0;j<D;j++)s+=cov[i][j]*v[j];ev+=s*v[i];}
    return{v,ev};
  }
  const{v:pc1,ev:ev1}=powerIter(null);
  const{v:pc2,ev:ev2}=powerIter(pc1);
  const tv=cov.reduce((s,r,i)=>s+r[i],0);
  const ve=tv>0?(ev1+ev2)/tv*100:0;
  const proj=c.map(r=>[r.reduce((s,x,i)=>s+x*pc1[i],0),r.reduce((s,x,i)=>s+x*pc2[i],0)]);
  return{proj,ve};
}
function verdict(d,p95,p99){return d<=p95?'COMPATIBLE':d<=p99?'ATIPICO':'MUY ATIPICO';}
function vcolor(v){return v==='COMPATIBLE'?'#4ade80cc':v.includes('MUY')?'#f87171cc':'#fb923ccc';}

// ── Charts (globales para destruir/recrear) ─────────────────────────────
let chPca,chAcc,chAcr,chFft,chDst;
function destroyCharts(){[chPca,chAcc,chAcr,chFft,chDst].forEach(c=>{if(c)c.destroy();});}

// ── Recompute ───────────────────────────────────────────────────────────
function recompute(){
  const t0=performance.now();
  const refTags=TAGS.filter(t=>document.getElementById('ref_'+t).checked);
  const evalTags=TAGS.filter(t=>document.getElementById('eval_'+t).checked);
  const alsoTags=TAGS.filter(t=>document.getElementById('also_'+t).checked);

  if(!refTags.length){document.getElementById('status').textContent='ERROR: selecciona al menos un REF';return;}
  if(!evalTags.length){document.getElementById('status').textContent='ERROR: selecciona al menos un EVAL';return;}

  // Separar datos
  const byTag={};TAGS.forEach(t=>byTag[t]=DATA.filter(s=>s.tag===t));

  const refData=[];refTags.forEach(t=>refData.push(...byTag[t]));
  const evalData=[];evalTags.forEach(t=>evalData.push(...byTag[t]));
  const refFeats=refData.map(s=>s.f);
  const evalFeats=evalData.map(s=>s.f);

  if(refFeats.length<5){document.getElementById('status').textContent='ERROR: REF < 5 sonetos';return;}

  // Modelo principal
  const model=buildModel(refFeats);

  // Modelos ALSO
  const alsoModels={};
  for(const t of alsoTags){
    const af=byTag[t].map(s=>s.f);
    if(af.length>=3) alsoModels[t]=buildModel(af);
  }

  // Evaluar
  const results=evalData.map((s,i)=>{
    const d=mahal(s.f,model.mu,model.ci);
    const v=verdict(d,model.p95,model.p99);
    const also={};let closerTag='',closerD=Infinity;
    for(const t of alsoTags){
      if(alsoModels[t]){
        const ad=mahal(s.f,alsoModels[t].mu,alsoModels[t].ci);
        also[t]=ad;
        if(ad<closerD){closerD=ad;closerTag=t;}
      }
    }
    return{...s,dref:d,v,also,closer:closerTag};
  });
  results.sort((a,b)=>a.dref-b.dref);

  // Outliers internos
  const refDists=refData.map(s=>({...s,d:mahal(s.f,model.mu,model.ci)}));
  const outliers=refDists.filter(s=>s.d>model.p95).sort((a,b)=>b.d-a.d).slice(0,20);

  // PCA
  const allPcaFeats=[...refFeats,...evalFeats];
  const allPcaData=[...refData,...evalData];
  const{proj,ve}=pca2d(allPcaFeats);

  // ── Render KPIs ───────────────────────────────────────────────────────
  const refLabel=refTags.join('+'),evalLabel=evalTags.join(',');
  let khtml='';
  TAGS.forEach(t=>{
    const n=byTag[t].length;
    const role=refTags.includes(t)?'ref':evalTags.includes(t)?'eval':'—';
    khtml+=`<div class="card kpi"><div class="v" style="color:${TCOLOR[t]}">${n}</div><div class="l">${t} (${role})</div></div>`;
  });
  khtml+=`<div class="card kpi"><div class="v" style="color:#4ade80">${ve.toFixed(1)}%</div><div class="l">PCA 2D</div></div>`;
  khtml+=`<div class="card kpi"><div class="v" style="color:#fbbf24">${model.p95.toFixed(1)}</div><div class="l">Umbral P95</div></div>`;
  document.getElementById('kpis').innerHTML=khtml;

  // ── Render eval table ─────────────────────────────────────────────────
  let thHtml='<tr><th data-col="n">#</th><th data-col="tag">Tag</th><th data-col="y">Año</th><th>Incipit</th><th data-col="ne">End.</th><th data-col="dref">d('+refLabel+')</th>';
  alsoTags.forEach(t=>{if(alsoModels[t])thHtml+=`<th data-col="also_${t}">d(${t})</th>`;});
  if(alsoTags.length)thHtml+='<th>→</th>';
  thHtml+='<th>Veredicto</th></tr>';
  document.getElementById('eval-thead').innerHTML=thHtml;

  let tbHtml='';
  for(const e of results){
    const yr=e.y||'?';
    const vc=e.v==='COMPATIBLE'?'color:#4ade80;font-weight:700':e.v.includes('MUY')?'color:#f87171;font-weight:700':'color:#fb923c;font-weight:700';
    tbHtml+=`<tr><td>${e.n}</td><td class="tag-${e.tag}">${e.tag}</td><td>${yr}</td>`;
    tbHtml+=`<td style="font-style:italic;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.inc}</td>`;
    tbHtml+=`<td>${e.ne}/14</td><td style="font-weight:700">${e.dref.toFixed(2)}</td>`;
    alsoTags.forEach(t=>{if(alsoModels[t])tbHtml+=`<td>${(e.also[t]||0).toFixed(2)}</td>`;});
    if(alsoTags.length)tbHtml+=`<td class="tag-${e.closer}">${e.closer}</td>`;
    tbHtml+=`<td style="${vc}">${e.v}</td></tr>`;
  }
  document.getElementById('eval-tbody').innerHTML=tbHtml;
  document.getElementById('eval-info').innerHTML=
    `d(${refLabel}): Mahalanobis. P95=${model.p95.toFixed(2)}, P99=${model.p99.toFixed(2)}, Mediana=${model.med.toFixed(2)}.`
    +(alsoTags.length?' También: '+alsoTags.filter(t=>alsoModels[t]).map(t=>`d(${t}) [n=${byTag[t].length}, P95=${alsoModels[t].p95.toFixed(2)}]`).join(', '):'');

  // ── Render outliers ───────────────────────────────────────────────────
  let outHtml='';
  for(const o of outliers)outHtml+=`<tr><td>${o.n}</td><td class="tag-${o.tag}">${o.tag}</td><td style="font-weight:700">${o.d.toFixed(2)}</td><td style="font-style:italic">${o.inc}</td></tr>`;
  document.getElementById('out-tbody').innerHTML=outHtml;

  // ── PCA chart ─────────────────────────────────────────────────────────
  destroyCharts();
  const refSet=new Set(refTags),evalSet=new Set(evalTags);
  // Build PCA datasets with embedded nums/incs per dataset
  const pcaDS=[];
  const dsInfo={}; // tag+role → {nums:[], incs:[]}
  TAGS.forEach(t=>{dsInfo[t+'_ref']={nums:[],incs:[]};dsInfo[t+'_eval']={nums:[],incs:[]};});
  allPcaData.forEach((s,i)=>{
    const isEval=evalSet.has(s.tag)&&!refSet.has(s.tag);
    const key=s.tag+'_'+(isEval?'eval':'ref');
    dsInfo[key].nums.push(s.n);
    dsInfo[key].incs.push(s.inc);
  });
  // Separate projections by tag+role
  const tagProj={};TAGS.forEach(t=>tagProj[t]={ref:[],eval:[],verd:[]});
  allPcaData.forEach((s,i)=>{
    const isEval=evalSet.has(s.tag)&&!refSet.has(s.tag);
    if(isEval){
      tagProj[s.tag].eval.push(proj[i]);
      const r=results.find(e=>e.n===s.n);
      tagProj[s.tag].verd.push(r?r.v:'COMPATIBLE');
    } else {
      tagProj[s.tag].ref.push(proj[i]);
    }
  });
  TAGS.forEach(t=>{
    if(tagProj[t].ref.length){
      pcaDS.push({label:t+' (ref)',data:tagProj[t].ref.map(p=>({x:p[0],y:p[1]})),
        backgroundColor:TCOLOR[t]+'44',borderColor:TCOLOR[t],borderWidth:1,pointRadius:5,
        pointStyle:t==='S'?'rect':'circle',
        _nums:dsInfo[t+'_ref'].nums,_incs:dsInfo[t+'_ref'].incs});
    }
    if(tagProj[t].eval.length){
      pcaDS.push({label:t+' (eval)',data:tagProj[t].eval.map(p=>({x:p[0],y:p[1]})),
        backgroundColor:tagProj[t].verd.map(v=>vcolor(v)),
        borderColor:'#fff',borderWidth:2,pointRadius:9,pointStyle:'triangle',
        _nums:dsInfo[t+'_eval'].nums,_incs:dsInfo[t+'_eval'].incs});
    }
  });
  chPca=new Chart(document.getElementById('pca'),{type:'scatter',data:{datasets:pcaDS},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{tooltip:{callbacks:{label:function(c){
        const ds=c.dataset,i=c.dataIndex;
        const n=ds._nums?ds._nums[i]:'?';
        const inc=ds._incs?ds._incs[i]:'';
        return '#'+n+': '+inc;
      }}},legend:{labels:{color:'#94a3b8'}}},
      scales:{x:{title:{display:true,text:'PC1',color:'#94a3b8'},ticks:{color:'#64748b'},grid:{color:'#1e293b'}},
              y:{title:{display:true,text:'PC2',color:'#94a3b8'},ticks:{color:'#64748b'},grid:{color:'#1e293b'}}}}
  });

  // ── Helper: compute mean profile per group ─────────────────────────────
  function meanProfile(sonnets, key, len){
    const acc=new Float64Array(len);
    const n=sonnets.length||1;
    sonnets.forEach(s=>{const v=s[key];for(let i=0;i<len;i++)acc[i]+=v[i];});
    return Array.from(acc,v=>+(v/n).toFixed(4));
  }
  // Subgroups within REF (only those with sonnets)
  const refByTag={};
  refTags.forEach(t=>refByTag[t]=refData.filter(s=>s.tag===t));
  const activeTags=refTags.filter(t=>refByTag[t].length>0);
  const showSub=activeTags.length>1; // show subgroups only if >1 non-empty tag

  // ── Accent profile ────────────────────────────────────────────────────
  const accDS=[{label:'REF ('+refLabel+')',data:meanProfile(refData,'ap',11),
    backgroundColor:'#4ade8044',borderColor:'#4ade80',borderWidth:2,order:0}];
  if(showSub) activeTags.forEach(t=>{
    accDS.push({label:t+' ('+refByTag[t].length+')',data:meanProfile(refByTag[t],'ap',11),
      backgroundColor:TCOLOR[t]+'66',borderColor:TCOLOR[t],borderWidth:1,order:1});
  });
  chAcc=new Chart(document.getElementById('acc'),{type:'bar',
    data:{labels:['1','2','3','4','5','6','7','8','9','10','11'],datasets:accDS},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#94a3b8',font:{size:10}}}},
      scales:{x:{title:{display:true,text:'Posición silábica',color:'#94a3b8'},ticks:{color:'#64748b'},grid:{display:false}},
              y:{title:{display:true,text:'Freq. acento',color:'#94a3b8'},ticks:{color:'#64748b'},grid:{color:'#1e293b'}}}}
  });

  // ── Autocorrelation ───────────────────────────────────────────────────
  function acSlice(sonnets){const full=meanProfile(sonnets,'ac',14);return full.slice(2);}
  const acrDS=[{label:'REF ('+refLabel+')',data:acSlice(refData),
    borderColor:'#4ade80',borderWidth:2,tension:.3,pointRadius:3,order:0}];
  if(showSub) activeTags.forEach(t=>{
    acrDS.push({label:t,data:acSlice(refByTag[t]),
      borderColor:TCOLOR[t],borderWidth:1,borderDash:[4,3],tension:.3,pointRadius:2,order:1});
  });
  chAcr=new Chart(document.getElementById('acr'),{type:'line',
    data:{labels:Array.from({length:12},(_,i)=>'lag='+(i+2)),datasets:acrDS},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#94a3b8',font:{size:10}}}},
      scales:{x:{ticks:{color:'#64748b'},grid:{color:'#1e293b'}},
              y:{ticks:{color:'#64748b'},grid:{color:'#1e293b'}}}}
  });

  // ── FFT ───────────────────────────────────────────────────────────────
  const fftDS=[{label:'REF ('+refLabel+')',data:meanProfile(refData,'fft',5),
    backgroundColor:'#4ade8044',borderColor:'#4ade80',borderWidth:2,order:0}];
  if(showSub) activeTags.forEach(t=>{
    fftDS.push({label:t+' ('+refByTag[t].length+')',data:meanProfile(refByTag[t],'fft',5),
      backgroundColor:TCOLOR[t]+'66',borderColor:TCOLOR[t],borderWidth:1,order:1});
  });
  chFft=new Chart(document.getElementById('fft'),{type:'bar',
    data:{labels:['DC','f1(T=11)','f2(T≈5)','f3(T≈4)','f4(T≈3)'],datasets:fftDS},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#94a3b8',font:{size:10}}}},
      scales:{x:{ticks:{color:'#64748b'},grid:{display:false}},
              y:{title:{display:true,text:'Amplitud',color:'#94a3b8'},ticks:{color:'#64748b'},grid:{color:'#1e293b'}}}}
  });

  // ── Distance histogram ────────────────────────────────────────────────
  // Compute per-tag distances to the combined REF centroid
  const bins=Array.from({length:20},(_,i)=>(i*0.5).toFixed(1));
  const dstDS=[];
  if(showSub){
    activeTags.forEach(t=>{
      const tagDists=refByTag[t].map(s=>mahal(s.f,model.mu,model.ci));
      const cts=bins.map(b=>tagDists.filter(d=>d>=+b&&d<+b+0.5).length);
      dstDS.push({label:t+' ('+refByTag[t].length+')',data:cts,backgroundColor:TCOLOR[t]+'88'});
    });
  } else {
    const cts=bins.map(b=>model.ds.filter(d=>d>=+b&&d<+b+0.5).length);
    dstDS.push({label:'REF',data:cts,backgroundColor:'#4ade8088'});
  }
  chDst=new Chart(document.getElementById('dst'),{type:'bar',
    data:{labels:bins,datasets:dstDS},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#94a3b8',font:{size:10}}}},
      scales:{x:{title:{display:true,text:'Dist. Mahalanobis',color:'#94a3b8'},ticks:{color:'#64748b'},grid:{display:false}},
              y:{title:{display:true,text:'N',color:'#94a3b8'},ticks:{color:'#64748b'},grid:{color:'#1e293b'}},
      },barPercentage:0.9,categoryPercentage:0.9}
  });

  const ms=Math.round(performance.now()-t0);
  document.getElementById('status').textContent=`REF=${refLabel} (${refData.length}) · EVAL=${evalLabel} (${evalData.length}) · ${ms}ms`;

  // ── Sortable table ────────────────────────────────────────────────────
  document.querySelectorAll('#eval-thead th[data-col]').forEach(th=>{
    th.onclick=()=>{
      const col=th.dataset.col;
      const tbody=document.getElementById('eval-tbody');
      const rows=Array.from(tbody.rows);
      const ci={n:0,tag:1,y:2,ne:4,dref:5}[col];
      if(ci===undefined)return;
      const asc=th.dataset.asc!=='1';th.dataset.asc=asc?'1':'0';
      rows.sort((a,b)=>{
        let va=a.cells[ci].textContent,vb=b.cells[ci].textContent;
        const na=parseFloat(va),nb=parseFloat(vb);
        if(!isNaN(na)&&!isNaN(nb))return asc?na-nb:nb-na;
        return asc?va.localeCompare(vb):vb.localeCompare(va);
      });
      rows.forEach(r=>tbody.appendChild(r));
    };
  });
}

// Auto-run on load
window.addEventListener('load',recompute);
</script></body></html>"""

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"\n[HTML] {output_path} ({len(html):,} chars)")


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="Gongora v7 — Atribución prosódica flexible",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python3 gongora_v7.py esc.csv --ref A+B+S --eval D
  python3 gongora_v7.py esc.csv --ref A --eval B,D --also B
  python3 gongora_v7.py esc.csv --ref A+B --eval S,D --also A,B
  python3 gongora_v7.py esc.csv --ref B+S --eval A,D
        """
    )
    parser.add_argument('csv', help='CSV de escansion curada')
    parser.add_argument('--ref', default='A+B+S', help='Subcorpus de referencia (default: A+B+S)')
    parser.add_argument('--eval', default='D', help='Subcorpus a evaluar (default: D)')
    parser.add_argument('--also', default='', help='Distancias adicionales a subgrupos (ej: A,B)')
    parser.add_argument('--html', default='gongora_v7.html')
    parser.add_argument('--json', default='gongora_v7.json')

    args = parser.parse_args()

    ref_tags = parse_group_spec(args.ref)
    eval_tags = parse_group_spec(args.eval)
    also_tags = parse_group_spec(args.also) if args.also else []

    if not ref_tags:
        print("ERROR: --ref vacío.", file=sys.stderr); sys.exit(1)
    if not eval_tags:
        print("ERROR: --eval vacío.", file=sys.stderr); sys.exit(1)

    # Validar que ref y eval no se solapen
    overlap = set(ref_tags) & set(eval_tags)
    if overlap:
        print(f"AVISO: {overlap} aparece en ref Y eval. Los sonetos se duplicarán en el PCA.", file=sys.stderr)

    print("╔══════════════════════════════════════════════════════════════╗")
    print("║  Góngora v7 — Atribución prosódica flexible               ║")
    print("║  33 rasgos · Mahalanobis · PCA                            ║")
    print("╚══════════════════════════════════════════════════════════════╝")

    subcorpora = load_csv(args.csv)
    results = run_analysis(subcorpora, ref_tags, eval_tags, also_tags)

    with open(args.json, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"[JSON] {args.json}")

    # Extraer rasgos de TODOS los sonetos para el HTML interactivo
    all_features = []
    for tag in 'ABSD':
        for s in subcorpora[tag]:
            all_features.append(extract_features(s))

    generate_html_interactive(all_features, args.html)
    print("\nAnalisis completado.")


if __name__ == '__main__':
    main()
