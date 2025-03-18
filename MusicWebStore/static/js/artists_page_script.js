import { fetchUserStatus } from './major_functions.js';
import { handleExistingSearchQuery, displayGenres, initializeSearchBar, initializeFilterSearch, initNavbarTransform } from './minor_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    window.currentPage = 1;
    
    const container = document.getElementById("product-grid");
    if (!container) {
        console.error("Error: #product-grid not found in DOM.");
        return;
    }

    fetchUserStatus();
    initializeSearchBar();
    initializeFilterSearch();
    initializeFilterEvents();
    initializeLoadMoreButton();
    
    fetchGenres();
    handleExistingSearchQuery();
    const navbarController = initNavbarTransform();
    navbarController.update();
    
    // Initialize the fetch artists function
    fetchArtists();
    
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
        
        // Sort by options for artists
        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) {
            // Empty the select first to replace with artist-specific options
            sortSelect.innerHTML = '';
            
            // Add artist-specific sorting options
            const sortOptions = [
                { value: "artists.name-asc", text: "Name (A-Z)" },
                { value: "artists.name-desc", text: "Name (Z-A)" }
            ];
            
            sortOptions.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                sortSelect.appendChild(optionElement);
            });
            
            sortSelect.addEventListener("change", function() {
                window.currentPage = 1; 
                fetchArtists(1, false);
            });
        }
        
        const header = document.getElementById("header");
        if (header) {
            header.textContent = "Artists";
        }
    }
    
    function initializeLoadMoreButton() {
        const loadMoreButton = document.querySelector('.load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', function() {
                const nextPage = (window.currentPage || 1) + 1;
                fetchArtists(nextPage, true);
            });
        }
    }
    
    function fetchGenres() {
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
    
    function initializeGenreCheckboxEvents() {
        setTimeout(() => {
            const checkboxes = document.querySelectorAll(".filter-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener("change", function() {
                    window.currentPage = 1; 
                    fetchArtists(1, false);
                });
            });
        }, 100);
    }
});

// Function to fetch artists with pagination and filters
function fetchArtists(page = 1, append = false) {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    if (page === 1 && !append) {
        productGrid.innerHTML = '<div class="loading">Loading artists...</div>';
    } else if (append) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading';
        loadingIndicator.textContent = 'Loading more artists...';
        productGrid.appendChild(loadingIndicator);
    }

    const searchInput = document.getElementById("search-bar");
    const searchTerm = searchInput ? searchInput.value.trim() : "";

    const genreCheckboxes = document.querySelectorAll(".filter-checkbox:checked");
    let filterParams = [];
    genreCheckboxes.forEach(checkbox => {
        filterParams.push(`filter=${encodeURIComponent(checkbox.value)}`);
    });

    const sortSelect = document.getElementById("sort-select");
    const sortValue = sortSelect ? sortSelect.value : "artists.name-asc";

    let queryParts = [];
    if (searchTerm) {
        queryParts.push(`query=${encodeURIComponent(searchTerm)}`);
    }
    if (sortValue) {
        queryParts.push(`sort=${encodeURIComponent(sortValue)}`);
    }
    if (filterParams.length > 0) {
        queryParts = queryParts.concat(filterParams);
    }
    
    // Add pagination parameters
    queryParts.push(`page=${page}`);
    queryParts.push('per_page=30');

    const queryString = queryParts.length ? "?" + queryParts.join("&") : "";

    fetch(`/api/artists_data${queryString}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            const loadingIndicators = productGrid.querySelectorAll('.loading');
            loadingIndicators.forEach(indicator => indicator.remove());
            
            if (data.artists.length === 0 && page === 1) {
                productGrid.innerHTML = '<div class="error">No artists found. Try adjusting your filters.</div>';
            } else {
                if (append && page > 1) {
                    displayArtists(data.artists, true);
                } else {
                    displayArtists(data.artists, false);
                }
                
                updateLoadMoreButton(data.has_more);
            }
            
            window.currentPage = page;
        })
        .catch(error => {
            console.error("Error fetching artists:", error);
            if (page === 1) {
                productGrid.innerHTML = '<div class="error">Failed to load artists. Please try again later.</div>';
            } else {
                const loadingIndicators = productGrid.querySelectorAll('.loading');
                loadingIndicators.forEach(indicator => indicator.remove());
            }
        });
}

// Function to display artists
function displayArtists(artists, append = false) {
    const container = document.getElementById("product-grid");
    if (!container) return;

    if (!append) {
        container.innerHTML = "";
    }

    artists.forEach(artist => {
        let product = document.createElement("div");
        product.classList.add("product", "artist-card");
        
        // Default image if artist doesn't have one
        let imageUrl = artist.artist_url || "/static/images/default_artist_image.png";
        
        // Set the background image for the artist card
        product.style.backgroundImage = `url('${imageUrl}')`;
        product.style.backgroundSize = 'cover';
        product.style.backgroundPosition = 'center';
        product.style.position = 'relative';
        
        // Create a semi-transparent overlay for better text visibility
        let overlay = document.createElement("div");
        overlay.classList.add("artist-overlay");
        overlay.style.position = 'absolute';
        overlay.style.bottom = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.padding = '10px';
        overlay.style.textAlign = 'center';
        
        overlay.innerHTML = `
            <h3 class="artist-name">${artist.name}</h3>
            <p class="artist-genre">${artist.genre || 'Various Genres'}</p>
            <button class="view-button" data-artist-id="${artist.artist_id}">View</button>
        `;
        
        product.appendChild(overlay);
        
        const viewButton = overlay.querySelector('.view-button');
        if (viewButton) {
            viewButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const artistId = viewButton.getAttribute('data-artist-id');
                window.location.href = `/artist/${artistId}`;
            });
        }
        
        container.appendChild(product);
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

// Make functions available globally
window.fetchArtists = fetchArtists;
window.displayArtists = displayArtists;
window.updateLoadMoreButton = updateLoadMoreButton;