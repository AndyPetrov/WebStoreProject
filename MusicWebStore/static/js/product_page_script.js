import { fetchUserStatus, fetchSimilarAlbums } from './major_functions.js';
import { handleExistingSearchQuery, initializeSearchBar } from './minor_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    fetchUserStatus();
    initializeSearchBar();
    handleExistingSearchQuery();

    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    
    fetchAlbumDetails(productId);
    displayTracks(productId);
    
    async function fetchAlbumDetails(productId) {
        try {
            const response = await fetch(`/api/product/${productId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch album details');
            }
            
            const album = await response.json();

            populateProductPage(album);
            
            let imagePath = album.cover_image_url
            ? (album.cover_image_url.startsWith('/static/') ? album.cover_image_url : `/static/images/album_images/${album.cover_image_url}`)
            : "/static/images/default_album_cover.png";
            
            // Fetch and display similar albums
            const similarAlbums = await fetchSimilarAlbums(album.album_id, 'artist', 4);
            displaySimilarAlbums(similarAlbums, 'itemMenu');
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    async function displayTracks(albumID) {
        try {
          tracklist = await fetch(`/api/album/${albumID}/tracks`);
          if (!tracklist.ok) {
            throw new Error('Failed to fetch tracklist');
          }
          const data = await tracklist.json();
          const tracklistContainer = document.getElementById('tracklist');
          tracklistContainer.innerHTML = '';

            data.forEach(track => {
                const trackElement = document.createElement('li');
                trackElement.classList.add('track-item');
                trackElement.innerHTML = `
                    <span class="track-number">${track.pos}</span>
                    <span class="track-name">${track.title}</span>
                    <span class="track-duration">${Math.floor(track.duration/60)}:${track.duration%60}</span>
                    <button class="track-play">▶️</button>
                `;
                tracklistContainer.appendChild(trackElement);
            });

        } catch (error) {
            console.error('Error fetching tracklist:', error);
        }
    }
    
    function applyScrimBackground(imagePath) {
  // First check if the scrim container already exists
  let pageBackground = document.querySelector('.page-background');
  
  // If not, create it
  if (!pageBackground) {
    pageBackground = document.createElement('div');
    pageBackground.className = 'page-background';
    
    const scrimElement = document.createElement('div');
    scrimElement.className = 'album-scrim';
    
    pageBackground.appendChild(scrimElement);
    document.body.insertBefore(pageBackground, document.body.firstChild);
  }
  
  // Get the scrim element
  const scrim = pageBackground.querySelector('.album-scrim');
  
  // Set the background image
  scrim.style.backgroundImage = `url('${imagePath}')`;
  
  // Apply animation
  scrim.style.animation = 'fadeIn 0.8s forwards';
  
  // Return a promise that resolves when the animation is complete
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Scrim background applied');
    }, 800);
  });
}

// Modify the existing function in your script to use this
function populateProductPage(album) {
  const container = document.getElementById("album-banner");
  container.innerHTML = "";
  let product = document.createElement("div");
  product.classList.add("album-banner-content");

  let imagePath = album.cover_image_url
    ? (album.cover_image_url.startsWith('/static/') ? album.cover_image_url : `/static/images/album_images/${album.cover_image_url}`)
    : "/static/images/default_album_cover.png";
  
  // Apply the scrim background first
  applyScrimBackground(imagePath);
  
  product.innerHTML = `
    <img src="${imagePath}" alt="${album.title}" class="album-banner-image">
    <h1 class="album-banner-title">${album.title}</h1>
    <p class="album-banner-artist">By ${album.artist}</p>
    <p class="album-banner-price">$${album.price.toFixed(2)}</p>
    <button class="album-banner-button">
        Add to cart <span class="cart-icon">🛒</span>
    </button>
  `;

  container.appendChild(product);
  
  const descriptionSection = document.querySelector('.album-description p');
  descriptionSection.textContent = album.description;
}

    function displaySimilarAlbums(albums, containerId) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }
        
        // Clear previous content
        container.innerHTML = '';
        
        // If no similar albums found, optionally show a message
        if (albums.length === 0) {
            container.innerHTML = '<p>No similar albums found.</p>';
            return;
        }
        
        // Create album cards
        albums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.classList.add('item');
            
            let imagePath = album.cover
                ? (album.cover.startsWith('/static/') ? album.cover : `/static/images/album_images/${album.cover}`)
                : "/static/images/default_album_cover.png";
            
            albumCard.innerHTML = `
                <img src="${imagePath}" alt="${album.title}">
                <div class="item-title">${album.title}</div>
                <div class="item-price">$${album.price.toFixed(2)}</div>
                <button class="add-to-cart" data-album-id="${album.id}">Add to Cart</button>
            `;
            
            applyScrimBackground(imagePath)
            .then(result => {
                console.log('Scrim background applied:', result);
            })
            .catch(error => {
                console.error('Error applying scrim background:', error);
            applyPresetTheme('dark');
            });

            const viewButton = albumCard.querySelector('.add-to-cart');
            viewButton.addEventListener('click', () => {
                window.location.href = `/product/${album.id}`;
            });
            
            container.appendChild(albumCard);
        });
    }
});