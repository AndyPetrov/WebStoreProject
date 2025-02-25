document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("product-grid");
    if (!container) {
        console.error("Error: #product-grid not found in DOM.");
        return;
    }
    const checkboxes = document.querySelectorAll(".filter-checkbox");
    const sortSelect = document.getElementById("sort-select");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    const applyPriceButton = document.getElementById("apply-price-filter");
    
    function fetchAlbums() {
        let filters = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                filters.push(`filter=${checkbox.value}`);
            }
        });
        let minPrice = minPriceInput.value;
        let maxPrice = maxPriceInput.value;
        let sortValue = sortSelect.value;
        let queryString = `?sort=${sortValue}&min_price=${minPrice}`;
        if (maxPrice) queryString += `&max_price=${maxPrice}`;
        if (filters.length) queryString += `&${filters.join("&")}`;
        
        fetch(`/api/albums${queryString}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then(albums => displayAlbums(albums))
            .catch(error => console.error("Error fetching albums:", error));
    }
    
    function displayAlbums(albums) {
        const container = document.getElementById("product-grid");
        container.innerHTML = "";
        
        albums.forEach(album => {
            let product = document.createElement("div");
            product.classList.add("product");
            
            // Construct the image path - adjust this based on your API response
            // Check if the cover path exists in the album object
            let imagePath = "";
            if (album.cover) {
                // Check if the path already includes '/static/'
                imagePath = album.cover.startsWith('/static/') 
                    ? album.cover 
                    : `/static/images/${album.cover}`;
            } else {
                // Default image if no cover is provided
                imagePath = "/static/images/default.jpg";
            }
            
            product.innerHTML = `
                <img src="${imagePath}" alt="${album.title}" class="album-cover">
                <h3 class="product-title">${album.title}</h3>
                <p class="product-artist">By ${album.artist}</p>
                <p class="product-price">${album.price}$</p>
                <button class="add-to-cart">Add to cart 🛒</button>
            `;
            
            // Add error handling for images
            const img = product.querySelector('img');
            img.onerror = function() {
                this.src = '/static/images/default_album_cover.png';
                this.alt = 'Image not available';
            };
            
            const addToCartBtn = product.querySelector('.add-to-cart');
            addToCartBtn.addEventListener('click', function() {
                console.log(`Added ${album.title} to cart`);
            });
            
            container.appendChild(product);
        });
    }
    
    checkboxes.forEach(checkbox => checkbox.addEventListener("change", fetchAlbums));
    sortSelect.addEventListener("change", fetchAlbums);
    applyPriceButton.addEventListener("click", fetchAlbums);
    
    fetchAlbums();
});
