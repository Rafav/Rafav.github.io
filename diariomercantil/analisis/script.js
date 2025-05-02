document.addEventListener('DOMContentLoaded', async () => {
    try {
        // No es necesario registrar manualmente el plugin de anotaciones,
        // se carga automáticamente con el script
        // Cargar el contenido del markdown
        const response = await fetch('articulo_literatura_aurea_completo.md');
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        let markdownText = await response.text();
        
        // Eliminar los metadatos YAML/LaTeX del inicio
        markdownText = markdownText.replace(/^---[\s\S]*?---\n/m, '');
        
        // Opciones para marked
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true
        });
        
        // Procesar el markdown y mostrarlo en el contenido principal
        const content = document.getElementById('content');
        content.innerHTML = marked.parse(markdownText);
        
        // Generar tabla de contenidos
        generateTableOfContents();
        
        // Crear los gráficos
        createCharts();
        
        // Añadir clase para animación de entrada
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 300);
        
    } catch(error) {
        console.error('Error al cargar el contenido:', error);
        document.getElementById('content').innerHTML = `
            <div class="error">
                <h2>Ha ocurrido un error al cargar el contenido</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
});

function generateTableOfContents() {
    const headings = document.querySelectorAll('main h2');
    const tocElement = document.getElementById('table-of-contents');
    
    headings.forEach((heading, index) => {
        // Asignar un ID al encabezado si no tiene uno
        if (!heading.id) {
            heading.id = `section-${index}`;
        }
        
        // Crear el elemento de la lista para la tabla de contenidos
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        listItem.appendChild(link);
        tocElement.appendChild(listItem);
    });
}

function createCharts() {
    // Buscar las tablas en el contenido y añadir gráficos después de ellas
    const tables = document.querySelectorAll('table');
    
    // Buscar tablas por sus leyendas/títulos
    const tableElems = Array.from(tables);
    
    // Tabla 1: Evolución de la presencia de literatura áurea
    const evolucionTable = findTableByCaption(tableElems, "Evolución de la presencia de literatura áurea");
    if (evolucionTable) {
        // Crear un contenedor para agrupar tabla y gráfico
        const pairWrapper = document.createElement('div');
        pairWrapper.className = 'table-chart-pair';
        
        // Crear contenedor para el gráfico
        const chartDiv = createChartContainer('evolucionChart', 'Gráfico: Evolución temporal (1807-1830)');
        
        // Reemplazar la tabla con el contenedor y mover la tabla dentro
        evolucionTable.parentNode.insertBefore(pairWrapper, evolucionTable);
        pairWrapper.appendChild(evolucionTable);
        pairWrapper.appendChild(chartDiv);
        
        // Crear el gráfico
        setTimeout(() => createEvolucionChart(), 100); // Pequeño retraso para asegurar que el DOM esté listo
    }
    
    // Tabla 2: Frecuencia de menciones por autor
    const autoresTable = findTableByCaption(tableElems, "Frecuencia de menciones por autor");
    if (autoresTable) {
        // Crear un contenedor para agrupar tabla y gráfico
        const pairWrapper = document.createElement('div');
        pairWrapper.className = 'table-chart-pair';
        
        // Crear contenedor para el gráfico
        const chartDiv = createChartContainer('autoresChart', 'Gráfico: Menciones por autor en años clave');
        
        // Reemplazar la tabla con el contenedor y mover la tabla dentro
        autoresTable.parentNode.insertBefore(pairWrapper, autoresTable);
        pairWrapper.appendChild(autoresTable);
        pairWrapper.appendChild(chartDiv);
        
        // Crear el gráfico
        setTimeout(() => createAutoresChart(), 200);
    }
    
    // Tabla 3: Obras áureas más representadas
    const obrasTable = findTableByCaption(tableElems, "Obras áureas más representadas");
    if (obrasTable) {
        // Crear un contenedor para agrupar tabla y gráfico
        const pairWrapper = document.createElement('div');
        pairWrapper.className = 'table-chart-pair';
        
        // Crear contenedor para el gráfico
        const chartDiv = createChartContainer('obrasChart', 'Gráfico: Obras más representadas');
        
        // Reemplazar la tabla con el contenedor y mover la tabla dentro
        obrasTable.parentNode.insertBefore(pairWrapper, obrasTable);
        pairWrapper.appendChild(obrasTable);
        pairWrapper.appendChild(chartDiv);
        
        // Crear el gráfico
        setTimeout(() => createObrasChart(), 300);
    }
    
    // Tabla 5: Correlación entre eventos políticos
    const correlacionTable = findTableByCaption(tableElems, "Correlación entre eventos políticos");
    if (correlacionTable) {
        // Crear un contenedor para agrupar tabla y gráfico
        const pairWrapper = document.createElement('div');
        pairWrapper.className = 'table-chart-pair';
        
        // Crear contenedor para el gráfico
        const chartDiv = createChartContainer('correlacionChart', 'Gráfico: Correlación con eventos políticos');
        
        // Reemplazar la tabla con el contenedor y mover la tabla dentro
        correlacionTable.parentNode.insertBefore(pairWrapper, correlacionTable);
        pairWrapper.appendChild(correlacionTable);
        pairWrapper.appendChild(chartDiv);
        
        // Crear el gráfico
        setTimeout(() => createCorrelacionChart(), 400);
    } else if (tables.length >= 5) {
        // Fallback: usar la quinta tabla si no encontramos por caption
        const table = tables[4];
        const pairWrapper = document.createElement('div');
        pairWrapper.className = 'table-chart-pair';
        
        const chartDiv = createChartContainer('correlacionChart', 'Gráfico: Correlación con eventos políticos');
        
        table.parentNode.insertBefore(pairWrapper, table);
        pairWrapper.appendChild(table);
        pairWrapper.appendChild(chartDiv);
        
        setTimeout(() => createCorrelacionChart(), 400);
    }
}

// Función para crear un contenedor de gráfico
function createChartContainer(chartId, title) {
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';
    
    // Añadir título descriptivo
    const chartTitle = document.createElement('h3');
    chartTitle.textContent = title;
    chartTitle.style.textAlign = 'center';
    chartTitle.style.marginBottom = '1rem';
    chartTitle.style.fontSize = '0.95rem';
    chartTitle.style.color = '#555';
    
    // Contenedor con altura limitada para el canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.style.height = '300px';
    canvasContainer.style.width = '100%';
    canvasContainer.style.position = 'relative';
    
    const canvas = document.createElement('canvas');
    canvas.id = chartId;
    canvas.style.maxHeight = '100%';
    
    canvasContainer.appendChild(canvas);
    chartWrapper.appendChild(chartTitle);
    chartWrapper.appendChild(canvasContainer);
    return chartWrapper;
}

// Función para insertar un elemento después de otro
function insertAfterElement(referenceNode, newNode) {
    if (referenceNode.parentNode) {
        // Insertar directamente el gráfico después de la tabla (sin espaciador)
        // Ya que los márgenes se manejan con CSS
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

// Función para encontrar una tabla por su texto de caption/título
function findTableByCaption(tables, captionText) {
    // Primero buscamos tablas que tengan un elemento caption con el texto
    for (const table of tables) {
        const prevElement = table.previousElementSibling;
        if (prevElement && prevElement.tagName === 'STRONG' && 
            prevElement.textContent.includes(captionText)) {
            return table;
        }
    }
    
    // Si no encontramos por caption, buscamos por texto cercano (encabezados o párrafos previos)
    for (const table of tables) {
        let prevSibling = table.previousElementSibling;
        let searchLimit = 3; // Buscar hasta 3 elementos hacia atrás
        
        while (prevSibling && searchLimit > 0) {
            if (prevSibling.textContent && prevSibling.textContent.includes(captionText)) {
                return table;
            }
            prevSibling = prevSibling.previousElementSibling;
            searchLimit--;
        }
    }
    
    // Si todo falla, devolvemos null
    return null;
}

function createEvolucionChart() {
    const ctx = document.getElementById('evolucionChart').getContext('2d');
    
    // Datos extraídos de la Tabla 1
    const years = [1807, 1808, 1809, 1810, 1811, 1812, 1816, 1818, 1820, 1825, 1830];
    const references = [59, 37, 22, 4, 18, 52, 43, 55, 61, 6, 119];
    const totals = [387, 253, 178, 86, 143, 324, 312, 408, 397, 127, 468];
    const percentages = [15.2, 14.6, 12.4, 4.7, 12.6, 16.0, 13.8, 13.5, 15.4, 4.7, 25.4];
    
    // Eventos históricos importantes para anotaciones
    const annotations = [
        { year: 1808, text: "Invasión francesa", position: "top" },
        { year: 1810, text: "Asedio de Cádiz", position: "bottom" },
        { year: 1812, text: "Constitución", position: "top" },
        { year: 1814, text: "Fin Guerra", position: "bottom", display: false },
        { year: 1820, text: "Trienio Liberal", position: "top" },
        { year: 1825, text: "Década Ominosa", position: "bottom" }
    ];
    
    // Configurar anotaciones para Chart.js
    const annotationItems = {};
    annotations.forEach(item => {
        if (years.includes(item.year)) {
            const index = years.indexOf(item.year);
            annotationItems[`annotation-${item.year}`] = {
                type: 'line',
                xMin: index,
                xMax: index,
                borderColor: item.position === 'top' ? '#4d2b1f' : '#a35638',
                borderWidth: 2,
                borderDash: [6, 4],
                label: {
                    display: item.display !== false,
                    content: item.text,
                    position: item.position,
                    backgroundColor: item.position === 'top' ? 'rgba(77, 43, 31, 0.8)' : 'rgba(163, 86, 56, 0.8)',
                    color: '#ffffff',
                    font: {
                        size: 11
                    },
                    padding: 6
                }
            };
        }
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Referencias áureas',
                    data: references,
                    borderColor: '#4d2b1f',
                    backgroundColor: 'rgba(77, 43, 31, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true
                },
                {
                    label: 'Porcentaje (%)',
                    data: percentages,
                    borderColor: '#a35638',
                    backgroundColor: 'rgba(163, 86, 56, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y1',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointStyle: 'rectRot'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            scales: {
                x: {
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    },
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Número de referencias',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    },
                    border: {
                        display: true
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Porcentaje (%)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    border: {
                        display: true
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        weight: 'bold',
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 10,
                    caretSize: 8,
                    cornerRadius: 6,
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0) {
                                const index = context.dataIndex;
                                return `Total menciones: ${totals[index]}`;
                            }
                            return '';
                        }
                    }
                },
                // Si el plugin de anotaciones está disponible, úsalo
                ...(window.Chart && window.Chart.annotation ? {
                    annotation: {
                        annotations: annotationItems
                    }
                } : {})
            }
        }
    });
}

function createAutoresChart() {
    const ctx = document.getElementById('autoresChart').getContext('2d');
    
    // Datos extraídos de la Tabla 2
    const authors = ['Lope de Vega', 'Calderón', 'Cervantes', 'Moreto', 'Tirso de Molina', 'Rojas Zorrilla'];
    const years = [1807, 1810, 1812, 1818, 1825, 1830];
    
    const datasets = [
        [39, 1, 18, 19, 2, 46], // Lope
        [11, 0, 14, 73, 3, 31], // Calderón
        [15, 2, 39, 12, 0, 36], // Cervantes
        [18, 0, 9, 13, 0, 22],  // Moreto
        [15, 1, 8, 14, 1, 64],  // Tirso
        [14, 0, 7, 3, 0, 12]    // Rojas
    ];
    
    // Colores para cada autor
    const colors = [
        '#c87941', '#8a5a44', '#3c1518', '#d8b26e', '#6d597a', '#9c6644'
    ];
    
    const chartDatasets = authors.map((author, i) => {
        return {
            label: author,
            data: datasets[i],
            backgroundColor: colors[i],
            borderColor: colors[i],
            borderWidth: 1
        };
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: chartDatasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Año'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Número de menciones'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createObrasChart() {
    const ctx = document.getElementById('obrasChart').getContext('2d');
    
    // Datos extraídos de la Tabla 3
    const obras = [
        'La Dama Duende (Calderón)',
        'Sancho Ortiz de las Roelas (Lope)',
        'El Alcalde de Zalamea (Calderón)',
        'Casa con dos puertas (Calderón)',
        'El desdén con el desdén (Moreto)',
        'La vida es sueño (Calderón)',
        'El mejor Alcalde el Rey (Lope)',
        'El vergonzoso en palacio (Tirso)',
        'Don Gil de las calzas verdes (Tirso)',
        'El perro del hortelano (Lope)'
    ];
    
    const representaciones = [38, 31, 27, 26, 25, 23, 22, 22, 21, 18];
    
    // Determinar el color basado en el autor
    const getColorByAuthor = (obra) => {
        if (obra.includes('Calderón')) return '#8a5a44';
        if (obra.includes('Lope')) return '#c87941';
        if (obra.includes('Tirso')) return '#6d597a';
        if (obra.includes('Moreto')) return '#d8b26e';
        return '#9c6644';
    };
    
    const colors = obras.map(getColorByAuthor);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: obras,
            datasets: [{
                label: 'Número de representaciones',
                data: representaciones,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const obra = obras[context.dataIndex];
                            const autor = obra.split('(')[1].replace(')', '');
                            return `Autor: ${autor}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Número de representaciones'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createCorrelacionChart() {
    const ctx = document.getElementById('correlacionChart').getContext('2d');
    
    // Datos extraídos de la Tabla 5
    const eventos = [
        'Motín de Aranjuez (Mar 1808)',
        'Llegada tropas francesas (May 1808)',
        'Batalla de Bailén (Jul 1808)',
        'Ocupación Sevilla (Feb 1810)',
        'Asedio de Cádiz (Feb 1810)',
        'Constitución 1812 (Mar 1812)',
        'Fin asedio (Ago 1812)',
        'Retorno Fernando VII (May 1814)',
        'Trienio Liberal (Mar 1820)',
        'Intervención francesa (Abr 1823)'
    ];
    
    const mesAnterior = [3, 5, 2, 3, 1, 4, 6, 7, 4, 8];
    const mesPosterior = [8, 2, 9, 1, 0, 11, 12, 3, 9, 2];
    const variacion = [166.7, -60.0, 350.0, -66.7, -100.0, 175.0, 100.0, -57.1, 125.0, -75.0];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: eventos,
            datasets: [
                {
                    label: 'Mes anterior',
                    data: mesAnterior,
                    backgroundColor: '#8a5a44',
                    borderColor: '#8a5a44',
                    borderWidth: 1,
                    stack: 'Stack 0'
                },
                {
                    label: 'Mes posterior',
                    data: mesPosterior,
                    backgroundColor: '#c87941',
                    borderColor: '#c87941',
                    borderWidth: 1,
                    stack: 'Stack 0'
                },
                {
                    label: 'Variación (%)',
                    data: variacion,
                    type: 'line',
                    borderColor: '#3c1518',
                    backgroundColor: 'rgba(60, 21, 24, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de referencias'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Variación (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}
