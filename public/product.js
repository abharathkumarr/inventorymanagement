// Get itemId from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId'); // Get itemId from the URL

// Function to fetch product features
async function fetchProductFeatures(itemId) {
    try {
        const response = await fetch(`/api/features/${itemId}`);
        const features = await response.json();

        const featuresList = document.getElementById('product-features');
        featuresList.innerHTML = ''; // Clear existing features

        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = `${feature.FeatureKey}: ${feature.FeatureValue}`;
            featuresList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching features:', error);
    }
}

// Function to fetch product filters
async function fetchProductFilters(itemId) {
    try {
        const response = await fetch(`/api/filters/${itemId}`);
        const filters = await response.json();

        const filtersDiv = document.getElementById('filters');
        filtersDiv.innerHTML = ''; // Clear existing filters

        const filterKeys = {};

        // Group filters by FilterKey
        filters.forEach(filter => {
            if (!filterKeys[filter.FilterKey]) {
                filterKeys[filter.FilterKey] = [];
            }
            if (!filterKeys[filter.FilterKey].includes(filter.FilterValue)) {
                filterKeys[filter.FilterKey].push(filter.FilterValue);
            }
        });

        // Display filter options
        Object.keys(filterKeys).forEach(key => {
            const filterContainer = document.createElement('div');
            filterContainer.classList.add('filter-container');

            const label = document.createElement('label');
            label.textContent = key;
            filterContainer.appendChild(label);

            const select = document.createElement('select');
            select.setAttribute('id', `filter-${key}`);

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `Select ${key}`;
            select.appendChild(defaultOption);

            filterKeys[key].forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });

            filterContainer.appendChild(select);
            filtersDiv.appendChild(filterContainer);
        });

        // Add apply filters button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Filters';
        applyButton.id = 'apply-filters';
        filtersDiv.appendChild(applyButton);

        // Add event listener for the apply button
        document.getElementById('apply-filters').addEventListener('click', () => {
            applyFilters(itemId);
        });
    } catch (error) {
        console.error('Error fetching filters:', error);
    }
}

// Apply selected filters and re-fetch the product list
async function applyFilters(itemId) {
    const filterInputs = document.querySelectorAll('#filters select');
    let filterQuery = '';

    filterInputs.forEach(select => {
        const key = select.id.replace('filter-', '');
        const value = select.value;
        if (value) {
            filterQuery += `&${key}=${value}`;
        }
    });

    try {
        const response = await fetch(`/api/products?itemId=${itemId}${filterQuery}`);
        const filteredProducts = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear existing products

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            // Fetch product details, features, filters, etc.
// Your existing code here...

// Render product cards with updated image class
productCard.innerHTML = `
<img src="/images/${product.ItemID}.jpg" alt="${product.ItemName}" class="product-image" style="cursor: pointer;" width="150" height="150">
<h2>${product.ItemName}</h2>
<p>${product.Description}</p>
<p>Category: ${product.Category}</p>
<p>Price: $${product.SellingPrice}</p>
<p>${product.Quantity > 0 ? `In Stock: ${product.Quantity}` : 'Out of Stock'}</p>
<button ${product.Quantity > 0 ? '' : 'disabled'}>Buy Now</button>
`;

// Modal functionality
document.addEventListener('click', (event) => {
if (event.target.tagName === 'IMG' && event.target.classList.contains('product-image')) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');

    modal.style.display = 'block';
    modalImg.src = event.target.src;
    captionText.textContent = event.target.alt;
}
});

document.querySelector('.close').addEventListener('click', () => {
const modal = document.getElementById('imageModal');
modal.style.display = 'none';
});

            productList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error fetching filtered products:', error);
    }
}

// Load product details when "View Details" is clicked
async function loadProductDetails(itemId) {
    await fetchProductFeatures(itemId);
    await fetchProductFilters(itemId);
}

// Handle category selection and display products
document.getElementById('category-select').addEventListener('change', async (event) => {
    const category = event.target.value;
    if (!category) return;

    try {
        const response = await fetch(`/api/category/${category}`);
        const products = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear previous products

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <h2>${product.ItemName}</h2>
                <p>${product.Description}</p>
                <p>Price: $${product.SellingPrice}</p>
                <button onclick="loadProductDetails(${product.ItemID})">View Details</button>
            `;
            productList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
    }
});

// If itemId is in the URL, load product details
if (itemId) {
    loadProductDetails(itemId);
}

