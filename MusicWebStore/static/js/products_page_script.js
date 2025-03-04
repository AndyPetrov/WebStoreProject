import { fetchUserStatus, fetchAlbums, updateLoadMoreButton } from './major_functions.js';
import { handleExistingSearchQuery, displayGenres, displayArtists, initializeSearchBar, initializeFilterSearch } from './minor_functions.js';

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
    fetchArtists();
    handleExistingSearchQuery();
    
    window.fetchAlbums = fetchAlbums;
    
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
                fetchAlbums(1, false);
            });
        }
        
        const applyPriceButton = document.getElementById("apply-price-filter");
        if (applyPriceButton) {
            applyPriceButton.addEventListener("click", function() {
                window.currentPage = 1;
                fetchAlbums(1, false);
            });
        }
        
        const header = document.getElementById("header");
        if (header) {
            header.textContent = "Albums";
        }
    }
    
    function initializeLoadMoreButton() {
        const loadMoreButton = document.querySelector('.load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', function() {
                const nextPage = (window.currentPage || 1) + 1;
                fetchAlbums(nextPage, true);
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
                    fetchAlbums(1, false);
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
                    fetchAlbums(1, false);
                });
            });
        }, 100);
    }
});