import { fetchUserStatus, fetchSimilarAlbums } from './major_functions.js';
import { handleExistingSearchQuery, initializeSearchBar } from './minor_functions.js';
import { initMusicPlayer } from './music_ctrl_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    fetchUserStatus();
    initializeSearchBar();
    handleExistingSearchQuery();

    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    
    fetchAlbumDetails(productId);
    displayTracks(productId);

    const playerIframe = document.getElementById('persistent-player');
      
    // Initial setup to make sure iframe has the right dimensions
    playerIframe.style.width = '100%';
    playerIframe.style.height = '80px'; // Initial minimized height
    playerIframe.style.position = 'fixed';
    playerIframe.style.bottom = '0';
    playerIframe.style.left = '0';
    playerIframe.style.zIndex = '1000';
    playerIframe.style.transition = 'height 0.3s ease';
    
    // Listen for messages from the iframe
    window.addEventListener('message', (event) => {
        // Check origin for security in production
        // if (event.origin !== "https://your-domain.com") return;
        
        const message = event.data;
        
        switch (message.action) {
            case 'resizePlayer':
                // Resize the iframe based on the player mode
                if (message.mode === 'expanded') {
                    playerIframe.style.height = message.height;
                    // Optional: Add overlay or adjust page content
                    document.body.classList.add('player-expanded');
                } else if (message.mode === 'minimized') {
                    playerIframe.style.height = message.height;
                    document.body.classList.remove('player-expanded');
                }
                break;
                
            case 'playerStateChanged':
                // Handle player state changes (playing, paused, ended)
                console.log('Player state changed:', message.state);
                // Update UI elements outside the iframe if needed
                break;
                
            case 'progressUpdate':
                // Update any progress indicators outside the iframe
                console.log('Progress update:', message.percentage + '%');
                break;
                
            case 'trackChanged':
                // Handle track change events
                console.log('Track changed:', message.direction);
                break;
                
            case 'trackInfoUpdated':
                // Update any UI elements with track info
                console.log('Track info updated:', message.trackInfo);
                // For example, update page title or mini-display
                document.title = `${message.trackInfo.title} - ${message.trackInfo.artist}`;
                break;
        }
    });
    
    // Function to send messages to the iframe
    function sendMessageToPlayer(message) {
        playerIframe.contentWindow.postMessage(message, '*');
        // In production, replace '*' with your domain
        // playerIframe.contentWindow.postMessage(message, 'https://your-domain.com');
    }
    
    async function fetchAlbumDetails(productId) {
        try {
            const response = await fetch(`/api/albums/${productId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch album details');
            }
            
            const album = await response.json();

            populateProductPage(album);
            
            let imagePath = album.cover_image_url;
            
            // Fetch and display similar albums
            const similarAlbums = await fetchSimilarAlbums(album.album_id, 'artist', 4);
            displaySimilarAlbums(similarAlbums, 'itemMenu');
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    async function displayTracks(albumID) {
        try {
          tracklist = await fetch(`/api/albums/${albumID}/tracks`);
          if (!tracklist.ok) {
            throw new Error('Failed to fetch tracklist');
          }
          const data = await tracklist.json();
          const tracklistContainer = document.getElementById('tracklist');
          tracklistContainer.innerHTML = '';

            data.forEach(track => {
                const trackElement = document.createElement('li');
                const date = new Date(track.duration);
                trackElement.classList.add('track-item');
                trackElement.innerHTML = `
                    <span class="track-number">${track.pos}</span>
                    <span class="track-name">${track.title}</span>
                    <span class="track-duration">${track.duration}</span>
                    <button class="track-play">
                        <i class="ph ph-play"></i>
                    </button>
                    <button class="favorite-button">
                        <i class="ph ph-heart"></i>
                    </button>
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
  console.log(imagePath);
  
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

  let imagePath = album.cover_image_url;
  
  // Apply the scrim background first
  applyScrimBackground(imagePath);
  
  product.innerHTML = `
    <img src="${imagePath}" alt="${album.title}" class="album-banner-image">
    <div class="album-info">
      <h1 class="album-banner-title">${album.title}</h1>
      <p class="album-banner-artist">By ${album.artist}</p>
      <p class="album-banner-price">$${album.price.toFixed(2)}</p>
      <div class="album-button-group">
        <button class="album-banner-button">
          Add to cart <span class="cart-icon">🛒</span>
        </button>
        <button class="favorite-button-banner">
                        <i class="ph ph-heart"></i>
        </button>
      </div>
    </div>
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
            
            let imagePath = album.cover;
            
            albumCard.innerHTML = `
                <img src="${imagePath}" alt="${album.title}">
                <div class="item-title">${album.title}</div>
                <div class="item-artist">${album.artist}</div>
                <div class="item-price">$${album.price.toFixed(2)}</div>
                <div class="btn-array">
                <button class="add-to-cart" data-album-id="${album.id}">Add to Cart</button>
                <button class="favorite-button">
                  <i class="ph ph-heart"></i>
                </button>
                </div>
            `;
            
            const viewButton = albumCard.querySelector('.add-to-cart');
            viewButton.addEventListener('click', () => {
                window.location.href = `/product/${album.id}`;
            });
            
            container.appendChild(albumCard);
        });
    }
});