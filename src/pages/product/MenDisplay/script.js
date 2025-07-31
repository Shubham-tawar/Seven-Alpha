const mensClothing = [
    {
        id: 1,
        name: "Ethnic Cotton Shirt",
        price: 45,
        image: "../../../../public/images/Men\ Shirts/Shirt-1.png",
        type: "T-Shirts",
        brand: "Nike",
        color: "Black",
        size: "M"
    },
    {
        id: 2,
        name: "Premium Denim Shirt",
        price: 120,
        image: "../../../../public/images/Men\ Shirts/Shirt-2.png",
        type: "Jeans",
        brand: "Levi's",
        color: "Blue",
        size: "L"
    },
    {
        id: 3,
        name: "Casual  Shirt",
        price: 85,
        image: "../../../../public/images/Men\ Shirts/Shirt-3.png",
        type: "Shirts",
        brand: "Calvin Klein",
        color: "White",
        size: "M"
    },
    {
        id: 4,
        name: "Leather Shirt",
        price: 285,
        image: "../../../../public/images/Men\ Shirts/Shirt-4.png",
        type: "Jackets",
        brand: "Tommy Hilfiger",
        color: "Black",
        size: "L"
    },
    {
        id: 5,
        name: "Comfortable Shirt",
        price: 95,
        image: "../../../../public/images/Men\ Shirts/Blazer-1.png",
        type: "Hoodies",
        brand: "Adidas",
        color: "Gray",
        size: "XL"
    },
    {
        id: 6,
        name: "Summer Blazzer",
        price: 65,
        image: "../../../../public/images/Men\ Shirts/Blazer-2.png",
        type: "Shorts",
        brand: "Ralph Lauren",
        color: "Navy",
        size: "M"
    },
    {
        id: 7,
        name: "Orange Blazer Classic",
        price: 75,
        image: "../../../../public/images/Men\ Shirts/Blazer-3.png",
        type: "Shirts",
        brand: "Ralph Lauren",
        color: "Navy",
        size: "L"
    },
    {
        id: 8,
        name: "Vintage Graphic Tee",
        price: 55,
        image: "../../../../public/images/Men\ Shirts/Blazer-4.png",
        type: "T-Shirts",
        brand: "Nike",
        color: "White",
        size: "S"
    },
    {
        id: 9,
        name: "Slim Fit Dress Shirt",
        price: 110,
        image: "../../../../public/images/Men\ Shirts/Shirt-5.png",
        type: "Shirts",
        brand: "Calvin Klein",
        color: "Blue",
        size: "M"
    },
    {
        id: 10,
        name: "Athletic Track Jacket",
        price: 145,
        image: "../../../../public/images/Men\ Shirts/Shirt-6.png",
        type: "Jackets",
        brand: "Adidas",
        color: "Black",
        size: "L"
    },
    {
        id: 11,
        name: "Relaxed Fit Hoodie",
        price: 125,
        image: "../../../../public/images/Men\ Shirts/Shirt-7.png",
        type: "Hoodies",
        brand: "Tommy Hilfiger",
        color: "Red",
        size: "XL"
    },
    {
        id: 12,
        name: "Cargo Shorts",
        price: 85,
        image: "../../../../public/images/Men\ Shirts/Shirt-8.png",
        type: "Shorts",
        brand: "Levi's",
        color: "Gray",
        size: "L"
    },

    
    
];

// State management
let currentFilters = {
    sizes: [],
    types: [],
    colors: [],
    brands: [],
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
    renderProducts(mensClothing);
    setupEventListeners();
    updatePriceDisplay();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Price range slider
    priceRange.addEventListener('input', handlePriceChange);

    // Size filters
    const sizeFilters = document.querySelectorAll('#sizeFilters input[type="checkbox"]');
    sizeFilters.forEach(filter => {
        filter.addEventListener('change', handleSizeFilter);
    });

    // Type filters
    const typeFilters = document.querySelectorAll('#typeFilters input[type="checkbox"]');
    typeFilters.forEach(filter => {
        filter.addEventListener('change', handleTypeFilter);
    });

    // Color filters
    const colorFilters = document.querySelectorAll('#colorFilters input[type="checkbox"]');
    colorFilters.forEach(filter => {
        filter.addEventListener('change', handleColorFilter);
    });

    // Brand filters
    const brandFilters = document.querySelectorAll('#brandFilters input[type="checkbox"]');
    brandFilters.forEach(filter => {
        filter.addEventListener('change', handleBrandFilter);
    });

    // Mobile filter toggle
    if (filterToggle) {
        filterToggle.addEventListener('click', toggleMobileFilters);
    }
    if (closeMobileFilter) {
        closeMobileFilter.addEventListener('click', closeMobileFilters);
    }
    if (mobileFilterOverlay) {
        mobileFilterOverlay.addEventListener('click', function(e) {
            if (e.target === mobileFilterOverlay) {
                closeMobileFilters();
            }
        });
    }

    // Clear all filters
    clearFiltersBtn.addEventListener('click', clearAllFilters);
}

// Render products
function renderProducts(products) {
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--muted-foreground);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--foreground);">No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${item.image}" alt="${item.name}" class="product-image" loading="lazy">
                <div class="product-overlay"></div>
                <button class="heart-button" onclick="toggleWishlist(${item.id})">
                    <i class="far fa-heart"></i>
                </button>

            </div>

            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-price">$${item.price.toLocaleString()}</p>
            </div>

            <div class="product-actions">
                <button class="btn-primary" onclick="addToCart(${item.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="btn-secondary" onclick="viewDetails(${item.id})">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Search functionality
function handleSearch(e) {
    currentFilters.searchQuery = e.target.value.toLowerCase();
    applyFilters();
}

// Price range functionality
function handlePriceChange(e) {
    currentFilters.priceRange = parseInt(e.target.value);
    updatePriceDisplay();
    applyFilters();
}

function updatePriceDisplay() {
    if (currentPrice) {
        currentPrice.textContent = `$${currentFilters.priceRange.toLocaleString()}`;
    }
}

// Filter handlers
function handleSizeFilter(e) {
    const size = e.target.value;
    if (e.target.checked) {
        currentFilters.sizes.push(size);
    } else {
        currentFilters.sizes = currentFilters.sizes.filter(s => s !== size);
    }
    applyFilters();
}

function handleTypeFilter(e) {
    const type = e.target.value;
    if (e.target.checked) {
        currentFilters.types.push(type);
    } else {
        currentFilters.types = currentFilters.types.filter(t => t !== type);
    }
    applyFilters();
}

function handleColorFilter(e) {
    const color = e.target.value;
    if (e.target.checked) {
        currentFilters.colors.push(color);
    } else {
        currentFilters.colors = currentFilters.colors.filter(c => c !== color);
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

// Apply all filters
function applyFilters() {
    let filtered = mensClothing.filter(item => {
        // Price filter
        if (item.price > currentFilters.priceRange) return false;

        // Search filter
        if (currentFilters.searchQuery && 
            !item.name.toLowerCase().includes(currentFilters.searchQuery) &&
            !item.brand.toLowerCase().includes(currentFilters.searchQuery) &&
            !item.type.toLowerCase().includes(currentFilters.searchQuery)) {
            return false;
        }

        // Size filter
        if (currentFilters.sizes.length > 0 && !currentFilters.sizes.includes(item.size)) {
            return false;
        }

        // Type filter
        if (currentFilters.types.length > 0 && !currentFilters.types.includes(item.type)) {
            return false;
        }

        // Color filter
        if (currentFilters.colors.length > 0 && !currentFilters.colors.includes(item.color)) {
            return false;
        }

        // Brand filter
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(item.brand)) {
            return false;
        }

        return true;
    });

    renderProducts(filtered);
}

// Mobile filter functions
function toggleMobileFilters() {
    if (mobileFilterOverlay) {
        mobileFilterOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileFilters() {
    if (mobileFilterOverlay) {
        mobileFilterOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Clear all filters
function clearAllFilters() {
    // Reset filter state
    currentFilters = {
        sizes: [],
        types: [],
        colors: [],
        brands: [],
        priceRange: 5000,
        searchQuery: ''
    };

    // Reset UI elements
    searchInput.value = '';
    priceRange.value = 5000;
    updatePriceDisplay();

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Re-render all products
    renderProducts(mensClothing);
}

// Product action functions
function addToCart(productId) {
    // Sample product data (replace with your actual data source)
    

    // Get the product based on ID
    const product = mensClothing.find(p => p.id === productId);
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





function viewDetails(productId) {
    const product = mensClothing.find(item => item.id === productId);
    if (product) {
        // Store product in localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        
        // Redirect to details page
        window.location.href = '/src/pages/details/index.html';
    }
}


function toggleWishlist(productId) {
    const product = mensClothing.find(p => p.id === productId);
    if (!product) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.findIndex(item => item.id === productId);

    const heartIcon = event.target.closest('.heart-button').querySelector('i');

    if (index !== -1) {
        // Already in wishlist, remove it
        wishlist.splice(index, 1);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showPopup(`${product.name} removed from wishlist`);
    } else {
        // Not in wishlist, add it
        wishlist.push(product);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showPopup(`${product.name} added to wishlist`);
    }

    // 🔥 Save updated wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}



// Smooth scrolling for better UX
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top functionality
window.addEventListener('scroll', function() {
    const scrollButton = document.getElementById('scrollToTop');
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close mobile filters with Escape key
    if (e.key === 'Escape' && mobileFilterOverlay && mobileFilterOverlay.style.display === 'block') {
        closeMobileFilters();
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        renderProducts(mensClothing);
        setupEventListeners();
        updatePriceDisplay();
    });
} else {
    renderProducts(mensClothing);
    setupEventListeners();
    updatePriceDisplay();
}

$(function () {
    $(".nav-header").load("../../../components/navigation-bar/navigation.html");
    $(".site-footer").load("../../../components/footer/footer.html");
});