let currentPage = 1;
const rowsPerPage = 5000;
let data = [];
let filteredData = null; // Changed from [] to null to distinguish between no search and empty results

function loadData() {
    fetch('bidiso.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData;
            displayTable(currentPage);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
}

function displayTable(page) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table body

    // Determine which data to use
    const dataToDisplay = filteredData !== null ? filteredData : data;
    
    // If there are no results from a search, don't display anything
    if (filteredData !== null && filteredData.length === 0) {
        updatePaginationButtons();
        updateResultCount(0);
        return; // Exit early, leaving the table empty
    }

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const currentData = dataToDisplay.slice(start, end);

    currentData.forEach(row => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td data-label="Edición ID">${row.edicion_id}</td>
            <td data-label="Título">${row.titulo}</td>
            <td data-label="Ejemplar ID">${row.ejemplar_id}</td>
            <td data-label="Biblioteca">${row.biblioteca}</td>
            <td data-label="Signatura">${row.signatura}</td>
            <td data-label="Digitalizado">${row.estaDigitalizado === "true" ? 'Sí' : 'No'}</td>
            <td data-label="URL">${row.url !== "null" ? `<a href="${row.url}" target="_blank">Ver URL</a>` : 'N/A'}</td>
            <td data-label="PDF">${row.pdfDigitalizadoPath !== "null" ? `<a href="${row.pdfDigitalizadoPath}" target="_blank">Ver PDF</a>` : 'N/A'}</td>
            <td data-label="ID Página">${row.pagina_id !== "null" ? row.pagina_id : 'N/A'}</td>
            <td data-label="URL Página">${row.pagina_path !== "null" ? `<a href="${row.pagina_path}" target="_blank">Ver Página</a>` : 'N/A'}</td>
            <td data-label="Orden Página">${row.pagina_orden !== "null" ? row.pagina_orden : 'N/A'}</td>
        `;
        tableBody.appendChild(newRow);
    });

    updatePaginationButtons();
    updateResultCount(dataToDisplay.length);
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dataToDisplay = filteredData !== null ? filteredData : data;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * rowsPerPage >= dataToDisplay.length;
}

function updateResultCount(count) {
    const searchContainer = document.querySelector('.search-container');
    let resultCount = searchContainer.querySelector('.result-count');
    
    if (!resultCount) {
        resultCount = document.createElement('div');
        resultCount.className = 'result-count';
        searchContainer.appendChild(resultCount);
    }
    
    resultCount.textContent = `Resultados encontrados: ${count}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function performSearch(query) {
    query = query.toLowerCase().trim();
    
    if (query === '') {
        filteredData = null; // Reset to null when search is empty
    } else {
        filteredData = data.filter(row => 
            row.titulo.toLowerCase().includes(query)
        );
    }
    
    currentPage = 1; // Reset to first page
    displayTable(currentPage);
}

document.getElementById('search').addEventListener('input', 
    debounce(function(e) {
        performSearch(e.target.value);
    }, 300)
);

document.getElementById('next-btn').addEventListener('click', () => {
    const dataToDisplay = filteredData !== null ? filteredData : data;
    if (currentPage * rowsPerPage < dataToDisplay.length) {
        currentPage++;
        displayTable(currentPage);
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayTable(currentPage);
    }
});

loadData();
