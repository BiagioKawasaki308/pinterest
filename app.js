const imageGrid = document.getElementById('imageGrid');
const loader = document.getElementById('loader');
const loadMoreButton = document.getElementById('loadMore');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let loadedUrls = new Set(); // Per evitare la ripetizione dei contenuti
let currentPage = 1; // Pagina corrente per il caricamento

async function loadContentFromRule34(tags = '') {
    loader.style.display = 'block';
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=50&tags=${tags}&pid=${currentPage}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length === 0) {
            console.log('Nessun contenuto trovato.');
            return;
        }

        data.forEach(item => {
            const url = item.file_url;
            if (loadedUrls.has(url)) return; // Salta i duplicati

            let element;
            if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif')) {
                element = document.createElement('img');
                element.src = url;
            } else if (url.endsWith('.mp4')) {
                element = document.createElement('video');
                element.src = url;
                element.controls = true;
            }

            if (element) {
                element.onclick = () => openPreview(url, element.tagName);
                imageGrid.appendChild(element);
                loadedUrls.add(url); // Aggiungi l'URL all'insieme
            }
        });
        currentPage++; // Incrementa la pagina
    } catch (error) {
        console.error('Errore nel caricamento dei contenuti:', error);
    } finally {
        loader.style.display = 'none';
    }
}

function openPreview(url, type) {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    
    const previewContent = document.createElement('div');
    previewContent.className = 'preview-content';
    
    let mediaElement;
    if (type === 'IMG') {
        mediaElement = document.createElement('img');
        mediaElement.src = url;
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = url;
        mediaElement.controls = true;
    }

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✖';
    closeButton.className = 'close-preview';
    closeButton.onclick = () => document.body.removeChild(previewContainer);

    previewContent.appendChild(mediaElement);
    previewContent.appendChild(closeButton);
    previewContainer.appendChild(previewContent);
    document.body.appendChild(previewContainer);
}

// Inizializza con i contenuti di Rule34
loadContentFromRule34();

// Gestisci il caricamento dei contenuti per il pulsante "Carica Altro"
loadMoreButton.addEventListener('click', loadContentFromRule34);

// Gestisci la ricerca
searchBtn.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        imageGrid.innerHTML = '';
        loadedUrls.clear();
        currentPage = 1; // Resetta la pagina
        loadContentFromRule34(searchQuery); // Cerca su Rule34
    }
});
