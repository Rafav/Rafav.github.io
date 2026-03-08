# Atribución prosódica de sonetos de Góngora

Sistema de análisis estilométrico basado en prosodia para evaluar la autoría de sonetos atribuidos a Luis de Góngora. Mide la distancia estadística (Mahalanobis) entre el perfil rítmico de un soneto y el del corpus gongorino de referencia.

## Para filólogos: qué hace y qué no hace

### Qué mide

Cada soneto se convierte en un **vector de 31 rasgos prosódicos**:

- **Espectro rítmico** (FFT): descompone el patrón acentual del endecasílabo en frecuencias. Detecta si el ritmo es binario (yámbico), ternario (dactílico) o mixto.
- **Autocorrelación**: mide la regularidad interna del ritmo a lo largo del soneto. Un valor alto indica ritmo repetitivo; uno bajo, variación.
- **Distribución acentual**: frecuencia de acento en cada posición silábica (1-9) del endecasílabo. Captura preferencias por tipos rítmicos (heroico, sáfico, melódico, etc.).
- **Sinalefas**: media de sinalefas por verso.
- **Longitud literal**: caracteres por verso y su variabilidad (FFT, media, desviación).
- **Entonación**: proporción de versos interrogativos y exclamativos, y posición de la primera marca.

### Los 31 rasgos

| Dims | Bloque | Rasgos | Qué captura |
|------|--------|--------|-------------|
| 0–4 | FFT acentual | f₀–f₄ del endecasílabo | Armonías rítmicas |
| 5–11 | Autocorrelación | lags 2–8 | Periodicidad rítmica |
| 12 | Sinalefas | media/verso | Fusión vocálica |
| 13–21 | Perfil acentual | posiciones 1–9 | Esquema estructural completo |
| 22–25 | FFT longitud | f₁–f₄ de caracteres/verso | Materialidad fonética |
| 26–27 | Estadísticas longitud | media, desviación | Densidad y variabilidad léxica |
| 28–30 | Entonación | %exclam, %interrog, posición | Curva entonativa |

### Qué no mide

No analiza léxico, sintaxis, metáforas, cultismos ni contenido semántico. Dos poetas con el mismo sistema métrico (por ejemplo, Góngora y Quevedo escribiendo sonetos endecasilábicos) pueden producir vectores similares. El sistema detecta **anomalías prosódicas**, no identifica autores.

### Cómo interpretar los resultados

| Veredicto | Significado |
|-----------|-------------|
| **COMPATIBLE** | El soneto cae dentro del rango prosódico normal del corpus (distancia < P95) |
| **ATÍPICO** | Está en la periferia (P95 < distancia < P99) |
| **MUY ATÍPICO** | Fuera del rango habitual (distancia > P99). No necesariamente apócrifo, pero prosódicamente anómalo |

**«Compatible» no significa «de Góngora»**. Significa que el perfil rítmico es estadísticamente indistinguible del corpus gongorino. Un soneto de Quevedo puede salir compatible.

**«Muy atípico» no significa «apócrifo»**. Puede ser un Góngora genuino con un perfil rítmico inusual (por ejemplo, un soneto satírico con ritmo más llano que los líricos).

## Para informáticos: arquitectura

### Pipeline

```
CSV curado ──→ extract_features() ──→ vector 31d ──→ Mahalanobis ──→ veredicto
                                                   ↗
                                    centroide + Σ⁻¹ del corpus REF
```

### Dependencias

**Ninguna** fuera de la stdlib de Python 3. No requiere numpy, scipy ni ningún paquete externo. La inversión de matriz 31×31 se hace por Gauss-Jordan, la PCA por power iteration, la FFT por DFT bruta O(N²) — aceptable para N ≤ 14.

### Estructura de ficheros

```
gongora_v6.py                    ← Script principal (análisis + HTML interactivo)
test_contraejemplo.py            ← Validación con sonetos no gongorinos
gongora_escansion_curada.csv     ← Corpus gongorino (escansión curada a mano)
contraejemplos.csv               ← Sonetos de otros autores (misma estructura)
gongora_obra-poetica.txt         ← Edición OBVIL/Carreira (texto plano)
gongora_attribution_v52.py       ← Motor de silabificación v5.2 (genera escansión automática)
```

### Formato del CSV

Delimitador: `;` — Todos los campos entrecomillados. **No editar con LibreOffice** (cambia delimitadores y destruye campos con comas internas). Usar un editor de texto.

```
"corpus";"soneto_n";"año";"incipit";"verso_n";"texto";"patron_binario";"sil_metricas";"sinalefas";"estrofa";"fuente_xml"
```

| Campo | Descripción |
|-------|-------------|
| `corpus` | `segura_A`, `segura_B`, `sin_asignar`, `dudoso`, `contraejemplo` |
| `soneto_n` | Número identificador del soneto |
| `año` | Año de composición (vacío si desconocido) |
| `incipit` | Primer verso (solo en verso_n=1, vacío en los demás) |
| `verso_n` | Número de verso (1-14) |
| `texto` | Texto del verso con puntuación |
| `patron_binario` | Cadena de 0/1 (átona/tónica), longitud = sílabas métricas |
| `sil_metricas` | Número de sílabas métricas (11 para endecasílabo) |
| `sinalefas` | Número de sinalefas en el verso |
| `estrofa` | `cuarteto` (v. 1-8) o `terceto` (v. 9-14) |
| `fuente_xml` | Fichero XML de origen o nombre del autor (contraejemplos) |

### Subcorpus

| Tag | Contenido | N |
|-----|-----------|--:|
| **A** (`segura_A`) | Sonetos de autoría segura, anteriores a 1610 | 38 |
| **B** (`segura_B`) | Sonetos de autoría segura, de 1610 en adelante | 15 |
| **S** (`sin_asignar`) | Sonetos de autoría segura sin fecha (n.º 900-949) | 50 |
| **D** (`dudoso`) | Sonetos de atribución dudosa | 13 |

## Comandos

### Análisis principal

```bash
# Configuración por defecto: REF=A+B+S, evaluar dudosos
python3 gongora_v6.py gongora_escansion_curada.csv

# Equivalente explícito
python3 gongora_v6.py gongora_escansion_curada.csv --ref A+B+S --eval D

# Con distancias adicionales a cada subcorpus (ver afinidad A vs B vs S)
python3 gongora_v6.py gongora_escansion_curada.csv --ref A+B+S --eval D --also A,B,S

# Solo corpus con fecha como referencia, evaluar sin_asignar y dudosos
python3 gongora_v6.py gongora_escansion_curada.csv --ref A+B --eval S,D --also A,B

# Solo periodo temprano como canon
python3 gongora_v6.py gongora_escansion_curada.csv --ref A --eval B,D

# Salida con nombre personalizado
python3 gongora_v6.py gongora_escansion_curada.csv --ref A+B+S --eval D --html informe.html --json datos.json
```

### Validación con contraejemplos

```bash
# Evaluar sonetos de otros autores contra el corpus gongorino
python3 test_contraejemplo.py gongora_escansion_curada.csv contraejemplos.csv
```

Genera `informe_contraejemplos.md` con los resultados contra tres configuraciones de corpus (A+B+S, A+B, A+S).

### Generar escansión automática (punto de partida para curar)

```bash
# Desde el TXT de la edición OBVIL: genera HTML + JSON con escansión automática
python3 gongora_attribution_v52.py gongora_obra-poetica.txt
```

La escansión automática tiene ~57% de precisión en patrones binarios respecto a la curada manual. Sirve como borrador para revisión experta.

## HTML interactivo

`gongora_v6.py` genera un HTML autónomo (~95 KB) con todos los vectores de rasgos embebidos. No necesita servidor — se abre directamente en el navegador.

### Controles

- **REF**: checkboxes para seleccionar qué subcorpus forman la referencia
- **EVAL**: checkboxes para seleccionar qué subcorpus evaluar
- **ALSO**: checkboxes para calcular distancias adicionales a subgrupos
- **Recalcular**: ejecuta Mahalanobis + PCA en JavaScript (~50ms para 115 sonetos)

### Contenido

1. **Mapa prosódico (PCA 2D)**: proyección de todos los sonetos en 2 dimensiones. Hover muestra número e incipit.
2. **Tabla de evaluados**: distancia al centroide, veredicto, distancias ALSO, columna "→" indica afinidad.
3. **Outliers internos**: sonetos del propio REF que superan P95.
4. **Perfiles**: distribución acentual, autocorrelación, FFT y histograma de distancias. Si REF tiene varios subcorpus, muestra series separadas por color.

### Columnas ordenables

Clic en las cabeceras `#`, `Tag`, `Año`, `End.`, `d(REF)` para ordenar la tabla.

## Añadir un soneto al corpus

Para añadir un soneto dudoso, editar `gongora_escansion_curada.csv` con un editor de texto (no LibreOffice) y añadir 14 líneas con el formato:

```csv
"dudoso";"NNN";"";"Primer verso del soneto";"1";"Primer verso del soneto";"10010100010";"11";"1";"cuarteto";"fuente"
"dudoso";"NNN";"";"";"2";"Segundo verso";"01010100010";"11";"0";"cuarteto";"fuente"
...
```

Después regenerar el HTML:

```bash
python3 gongora_v6.py gongora_escansion_curada.csv --ref A+B+S --eval D
```

Para generar la escansión automática de un soneto como punto de partida:

```bash
python3 -c "
from gongora_attribution_v52 import analyze_verse
versos = ['primer verso,', 'segundo verso,', ...]
for i, v in enumerate(versos, 1):
    r = analyze_verse(v)
    pat = ''.join(str(x) for x in r['pattern'])
    print(f'\"dudoso\";\"NNN\";\"\";\"{\"\"}\";\"{i}\";\"{v}\";\"{pat}\";\"{r[\"s\"]}\";\"{r[\"sin\"]}\";\"{\"cuarteto\" if i<=8 else \"terceto\"}\";\"{\"fuente\"}\"')
"
```

## Advertencia sobre LibreOffice

**No guardar el CSV con LibreOffice Calc.** Al guardar, LibreOffice cambia el delimitador de `;` a `,` y elimina las comillas protectoras. Los versos con comas internas (frecuentes en poesía) se corrompen, produciendo resultados falsos sin mensaje de error.

Si es necesario usar una hoja de cálculo, exportar explícitamente como "CSV con separador punto y coma" y "entrecomillar todos los campos".

## Créditos

- Corpus: ADSO de Borja Navarro / 
- Motor de silabificación v5.2 y sistema de atribución: R. Vidal / Claude
- Marzo 2026
