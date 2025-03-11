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

export function initNavbarTransform(options = {}) {
    // Default options
    const settings = {
      navbarSelector: '.navbar',
      sidebarSelector: '.filter-sidebar',
      scrollThreshold: 50,
      mobileBreakpoint: 768,
      navbarOffset: 10,
      transitionDuration: 300,
      ...options
    };
  
    // Get DOM elements
    const navbar = document.querySelector(settings.navbarSelector);
    const filterSidebar = document.querySelector(settings.sidebarSelector);
    
    // Variable to store the sidebar top position
    let filterSidebarTop = null;
    let lastScrolledState = false;
    
    // Create collapse toggle button if it doesn't exist
    function ensureCollapseButton() {
      if (!navbar.querySelector('.navbar-collapse-toggle')) {
        const collapseBtn = document.createElement('div');
        collapseBtn.className = 'navbar-collapse-toggle';
        collapseBtn.innerHTML = '<span></span>';
        collapseBtn.addEventListener('click', function() {
          navbar.classList.toggle('expanded');
          // Update filter sidebar position when expanded/collapsed
          if (filterSidebar) {
            if (navbar.classList.contains('expanded')) {
              // Get expanded navbar height
              const navbarHeight = navbar.offsetHeight;
              filterSidebar.style.top = `${navbarHeight + 10}px`;
            } else {
              // Reset to collapsed height
              const navbarHeight = navbar.querySelector('.navbar-minimal').offsetHeight;
              filterSidebar.style.top = `${navbarHeight + 10}px`;
            }
          }
        });
        navbar.appendChild(collapseBtn);
      }
    }
    
    // Ensure minimal row exists for collapsed state
    function ensureMinimalRow() {
      if (!navbar.querySelector('.navbar-minimal')) {
        const minimalRow = document.createElement('div');
        minimalRow.className = 'navbar-minimal';

        const homeIcon = document.createElement('div');
    homeIcon.className = 'home-icon';
    homeIcon.innerHTML = '🏠';
    homeIcon.addEventListener('click', function() {
      window.location.href = '/';
    });
    minimalRow.appendChild(homeIcon);
        
        // Clone search bar for minimal row
        const searchBar = navbar.querySelector('.search-bar');
        const searchInput = searchBar.querySelector(".search-bar input")
          if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = searchInput.value.trim();
                window.location.href = `/products?query=${encodeURIComponent(searchTerm)}`;
              }
            });
          }
        
        
        navbar.insertBefore(minimalRow, navbar.firstChild);
      }
    }
    
    /**
     * Updates the navbar position and state based on scroll position
     */
    function updateNavbarPosition() {
      if (!navbar) return;
      
      // Calculate filter sidebar top position if needed
      if (filterSidebar && !filterSidebarTop) {
        filterSidebarTop = filterSidebar.getBoundingClientRect().top + window.scrollY - settings.navbarOffset;
      }
      
      // Don't transform navbar on smaller screens
      if (window.innerWidth <= settings.mobileBreakpoint) {
        navbar.classList.remove('scrolled');
        navbar.classList.remove('expanded');
        if (filterSidebar) {
          filterSidebar.style.top = '';
        }
        return;
      }
      
      const scrollPosition = window.scrollY;
      const shouldBeScrolled = scrollPosition > settings.scrollThreshold;
      
      // Only update if state has changed
      if (shouldBeScrolled !== lastScrolledState) {
        lastScrolledState = shouldBeScrolled;
        
        if (shouldBeScrolled) {
          // Ensure we have the collapse button and minimal row for scrolled state
          ensureCollapseButton();
          ensureMinimalRow();
          
          // Add scrolled class
          navbar.classList.add('scrolled');
          navbar.classList.remove('expanded'); // Start in collapsed state
          
          // Adjust filter sidebar top position
          if (filterSidebar) {
            // Calculate the minimal row height
            const navbarHeight = navbar.querySelector('.navbar-minimal').offsetHeight;
            filterSidebar.style.top = `${navbarHeight + 60}px`;
          }
        } else {
          // Reset to normal state
          navbar.classList.remove('scrolled');
          navbar.classList.remove('expanded');
          
          // Reset filter sidebar position
          if (filterSidebar) {
            filterSidebar.style.top = '';
          }
        }
      }
    }
    
    // Initial update
    updateNavbarPosition();
    
    // Set up event listeners
    window.addEventListener('scroll', updateNavbarPosition);
    window.addEventListener('resize', function() {
      filterSidebarTop = null;
      updateNavbarPosition();
    });
    
    // Return public methods
    return {
      update: updateNavbarPosition,
      reset: function() {
        filterSidebarTop = null;
        lastScrolledState = false;
        updateNavbarPosition();
      }
    };
  }
  