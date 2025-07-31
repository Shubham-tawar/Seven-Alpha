const handbags = [
    {
        id: 41,
        name: "Alpha Luxury Tote",
        price: 2850,
        image: "../../../../public/images/bags/bag-2.jpg",
        category: "Tote Bags",
        brand: "Alpha Luxury",
        material: "Genuine Leather"
    },
    {
        id: 42,
        name: "Golden Collection Shoulder",
        price: 1950,
        image: "../../../../public/images/bags/bag-3.jpg",
        category: "Shoulder Bags",
        brand: "Golden Collection",
        material: "Quilted Leather"
    },
    {
        id: 43,
        name: "Elite Series Crossbody",
        price: 1450,
        image: "../../../../public/images/bags/bag-4.jpg",
        category: "Crossbody Bags",
        brand: "Elite Series",
        material: "Textured Leather"
    },
    {
        id: 44,
        name: "Premium Line Clutch",
        price: 850,
        image: "../../../../public/images/bags/bag-5.png",
        category: "Clutches",
        brand: "Premium Line",
        material: "Smooth Leather"
    },
    {
        id: 45,
        name: "Signature Collection Backpack",
        price: 2200,
        image: "../../../../public/images/bags/bag-6.png",
        category: "Backpacks",
        brand: "Signature Collection",
        material: "Patent Leather"
    },
    {
        id: 46,
        name: "Alpha Luxury Satchel",
        price: 3200,
        image: "../../../../public/images/bags/bag-10.png",
        category: "Satchels",
        brand: "Alpha Luxury",
        material: "Suede"
    },
    {
        id: 47,
        name: "Golden Evening Bag",
        price: 1200,
        image: "../../../../public/images/bags/bag-8.png",
        category: "Evening Bags",
        brand: "Golden Collection",
        material: "Patent Leather"
    },
    {
        id: 48,
        name: "Elite Designer Tote",
        price: 2650,
        image: "../../../../public/images/bags/bag-9.png",
        category: "Tote Bags",
        brand: "Elite Series",
        material: "Genuine Leather"
    },
    {
        id: 49,
        name: "Premium Shoulder Luxury",
        price: 2100,
        image: "../../../../public/images/bags/bag-7.png",
        category: "Shoulder Bags",
        brand: "Premium Line",
        material: "Quilted Leather"
    }
];

// State management
let currentFilters = {
    categories: [],
    brands: [],
    materials: [],
    priceRange: 5000,
    searchQuery: ''
};

// DOM elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const priceRange = document.getElementById('priceRange');
const currentPrice = document.getElementById('currentPrice');
const filterToggle = document.getElementById('filterToggle');
const mobileFilterOverlay = document.getElementById('mobileFilterOverlay');
const closeMobileFilter = document.getElementById('closeMobileFilter');
const clearFiltersBtn = document.getElementById('clearFilters');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(handbags);
    setupEventListeners();
    updatePriceDisplay();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Price range slider
    priceRange.addEventListener('input', handlePriceChange);
    
    // Category filters
    const categoryFilters = document.querySelectorAll('#categoryFilters input[type="checkbox"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', handleCategoryFilter);
    });
    
    // Brand filters
    const brandFilters = document.querySelectorAll('#brandFilters input[type="checkbox"]');
    brandFilters.forEach(filter => {
        filter.addEventListener('change', handleBrandFilter);
    });
    
    // Material filters
    const materialFilters = document.querySelectorAll('#materialFilters input[type="checkbox"]');
    materialFilters.forEach(filter => {
        filter.addEventListener('change', handleMaterialFilter);
    });
    
    // Mobile filter toggle
    filterToggle.addEventListener('click', toggleMobileFilters);
    closeMobileFilter.addEventListener('click', closeMobileFilters);
    mobileFilterOverlay.addEventListener('click', function(e) {
        if (e.target === mobileFilterOverlay) {
            closeMobileFilters();
        }
    });
    
    // Clear all filters
    clearFiltersBtn.addEventListener('click', clearAllFilters);
}

// Render products
function renderProducts(products) {
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--muted-foreground);">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = products.map(handbag => `
        <div class="product-card" data-id="${handbag.id}">
            <div class="product-image-container">
                <img src="${handbag.image}" alt="${handbag.name}" class="product-image">
                <div class="product-overlay"></div>
                <button class="heart-button">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${handbag.name}</h3>
                <p class="product-price">$${handbag.price.toLocaleString()}</p>
            </div>
            
            <div class="product-actions">
                <button class="btn-primary" onclick="viewDetails(${handbag.id})">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="btn-secondary" onclick="addToCart(${handbag.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter functions
function handleSearch(e) {
    currentFilters.searchQuery = e.target.value.toLowerCase();
    applyFilters();
}

function handlePriceChange(e) {
    currentFilters.priceRange = parseInt(e.target.value);
    updatePriceDisplay();
    applyFilters();
}

function handleCategoryFilter(e) {
    const category = e.target.value;
    if (e.target.checked) {
        currentFilters.categories.push(category);
    } else {
        currentFilters.categories = currentFilters.categories.filter(c => c !== category);
    }
    applyFilters();
}

function handleBrandFilter(e) {
    const brand = e.target.value;
    if (e.target.checked) {
        currentFilters.brands.push(brand);
    } else {
        currentFilters.brands = currentFilters.brands.filter(b => b !== brand);
    }
    applyFilters();
}

function handleMaterialFilter(e) {
    const material = e.target.value;
    if (e.target.checked) {
        currentFilters.materials.push(material);
    } else {
        currentFilters.materials = currentFilters.materials.filter(m => m !== material);
    }
    applyFilters();
}

function applyFilters() {
    let filteredProducts = handbags;
    
    // Search filter
    if (currentFilters.searchQuery) {
        filteredProducts = filteredProducts.filter(handbag =>
            handbag.name.toLowerCase().includes(currentFilters.searchQuery) ||
            handbag.category.toLowerCase().includes(currentFilters.searchQuery) ||
            handbag.brand.toLowerCase().includes(currentFilters.searchQuery)
        );
    }
    
    // Price filter
    filteredProducts = filteredProducts.filter(handbag =>
        handbag.price <= currentFilters.priceRange
    );
    
    // Category filter
    if (currentFilters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(handbag =>
            currentFilters.categories.includes(handbag.category)
        );
    }
    
    // Brand filter
    if (currentFilters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(handbag =>
            currentFilters.brands.includes(handbag.brand)
        );
    }
    
    // Material filter
    if (currentFilters.materials.length > 0) {
        filteredProducts = filteredProducts.filter(handbag =>
            currentFilters.materials.includes(handbag.material)
        );
    }
    
    renderProducts(filteredProducts);
}

function updatePriceDisplay() {
    currentPrice.textContent = `$${currentFilters.priceRange.toLocaleString()}`;
}

// Mobile filter functions
function toggleMobileFilters() {
    mobileFilterOverlay.style.display = 'block';
    // Copy current filter state to mobile filters
    copyFiltersToMobile();
}

function closeMobileFilters() {
    mobileFilterOverlay.style.display = 'none';
}

function copyFiltersToMobile() {
    // This would copy the current filter state to the mobile overlay
    // For simplicity, we'll assume the same filter elements exist in mobile
}

// Clear all filters
function clearAllFilters() {
    // Reset filter state
    currentFilters = {
        categories: [],
        brands: [],
        materials: [],
        priceRange: 5000,
        searchQuery: ''
    };
    
    // Reset UI elements
    searchInput.value = '';
    priceRange.value = 5000;
    updatePriceDisplay();
    
    // Uncheck all checkboxes
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Apply filters (show all products)
    applyFilters();
}

// Product action functions
function buyNow(productId) {
    const product = handbags.find(h => h.id === productId);
    alert(`Proceeding to checkout with ${product.name} - $${product.price.toLocaleString()}`);
}

function viewDetails(productId) {
    const product = handbags.find(item => item.id === productId);
    if (product) {
        // Store product in localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        
        // Redirect to details page
        window.location.href = '/src/pages/details/index.html';
    }
}

// Utility function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

$(function () {
    $(".nav-header").load("../../../components/navigation-bar/navigation.html");
    $(".site-footer").load("../../../components/footer/footer.html");
});



// Function to add item to cart
function addToCart(productId) {
    // Sample product data (replace with your actual data source)
    

    // Get the product based on ID
    const product = handbags.find(p => p.id === productId);
    if (!product) return;

    // Get existing cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show pop-up confirmation
    showPopup(`${product.name} added to cart!`);

    // Update cart page (you can use a fetch or reload mechanism if needed)
   
}

// Function to show pop-up
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.textContent = message;
    document.body.appendChild(popup);

    // Trigger animation
    setTimeout(() => popup.classList.add('show'), 10);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => document.body.removeChild(popup), 500);
    }, 2000); // Remove after 2 seconds
}

