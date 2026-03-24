# Atribución prosódica y léxica de sonetos de Góngora

Sistema de análisis estilométrico para evaluar la autoría de sonetos atribuidos a Luis de Góngora. Combina rasgos prosódicos (ritmo, acentos, sinalefas) con rasgos léxicos de rima (4-gramas fonológicos). Mide la distancia estadística (Mahalanobis) entre el perfil de un soneto y el del corpus gongorino de referencia.

## Para filólogos: qué hace y qué no hace

### Qué mide

Cada soneto se convierte en un **vector de 33 rasgos** organizados en dos bloques:

**Bloque prosódico (28 dimensiones)**:
- **Espectro rítmico** (FFT): descompone el patrón acentual del endecasílabo en frecuencias. Detecta si el ritmo es binario (yámbico), ternario (dactílico) o mixto.
- **Autocorrelación**: mide la regularidad interna del ritmo a lo largo del soneto. Un valor alto indica ritmo repetitivo; uno bajo, variación.
- **Distribución acentual**: frecuencia de acento en cada posición silábica (1-9) del endecasílabo. Captura preferencias por tipos rítmicos (heroico, sáfico, melódico, etc.).
- **Sinalefas**: media de sinalefas por verso.
- **Longitud literal**: caracteres por verso y su variabilidad (FFT, media, desviación).

**Bloque léxico de rima (5 dimensiones)**:
- **Diversidad de rima**: proporción de terminaciones fonológicas distintas (4-gramas invertidos) sobre el total de 14 versos.
- **Entropía de rima**: entropía de Shannon del histograma de 4-gramas. Alta entropía = rimas variadas; baja = rimas repetitivas.
- **Longitud de palabra-rima**: media de caracteres de las palabras en posición de rima. Señal de registro léxico (cultismos tienden a ser más largos).
- **Proporción participial**: porcentaje de rimas con terminación -ado/-ido/-ada/-ida. Marcador de sintaxis latinizante.
- **Longitud base normalizada**: longitud media de la raíz fonológica, discrimina entre léxico culto (largo) y popular (corto).

### Nota sobre la entonación

Las versiones anteriores incluían rasgos de entonación (% exclamaciones, % interrogaciones). Se han eliminado en v7 porque dependen de la puntuación editorial, que varía de un editor a otro. Donde un editor pone ¡...! otro puede no hacerlo, o el alcance del signo puede diferir entre ediciones. Es un rasgo poco fiable para atribución cuantitativa.

### Los 33 rasgos

| Dims | Bloque | Rasgos | Qué captura |
|------|--------|--------|-------------|
| 0–4 | FFT acentual | f₀–f₄ del endecasílabo | Armonías rítmicas |
| 5–11 | Autocorrelación | lags 2–8 | Periodicidad rítmica |
| 12 | Sinalefas | media/verso | Fusión vocálica |
| 13–21 | Perfil acentual | posiciones 1–9 | Esquema estructural completo |
| 22–25 | FFT longitud | f₁–f₄ de caracteres/verso | Materialidad fonética |
| 26–27 | Estadísticas longitud | media, desviación | Densidad y variabilidad léxica |
| 28 | Diversidad rima | tipos 4-gram / 14 | Riqueza fonológica de rima |
| 29 | Entropía rima | Shannon del histograma | Concentración vs dispersión |
| 30 | Longitud palabra-rima | media caracteres | Registro léxico (culto/popular) |
| 31 | Terminación participial | % -ado/-ido/-ada/-ida | Sintaxis latinizante |
| 32 | Longitud base normalizada | media raíz fonológica | Complejidad morfológica |

### Qué no mide

No analiza sintaxis, metáforas ni contenido semántico. Se limita a prosodia y hábito fonológico de rima. Sin embargo, con los 5 rasgos léxicos de rima, el sistema es capaz de rechazar sonetos de otros poetas áureos (Quevedo, Lope, Garcilaso, Sor Juana) que antes pasaban el filtro puramente prosódico.

### Cómo interpretar los resultados

| Veredicto | Significado |
|-----------|-------------|
| **COMPATIBLE** | El soneto cae dentro del rango prosódico y léxico normal del corpus (distancia < P95) |
| **ATÍPICO** | Está en la periferia (P95 < distancia < P99) |
| **MUY ATÍPICO** | Fuera del rango habitual (distancia > P99). Prosódica o léxicamente anómalo |

**«Compatible» no significa «de Góngora»**. Significa que el perfil rítmico y léxico es estadísticamente indistinguible del corpus gongorino.

**«Muy atípico» no significa «apócrifo»**. Puede ser un Góngora genuino con un perfil inusual (por ejemplo, un soneto satírico con ritmo más llano y léxico más popular).

### 4-gramas de rima: cómo funcionan

El 4-grama de rima es la terminación fonológica de la última palabra de cada verso, leída al revés y normalizada. Ejemplos:

| Palabra | Invertida | 4-grama |
|---------|-----------|---------|
| *enamorado* | odaromane | `odar` |
| *postrera* | arertsop | `arer` |
| *disciplina* | anilpicsid | `anil` |
| *sol* | los | `los_` (padding) |

Este mecanismo captura la sílaba tónica y la terminación sin depender de la longitud de la palabra. Es sensible al registro léxico: los cultismos y las palabras largas producen 4-gramas diferentes a las patrimoniales y cortas.

Para una explicación visual interactiva con ejemplos paso a paso, abrir [`fourgram_explicacion.html`](fourgram_explicacion.html) en el navegador.

## Para informáticos: arquitectura

### Pipeline

```
CSV curado ──→ extract_features() ──→ vector 33d ──→ Mahalanobis ──→ veredicto
                 ├── 28 dims prosódicas            ↗
                 └── 5 dims léxicas (4-gram)    centroide + Σ⁻¹ del REF
```

### Dependencias

**Ninguna** fuera de la stdlib de Python 3. No requiere numpy, scipy ni ningún paquete externo. La inversión de matriz 33×33 se hace por Gauss-Jordan, la PCA por power iteration, la FFT por DFT bruta O(N²) — aceptable para N ≤ 14.

### Estructura de ficheros

```
gongora_v7.py                    ← Script principal v7 (33 rasgos + HTML interactivo)
test_contraejemplo.py            ← Validación con sonetos no gongorinos
gongora_escansion_curada.csv     ← Corpus gongorino (escansión curada a mano)
contraejemplos.csv               ← Sonetos de otros autores (misma estructura, para curar)
gongora_pendientes_escansion.csv ← Sonetos del TXT pendientes de curar (escansión automática)
gongora_obra-poetica.txt         ← Edición OBVIL/Carreira (texto plano)
gongora_attribution_v52.py       ← Motor de silabificación v5.2 (genera escansión automática)
generar_pendientes.py            ← Genera CSV de sonetos pendientes desde el TXT
fourgram_rima.py                 ← Análisis exploratorio de 4-gramas (independiente)
```

#### Versiones anteriores (en salidas-3-categorias/)

```
gongora_v6.py                    ← v6: 31 rasgos (con entonación, sin 4-gramas)
gongora_corpus_completo.py       ← Versión anterior del corpus completo
gongora_from_csv.py              ← Generador de HTML desde CSV (3 categorías)
gongora_all_from_csv.py          ← Generador con 4 categorías
xml_to_csv.py                    ← Conversor XML→CSV original
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
| `fuente_xml` | Fichero XML de origen, nombre del autor (contraejemplos) o `OBVIL_auto` (pendientes) |

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
python3 gongora_v7.py gongora_escansion_curada.csv

# Equivalente explícito
python3 gongora_v7.py gongora_escansion_curada.csv --ref A+B+S --eval D

# Con distancias adicionales a cada subcorpus (ver afinidad A vs B vs S)
python3 gongora_v7.py gongora_escansion_curada.csv --ref A+B+S --eval D --also A,B,S

# Solo corpus con fecha como referencia, evaluar sin_asignar y dudosos
python3 gongora_v7.py gongora_escansion_curada.csv --ref A+B --eval S,D --also A,B

# Solo periodo temprano como canon
python3 gongora_v7.py gongora_escansion_curada.csv --ref A --eval B,D

# Salida con nombre personalizado
python3 gongora_v7.py gongora_escansion_curada.csv --ref A+B+S --eval D --html informe.html --json datos.json
```

### Validación con contraejemplos

```bash
# Evaluar sonetos de otros autores contra el corpus gongorino
python3 test_contraejemplo.py gongora_escansion_curada.csv contraejemplos.csv
```

Genera `informe_contraejemplos.md` con los resultados contra tres configuraciones de corpus (A+B+S, A+B, A+S).

### Generar escansión automática (punto de partida para curar)

```bash
# Generar CSV de sonetos del TXT que no están en el CSV curado
python3 generar_pendientes.py

# Desde el TXT de la edición OBVIL: genera HTML + JSON con escansión automática
python3 gongora_attribution_v52.py gongora_obra-poetica.txt
```

La escansión automática tiene ~57% de precisión en patrones binarios respecto a la curada manual. Sirve como borrador para revisión experta. Los sonetos pendientes se guardan en `gongora_pendientes_escansion.csv` con `fuente_xml="OBVIL_auto"`.

### Análisis exploratorio de 4-gramas

```bash
# Histogramas, distancias y clasificación por 4-gramas de rima
python3 fourgram_rima.py
```

Requiere `ultimas_palabras.csv`. Genera análisis de 4-gramas por corpus: top frecuencias, exclusividad, matrices de distancia coseno/JSD, clasificación de sin_asignar.

## HTML interactivo

`gongora_v7.py` genera un HTML autónomo (~98 KB) con todos los vectores de 33 rasgos embebidos. No necesita servidor — se abre directamente en el navegador.

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
python3 gongora_v7.py gongora_escansion_curada.csv --ref A+B+S --eval D
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

## Historial de versiones

| Versión | Rasgos | Cambios principales |
|---------|-------:|---------------------|
| v5.2 | 31 | Motor de silabificación + FFT + autocorrelación + Mahalanobis + PCA |
| v6 | 31 | HTML interactivo, selección flexible de REF/EVAL/ALSO, perfiles por subcorpus |
| v7 | 33 | Elimina entonación (poco fiable), añade 5 dims de 4-gramas de rima |

## Advertencia sobre LibreOffice

**No guardar el CSV con LibreOffice Calc.** Al guardar, LibreOffice cambia el delimitador de `;` a `,` y elimina las comillas protectoras. Los versos con comas internas (frecuentes en poesía) se corrompen, produciendo resultados falsos sin mensaje de error.

Si es necesario usar una hoja de cálculo, exportar explícitamente como "CSV con separador punto y coma" y "entrecomillar todos los campos".

## Créditos

- Corpus: ADSO de Borja Navarro
- Escansión curada: R. Vidal
- Motor de silabificación v5.2 y sistema de atribución: R. Vidal / Claude
- Marzo 2026
