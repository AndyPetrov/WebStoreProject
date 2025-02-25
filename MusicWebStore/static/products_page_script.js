document.addEventListener("DOMContentLoaded", function () {	
	const filterSidebar = document.getElementById('filter-sidebar');
	const categoryHeader = document.getElementById('header');
	const productsGenerator = document.getElementById('product-grid');
	var allProducts = productsGenerator.querySelectorAll('.product');
	const sortByName = document.getElementById('sort-by-name');
	const loadButton = document.getElementById('load-button');
	var br = 0;
	var currentAlbums = 20;
	var Ordered = false;

	
	
	allProducts.forEach(product => {
		product.classList.add('hidden');
	});

	const categoryLinks = document.querySelectorAll('#categories a');

	function getAlbums()
	{
		let listAlbums = [];  
		
		const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
		filterCheckboxes.forEach(checkbox => {
			checkbox.checked = false;
		});

		albums.forEach(album => {
			listAlbums.push(album[1]);
		});

		return listAlbums;
	}

	function filteredAlbumGen(listAlbums)
	{
		let productHTML = '';
		Ordered = true;
		listAlbums.forEach(albumFromList => {
			albums.forEach(album => {
				console.log('Album:', album);
				let artistName = '';
				{artists.forEach(artist => {
					if (artist[0] === album[3]) {
						artistName = artist[1];
					}
				})}
				if (album[1] === albumFromList && br <= currentAlbums) 
				{
					productHTML += ` 
					<div class = "product" data-genre="${album[2]}" data-artist="${album[3]}" data-name = "${album[1]}">
					<img src="../Assets/AlbumImages/The_life_of_pablo_alternate.jpg" alt="Product Image">
					<h3 class = "product-title">${album[1]}</h3>
					<p class = "product-artist">${artistName}</p>
					<p class = "product-price">${album[4]}$</p>
					<button class = "product-button">Add to Cart 🛒</button>
					</div>
					`;
					br = br + 1;
				}
			});	
						
		});
		br = 0;
		return productHTML;

	}

	function AlbumGen()
	{
		let productHTML = '';
		albums.forEach(album => {
			console.log('Album:', album);
			let artistName = '';
			{artists.forEach(artist => {
				if (artist[0] === album[3]) {
					artistName = artist[1];
				}
			})}

			if (br <= currentAlbums) 
			{
				productHTML += ` 
				<div class = "product" data-genre="${album[2]}" data-artist="${album[3]}" data-name = "${album[1]}">
				<img src="../Assets/AlbumImages/The_life_of_pablo_alternate.jpg" alt="Product Image">
				<h3 class = "product-title">${album[1]}</h3>
				<p class = "product-artist">${artistName}</p>
				<p class = "product-price">${album[4]}$</p>
				<button class = "product-button">Add to Cart 🛒</button>
				</div>
				`;
				br = br + 1;
			}
		});

		return productHTML;
	}

	loadButton.addEventListener('click', function() 
	{
		let listAlbums = getAlbums();
		let productHTML = '';	
		
		if (currentAlbums <= listAlbums.length)
		{
			const filterCheckboxes = document.querySelectorAll('.filter-checkbox');			
			filterCheckboxes.forEach(checkbox => {
			checkbox.checked = false;
			});

			currentAlbums = currentAlbums + 20;
			if (Ordered == false) 
			{
				productHTML += AlbumGen();
			}
			else
			{
				listAlbums.sort((a, b) => a.localeCompare(b));
				productHTML += filteredAlbumGen(listAlbums);
			}
			productsGenerator.innerHTML = productHTML;
        	allProducts = productsGenerator.querySelectorAll('.product');
        	addFilterEventListeners();
		} 
		else
		{
			const filterCheckboxes = document.querySelectorAll('.filter-checkbox');			
			filterCheckboxes.forEach(checkbox => {
			checkbox.checked = false;
			});
			allProducts.forEach(product => product.style.display = 'block');
		}
			
		
					
	});
	
	sortByName.addEventListener('click', function() {
		let listAlbums = getAlbums();
		let productHTML = '';
		Ordered = true;
		listAlbums.sort((a, b) => a.localeCompare(b));		
		productHTML = filteredAlbumGen(listAlbums);						
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
			categoryHeader.textContent = 'Albums';
			let filterHTML = '';
			currentAlbums = 20;
			let productHTML = AlbumGen();

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
			

			filterHTML += `
				<div class="submenu-section">Other Options</div>
				<div class="filter-option show-all">
					<a href="#" id="show-all-link" class="show-all-link">Show All</a>
				</div>
			`;
			
			filterSidebar.style.display = 'block';
			filterSidebar.innerHTML = filterHTML; 

			addFilterEventListeners();
			
			productsGenerator.innerHTML = productHTML; 
			allProducts.forEach(product => {
				product.classList.remove('hidden'); 
			});
			allProducts = productsGenerator.querySelectorAll('.product');
			br = 0;
		} 
		else 
		{
			filterSidebar.style.display = 'none';
			allProducts.forEach(product => product.classList.add('hidden')); 
		}
	}

	function addFilterEventListeners() {
		const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
		
		filterCheckboxes.forEach(checkbox => {
			checkbox.addEventListener('change', filterAlbums);
		});


		const showAllLink = document.getElementById('show-all-link');
		if (showAllLink) {
			showAllLink.addEventListener('click', function(event) {
				event.preventDefault();
				
				filterCheckboxes.forEach(checkbox => {
					checkbox.checked = false; 
				});

				
				allProducts.forEach(product => product.style.display = 'block');
			});
		}
	}

	function filterAlbums() {
		const selectedGenres = [];
		const selectedArtists = [];
		 	
		document.querySelectorAll('.filter-checkbox[data-category="By genre"]:checked').forEach(checkbox => {
			selectedGenres.push(checkbox.value);
		});

		document.querySelectorAll('.filter-checkbox[data-category="By artist"]:checked').forEach(checkbox => {
			selectedArtists.push(checkbox.value);
		});

		allProducts.forEach(product => {
			const productGenre = product.getAttribute('data-genre');
			const productArtist = product.getAttribute('data-artist');
			
			const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(productGenre);
			const matchesArtist = selectedArtists.length === 0 || selectedArtists.includes(productArtist);

			if (matchesGenre && matchesArtist) {
				product.style.display = 'block'; 
			} else {
				product.style.display = 'none';  
			}
		});
	}
});
