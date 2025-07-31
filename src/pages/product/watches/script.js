// Watch data
const watches = [
    {
        id: 21,
        name: "Arteal Ultimate Chronograph",
        price: 8500,
        image: "../../../../public/images/watches/watch-5.jpg",
        brand: "Arteal",
        category: "Chronograph"
    },
    {
        id: 22, 
        name: "Pomet Voiters Alphaneon",
        price: 12500,
        image: "../../../../public/images/watches/watch-4.jpg",
        brand: "Pomet Voiters",
        category: "Sport Watches"
    },
    {
        id: 23,
        name: "Swiss Synx Professional",
        price: 15800,
        image: "../../../../public/images/watches/watch-3.jpg", 
        brand: "Swiss Luxury",
        category: "Chronograph"
    },
    {
        id: 24,
        name: "Biotleck Naye GK199",
        price: 22000,
        image: "../../../../public/images/watches/watch-2.jpg",
        brand: "Biotleck", 
        category: "Diving Watches"
    },
    {
        id: 25,
        name: "Vinu Chronos Elite",
        price: 18500,
        image: "../../../../public/images/watches/watch-1.jpg",
        brand: "Vinu Chronos",
        category: "GMT/Travel"
    },
    {
        id: 26,
        name: "Classic Rose Gold Heritage",
        price: 9800,
        image: "../../../../public/images/watches/watch-classic-rose-gold.png",
        brand: "Elite Timepieces",
        category: "Dress Watches"
    },
    {
        id: 27,
        name: "Skeleton Master Gold",
        price: 35000,
        image: "../../../../public/images/watches/watch-skeleton-gold.png",
        brand: "Swiss Luxury",
        category: "Skeleton/Open Heart"
    },
    {
        id: 28,
        name: "Ocean Sport Pro",
        price: 7200,
        image: "../../../../public/images/watches/watch-sports-blue.png",
        brand: "Pomet Voiters",
        category: "Sport Watches"
    },
    {
        id: 29,
        name: "Vintage Collection Classic",
        price: 6500,
        image: "../../../../public/images/watches/watch-vintage-cream.png",
        brand: "Elite Timepieces", 
        category: "Vintage Classic"
    },
    {
        id: 30,
        name: "GMT Explorer Black",
        price: 11200,
        image: "../../../../public/images/watches/watch-gmt-black.png",
        brand: "Arteal",
        category: "GMT/Travel"
    },
    {
        id: 31,
        name: "Tourbillon Masterpiece",
        price: 45000,
        image: "../../../../public/images/watches/watch-tourbillon.png",
        brand: "Biotleck",
        category: "Skeleton/Open Heart"
    }
];

// State management
let currentFilters = {
    categories: [],
    brands: [],
    priceRange: [1000, 50000],
    searchQuery: ""
};

let viewMode = "grid";
let sidebarOpen = false;

// DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const filterToggle = document.getElementById('filterToggle');
const closeSidebar = document.getElementById('closeSidebar');
const watchGrid = document.getElementById('watchGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const minPriceSlider = document.getElementById('minPrice');
const maxPriceSlider = document.getElementById('maxPrice');
const minPriceDisplay = document.getElementById('minPriceDisplay');
const maxPriceDisplay = document.getElementById('maxPriceDisplay');
const clearFiltersBtn = document.getElementById('clearFilters');
const categoriesGroup = document.getElementById('categoriesGroup');
const brandsGroup = document.getElementById('brandsGroup');
//const viewToggle = document.getElementById('viewToggle');
//const viewIcon = document.getElementById('viewIcon');
const sortSelect = document.getElementById('sortSelect');

// Initialize Lucide icons
lucide.createIcons();

// Event listeners
filterToggle.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', toggleSidebar);

searchInput.addEventListener('input', handleSearch);
mobileSearchInput.addEventListener('input', handleSearch);

minPriceSlider.addEventListener('input', handlePriceChange);
maxPriceSlider.addEventListener('input', handlePriceChange);

clearFiltersBtn.addEventListener('click', clearAllFilters);

viewToggle.addEventListener('click', toggleViewMode);
sortSelect.addEventListener('change', handleSort);

// Add event listeners for checkboxes
categoriesGroup.addEventListener('change', handleFilterChange);
brandsGroup.addEventListener('change', handleFilterChange);

// Functions
function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('active', sidebarOpen);
    sidebarOverlay.classList.toggle('active', sidebarOpen);
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
}

function handleSearch(event) {
    currentFilters.searchQuery = event.target.value.toLowerCase();
    
    // Sync both search inputs
    if (event.target.id === 'searchInput') {
        mobileSearchInput.value = event.target.value;
    } else {
        searchInput.value = event.target.value;
    }
    
    renderWatches();
}

function handlePriceChange() {
    let minVal = parseInt(minPriceSlider.value);
    let maxVal = parseInt(maxPriceSlider.value);
    
    if (minVal > maxVal) {
        [minVal, maxVal] = [maxVal, minVal];
        minPriceSlider.value = minVal;
        maxPriceSlider.value = maxVal;
    }
    
    currentFilters.priceRange = [minVal, maxVal];
    
    minPriceDisplay.textContent = `$${minVal.toLocaleString()}`;
    maxPriceDisplay.textContent = `$${maxVal.toLocaleString()}`;
    
    renderWatches();
}

function handleFilterChange(event) {
    if (event.target.type === 'checkbox') {
        const value = event.target.value;
        const isCategory = event.target.closest('#categoriesGroup');
        
        if (isCategory) {
            if (event.target.checked) {
                currentFilters.categories.push(value);
            } else {
                currentFilters.categories = currentFilters.categories.filter(cat => cat !== value);
            }
        } else {
            if (event.target.checked) {
                currentFilters.brands.push(value);
            } else {
                currentFilters.brands = currentFilters.brands.filter(brand => brand !== value);
            }
        }
        
        renderWatches();
    }
}

function clearAllFilters() {
    currentFilters = {
        categories: [],
        brands: [],
        priceRange: [1000, 50000],
        searchQuery: ""
    };
    
    // Reset form elements
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    minPriceSlider.value = 1000;
    maxPriceSlider.value = 50000;
    minPriceDisplay.textContent = '$1,000';
    maxPriceDisplay.textContent = '$50,000';
    
    searchInput.value = '';
    mobileSearchInput.value = '';
    
    renderWatches();
}

function toggleViewMode() {
    viewMode = viewMode === 'grid' ? 'list' : 'grid';
    viewIcon.setAttribute('data-lucide', viewMode === 'grid' ? 'list' : 'grid-3x3');
    lucide.createIcons();
    
    // You can add different grid layouts here if needed
    renderWatches();
}

function handleSort() {
    const sortValue = sortSelect.value;
    renderWatches(sortValue);
}

function filterWatches(sortBy = 'featured') {
    let filtered = watches.filter(watch => {
        // Price filter
        if (watch.price < currentFilters.priceRange[0] || watch.price > currentFilters.priceRange[1]) {
            return false;
        }
        
        // Category filter
        if (currentFilters.categories.length > 0 && !currentFilters.categories.includes(watch.category)) {
            return false;
        }
        
        // Brand filter
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(watch.brand)) {
            return false;
        }
        
        // Search filter
        if (currentFilters.searchQuery) {
            const searchLower = currentFilters.searchQuery.toLowerCase();
            return (
                watch.name.toLowerCase().includes(searchLower) ||
                watch.brand.toLowerCase().includes(searchLower) ||
                watch.category.toLowerCase().includes(searchLower)
            );
        }
        
        return true;
    });
    
    // Sort watches
    switch (sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // Assuming newer watches have higher IDs
            filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            break;
        case 'bestselling':
            // Random order for demo
            filtered.sort(() => Math.random() - 0.5);
            break;
        default:
            // Featured order (default)
            break;
    }
    
    return filtered;
}

function createWatchCard(watch) {
    return `
        <div class="watch-card" data-watch-id="${watch.id}">
            <div class="watch-image">
                <img src="${watch.image}" alt="${watch.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRDRBRjM3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+V2F0Y2ggSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='" />
                <div class="image-overlay"></div>
                <div class="category-badge">${watch.category}</div>
            </div>
            
            <div class="watch-content">
                <div class="watch-info">
                    <h3 class="watch-name">${watch.name}</h3>
                    <p class="watch-brand">${watch.brand}</p>
                    <p class="watch-price">$${watch.price.toLocaleString()}</p>
                </div>
                
                <div class="watch-actions">
                    <button class="btn btn-gold" onclick="viewDetails(${watch.id})">
                        <i data-lucide="eye"></i>
                        View Details
                    </button>
                    <button class="btn btn-cart" onclick="addToCart(${watch.id})">
                        <i data-lucide="shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
            
            <div class="watch-glow"></div>
        </div>
    `;
}

function renderWatches(sortBy = 'featured') {
    const filteredWatches = filterWatches(sortBy);
    
    if (filteredWatches.length === 0) {
        watchGrid.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        watchGrid.style.display = 'grid';
        noResults.style.display = 'none';
        
        watchGrid.innerHTML = filteredWatches.map(watch => createWatchCard(watch)).join('');
        
        // Reinitialize Lucide icons for the new content
        lucide.createIcons();
    }
}

// Action functions
function viewDetails(productId) {
    const product = watches.find(item => item.id === productId);
    if (product) {
        // Store product in localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        
        // Redirect to details page
        window.location.href = '/src/pages/details/index.html';
    }
}



// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderWatches();
    
    // Close sidebar when clicking outside on larger screens
    document.addEventListener('click', function(event) {
        if (window.innerWidth >= 1024) return;
        
        if (sidebarOpen && 
            !sidebar.contains(event.target) && 
            !filterToggle.contains(event.target)) {
            toggleSidebar();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024 && sidebarOpen) {
            sidebarOpen = false;
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});


// load the header and footer
$(function () {
    $(".nav-header").load("../../../components/navigation-bar/navigation.html");
    $(".site-footer").load("../../../components/footer/footer.html");
});

// Product action functions
function addToCart(productId) {
    // Sample product data (replace with your actual data source)
    

    // Get the product based on ID
    const product = watches.find(p => p.id === productId);
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