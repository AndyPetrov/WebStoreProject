document.addEventListener("DOMContentLoaded", function () {	
	const filterSidebar = document.getElementById('filter-sidebar');
	const categoryHeader = document.getElementById('header');
	const productsGenerator = document.getElementById('product-grid');
	var allProducts = productsGenerator.querySelectorAll('.product');
	const sortByName = document.getElementById('sort-by-name');
	// Hide the filter sidebar initially
	
	
	allProducts.forEach(product => {
		product.classList.add('hidden');  // Hide all products initially
	});

	// Listen for category selection
	const categoryLinks = document.querySelectorAll('#categories a');
	
	sortByName.addEventListener('click', function() {
		let listAlbums = [];  // Initialize an array to hold the sorted albums
		let productHTML = '';
		
		const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
		filterCheckboxes.forEach(checkbox => {
			checkbox.checked = false;  // Uncheck all filters
		});

		allProducts.forEach(product => {
			const product_name = product.getAttribute('data-name');
			listAlbums.push(product_name);
		});
		listAlbums.sort((a, b) => a.localeCompare(b));
		listAlbums.forEach(albumFromList => {
			albums.forEach(album => {
				console.log('Album:', album);
				let artistName = '';
				{artists.forEach(artist => {
					if (artist[0] === album[3]) {
						artistName = artist[1];
					}
				})}
				if (album[1] === albumFromList) {
					productHTML += ` 
					<div class = "product" data-genre="${album[2]}" data-artist="${album[3]}" data-name = "${album[1]}">
					<img src="../Assets/AlbumImages/The_life_of_pablo_alternate.jpg" alt="Product Image">
					<h3 class = "product-title">${album[1]}</h3>
					<p class = "product-artist">${artistName}</p>
					<p class = "product-price">${album[4]}$</p>
					<button class = "product-button">Add to Cart 🛒</button>
					</div>
					`;
				}
				
			});	
		});	
		
		productsGenerator.innerHTML = productHTML;
		allProducts = productsGenerator.querySelectorAll('.product');
		addFilterEventListeners();
		
	});
	
	
	
	categoryLinks.forEach(link => {
		link.addEventListener('click', function(event) {
			event.preventDefault();
			showFilter(this);
		});
	});

	function showFilter(item) {
		const category = item.getAttribute('data-category');
		
		if (category === 'albums') {
			categoryHeader.textContent = 'Albums'; // Set the header text
			
			let filterHTML = '';  // Initialize filter HTML string
			let productHTML = '';  // Initialize product HTML string
			categoriesWithOptions.forEach(categoryData => {
				if (categoryData.category_name === 'By genre' || categoryData.category_name === 'By artist') {
					filterHTML += `
						<div class="submenu-section">${categoryData.category_name}</div>
					`;
					categoryData.options.forEach(option => {
						filterHTML += `
							<div class="filter-option">
								<input type="checkbox" class="filter-checkbox" data-category="${categoryData.category_name}" value="${option.id}" id="filter-${categoryData.category_name}-${option.name}">
								<label for="filter-${categoryData.category_name}-${option.name}">${option.name}</label>
							</div>
						`;
					});
				}
			});
			
			// Add a "Show All" link at the end
			filterHTML += `
				<div class="submenu-section">Other Options</div>
				<div class="filter-option show-all">
					<a href="#" id="show-all-link" class="show-all-link">Show All</a>
				</div>
			`;
			
			albums.forEach(album => {
				console.log('Album:', album);
				let artistName = '';
				{artists.forEach(artist => {
					if (artist[0] === album[3]) {
						artistName = artist[1];
					}
				})}
				
				productHTML += ` 
				<div class = "product" data-genre="${album[2]}" data-artist="${album[3]}" data-name = "${album[1]}">
				<img src="../Assets/AlbumImages/The_life_of_pablo_alternate.jpg" alt="Product Image">
				<h3 class = "product-title">${album[1]}</h3>
				<p class = "product-artist">${artistName}</p>
				<p class = "product-price">${album[4]}$</p>
				<button class = "product-button">Add to Cart 🛒</button>
				</div>
				`;
			});
			

			// Insert filter HTML into the sidebar
			
			filterSidebar.style.display = 'block'; // Show filter sidebar
			filterSidebar.innerHTML = filterHTML; // Insert filter HTML into the sidebar
			// Add event listeners to the filter checkboxes
			addFilterEventListeners();
			
			productsGenerator.innerHTML = productHTML; // Insert product HTML into the products gridrator.innerHTML = productHTML; // Insert product HTML into the products gridrator.innerHTML = productHTML; // Insert product HTML into the products grid
			allProducts.forEach(product => {
				product.classList.remove('hidden');  // Hide all products initially
			});
			allProducts = productsGenerator.querySelectorAll('.product');
		} else {
			// Hide filter sidebar if another category is selected
			filterSidebar.style.display = 'none';
			allProducts.forEach(product => product.classList.add('hidden')); // Hide all products
		}
	}

	function addFilterEventListeners() {
		const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
		
		filterCheckboxes.forEach(checkbox => {
			checkbox.addEventListener('change', filterAlbums);
		});

		// Show All link
		const showAllLink = document.getElementById('show-all-link');
		if (showAllLink) {
			showAllLink.addEventListener('click', function(event) {
				event.preventDefault();
				
				filterCheckboxes.forEach(checkbox => {
					checkbox.checked = false;  // Uncheck all filters
				});

				// Show all products
				allProducts.forEach(product => product.style.display = 'block');
			});
		}
	}

	function filterAlbums() {
		const selectedGenres = [];
		const selectedArtists = [];
		 
		// Collect selected genres
		document.querySelectorAll('.filter-checkbox[data-category="By genre"]:checked').forEach(checkbox => {
			selectedGenres.push(checkbox.value);
		});

		// Collect selected artists
		document.querySelectorAll('.filter-checkbox[data-category="By artist"]:checked').forEach(checkbox => {
			selectedArtists.push(checkbox.value);
		});

		// Filter products based on selected genres and artists
		allProducts.forEach(product => {
			const productGenre = product.getAttribute('data-genre');
			const productArtist = product.getAttribute('data-artist');
			
			const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(productGenre);
			const matchesArtist = selectedArtists.length === 0 || selectedArtists.includes(productArtist);

			if (matchesGenre && matchesArtist) {
				product.style.display = 'block';  // Show product
			} else {
				product.style.display = 'none';  // Hide product
			}
		});
	}
});
