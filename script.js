let currentPage = 1;
const rowsPerPage = 100;
let data = [];
let filteredData = [];

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
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const tableBody = document.getElementById('table-body');

    tableBody.innerHTML = '';

    const dataToDisplay = filteredData.length > 0 ? filteredData : data;

    dataToDisplay.slice(start, end).forEach(row => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${row.edicion_id}</td>
            <td>${row.titulo}</td>
            <td>${row.ejemplar_id}</td>
            <td>${row.biblioteca}</td>
            <td>${row.signatura}</td>
            <td>${row.estaDigitalizado === "true" ? 'Sí' : 'No'}</td>
            <td>${row.url !== "null" ? `<a href="${row.url}" target="_blank">Ver URL</a>` : 'N/A'}</td>
            <td>${row.pdfDigitalizadoPath !== "null" ? `<a href="${row.pdfDigitalizadoPath}" target="_blank">Ver PDF</a>` : 'N/A'}</td>
            <td>${row.pagina_id !== "null" ? row.pagina_id : 'N/A'}</td>
            <td>${row.pagina_path !== "null" ? `<a href="${row.pagina_path}" target="_blank">Ver Página</a>` : 'N/A'}</td>
            <td>${row.pagina_orden !== "null" ? row.pagina_orden : 'N/A'}</td>
        `;
        tableBody.appendChild(newRow);
    });

    updatePaginationButtons();
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dataToDisplay = filteredData.length > 0 ? filteredData : data;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * rowsPerPage >= dataToDisplay.length;
}

document.getElementById('next-btn').addEventListener('click', () => {
    const dataToDisplay = filteredData.length > 0 ? filteredData : data;
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

document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    filteredData = data.filter(row => row.titulo.toLowerCase().includes(query));

    currentPage = 1;
    displayTable(currentPage);
});

loadData();
