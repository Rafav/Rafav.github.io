document.addEventListener('DOMContentLoaded', function() {
    // Carga el JSON de datos
    let musicData = null;
    
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            musicData = data;
            console.log('Datos cargados', musicData);
            prepareData();
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('search-results').innerHTML = 
                `<div class="alert alert-danger">Error al cargar los datos. Por favor, intenta recargar la página.</div>`;
        });

    // Preparar datos para búsqueda
    function prepareData() {
        // Este método puede pre-procesar los datos si es necesario
        initCharts();
    }

    // Inicializar los gráficos
    function initCharts() {
        // Gráfico de términos
        const termsCtx = document.getElementById('termsChart').getContext('2d');
        new Chart(termsCtx, {
            type: 'bar',
            data: {
                labels: ['Coliseo', 'Comedia', 'Teatro', 'Tonadilla', 'Ópera', 'Aria', 'Música', 'Solo', 'Clave', 'Bajo', 'Concierto', 'Instrumento', 'Coro', 'Violín', 'Función', 'Espectáculo', 'Danza', 'Piano', 'Flauta', 'Obertura', 'Canto', 'Guitarra', 'Zarzuela', 'Músico', 'Seguidilla', 'Minuet', 'Baile', 'Orquesta', 'Villancico', 'Compositor'],
                datasets: [{
                    label: 'Frecuencia de términos',
                    data: [570, 601, 493, 517, 384, 256, 169, 301, 45, 43, 54, 40, 37, 31, 29, 26, 23, 22, 21, 21, 19, 17, 15, 12, 11, 11, 10, 6, 9, 11],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(199, 199, 199, 0.7)',
                        'rgba(83, 102, 255, 0.7)',
                        'rgba(128, 0, 128, 0.7)',
                        'rgba(0, 128, 128, 0.7)',
                        'rgba(128, 128, 0, 0.7)',
                        'rgba(0, 0, 128, 0.7)',
                        'rgba(128, 0, 0, 0.7)',
                        'rgba(0, 128, 0, 0.7)',
                        'rgba(139, 69, 19, 0.7)',
                        'rgba(72, 61, 139, 0.7)',
                        'rgba(46, 139, 87, 0.7)',
                        'rgba(205, 133, 63, 0.7)',
                        'rgba(123, 104, 238, 0.7)',
                        'rgba(255, 182, 193, 0.7)',
                        'rgba(250, 128, 114, 0.7)',
                        'rgba(152, 251, 152, 0.7)',
                        'rgba(135, 206, 250, 0.7)',
                        'rgba(221, 160, 221, 0.7)',
                        'rgba(176, 196, 222, 0.7)',
                        'rgba(255, 228, 196, 0.7)',
                        'rgba(210, 105, 30, 0.7)',
                        'rgba(100, 149, 237, 0.7)',
                        'rgba(144, 238, 144, 0.7)',
                        'rgba(240, 230, 140, 0.7)'
                    ],
                    borderColor: [
                        'rgb(54, 162, 235)',
                        'rgb(75, 192, 192)',
                        'rgb(255, 159, 64)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 206, 86)',
                        'rgb(199, 199, 199)',
                        'rgb(83, 102, 255)',
                        'rgb(128, 0, 128)',
                        'rgb(0, 128, 128)',
                        'rgb(128, 128, 0)',
                        'rgb(0, 0, 128)',
                        'rgb(128, 0, 0)',
                        'rgb(0, 128, 0)',
                        'rgb(139, 69, 19)',
                        'rgb(72, 61, 139)',
                        'rgb(46, 139, 87)',
                        'rgb(205, 133, 63)',
                        'rgb(123, 104, 238)',
                        'rgb(255, 182, 193)',
                        'rgb(250, 128, 114)',
                        'rgb(152, 251, 152)',
                        'rgb(135, 206, 250)',
                        'rgb(221, 160, 221)',
                        'rgb(176, 196, 222)',
                        'rgb(255, 228, 196)',
                        'rgb(210, 105, 30)',
                        'rgb(100, 149, 237)',
                        'rgb(144, 238, 144)',
                        'rgb(240, 230, 140)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Gráfico de categorías
        const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
        new Chart(categoriesCtx, {
            type: 'pie',
            data: {
                labels: ['Espacios', 'Géneros musicales', 'Instrumentos', 'Otros'],
                datasets: [{
                    label: 'Distribución por categorías',
                    data: [58.3, 39.2, 1.5, 1.0],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // Configurar navegación
    document.getElementById('nav-buscar').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('buscar');
    });

    document.getElementById('nav-estadisticas').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('estadisticas');
    });

    document.getElementById('nav-terminologia').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('terminologia');
    });

    document.getElementById('nav-marco').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('marco');
    });

    function showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('main > section').forEach(section => {
            section.classList.add('d-none');
        });
        
        // Mostrar la sección seleccionada
        document.getElementById(sectionId).classList.remove('d-none');
        
        // Actualizar navegación activa
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById('nav-' + sectionId).classList.add('active');
    }

    // Configurar búsqueda
    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('search-term').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Función de búsqueda
    function performSearch() {
        const searchTerm = document.getElementById('search-term').value.trim().toLowerCase();
        const searchCategory = document.getElementById('search-category').value;
        
        if (!musicData) {
            document.getElementById('search-results').innerHTML = 
                `<div class="alert alert-warning">Cargando datos, por favor espera...</div>`;
            return;
        }

        // Simulación de resultados (en una aplicación real, filtrarías musicData)
        // Este es un conjunto de resultados de ejemplo basados en los datos históricos
        const results = simulateSearch(searchTerm, searchCategory);
        
        displayResults(results, searchTerm);
    }

    // Búsqueda en datos reales
    function simulateSearch(term, category) {
        // Extraer entradas de los datos reales
        let results = [];
        
        if (!musicData || !musicData.Año || !musicData.datos) {
            console.error('Datos no disponibles o con formato incorrecto');
            return results;
        }
        
        // Crear ID único para cada noticia
        let currentId = 1;
        
        // Recorrer todas las entradas en data.json
        musicData.datos.forEach(entry => {
            // Procesar array "noticias"
            if (entry.noticias && Array.isArray(entry.noticias)) {
                entry.noticias.forEach(noticia => {
                    if (!noticia.contenido) {
                        return;
                    }
                    
                    // Extraer palabras clave del contenido
                    const keywords = extractKeywords(noticia.contenido);
                    
                    // Determinar categorías basadas en el contenido
                    const categories = determineCategories(noticia.contenido, keywords);
                    
                    // Determinar tipo de la noticia
                    const type = noticia.tipo || determineType(noticia);
                    
                    // Crear entrada procesada
                    const processedEntry = {
                        id: currentId++,
                        date: entry.fecha || 'Fecha desconocida',
                        title: noticia.título || noticia.sección || 'Sin título',
                        content: noticia.contenido,
                        type: type,
                        categories: categories,
                        keywords: keywords
                    };
                    
                    // Añadir a resultados según criterios de búsqueda
                    addToResults(processedEntry, term, category, results);
                });
            }
            
            // Procesar array "noticias_musicales"
            if (entry.noticias_musicales && Array.isArray(entry.noticias_musicales)) {
                entry.noticias_musicales.forEach(noticia => {
                    if (!noticia.contenido) {
                        return;
                    }
                    
                    // Extraer palabras clave del contenido
                    const keywords = extractKeywords(noticia.contenido);
                    
                    // Determinar categorías basadas en el contenido
                    const categories = determineCategories(noticia.contenido, keywords);
                    
                    // Añadir "musical" a las categorías si no existe
                    if (!categories.includes('musical')) {
                        categories.push('musical');
                    }
                    
                    // Determinar tipo de la noticia
                    const type = noticia.tipo || determineType(noticia);
                    
                    // Crear entrada procesada
                    const processedEntry = {
                        id: currentId++,
                        date: entry.fecha || 'Fecha desconocida',
                        title: noticia.título || noticia.sección || 'Sin título',
                        content: noticia.contenido,
                        type: type,
                        categories: categories,
                        keywords: keywords
                    };
                    
                    // Añadir a resultados según criterios de búsqueda
                    addToResults(processedEntry, term, category, results);
                });
            }
        });
        
        // Mostrar todos los resultados disponibles, sin límite
        console.log(`Total de resultados encontrados: ${results.length}`);
        return results;
    }
    
    // Función auxiliar para añadir entradas a los resultados
    function addToResults(entry, term, category, results) {
        // Si no hay término de búsqueda, incluir todos los resultados
        if (!term) {
            if (category === 'all' || entry.categories.includes(category)) {
                results.push(entry);
            }
        } else {
            // Buscar en el contenido
            const contentMatches = entry.content.toLowerCase().includes(term.toLowerCase());
            
            // Buscar en palabras clave
            const keywordMatches = entry.keywords.some(keyword => 
                keyword.toLowerCase().includes(term.toLowerCase())
            );
            
            // Filtrar por categoría si es necesario
            if (category !== 'all') {
                if ((contentMatches || keywordMatches) && entry.categories.includes(category)) {
                    results.push(entry);
                }
            } else if (contentMatches || keywordMatches) {
                results.push(entry);
            }
        }
    }
    
    // Extraer palabras clave de un texto
    function extractKeywords(text) {
        const keywords = [];
        const musicTerms = [
            'ópera', 'opera', 'tonadilla', 'comedia', 'teatro', 'coliseo', 'aria', 
            'música', 'concierto', 'instrumento', 'coro', 'violín', 'violin', 'flauta', 
            'obertura', 'canto', 'guitarra', 'zarzuela', 'músico', 'seguidilla', 
            'minuet', 'baile', 'bayle', 'orquesta', 'compañía', 'entrada', 'caños del peral',
            'principe', 'cruz', 'sonata', 'dueto', 'fandango', 'clave', 'bajo', 'baxo',
            'saynete', 'sainete', 'contradanza', 'divertimiento', 'fagot', 'clarinete'
        ];
        
        // Buscar términos musicales en el texto
        musicTerms.forEach(term => {
            if (text.toLowerCase().includes(term.toLowerCase())) {
                if (!keywords.includes(term)) {
                    keywords.push(term);
                }
            }
        });
        
        return keywords;
    }
    
    // Determinar categorías basadas en el contenido
    function determineCategories(text, keywords) {
        const categories = [];
        
        // Espacios musicales
        if (text.toLowerCase().includes('teatro') || 
            text.toLowerCase().includes('coliseo') || 
            text.toLowerCase().includes('caños del peral')) {
            categories.push('espacio');
        }
        
        // Géneros musicales
        if (text.toLowerCase().includes('ópera') || 
            text.toLowerCase().includes('opera') || 
            text.toLowerCase().includes('tonadilla') || 
            text.toLowerCase().includes('concierto') || 
            text.toLowerCase().includes('zarzuela')) {
            categories.push('genero');
        }
        
        // Instrumentos
        if (text.toLowerCase().includes('violín') || 
            text.toLowerCase().includes('violin') || 
            text.toLowerCase().includes('flauta') || 
            text.toLowerCase().includes('guitarra') || 
            text.toLowerCase().includes('clave') || 
            text.toLowerCase().includes('fagot') || 
            text.toLowerCase().includes('clarinete')) {
            categories.push('instrumento');
        }
        
        // Información económica
        if (text.toLowerCase().includes('entrada') || 
            text.toLowerCase().includes('rs.') || 
            text.toLowerCase().includes('precio')) {
            categories.push('economico');
        }
        
        // Intérpretes
        if (text.toLowerCase().includes('sr.') || 
            text.toLowerCase().includes('sra.') || 
            text.toLowerCase().includes('compañía')) {
            categories.push('interprete');
        }
        
        return categories;
    }
    
    // Determinar tipo de noticia
    function determineType(noticia) {
        if (noticia.tipo) {
            return noticia.tipo;
        }
        
        if (noticia.sección && noticia.sección.toLowerCase().includes('teatros')) {
            return 'anuncio';
        }
        
        if (noticia.título) {
            const title = noticia.título.toLowerCase();
            if (title.includes('carta')) {
                return 'carta';
            }
            if (title.includes('concierto') || title.includes('teatro') || title.includes('ópera')) {
                return 'anuncio';
            }
        }
        
        if (noticia.contenido) {
            const content = noticia.contenido.toLowerCase();
            if (content.includes('hoy') && (content.includes('teatro') || content.includes('ópera'))) {
                return 'anuncio';
            }
        }
        
        return 'otro';
    }

    // Mostrar resultados en la interfaz
    function displayResults(results, searchTerm) {
        const resultsContainer = document.getElementById('search-results');
        const resultCount = document.getElementById('result-count');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = 
                `<div class="alert alert-info">No se encontraron resultados para "${searchTerm}"</div>`;
            resultCount.textContent = '0 resultados';
            return;
        }
        
        // Actualizar contador
        resultCount.textContent = `${results.length} resultado${results.length !== 1 ? 's' : ''}`;
        
        // Mostrar resultados
        const resultsHTML = results.map(result => {
            // Destacar el término de búsqueda en el contenido
            const highlightedContent = highlightTerm(
                result.content.substring(0, 200) + (result.content.length > 200 ? '...' : ''),
                searchTerm
            );
            
            // Determinar la clase de insignia según el tipo
            let badgeClass = 'bg-secondary';
            if (result.type === 'anuncio') badgeClass = 'bg-primary';
            if (result.type === 'carta') badgeClass = 'bg-success';
            
            return `
                <div class="list-group-item list-group-item-action search-result fade-in" 
                     data-id="${result.id}" onclick="showEntryDetail(${result.id})">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-1">${result.title || 'Sin título'}</h5>
                        <span class="badge ${badgeClass}">${result.type}</span>
                    </div>
                    <p class="mb-1 text-muted small">${result.date}</p>
                    <p class="mb-1">${highlightedContent}</p>
                    <div class="mt-2">
                        ${result.keywords.map(keyword => 
                            `<span class="badge bg-light text-dark me-1">${keyword}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        resultsContainer.innerHTML = resultsHTML;
    }

    // Función para resaltar términos de búsqueda
    function highlightTerm(text, term) {
        if (!term) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Función global para mostrar detalles de una entrada
    window.showEntryDetail = function(id) {
        // En una aplicación real, buscarías la entrada por ID en musicData
        // Aquí usamos los datos de ejemplo
        const entry = simulateSearch('', 'all').find(e => e.id === id);
        
        if (!entry) {
            console.error('Entrada no encontrada:', id);
            return;
        }
        
        // Actualizar modal con detalles
        document.getElementById('entryModalTitle').textContent = entry.title || 'Detalle de la entrada';
        document.getElementById('modal-date').textContent = entry.date;
        document.getElementById('modal-content').textContent = entry.content;
        
        // Crear lista de referencias musicales
        const referencesHTML = entry.keywords.map(keyword => 
            `<li class="list-group-item">${keyword}</li>`
        ).join('');
        document.getElementById('modal-references').innerHTML = referencesHTML;
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('entryModal'));
        modal.show();
    };
});