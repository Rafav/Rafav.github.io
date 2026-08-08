# Ex Bibliotheca Velasco — exposición virtual

Carrusel 3D de salas con control por gestos de webcam (o ratón/teclado) sobre
la biblioteca de Fernando José de Velasco y Ceballos (1707-1788).

## Uso

Necesita servirse por HTTP; no funciona con doble clic (`file://`).

```bash
cd ex_bibliotheca_velasco
python3 -m http.server 8000
```

Abrir `http://localhost:8000/index.html`.

## Controles

- **Ratón**: arrastrar para girar el carrusel, click para entrar en una sala
  o abrir un libro.
- **Teclado**: flechas ← → para girar, Enter para entrar, Escape para volver.
- **Gestos (requiere cámara)**: mano a la izquierda/derecha de la pantalla
  gira el carrusel; pinza (índice + pulgar) selecciona; dentro de una sala,
  mano cerca del borde superior/inferior hace scroll por los libros.

## Estructura

```
index.html        La aplicación
config.json        Las 12 salas y sus obras (título, portada, libros)
assets/            Favicon y marca de agua (ex-libris de Velasco)
salas/salaN/       Portada de cada sala + portadas de sus libros
fuente/            Scripts Python que generaron config.json y las portadas
                   (datos_salas.py, generar_portadas.py, generar_config.py) —
                   solo necesarios si se quiere editar contenido y regenerar,
                   no para ver la exposición.
```

## Editar contenido

Los textos y obras de cada sala viven en `fuente/datos_salas.py`. Tras
editarlo, desde esa carpeta:

```bash
python3 generar_portadas.py   # regenera las imágenes de portada
python3 generar_config.py     # regenera config.json
```

Requiere Pillow (`pip install pillow`) y la fuente EB Garamond instalada en
el sistema (o cambiar las rutas de fuente en `generar_portadas.py`).
