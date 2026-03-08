# Validación del método prosódico: contraejemplos no gongorinos

**Objetivo**: comprobar si el sistema de atribución basado en distancia de
Mahalanobis sobre 31 rasgos prosódicos es capaz de distinguir sonetos de
Góngora de sonetos de otros autores del Siglo de Oro.

**Motor**: gongora_v6.py — escansión curada manualmente en ambos CSVs

---

## 1. Configuraciones de corpus evaluadas

| Modelo | Composición | N | Mediana | P95 | P99 |
|--------|-------------|--:|--------:|----:|----:|
| **A+B+S** | A+B+S | 103 | 5.22 | 6.64 | 7.24 |
| **A+B** | A+B | 53 | 5.22 | 6.01 | 6.60 |
| **A+S** | A+S | 88 | 5.22 | 6.52 | 7.22 |

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
| 9001 | Quevedo | 14/14 | **6.05** | COMPATIBLE |
| 9002 | Lope | 13/14 | **4.93** | COMPATIBLE |
| 9003 | FrayLuis | 5/14 | **14.67** | MUY ATÍPICO |
| 9004 | Garcilaso | 12/14 | **7.73** | MUY ATÍPICO |
| 9005 | Cetina | 9/14 | **16.12** | MUY ATÍPICO |
| 9006 | Lope2 | 12/14 | **7.73** | MUY ATÍPICO |
| 9007 | SorJuana | 14/14 | **5.96** | COMPATIBLE |

---

## 4. Contraejemplos vs A+B (53 sonetos)

| # | Autor | End. | d(A+B) | Veredicto |
|--:|-------|-----:|-------:|-----------|
| 9001 | Quevedo | 14/14 | **7.08** | MUY ATÍPICO |
| 9002 | Lope | 13/14 | **6.56** | ATÍPICO |
| 9003 | FrayLuis | 5/14 | **25.52** | MUY ATÍPICO |
| 9004 | Garcilaso | 12/14 | **8.84** | MUY ATÍPICO |
| 9005 | Cetina | 9/14 | **23.22** | MUY ATÍPICO |
| 9006 | Lope2 | 12/14 | **11.86** | MUY ATÍPICO |
| 9007 | SorJuana | 14/14 | **7.89** | MUY ATÍPICO |

---

## 5. Contraejemplos vs A+S (88 sonetos)

| # | Autor | End. | d(A+S) | Veredicto |
|--:|-------|-----:|-------:|-----------|
| 9001 | Quevedo | 14/14 | **6.00** | COMPATIBLE |
| 9002 | Lope | 13/14 | **5.13** | COMPATIBLE |
| 9003 | FrayLuis | 5/14 | **14.34** | MUY ATÍPICO |
| 9004 | Garcilaso | 12/14 | **7.94** | MUY ATÍPICO |
| 9005 | Cetina | 9/14 | **16.37** | MUY ATÍPICO |
| 9006 | Lope2 | 12/14 | **7.91** | MUY ATÍPICO |
| 9007 | SorJuana | 14/14 | **6.05** | COMPATIBLE |

---

## 6. Comparación entre configuraciones

| # | Autor | d(A+B+S) | V. | d(A+B) | V. | d(A+S) | V. |
|--:|-------|-------:|----|-------:|----|-------:|----|
| 9001 | Quevedo | 6.05 | COMPATIBLE | 7.08 | MUY ATÍPICO | 6.00 | COMPATIBLE |
| 9002 | Lope | 4.93 | COMPATIBLE | 6.56 | ATÍPICO | 5.13 | COMPATIBLE |
| 9003 | FrayLuis | 14.67 | MUY ATÍPICO | 25.52 | MUY ATÍPICO | 14.34 | MUY ATÍPICO |
| 9004 | Garcilaso | 7.73 | MUY ATÍPICO | 8.84 | MUY ATÍPICO | 7.94 | MUY ATÍPICO |
| 9005 | Cetina | 16.12 | MUY ATÍPICO | 23.22 | MUY ATÍPICO | 16.37 | MUY ATÍPICO |
| 9006 | Lope2 | 7.73 | MUY ATÍPICO | 11.86 | MUY ATÍPICO | 7.91 | MUY ATÍPICO |
| 9007 | SorJuana | 5.96 | COMPATIBLE | 7.89 | MUY ATÍPICO | 6.05 | COMPATIBLE |

---

## 7. Referencia: dudosos gongorinos

### A+B+S

| # | Incipit | End. | d(A+B+S) | Veredicto |
|--:|---------|-----:|-------:|-----------|
| 433 | *Yace debajo de esta piedra fría* | 14/14 | 4.66 | COMPATIBLE |
| 421 | *Generoso don Juan, sobre quien llueve* | 14/14 | 4.71 | COMPATIBLE |
| 428 | *Por tu vida, Lopillo, que me borres* | 14/14 | 5.18 | COMPATIBLE |
| 427 | *Señor, aquel Dragón de inglés veneno,* | 14/14 | 5.23 | COMPATIBLE |
| 458 | *No sois, aunque en edad de cuatro sietes* | 14/14 | 5.25 | COMPATIBLE |
| 460 | *Cierto poeta, en forma peregrina* | 14/14 | 5.26 | COMPATIBLE |
| 456 | *Antes que alguna caja luterana* | 14/14 | 5.45 | COMPATIBLE |
| 420 | *Cisne gentil, después que crespo el vado* | 14/14 | 6.14 | COMPATIBLE |
| 462 | *Doce sermones estampó Florencia,* | 14/14 | 6.67 | ATÍPICO |
| 442 | *Anacreonte español, no hay quien os tope* | 14/14 | 6.74 | ATÍPICO |
| 440 | *Vimo, señora Lopa, su Epopeya,* | 14/14 | 7.01 | ATÍPICO |
| 449 | *Con poca luz y menos disciplina* | 14/14 | 7.20 | ATÍPICO |
| 439 | *Pálido sol en cielo encapotado,* | 14/14 | 11.08 | MUY ATÍPICO |

### A+B

| # | Incipit | End. | d(A+B) | Veredicto |
|--:|---------|-----:|-------:|-----------|
| 428 | *Por tu vida, Lopillo, que me borres* | 14/14 | 5.37 | COMPATIBLE |
| 421 | *Generoso don Juan, sobre quien llueve* | 14/14 | 6.43 | ATÍPICO |
| 427 | *Señor, aquel Dragón de inglés veneno,* | 14/14 | 7.29 | MUY ATÍPICO |
| 433 | *Yace debajo de esta piedra fría* | 14/14 | 7.47 | MUY ATÍPICO |
| 460 | *Cierto poeta, en forma peregrina* | 14/14 | 7.60 | MUY ATÍPICO |
| 458 | *No sois, aunque en edad de cuatro sietes* | 14/14 | 7.73 | MUY ATÍPICO |
| 420 | *Cisne gentil, después que crespo el vado* | 14/14 | 7.93 | MUY ATÍPICO |
| 442 | *Anacreonte español, no hay quien os tope* | 14/14 | 7.98 | MUY ATÍPICO |
| 456 | *Antes que alguna caja luterana* | 14/14 | 7.99 | MUY ATÍPICO |
| 462 | *Doce sermones estampó Florencia,* | 14/14 | 8.16 | MUY ATÍPICO |
| 449 | *Con poca luz y menos disciplina* | 14/14 | 9.10 | MUY ATÍPICO |
| 440 | *Vimo, señora Lopa, su Epopeya,* | 14/14 | 10.75 | MUY ATÍPICO |
| 439 | *Pálido sol en cielo encapotado,* | 14/14 | 16.52 | MUY ATÍPICO |

### A+S

| # | Incipit | End. | d(A+S) | Veredicto |
|--:|---------|-----:|-------:|-----------|
| 433 | *Yace debajo de esta piedra fría* | 14/14 | 4.78 | COMPATIBLE |
| 421 | *Generoso don Juan, sobre quien llueve* | 14/14 | 4.91 | COMPATIBLE |
| 458 | *No sois, aunque en edad de cuatro sietes* | 14/14 | 5.11 | COMPATIBLE |
| 427 | *Señor, aquel Dragón de inglés veneno,* | 14/14 | 5.39 | COMPATIBLE |
| 428 | *Por tu vida, Lopillo, que me borres* | 14/14 | 5.44 | COMPATIBLE |
| 460 | *Cierto poeta, en forma peregrina* | 14/14 | 5.56 | COMPATIBLE |
| 456 | *Antes que alguna caja luterana* | 14/14 | 5.63 | COMPATIBLE |
| 420 | *Cisne gentil, después que crespo el vado* | 14/14 | 6.60 | ATÍPICO |
| 462 | *Doce sermones estampó Florencia,* | 14/14 | 6.97 | ATÍPICO |
| 442 | *Anacreonte español, no hay quien os tope* | 14/14 | 7.01 | ATÍPICO |
| 440 | *Vimo, señora Lopa, su Epopeya,* | 14/14 | 7.45 | MUY ATÍPICO |
| 449 | *Con poca luz y menos disciplina* | 14/14 | 7.61 | MUY ATÍPICO |
| 439 | *Pálido sol en cielo encapotado,* | 14/14 | 10.88 | MUY ATÍPICO |

---

## 8. Detalle verso a verso

### 9001. Quevedo

- **d(A+B+S)**: 6.05 → COMPATIBLE
- **d(A+B)**: 7.08 → MUY ATÍPICO
- **d(A+S)**: 6.00 → COMPATIBLE

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

- **d(A+B+S)**: 4.93 → COMPATIBLE
- **d(A+B)**: 6.56 → ATÍPICO
- **d(A+S)**: 5.13 → COMPATIBLE

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

- **d(A+B+S)**: 14.67 → MUY ATÍPICO
- **d(A+B)**: 25.52 → MUY ATÍPICO
- **d(A+S)**: 14.34 → MUY ATÍPICO

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

- **d(A+B+S)**: 7.73 → MUY ATÍPICO
- **d(A+B)**: 8.84 → MUY ATÍPICO
- **d(A+S)**: 7.94 → MUY ATÍPICO

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

- **d(A+B+S)**: 16.12 → MUY ATÍPICO
- **d(A+B)**: 23.22 → MUY ATÍPICO
- **d(A+S)**: 16.37 → MUY ATÍPICO

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

- **d(A+B+S)**: 7.73 → MUY ATÍPICO
- **d(A+B)**: 11.86 → MUY ATÍPICO
- **d(A+S)**: 7.91 → MUY ATÍPICO

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

- **d(A+B+S)**: 5.96 → COMPATIBLE
- **d(A+B)**: 7.89 → MUY ATÍPICO
- **d(A+S)**: 6.05 → COMPATIBLE

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

## 9. Conclusiones

| Capacidad | Resultado |
|-----------|-----------|
| Detectar no-sonetos | **Sí** — rechaza correctamente liras y madrigales |
| Detectar sonetos prosódicamente anómalos | **Sí** — señala versos no endecasilábicos |
| Distinguir Góngora de otros sonetistas áureos | **Parcial** — depende de la configuración |
| Confirmar autoría gongorina | **No** — «compatible» ≠ «de Góngora» |

---

*Informe generado con `test_contraejemplo.py` — gongora_v6.py — escansión curada*
