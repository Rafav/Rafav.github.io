document.addEventListener('DOMContentLoaded', () => {
    try {
        // Generar tabla de contenidos
        generateTableOfContents();
        
        // Crear los gráficos
        createCharts();
        
        // Añadir clase para animación de entrada
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 300);
        
    } catch(error) {
        console.error('Error al inicializar la página:', error);
        document.getElementById('content').innerHTML += `
            <div class="error">
                <h2>Ha ocurrido un error al cargar los gráficos</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
});

function generateTableOfContents() {
    const headings = document.querySelectorAll('main h2');
    const tocElement = document.getElementById('table-of-contents');
    
    headings.forEach((heading) => {
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
    // Configuración global para todos los gráficos
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    
    // Crear los cuatro gráficos principales
    createEvolucionChart();
    createAutoresChart();
    createObrasChart();
    createCorrelacionChart();
    
    // Asegurar que los gráficos se redimensionen correctamente
    window.addEventListener('resize', function() {
        setTimeout(function() {
            // Actualizar todos los gráficos cuando cambie el tamaño de la ventana
            Chart.instances.forEach(chart => {
                chart.resize();
            });
        }, 100);
    });
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
                    borderColor: '#1a3a5a', // Actualizado a la paleta azul
                    backgroundColor: 'rgba(26, 58, 90, 0.1)',
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
                    borderColor: '#3b6e9e', // Actualizado a la paleta azul
                    backgroundColor: 'rgba(59, 110, 158, 0.1)',
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
                annotation: {
                    annotations: annotationItems
                }
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
    
    // Colores para cada autor (paleta azul)
    const colors = [
        '#1a3a5a', '#3b6e9e', '#5f9ad1', '#8abcf2', '#6c8fb3', '#274b73'
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
    
    // Determinar el color basado en el autor (paleta azul)
    const getColorByAuthor = (obra) => {
        if (obra.includes('Calderón')) return '#1a3a5a';
        if (obra.includes('Lope')) return '#3b6e9e';
        if (obra.includes('Tirso')) return '#5f9ad1';
        if (obra.includes('Moreto')) return '#8abcf2';
        return '#274b73';
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
                    backgroundColor: '#1a3a5a',
                    borderColor: '#1a3a5a',
                    borderWidth: 1,
                    stack: 'Stack 0'
                },
                {
                    label: 'Mes posterior',
                    data: mesPosterior,
                    backgroundColor: '#3b6e9e',
                    borderColor: '#3b6e9e',
                    borderWidth: 1,
                    stack: 'Stack 0'
                },
                {
                    label: 'Variación (%)',
                    data: variacion,
                    type: 'line',
                    borderColor: '#5f9ad1',
                    backgroundColor: 'rgba(95, 154, 209, 0.1)',
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
