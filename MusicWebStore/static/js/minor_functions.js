export function initializeFilterSearch() {
    const artistSearch = document.getElementById('artist-search');
    if (artistSearch) {
        artistSearch.addEventListener('input', function() {
            filterCheckboxes(this.value, 'artist-checkbox');
        });
    }
    
    const genreSearch = document.getElementById('genre-search');
    if (genreSearch) {
        genreSearch.addEventListener('input', function() {
            filterCheckboxes(this.value, 'filter-checkbox');
        });
    }
}

function filterCheckboxes(searchTerm, checkboxClass) {
    searchTerm = searchTerm.toLowerCase();
    
    const checkboxes = document.querySelectorAll(`.${checkboxClass}`);
    
    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label');
        
        const labelText = label.textContent.trim().toLowerCase();
        
        if (labelText.includes(searchTerm)) {
            label.classList.remove('hidden-filter');
        } else {
            label.classList.add('hidden-filter');
        }
    });
}

export function initializeSearchBar() {
    const searchBar = document.getElementById("search-bar");
    
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = searchBar.value.trim();
                window.location.href = `/products?query=${encodeURIComponent(searchTerm)}`;
            }
        });
        
        const searchBarContainer = searchBar.parentElement;
        if (searchBarContainer && searchBarContainer.classList.contains('search-bar')) {
            if (!searchBarContainer.querySelector('.search-button')) {
                const searchButton = document.createElement('button');
                searchButton.className = 'search-button';
                searchButton.innerHTML = '🔍';
                searchButton.style.border = 'none';
                searchButton.style.background = 'transparent';
                searchButton.style.cursor = 'pointer';
                searchButton.style.fontSize = '16px';
                
                searchButton.addEventListener('click', function() {
                    const searchTerm = searchBar.value.trim();
                    window.location.href = `/products?query=${encodeURIComponent(searchTerm)}`;
                });
                
                searchBarContainer.appendChild(searchButton);
            }
        }
    }
}

export function getSearchTermFromInput() {
    const searchBar = document.getElementById('search-bar');
    return searchBar ? searchBar.value.trim() : '';
}

export function displayGenres(genres) {
    const genreContainer = document.getElementById("filters");
    if (!genreContainer) return;
    
    genreContainer.innerHTML = "";
    
    genres.forEach(genre => {
        let genreLabel = document.createElement("label");
        genreLabel.classList.add("filter-label");
        
        const genreName = typeof genre === 'string' ? genre : genre[0];
        const displayName = genreName[0].toUpperCase() + genreName.slice(1);
        
        genreLabel.innerHTML = `
            <input type="checkbox" class="filter-checkbox" value="${displayName}">
            ${displayName}
        `;
        
        genreContainer.appendChild(genreLabel);
    });
}

export function handleExistingSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('query') || urlParams.get('title_search');
    
    if (searchTerm) {
        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
            searchBar.value = searchTerm;
        }
    }
    
    if (window.location.pathname.includes('/products')) {
        import('./major_functions.js').then(module => {
            module.fetchAlbums();
        });
    }
}

export function displayErrorMessage(message, container) {
    const targetContainer = container || document.getElementById("product-grid");
    if (targetContainer) {
        targetContainer.innerHTML = '';
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        targetContainer.appendChild(errorElement);
    }
}

export function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(content => {
        content.classList.remove("active");
    });

    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.classList.remove("active");
    });

    if (tabName && evt) {
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add("active");
        }
        
        evt.currentTarget.classList.add("active");
    } else {
        const firstTab = document.querySelector('.tab-content');
        const firstButton = document.querySelector('.tab-button');
        
        if (firstTab) firstTab.classList.add("active");
        if (firstButton) firstButton.classList.add("active");
    }
}

export function displayArtists(artists) {
    const artistContainer = document.getElementById("artists-filters");
    if (!artistContainer) return;
    
    artistContainer.innerHTML = "";
    
    artists.forEach(artist => {
        let artistLabel = document.createElement("label");
        artistLabel.classList.add("filter-label");
        
        artistLabel.innerHTML = `
            <input type="checkbox" class="artist-checkbox" value="${artist.id}">
            ${artist.name}
        `;
        
        artistContainer.appendChild(artistLabel);
    });
}