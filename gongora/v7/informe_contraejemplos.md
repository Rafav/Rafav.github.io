# Validación del método prosódico: contraejemplos no gongorinos

**Objetivo**: comprobar si el sistema de atribución basado en distancia de
Mahalanobis sobre 33 rasgos (28 prosódicos + 5 léxicos de rima) es capaz de distinguir sonetos de
Góngora de sonetos de otros autores del Siglo de Oro.

**Motor**: gongora_v7.py — 33 rasgos — escansión curada manualmente en ambos CSVs

---

## 1. Configuraciones de corpus evaluadas

| Modelo | Composición | N | Mediana | P95 | P99 |
|--------|-------------|--:|--------:|----:|----:|
| **A+B+S** | A+B+S | 103 | 5.32 | 6.41 | 7.25 |
| **A+B** | A+B | 53 | 5.30 | 5.79 | 6.32 |
| **A+S** | A+S | 88 | 5.33 | 6.56 | 6.99 |

---

## 2. Contraejemplos

| # | Autor | Incipit |
|--:|-------|---------|
| 9001 | Quevedo | *Cerrar podrá mis ojos la postrera* |
| 9002 | Lope | *Un soneto me manda hacer Violante,* |
| 9003 | FrayLuis | *¿Y dejas, Pastor santo,* |
| 9004 | Garcilaso | *En tanto que de rosa y de azucena* |
| 9005 | Cetina | *Ojos claros, serenos,* |
| 9006 | Lope2 | *Desmayarse, atreverse, estar furioso,* |
| 9007 | SorJuana | *Detente, sombra de mi bien esquivo,* |

---

## 3. Contraejemplos vs A+B+S (103 sonetos)

| # | Autor | End. | d(A+B+S) | Veredicto |
|--:|-------|-----:|-------:|-----------|
| 9001 | Quevedo | 14/14 | **6.12** | COMPATIBLE |
| 9002 | Lope | 13/14 | **5.06** | COMPATIBLE |
| 9003 | FrayLuis | 5/14 | **16.44** | MUY ATÍPICO |
| 9004 | Garcilaso | 12/14 | **7.86** | MUY ATÍPICO |
| 9005 | Cetina | 9/14 | **18.92** | MUY ATÍPICO |
| 9006 | Lope2 | 12/14 | **8.35** | MUY ATÍPICO |
| 9007 | SorJuana | 14/14 | **6.03** | COMPATIBLE |

---

## 4. Contraejemplos vs A+B (53 sonetos)

| # | Autor | End. | d(A+B) | Veredicto |
|--:|-------|-----:|-------:|-----------|
| 9001 | Quevedo | 14/14 | **7.42** | MUY ATÍPICO |
| 9002 | Lope | 13/14 | **7.57** | MUY ATÍPICO |
| 9003 | FrayLuis | 5/14 | **28.55** | MUY ATÍPICO |
| 9004 | Garcilaso | 12/14 | **9.16** | MUY ATÍPICO |
| 9005 | Cetina | 9/14 | **30.23** | MUY ATÍPICO |
| 9006 | Lope2 | 12/14 | **12.30** | MUY ATÍPICO |
| 9007 | SorJuana | 14/14 | **8.18** | MUY ATÍPICO |

---

## 5. Contraejemplos vs A+S (88 sonetos)

| # | Autor | End. | d(A+S) | Veredicto |
|--:|-------|-----:|-------:|-----------|
| 9001 | Quevedo | 14/14 | **6.07** | COMPATIBLE |
| 9002 | Lope | 13/14 | **4.85** | COMPATIBLE |
| 9003 | FrayLuis | 5/14 | **16.38** | MUY ATÍPICO |
| 9004 | Garcilaso | 12/14 | **8.19** | MUY ATÍPICO |
| 9005 | Cetina | 9/14 | **19.63** | MUY ATÍPICO |
| 9006 | Lope2 | 12/14 | **8.66** | MUY ATÍPICO |
| 9007 | SorJuana | 14/14 | **6.13** | COMPATIBLE |

---

## 6. Comparación entre configuraciones

| # | Autor | d(A+B+S) | V. | d(A+B) | V. | d(A+S) | V. |
|--:|-------|-------:|----|-------:|----|-------:|----|
| 9001 | Quevedo | 6.12 | COMPATIBLE | 7.42 | MUY ATÍPICO | 6.07 | COMPATIBLE |
| 9002 | Lope | 5.06 | COMPATIBLE | 7.57 | MUY ATÍPICO | 4.85 | COMPATIBLE |
| 9003 | FrayLuis | 16.44 | MUY ATÍPICO | 28.55 | MUY ATÍPICO | 16.38 | MUY ATÍPICO |
| 9004 | Garcilaso | 7.86 | MUY ATÍPICO | 9.16 | MUY ATÍPICO | 8.19 | MUY ATÍPICO |
| 9005 | Cetina | 18.92 | MUY ATÍPICO | 30.23 | MUY ATÍPICO | 19.63 | MUY ATÍPICO |
| 9006 | Lope2 | 8.35 | MUY ATÍPICO | 12.30 | MUY ATÍPICO | 8.66 | MUY ATÍPICO |
| 9007 | SorJuana | 6.03 | COMPATIBLE | 8.18 | MUY ATÍPICO | 6.13 | COMPATIBLE |

---

## 7. Referencia: dudosos gongorinos

### A+B+S

| # | Incipit | End. | d(A+B+S) | Veredicto |
|--:|---------|-----:|-------:|-----------|
| 433 | *Yace debajo de esta piedra fría* | 14/14 | 5.00 | COMPATIBLE |
| 427 | *Señor, aquel Dragón de inglés veneno,* | 14/14 | 5.09 | COMPATIBLE |
| 428 | *Por tu vida, Lopillo, que me borres* | 14/14 | 5.30 | COMPATIBLE |
| 421 | *Generoso don Juan, sobre quien llueve* | 14/14 | 5.53 | COMPATIBLE |
| 460 | *Cierto poeta, en forma peregrina* | 14/14 | 5.90 | COMPATIBLE |
| 458 | *No sois, aunque en edad de cuatro sietes* | 14/14 | 5.93 | COMPATIBLE |
| 456 | *Antes que alguna caja luterana* | 14/14 | 6.38 | COMPATIBLE |
| 462 | *Doce sermones estampó Florencia,* | 14/14 | 6.66 | ATÍPICO |
| 449 | *Con poca luz y menos disciplina* | 14/14 | 7.39 | MUY ATÍPICO |
| 440 | *Vimo, señora Lopa, su Epopeya,* | 14/14 | 7.45 | MUY ATÍPICO |
| 420 | *Cisne gentil, después que crespo el vado* | 14/14 | 7.57 | MUY ATÍPICO |
| 442 | *Anacreonte español, no hay quien os tope* | 14/14 | 8.06 | MUY ATÍPICO |
| 439 | *Pálido sol en cielo encapotado,* | 14/14 | 11.19 | MUY ATÍPICO |

### A+B

| # | Incipit | End. | d(A+B) | Veredicto |
|--:|---------|-----:|-------:|-----------|
| 428 | *Por tu vida, Lopillo, que me borres* | 14/14 | 5.55 | COMPATIBLE |
| 462 | *Doce sermones estampó Florencia,* | 14/14 | 7.64 | MUY ATÍPICO |
| 427 | *Señor, aquel Dragón de inglés veneno,* | 14/14 | 7.72 | MUY ATÍPICO |
| 460 | *Cierto poeta, en forma peregrina* | 14/14 | 7.81 | MUY ATÍPICO |
| 433 | *Yace debajo de esta piedra fría* | 14/14 | 7.82 | MUY ATÍPICO |
| 421 | *Generoso don Juan, sobre quien llueve* | 14/14 | 8.24 | MUY ATÍPICO |
| 458 | *No sois, aunque en edad de cuatro sietes* | 14/14 | 8.36 | MUY ATÍPICO |
| 442 | *Anacreonte español, no hay quien os tope* | 14/14 | 8.82 | MUY ATÍPICO |
| 456 | *Antes que alguna caja luterana* | 14/14 | 9.39 | MUY ATÍPICO |
| 449 | *Con poca luz y menos disciplina* | 14/14 | 10.27 | MUY ATÍPICO |
| 420 | *Cisne gentil, después que crespo el vado* | 14/14 | 11.29 | MUY ATÍPICO |
| 440 | *Vimo, señora Lopa, su Epopeya,* | 14/14 | 11.75 | MUY ATÍPICO |
| 439 | *Pálido sol en cielo encapotado,* | 14/14 | 17.49 | MUY ATÍPICO |

### A+S

| # | Incipit | End. | d(A+S) | Veredicto |
|--:|---------|-----:|-------:|-----------|
| 433 | *Yace debajo de esta piedra fría* | 14/14 | 4.93 | COMPATIBLE |
| 427 | *Señor, aquel Dragón de inglés veneno,* | 14/14 | 5.34 | COMPATIBLE |
| 428 | *Por tu vida, Lopillo, que me borres* | 14/14 | 5.39 | COMPATIBLE |
| 458 | *No sois, aunque en edad de cuatro sietes* | 14/14 | 6.05 | COMPATIBLE |
| 460 | *Cierto poeta, en forma peregrina* | 14/14 | 6.14 | COMPATIBLE |
| 421 | *Generoso don Juan, sobre quien llueve* | 14/14 | 6.14 | COMPATIBLE |
| 456 | *Antes que alguna caja luterana* | 14/14 | 6.59 | ATÍPICO |
| 462 | *Doce sermones estampó Florencia,* | 14/14 | 7.05 | MUY ATÍPICO |
| 449 | *Con poca luz y menos disciplina* | 14/14 | 7.41 | MUY ATÍPICO |
| 420 | *Cisne gentil, después que crespo el vado* | 14/14 | 7.91 | MUY ATÍPICO |
| 442 | *Anacreonte español, no hay quien os tope* | 14/14 | 8.34 | MUY ATÍPICO |
| 440 | *Vimo, señora Lopa, su Epopeya,* | 14/14 | 8.47 | MUY ATÍPICO |
| 439 | *Pálido sol en cielo encapotado,* | 14/14 | 11.14 | MUY ATÍPICO |

---

## 8. Detalle verso a verso

### 9001. Quevedo

- **d(A+B+S)**: 6.12 → COMPATIBLE
- **d(A+B)**: 7.42 → MUY ATÍPICO
- **d(A+S)**: 6.07 → COMPATIBLE

| V. | Sil | Patrón | Sin. | Texto |
|---:|----:|--------|-----:|-------|
| 1 | 11 | `01010100010` | 0 | |
| 2 | 11 | `10000101010` | 1 | |
| 3 | 11 | `00100111010` | 1 | |
| 4 | 11 | `10010100010` | 2 | |
| 5 | 11 | `00010100010` | 2 | |
| 6 | 11 | `00100101010` | 2 | |
| 7 | 11 | `01010101010` | 1 | |
| 8 | 11 | `00100101010` | 1 | |
| 9 | 11 | `10110101110` | 2 | |
| 10 | 11 | `10010101110` | 2 | |
| 11 | 11 | `01010001010` | 2 | |
| 12 | 11 | `01000100010` | 0 | |
| 13 | 11 | `01010001010` | 0 | |
| 14 | 11 | `10010100010` | 1 | |

### 9002. Lope

- **d(A+B+S)**: 5.06 → COMPATIBLE
- **d(A+B)**: 7.57 → MUY ATÍPICO
- **d(A+S)**: 4.85 → COMPATIBLE

| V. | Sil | Patrón | Sin. | Texto |
|---:|----:|--------|-----:|-------|
| 1 | 11 | `00100101010` | 1 | |
| 2 | 11 | `00101101010` | 4 | |
| 3 | 11 | `01010101010` | 1 | |
| 4 | 11 | `10010101010` | 0 | |
| 5 | 11 | `10100100010` | 1 | |
| 6 | 11 | `01000110010` | 2 | |
| 7 | 11 | `00010001010` | 1 | |
| 8 | 11 | `11000100010` | 3 | |
| 9 | 11 | `00010101010` | 0 | |
| 10 | 11 | `00100101010` | 1 | |
| 11 | 11 | `01010100110` | 0 | |
| 12 | 11 | `01000101010` | 2 | |
| 13 | 11 | `01010100010` | 0 | |
| 14 | 10 | `0101010010` | 2 | |

### 9003. FrayLuis

- **d(A+B+S)**: 16.44 → MUY ATÍPICO
- **d(A+B)**: 28.55 → MUY ATÍPICO
- **d(A+S)**: 16.38 → MUY ATÍPICO

| V. | Sil | Patrón | Sin. | Texto |
|---:|----:|--------|-----:|-------|
| 1 | 7 | `0100110` | 0 | |
| 2 | 10 | `0101011010` | 2 | |
| 3 | 7 | `0001010` | 0 | |
| 4 | 7 | `0101010` | 1 | |
| 5 | 11 | `10010001010` | 0 | |
| 6 | 7 | `0100010` | 0 | |
| 7 | 11 | `00010100010` | 1 | |
| 8 | 6 | `001010` | 0 | |
| 9 | 7 | `0100010` | 0 | |
| 10 | 11 | `01000100010` | 0 | |
| 11 | 7 | `1001010` | 0 | |
| 12 | 11 | `01000100010` | 1 | |
| 13 | 7 | `0001010` | 1 | |
| 14 | 11 | `10100100010` | 0 | |

### 9004. Garcilaso

- **d(A+B+S)**: 7.86 → MUY ATÍPICO
- **d(A+B)**: 9.16 → MUY ATÍPICO
- **d(A+S)**: 8.19 → MUY ATÍPICO

| V. | Sil | Patrón | Sin. | Texto |
|---:|----:|--------|-----:|-------|
| 1 | 11 | `01000100010` | 2 | |
| 2 | 11 | `01000101010` | 0 | |
| 3 | 11 | `00100101010` | 1 | |
| 4 | 11 | `01000100010` | 1 | |
| 5 | 11 | `01000100010` | 3 | |
| 6 | 11 | `01000101010` | 1 | |
| 7 | 11 | `00010101010` | 1 | |
| 8 | 11 | `01010100010` | 2 | |
| 9 | 11 | `01010100010` | 1 | |
| 10 | 11 | `01011001010` | 3 | |
| 11 | 10 | `1001001010` | 1 | |
| 12 | 11 | `00010101010` | 2 | |
| 13 | 11 | `10000101010` | 1 | |
| 14 | 10 | `0010100010` | 2 | |

### 9005. Cetina

- **d(A+B+S)**: 18.92 → MUY ATÍPICO
- **d(A+B)**: 30.23 → MUY ATÍPICO
- **d(A+S)**: 19.63 → MUY ATÍPICO

| V. | Sil | Patrón | Sin. | Texto |
|---:|----:|--------|-----:|-------|
| 1 | 7 | `1010010` | 0 | |
| 2 | 11 | `00100110010` | 1 | |
| 3 | 11 | `01000101010` | 0 | |
| 4 | 7 | `0101010` | 0 | |
| 5 | 11 | `11000101010` | 2 | |
| 6 | 7 | `0001010` | 0 | |
| 7 | 11 | `10000110010` | 0 | |
| 8 | 7 | `1010010` | 0 | |
| 9 | 7 | `1010010` | 0 | |
| 10 | 11 | `00100101010` | 2 | |
| 11 | 11 | `00100101010` | 2 | |
| 12 | 11 | `00100101010` | 2 | |
| 13 | 11 | `00100101010` | 2 | |
| 14 | 11 | `00100101010` | 2 | |

### 9006. Lope2

- **d(A+B+S)**: 8.35 → MUY ATÍPICO
- **d(A+B)**: 12.30 → MUY ATÍPICO
- **d(A+S)**: 8.66 → MUY ATÍPICO

| V. | Sil | Patrón | Sin. | Texto |
|---:|----:|--------|-----:|-------|
| 1 | 11 | `00100101010` | 2 | |
| 2 | 11 | `10010001010` | 0 | |
| 3 | 11 | `00100101010` | 0 | |
| 4 | 11 | `01010100010` | 1 | |
| 5 | 11 | `01100010010` | 2 | |
| 6 | 11 | `01010101010` | 3 | |
| 7 | 11 | `00100100010` | 0 | |
| 8 | 11 | `00100100010` | 1 | |
| 9 | 10 | `1010100010` | 1 | |
| 10 | 10 | `0101000110` | 0 | |
| 11 | 11 | `00100101010` | 1 | |
| 12 | 11 | `01010001010` | 2 | |
| 13 | 11 | `10100100010` | 3 | |
| 14 | 11 | `11011001010` | 1 | |

### 9007. SorJuana

- **d(A+B+S)**: 6.03 → COMPATIBLE
- **d(A+B)**: 8.18 → MUY ATÍPICO
- **d(A+S)**: 6.13 → COMPATIBLE

| V. | Sil | Patrón | Sin. | Texto |
|---:|----:|--------|-----:|-------|
| 1 | 11 | `01010000010` | 0 | |
| 2 | 11 | `01000100110` | 0 | |
| 3 | 11 | `10010101010` | 1 | |
| 4 | 11 | `10010101010` | 0 | |
| 5 | 11 | `00100100010` | 1 | |
| 6 | 11 | `10010001010` | 2 | |
| 7 | 11 | `10100100010` | 1 | |
| 8 | 11 | `10010100010` | 1 | |
| 9 | 11 | `00010100010` | 0 | |
| 10 | 11 | `00100100010` | 0 | |
| 11 | 11 | `10100101010` | 3 | |
| 12 | 11 | `00100100010` | 0 | |
| 13 | 11 | `10100110010` | 1 | |
| 14 | 11 | `00100100010` | 0 | |

---

## 9. Análisis de los 4-gramas de rima (dims 28-32)

Las 5 dimensiones léxicas de rima capturan el hábito fonológico del poeta en posición
de rima. Esta sección aísla esas dimensiones para valorar su aportación independiente.

### 9.1. Perfil de referencia (corpus A+B+S, 103 sonetos)

| Rasgo | Media | Std | Mín | Máx |
|-------|------:|----:|----:|----:|
| Diversidad (tipos/14) | 0.691 | 0.160 | 0.286 | 1.000 |
| Entropía (bits) | 3.070 | 0.422 | 1.985 | 4.000 |
| Longitud palabra-rima | 6.34 | 0.73 | 3.07 | 8.43 |
| % participial (-ado/-ido) | 11.3% | 14.6% | 0% | 57.1% |
| Base normalizada | 6.34 | 0.73 | 3.07 | 8.43 |

### 9.2. Contraejemplos: perfil de 4-gramas

| # | Autor | Div | Ent | LenR | %Ptc | Base | 4-gramas compartidos con REF |
|--:|-------|----:|----:|-----:|-----:|-----:|----:|
| 9001 | Quevedo | 0.929 | 3.664 | 5.79 | **42.9%** | 5.79 | 13/14 |
| 9002 | Lope (Violante) | 0.500 | 2.557 | 7.21 | 0% | 7.21 | 10/14 |
| 9003 | Fray Luis | 0.643 | 3.039 | 7.07 | 14.3% | 7.07 | 11/14 |
| 9004 | Garcilaso | 0.714 | 3.093 | 6.79 | 14.3% | 6.79 | 6/14 |
| 9005 | Cetina | **0.357** | **1.921** | 6.07 | 0% | 6.07 | 6/14 |
| 9006 | Lope (Desmayarse) | 0.857 | 3.522 | 6.29 | 0% | 6.29 | 7/14 |
| 9007 | Sor Juana | 0.786 | 3.325 | 6.86 | 0% | 6.86 | 6/14 |

**Observaciones**:

- **Quevedo** tiene el % participial más alto (42.9%): 6 de 14 rimas terminan en
  -ado/-ido (*enamorado, traspasado, sido, dado, ardido, cuidado, sentido*). El corpus
  gongorino promedia 11.3%. Esta sobrecarga de participios en rima es el marcador
  más claro de distancia léxica.
- **Cetina** tiene la diversidad más baja (0.357) y la entropía mínima (1.921): repite
  el verso «ya que así me miráis, miradme al menos» 5 veces (artefacto del padding
  del madrigal a 14 versos).
- **Garcilaso y Sor Juana** solo comparten 6 de 14 terminaciones con el corpus
  gongorino. Sus 4-gramas exclusivos (*anec* ← azucena, *otseg* ← gesto, *oviq* ← esquivo)
  delatan un vocabulario de rima distinto.
- **Lope (Violante)** es el más anómalo en longitud (7.21): rima con palabras
  largas (*Violante, consonante, aprieto, cuarteto*) pero sin participios.

### 9.3. Dudosos gongorinos: perfil de 4-gramas

| # | Incipit | Div | Ent | LenR | %Ptc | Base | Compartidos |
|--:|---------|----:|----:|-----:|-----:|-----:|----:|
| 420 | *Cisne gentil* | 0.929 | 3.664 | 7.14 | 28.6% | 7.14 | 13/14 |
| 421 | *Generoso don Juan* | 0.929 | 3.664 | 5.86 | 14.3% | 5.86 | 10/14 |
| 427 | *Señor, aquel Dragón* | 0.714 | 3.182 | 5.50 | 0% | 5.50 | 10/14 |
| 428 | *Por tu vida, Lopillo* | 0.714 | 3.093 | 6.00 | 14.3% | 6.00 | 2/14 |
| 433 | *Yace debajo* | 0.571 | 2.807 | 7.50 | 0% | 7.50 | 4/14 |
| 439 | *Pálido sol* | 0.857 | 3.522 | 7.43 | 28.6% | 7.43 | 8/14 |
| 440 | *Vimo, señora Lopa* | 0.643 | 2.896 | 6.14 | 0% | 6.14 | 6/14 |
| 442 | *Anacreonte español* | 0.643 | 3.039 | 5.43 | 0% | 5.43 | 8/14 |
| 449 | *Con poca luz* | 0.786 | 3.325 | 6.36 | 0% | 6.36 | 11/14 |
| 456 | *Antes que alguna caja* | 0.714 | 3.236 | 6.93 | 0% | 6.93 | 6/14 |
| 458 | *No sois, aunque en edad* | 0.643 | 2.896 | 6.86 | 14.3% | 6.86 | 4/14 |
| 460 | *Cierto poeta* | 0.929 | 3.664 | 6.36 | 0% | 6.36 | 6/14 |
| 462 | *Doce sermones* | 0.571 | 2.807 | 7.50 | 14.3% | 7.50 | 10/14 |

**Observaciones sobre los dudosos**:

- **#449** (*Con poca luz y menos disciplina*): 0% de participios en rima y 11 de 14
  terminaciones compartidas con el corpus. Por 4-gramas, su vocabulario de rima es
  perfectamente gongorino (*disciplina, lego, luego, camina, Latina, griego...*).
  Su clasificación como MUY ATÍPICO (d=7.39) se debe a las dimensiones prosódicas,
  no a las léxicas.
- **#428** (*Por tu vida, Lopillo*): solo 2 de 14 terminaciones compartidas con REF.
  A pesar de ello sale COMPATIBLE (d=5.30), porque sus valores en las otras 4 dims
  léxicas están dentro del rango normal.
- **#439** (*Pálido sol*): 28.6% participial, por encima de la media (11.3%).
  Refuerza la señal de atipicidad que ya daba la prosodia (d=11.19).
- **#420** (*Cisne gentil*): 28.6% participial y diversidad máxima (0.929). Sale
  MUY ATÍPICO (d=7.57). El alto % de participios (*vado/abrigado/encanecida/humedecida*)
  contribuye a la distancia.

### 9.4. Valoración del bloque de 4-gramas

| Rasgo | Poder discriminante | Observaciones |
|-------|:---:|---|
| **Diversidad** (dim 28) | Medio | Distingue poemas con rimas repetidas (Cetina) pero el rango del corpus es amplio |
| **Entropía** (dim 29) | Medio | Correlaciona con diversidad; aporta matiz sobre distribución |
| **Longitud rima** (dim 30) | Bajo | Rango del corpus (3–8.4) muy amplio; pocos contraejemplos quedan fuera |
| **% participial** (dim 31) | **Alto** | Quevedo (43%) queda muy lejos de la media gongorina (11%). El marcador más claro |
| **Base normalizada** (dim 32) | Bajo | Redundante con dim 30 en este corpus |

La dimensión más discriminante de las 5 es el **porcentaje de participios en rima** (dim 31).
Un poeta que abusa de rimas participiales (-ado, -ido) se aleja significativamente del
perfil gongorino. La diversidad y la entropía son útiles para detectar anomalías formales
(como el padding del madrigal de Cetina) pero menos para distinguir entre sonetistas.

Las dimensiones 30 y 32 (longitud de palabra-rima y base normalizada) resultan
**redundantes** en este corpus porque la normalización apenas altera la longitud.
En una futura versión podría sustituirse dim 32 por otra métrica más informativa
(por ejemplo, % de rimas exclusivas del corpus REF).

---

## 10. Conclusiones

| Capacidad | Resultado |
|-----------|-----------|
| Detectar no-sonetos | **Sí** — rechaza correctamente liras y madrigales |
| Detectar sonetos prosódicamente anómalos | **Sí** — señala versos no endecasilábicos |
| Distinguir Góngora de otros sonetistas áureos | **Parcial** — depende de la configuración |
| Confirmar autoría gongorina | **No** — «compatible» ≠ «de Góngora» |

---

*Informe generado con `test_contraejemplo.py` — gongora_v7.py — 33 rasgos (28 prosódicos + 5 léxicos)*
