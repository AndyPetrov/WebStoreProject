import { fetchUserStatus } from './major_functions.js';
import { handleExistingSearchQuery, displayGenres, displayArtists, initializeSearchBar, initializeFilterSearch, initNavbarTransform } from './minor_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    window.currentPage = 1;
    
    const container = document.getElementById("product-grid");
    if (!container) {
        console.error("Error: #track-grid not found in DOM.");
        return;
    }

    fetchUserStatus();
    initializeSearchBar();
    initializeFilterSearch();
    initializeFilterEvents();
    initializeLoadMoreButton();
    
    fetchGenres();
    fetchArtists();
    handleExistingSearchQuery();
    const navbarController = initNavbarTransform();
    navbarController.update();
    window.fetchTracks = fetchTracks;
    fetchTracks(1, false);
    
    function initializeFilterEvents() {
        const filterHeaders = document.querySelectorAll('.filter-header');
        filterHeaders.forEach(header => {
            const filtersContainer = header.nextElementSibling;
            const filters = filtersContainer.querySelector('.filters');
            
            header.classList.remove('expanded');
            if (filters) {
                filters.classList.remove('expanded');
            }
            
            header.addEventListener('click', function() {
                this.classList.toggle('expanded');
                
                const filtersContainer = this.nextElementSibling;
                
                const filters = filtersContainer.querySelector('.filters');
                
                if (filters) {
                    filters.classList.toggle('expanded');
                }
            });
        });
        
        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) {
            sortSelect.addEventListener("change", function() {
                window.currentPage = 1; 
                fetchTracks(1, false);
            });
        }
        
        const applyPriceButton = document.getElementById("apply-price-filter");
        if (applyPriceButton) {
            applyPriceButton.addEventListener("click", function() {
                window.currentPage = 1;
                fetchTracks(1, false);
            });
        }
        
        const header = document.getElementById("header");
        if (header) {
            header.textContent = "Tracks";
        }
    }
    
    function initializeLoadMoreButton() {
        const loadMoreButton = document.querySelector('.load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', function() {
                const nextPage = (window.currentPage || 1) + 1;
                fetchTracks(nextPage, true);
            });
        }
    }
    
    function fetchGenres() {
        console.log("Fetching genres...");
        fetch(`/api/genres`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch genres");
                }
                return response.json();
            })
            .then(genres => {
                displayGenres(genres);
                initializeGenreCheckboxEvents();
            })
            .catch(error => console.error("Error fetching genres:", error));
    }
    
    function fetchArtists() {
        fetch(`/api/artists`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch artists");
                }
                return response.json();
            })
            .then(artists => {
                displayArtists(artists);
                initializeArtistCheckboxEvents();
            })
            .catch(error => console.error("Error fetching artists:", error));
    }
    
    function initializeGenreCheckboxEvents() {
        setTimeout(() => {
            const checkboxes = document.querySelectorAll(".filter-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener("change", function() {
                    window.currentPage = 1; 
                    fetchTracks(1, false);
                });
            });
        }, 100);
    }
    
    function initializeArtistCheckboxEvents() {
        setTimeout(() => {
            const checkboxes = document.querySelectorAll(".artist-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener("change", function() {
                    window.currentPage = 1; 
                    fetchTracks(1, false);
                });
            });
        }, 100);
    }
});

// Main function to fetch tracks with filtering and pagination
function fetchTracks(page = 1, append = false) {
    const trackGrid = document.getElementById("product-grid");
    if (!trackGrid) return;

    console.log("Fetching tracks...");

    if (page === 1 && !append) {
        trackGrid.innerHTML = '<div class="loading">Loading tracks...</div>';
    } else if (append) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading';
        loadingIndicator.textContent = 'Loading more tracks...';
        trackGrid.appendChild(loadingIndicator);
    }

    const searchInput = document.getElementById("search-bar");
    const searchTerm = searchInput ? searchInput.value.trim() : "";

    const genreCheckboxes = document.querySelectorAll(".filter-checkbox:checked");
    let filterParams = [];
    genreCheckboxes.forEach(checkbox => {
        filterParams.push(`filter=${encodeURIComponent(checkbox.value)}`);
    });

    const artistCheckboxes = document.querySelectorAll(".artist-checkbox:checked");
    let artistParams = [];
    artistCheckboxes.forEach(checkbox => {
        artistParams.push(`artist=${encodeURIComponent(checkbox.value)}`);
    });

    const sortSelect = document.getElementById("sort-select");
    const sortValue = sortSelect ? sortSelect.value : "tracks.title-asc";

    const minPriceInput = document.getElementById("min-price");
    const minPrice = minPriceInput ? minPriceInput.value : "";

    const maxPriceInput = document.getElementById("max-price");
    const maxPrice = maxPriceInput ? maxPriceInput.value : "";

    let queryParts = [];
    if (searchTerm) {
        queryParts.push(`query=${encodeURIComponent(searchTerm)}`);
    }
    if (minPrice) {
        queryParts.push(`min_price=${encodeURIComponent(minPrice)}`);
    }
    if (maxPrice) {
        queryParts.push(`max_price=${encodeURIComponent(maxPrice)}`);
    }
    if (sortValue) {
        queryParts.push(`sort=${encodeURIComponent(sortValue)}`);
    }
    if (filterParams.length > 0) {
        queryParts = queryParts.concat(filterParams);
    }
    if (artistParams.length > 0) {
        queryParts = queryParts.concat(artistParams);
    }
    
    // Add pagination parameters
    queryParts.push(`page=${page}`);
    queryParts.push('per_page=30');

    const queryString = queryParts.length ? "?" + queryParts.join("&") : "";

    fetch(`/api/tracks${queryString}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            const loadingIndicators = trackGrid.querySelectorAll('.loading');
            loadingIndicators.forEach(indicator => indicator.remove());
            
            if (data.tracks.length === 0 && page === 1) {
                trackGrid.innerHTML = '<div class="error">No tracks found. Try adjusting your filters.</div>';
            } else {
                if (append && page > 1) {
                    displayTracks(data.tracks, true);
                } else {
                    displayTracks(data.tracks, false);
                }
                
                updateLoadMoreButton(data.has_more);
            }
            
            window.currentPage = page;
        })
        .catch(error => {
            console.error("Error fetching tracks:", error);
            if (page === 1) {
                trackGrid.innerHTML = '<div class="error">Failed to load tracks. Please try again later.</div>';
            } else {
                const loadingIndicators = trackGrid.querySelectorAll('.loading');
                loadingIndicators.forEach(indicator => indicator.remove());
            }
        });
}

// Function to display tracks in the grid
function displayTracks(tracks, append = false) {
    const container = document.getElementById("product-grid");
    if (!container) return;
    console.log("Display");
    if (!append) {
        container.innerHTML = "";
    }

    tracks.forEach(track => {
        let trackItem = document.createElement("div");
        trackItem.classList.add("product");
        
        // Get album cover from track's album
        let coverPath = track.album_cover;
        
        trackItem.innerHTML = `
            <img src="${coverPath}" alt="${track.title}" class="album-cover">
            <h3 class="product-title">${track.title}</h3>
            <p class="product-artist">By ${track.artist}</p>
            <p class="track-album">From ${track.album}</p>
            <p class="product-price">$${track.price.toFixed(2)}</p>
            <div class="product-buttons">
                <button class="view-button" data-track-id="${track.id}">View</button>
                <button class="preview-button" data-track-id="${track.id}" data-preview-url="${track.preview_url}">🎵</button>
                <button class="favorite-button" data-track-id="${track.id}">❤️</button>
            </div>
        `;
        
        // Image error handling
        const img = trackItem.querySelector("img");
        img.onerror = function() {
            this.src = '/static/images/default_album_cover.png';
            this.alt = 'Image not available';
        };
        
        const viewButton = trackItem.querySelector('.view-button');
        if (viewButton) {
            viewButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const trackId = viewButton.getAttribute('data-track-id');
                window.location.href = `/track/${trackId}`;
            });
        }
        
        const previewButton = trackItem.querySelector('.preview-button');
        if (previewButton) {
            previewButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const previewUrl = previewButton.getAttribute('data-preview-url');
                if (previewUrl) {
                    // Create audio element to play preview
                    const audio = new Audio(previewUrl);
                    audio.play();
                }
            });
        }
        
        container.appendChild(trackItem);
    });
}

// Function to update the load more button visibility
function updateLoadMoreButton(hasMore) {
    const loadMoreButton = document.querySelector('.load-more');
    if (loadMoreButton) {
        if (hasMore) {
            loadMoreButton.style.display = 'block';
        } else {
            loadMoreButton.style.display = 'none';
        }
    }
}

export { fetchTracks, displayTracks, updateLoadMoreButton };