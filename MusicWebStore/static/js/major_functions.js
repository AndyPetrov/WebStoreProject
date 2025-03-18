export function fetchUserStatus() {
  return fetch('/api/user_status')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const profileButton = document.querySelector('.profile-button');
      if (profileButton) {
        if (data.logged_in) {
          profileButton.textContent = data.username;
          profileButton.onclick = () => location.href = '/profile';
        } else {
          profileButton.textContent = "Login";
          profileButton.onclick = () => location.href = '/login';
        }
      }
      return data;
    })
    .catch(error => {
      console.error("Error fetching user status:", error);
      return { logged_in: false };
    });
}

export async function handleRegisterSubmit(e) {
    e.preventDefault();

    const formData = {
        action: "register",
        username: document.querySelector("#register-form input[placeholder='Username...']").value,
        name: document.querySelector("#register-form input[placeholder='Name...']").value,
        surname: document.querySelector("#register-form input[placeholder='Surname...']").value,
        email: document.querySelector("#register-form input[placeholder='E-mail...']").value,
        password: document.querySelector("#register-form input[placeholder='Password...']").value
    };

    const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    const data =  response.json();
    if (response.ok) {
        alert("Registration successful! You can now log in.");
    } else {
        alert(data.error);
    }
}

export async function handleLoginSubmit(e) {
    e.preventDefault();

    const username = document.querySelector("#login-form input[type='text']").value;
    const password = document.querySelector("#login-form input[type='password']").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username, password })
    });

    const data = response.json();
    if (response.ok) {
        alert("Login successful!");
        window.location.href = "/";
    } else {
        alert(data.error);
    }
}

export function fetchAlbums(page = 1, append = false) {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  if (page === 1 && !append) {
      productGrid.innerHTML = '<div class="loading">Loading albums...</div>';
  } else if (append) {
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'loading';
      loadingIndicator.textContent = 'Loading more albums...';
      productGrid.appendChild(loadingIndicator);
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
  const sortValue = sortSelect ? sortSelect.value : "albums.title-asc";

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

  fetch(`/api/albums${queryString}`)
      .then(response => {
          if (!response.ok) {
              return response.text().then(text => { throw new Error(text); });
          }
          return response.json();
      })
      .then(data => {
          const loadingIndicators = productGrid.querySelectorAll('.loading');
          loadingIndicators.forEach(indicator => indicator.remove());
          
          if (data.albums.length === 0 && page === 1) {
              productGrid.innerHTML = '<div class="error">No albums found. Try adjusting your filters.</div>';
          } else {
              if (append && page > 1) {
                  displayAlbums(data.albums, true);
              } else {
                  displayAlbums(data.albums, false);
              }
              
              updateLoadMoreButton(data.has_more);
          }
          
          window.currentPage = page;
      })
      .catch(error => {
          console.error("Error fetching albums:", error);
          if (page === 1) {
              productGrid.innerHTML = '<div class="error">Failed to load albums. Please try again later.</div>';
          } else {
              const loadingIndicators = productGrid.querySelectorAll('.loading');
              loadingIndicators.forEach(indicator => indicator.remove());
          }
      });
}

export function displayAlbums(albums, append = false) {
  const container = document.getElementById("product-grid");
  if (!container) return;

  if (!append) {
      container.innerHTML = "";
  }

  albums.forEach(album => {
      let product = document.createElement("div");
      product.classList.add("product");
      
      // let imagePath = album.cover
      //     ? (album.cover.startsWith('/static/') ? album.cover : `/static/images/album_images/${album.cover}`)
      //     : "/static/images/default_album_cover.png";

      let imagePath = album.cover;
      
      product.innerHTML = `
          <img src="${imagePath}" alt="${album.title}" class="album-cover">
          <h3 class="product-title">${album.title}</h3>
          <p class="product-artist">By ${album.artist}</p>
          <p class="product-price">$${album.price.toFixed(2)}</p>
          <div class="product-buttons">
            <button class="view-button" data-product-id="${album.id}">View</button>
            <button class="preview-button" data-product-id="${album.id}">📝</button>
            <button class="favorite-button" data-product-id="${album.id}">❤️</button>
          </div>
      `;
      
      // Image error handling
      const img = product.querySelector("img");
      img.onerror = function() {
          this.src = '/static/images/default_album_cover.png';
          this.alt = 'Image not available';
      };
      
      const viewButton = product.querySelector('.view-button');
      if (viewButton) {
          viewButton.addEventListener('click', (e) => {
              e.stopPropagation();
              const productId = viewButton.getAttribute('data-product-id');
              window.location.href = `/product/${productId}`;
          });
      }
      
      container.appendChild(product);
  });
}

export function updateLoadMoreButton(hasMore) {
  const loadMoreButton = document.querySelector('.load-more');
  if (loadMoreButton) {
      if (hasMore) {
          loadMoreButton.style.display = 'block';
      } else {
          loadMoreButton.style.display = 'none';
      }
  }
}

export function goToProductPage(productId) {
window.location.href = `/product/${productId}`;
}

export function fetchSubscriptionStatus() {
  return fetch(`/api/user_subscription`)
      .then(response => {
          if (!response.ok) {
              throw new Error('There was an error fetching the subscription status');
          }
          return response.json();
      })
      .then(data => {
          return data;
      })
      .catch(error => {
          console.error("Error fetching subscription status:", error);
          return {};
      });
}

export async function fetchSimilarAlbums(referenceId, factor = 'artist', limit = 10) {
    try {
      // Validate factor
      const validFactors = ['artist', 'genre', 'decade', 'price_range'];
      if (!validFactors.includes(factor)) {
        throw new Error(`Invalid factor. Choose from: ${validFactors.join(', ')}`);
      }
  
      // First, fetch the reference album details to get comparison data
      const referenceResponse = await fetch(`/api/product/${referenceId}`);
      if (!referenceResponse.ok) {
        throw new Error('Failed to fetch reference album details');
      }
      const referenceAlbum = await referenceResponse.json();
  
      // Construct query parameters based on the factor
      const queryParams = new URLSearchParams({
        per_page: limit
      });
  
      switch (factor) {
        case 'artist':
            queryParams.append('artist', referenceAlbum.artist_id);
            break;
        case 'genre':
            queryParams.append('filter', referenceAlbum.genre);
            break;
        case 'decade':
            const decade = Math.floor(parseInt(referenceAlbum.release_date.split('-')[0]) / 10) * 10;
            queryParams.append('min_year', decade);
            queryParams.append('max_year', decade + 9);
            break;
        case 'price_range':
            const minPrice = Math.max(0, referenceAlbum.price - 5);
            const maxPrice = referenceAlbum.price + 5;
            queryParams.append('min_price', minPrice);
            queryParams.append('max_price', maxPrice);
            break;
      }
  
      // Exclude the reference album itself
      queryParams.append('exclude', referenceId);
  
      const response = await fetch(`/api/albums?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch similar albums');
      }
      
      const data = await response.json();
      return data.albums || [];
    } catch (error) {
      console.error('Error fetching similar albums:', error);
      return [];
    }
  }
  
  export async function displaySimilarAlbums(referenceId, containerId, factor = 'artist', limit = 4) {
    try {
      const similarAlbums = await fetchSimilarAlbums(referenceId, factor, limit);
      const container = document.getElementById(containerId);
      
      if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
      }
      
      // Clear previous content
      container.innerHTML = '';
      
      // If no similar albums found, optionally show a message
      if (similarAlbums.length === 0) {
        container.innerHTML = '<p>No similar albums found.</p>';
        return;
      }
      
      // Create album cards
      similarAlbums.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.classList.add('similar-album');
        
        let imagePath = album.cover;
        
        albumCard.innerHTML = `
          <img src="${imagePath}" alt="${album.title}" class="album-cover">
          <h4>${album.title}</h4>
          <p>By ${album.artist}</p>
          <p>$${album.price.toFixed(2)}</p>
          <div class="product-buttons">
            <button class="view-button" data-product-id="${album.id}">View</button>
            <button class="preview-button" data-product-id="${album.id}">📝</button>
            <button class="favorite-button" data-product-id="${album.id}">❤️</button>
          </div>
        `;
        
        // Add click event to view album
        const viewButton = albumCard.querySelector('.view-album');
        viewButton.addEventListener('click', () => {
          window.location.href = `/product/${album.id}`;
        });
        
        container.appendChild(albumCard);
      });
    } catch (error) {
      console.error('Error displaying similar albums:', error);
    }
  }