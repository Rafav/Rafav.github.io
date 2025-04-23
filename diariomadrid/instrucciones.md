# Instrucciones para la Web de Música en el Madrid del Siglo XVIII

## Archivos Incluidos

1. **index.html** - Página principal de la aplicación web con estructura responsive
2. **styles.css** - Estilos CSS personalizados
3. **scripts.js** - Funcionalidades JavaScript para interactividad
4. **data.json** - Archivo original con los datos históricos (ya existente)

## Características Principales

Esta web permite consultar y analizar las referencias musicales del Madrid del siglo XVIII:

- **Buscador interactivo**: Permite filtrar por términos y categorías
- **Visualización de estadísticas**: Muestra gráficos de frecuencia de términos musicales
- **Corpus terminológico**: Documenta términos y vocabulario especializado
- **Marco teórico**: Proporciona contexto académico para la investigación

## Cómo Usar la Web

1. **Búsqueda de Referencias Musicales**:
   - Ingresa un término (por ejemplo: "ópera", "violín", "tonadilla")
   - Selecciona una categoría opcional (Géneros, Espacios, Instrumentos, etc.)
   - Haz clic en "Buscar" para encontrar coincidencias

2. **Visualización de Resultados**:
   - Los resultados aparecen como tarjetas interactivas
   - Haz clic en cualquier resultado para ver el documento completo
   - Las palabras buscadas aparecen resaltadas

3. **Análisis Estadístico**:
   - Navega a la pestaña "Estadísticas" para ver gráficos
   - Consulta la distribución de términos y categorías musicales

4. **Terminología Musical**:
   - Explora el vocabulario musical categorizado del siglo XVIII
   - Accede a información sobre géneros, espacios, instrumentos y economía musical

## Notas Técnicas

- **Responsive**: La web se adapta a dispositivos móviles, tablets y ordenadores
- **Navegación**: Usa el menú superior para cambiar entre las diferentes secciones
- **Datos**: Actualmente usa datos de ejemplo basados en el archivo data.json original
- **Gráficos**: Implementados con Chart.js para visualización de datos

## Personalización

Para personalizar la aplicación:

1. **Ajustar la conexión con data.json**:
   - Modifica scripts.js para procesar correctamente el archivo data.json existente
   - Reemplaza la función simulateSearch() con una que filtre los datos reales

2. **Extender funcionalidades**:
   - Añade filtros adicionales (por fecha, tipo de documento, etc.)
   - Incorpora más visualizaciones estadísticas
   - Agrega opciones de exportación de resultados

3. **Diseño visual**:
   - Personaliza los colores en styles.css
   - Ajusta el diseño según necesidades específicas

## Consideraciones Futuras

- Implementar búsqueda avanzada con operadores booleanos
- Desarrollar una API para acceder a los datos desde otras aplicaciones
- Crear un mapa interactivo de espacios musicales en el Madrid histórico
- Añadir línea temporal de eventos musicales relevantes