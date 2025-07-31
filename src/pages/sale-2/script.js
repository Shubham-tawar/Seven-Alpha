// Product data array
const products = [
    // New Arrivals
    { id: 61, name: "Elegant Silk Scarf", price: 185, image: "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Accessories", brand: "Luxe Silk", material: "Pure Silk", section: "newArrivals" },
    { id: 62, name: "Premium Leather Jacket", price: 1250, image: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Outerwear", brand: "Milano Fashion", material: "Genuine Leather", section: "newArrivals" },
    { id: 63, name: "Designer Sunglasses", price: 450, image: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Accessories", brand: "Elite Vision", material: "Titanium", section: "newArrivals" },
    { id: 64, name: "Cashmere Sweater", price: 890, image: "https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Knitwear", brand: "Cashmere Co", material: "Pure Cashmere", section: "newArrivals" },
    { id: 65, name: "Pearl Necklace", price: 650, image: "https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Jewelry", brand: "Pearl Elegance", material: "Cultured Pearls", section: "newArrivals" },
    { id: 66, name: "Luxury Watch", price: 2400, image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Watches", brand: "Timepiece Masters", material: "Stainless Steel", section: "newArrivals" },

    // Trending Now
    { id: 67, name: "Velvet Evening Dress", price: 1580, image: "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Dresses", brand: "Evening Luxe", material: "Silk Velvet", section: "trendingNow" },
    { id: 68, name: "Gold Statement Ring", price: 780, image: "https://images.pexels.com/photos/1721556/pexels-photo-1721556.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Jewelry", brand: "Golden Touch", material: "18K Gold", section: "trendingNow" },
    { id: 69, name: "Designer Handbag", price: 2200, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Bags", brand: "Luxury Bags Co", material: "Italian Leather", section: "trendingNow" },
    { id: 70, name: "Silk Blouse", price: 420, image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Tops", brand: "Silk Stories", material: "Pure Silk", section: "trendingNow" },
    { id: 71, name: "Diamond Earrings", price: 1850, image: "https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Jewelry", brand: "Diamond Elite", material: "18K White Gold", section: "trendingNow" },
    { id: 72, name: "Wool Coat", price: 1650, image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Outerwear", brand: "Winter Luxury", material: "Merino Wool", section: "trendingNow" },

    // Best Sellers
    { id: 73, name: "Crystal Bracelet", price: 380, image: "https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Jewelry", brand: "Crystal Dreams", material: "Swarovski Crystal", section: "bestSellers" },
    { id: 74, name: "Luxury Boots", price: 950, image: "https://images.pexels.com/photos/1390574/pexels-photo-1390574.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Footwear", brand: "Step Luxury", material: "Italian Leather", section: "bestSellers" },
    { id: 75, name: "Satin Evening Clutch", price: 320, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Bags", brand: "Evening Grace", material: "Satin", section: "bestSellers" },
    { id: 76, name: "Platinum Ring", price: 2100, image: "https://images.pexels.com/photos/1721556/pexels-photo-1721556.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Jewelry", brand: "Platinum Plus", material: "Platinum", section: "bestSellers" },
    { id: 77, name: "Designer Perfume", price: 285, image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Fragrance", brand: "Scent Luxury", material: "Glass", section: "bestSellers" },
    { id: 78, name: "Luxury Tie", price: 165, image: "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Accessories", brand: "Gentleman's Choice", material: "Silk", section: "bestSellers" },

    // Additional products for variety
    { id: 79, name: "Evening Gown", price: 2800, image: "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Dresses", brand: "Gown Couture", material: "Chiffon", section: "newArrivals" },
    { id: 80, name: "Leather Belt", price: 220, image: "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Accessories", brand: "Belt Masters", material: "Leather", section: "trendingNow" },
    { id: 81, name: "Emerald Necklace", price: 3200, image: "https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Jewelry", brand: "Emerald Dreams", material: "18K Gold", section: "bestSellers" },
    { id: 82, name: "Luxury Heels", price: 680, image: "https://images.pexels.com/photos/1390574/pexels-photo-1390574.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Footwear", brand: "Heel Heaven", material: "Patent Leather", section: "newArrivals" },
    { id: 83, name: "Silk Pajamas", price: 380, image: "https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Sleepwear", brand: "Dream Silk", material: "Mulberry Silk", section: "trendingNow" },
    { id: 84, name: "Diamond Watch", price: 4500, image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500", category: "Watches", brand: "Diamond Time", material: "White Gold", section: "bestSellers" }
];

// Global variables
let filteredProducts = [...products];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupFilters();
    renderProducts();
    setupEventListeners();
});

// Setup filter options
function setupFilters() {
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const materials = [...new Set(products.map(p => p.material))];

    populateFilterOptions('categoryFilter', categories, 'category');
    populateFilterOptions('brandFilter', brands, 'brand');
    populateFilterOptions('materialFilter', materials, 'material');
}

// Populate filter options
function populateFilterOptions(containerId, options, filterType) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'filter-option';
        
        div.innerHTML = `
            <input type="checkbox" id="${filterType}-${option}" name="${filterType}" value="${option}">
            <label for="${filterType}-${option}">${option}</label>
        `;
        
        container.appendChild(div);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Price range slider
    document.getElementById('priceRange').addEventListener('input', function() {
        document.getElementById('priceValue').textContent = this.value;
        applyFilters();
    });

    // Clear filters button
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);

    // Mobile filter button
    document.getElementById('mobileFilterBtn').addEventListener('click', toggleSidebar);

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);

    // Sidebar overlay
    document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

}

// Apply filters
function applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const selectedCategories = getSelectedFilters('category');
    const selectedBrands = getSelectedFilters('brand');
    const selectedMaterials = getSelectedFilters('material');

    filteredProducts = products.filter(product => {
        const priceMatch = product.price <= maxPrice;
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);

        return priceMatch && categoryMatch && brandMatch && materialMatch;
    });

    renderProducts();
}

// Get selected filters
function getSelectedFilters(filterType) {
    const checkboxes = document.querySelectorAll(`input[name="${filterType}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Clear all filters
function clearAllFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('priceRange').value = 5000;
    document.getElementById('priceValue').textContent = '5000';
    
    filteredProducts = [...products];
    renderProducts();
}

// Render products
function renderProducts() {
    const sections = {
        newArrivals: document.getElementById('newArrivalsGrid'),
        trendingNow: document.getElementById('trendingNowGrid'),
        bestSellers: document.getElementById('bestSellersGrid')
    };

    // Clear all grids
    Object.values(sections).forEach(grid => grid.innerHTML = '');

    // Group filtered products by section
    const productsBySection = {
        newArrivals: filteredProducts.filter(p => p.section === 'newArrivals'),
        trendingNow: filteredProducts.filter(p => p.section === 'trendingNow'),
        bestSellers: filteredProducts.filter(p => p.section === 'bestSellers')
    };

    // Render products in each section
    Object.entries(productsBySection).forEach(([section, sectionProducts]) => {
        sectionProducts.forEach(product => {
            const productCard = createProductCard(product);
            sections[section].appendChild(productCard);
        });
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const isInWishlist = wishlist.includes(product.id);

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" onclick='viewProductDetail(${JSON.stringify(product.id)})' />
        
        <div class="wishlist-icon ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.041 1.5487 8.5C1.5487 9.959 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price}</p>
        </div>
        <div class="hover-actions">
            <button class="action-btn" onclick="buyNow(${product.id})">Buy Now</button>
            <button class="action-btn secondary" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;

    return card;
}


// Toggle wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist icon
    const wishlistIcon = document.querySelector(`[data-product-id="${productId}"] .wishlist-icon`);
    if (wishlistIcon) {
        wishlistIcon.classList.toggle('active');
    }
}

// Add to cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show feedback
    showNotification('Product added to cart!');
}

// Buy now function
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const itemToCheckout = { ...product, quantity: 1, selectedSize: product.selectedSize || 'Free Size' };
        localStorage.setItem("directCheckoutItem", JSON.stringify(itemToCheckout));
        window.location.href = "/src/pages/checkout/checkout.html";
    }
}



// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-gold);
        color: var(--primary-black);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Close sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(300px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(300px); opacity: 0; }
    }
`;
document.head.appendChild(style);

function viewProductDetail(productId) {
    const selected = products.find(p => p.id === productId);
    if (selected) {
        localStorage.setItem('selectedProduct', JSON.stringify(selected));
        window.location.href = '/src/pages/details/index.html'; 
    }
}

$(function () {
    $(".nav-header").load("/src/components/navigation-bar/navigation.html");
    $(".site-footer").load("/src/components/footer/footer.html");
});