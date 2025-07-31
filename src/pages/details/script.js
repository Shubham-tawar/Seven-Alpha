class ProductDetail {
    constructor(productData) {
        this.product = productData;
        this.currentImageIndex = 0;
        this.selectedSize = '';
        this.isZoomed = false;
        this.zoomPosition = { x: 0, y: 0 };
        this.carouselPosition = 0;
        
        this.init();
    }

    init() {
        this.renderProduct();
        this.setupEventListeners();
        this.updateButtonStates();
    }

    renderProduct() {
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = `
            <div class="image-section">
                <div class="main-image-container">
                    <div class="main-image-wrapper" id="mainImageWrapper">
                        <img src="${this.product.images[0]}" alt="${this.product.name}" class="main-image" id="mainImage">
                        <div class="zoom-container" id="zoomContainer">
                            <img src="${this.product.images[0]}" alt="Zoomed ${this.product.name}" class="zoom-image" id="zoomImage">
                        </div>
                    </div>
                </div>
                <div class="carousel-container">
                    <button class="carousel-btn prev" id="carouselPrev"><</button>
                    <div class="carousel-track" id="carouselTrack">
                        ${this.product.images.map((img, index) => `
                            <button class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <img src="${img}" alt="Thumbnail ${index + 1}">
                            </button>
                        `).join('')}
                    </div>
                    <button class="carousel-btn next" id="carouselNext">></button>
                </div>
            </div>
            <div class="details-section">
                <div class="brand-title">
                    <div class="brand-header">
                        <span class="brand-badge">${this.product.brand}</span>
                        <button class="wishlist-btn" onclick="">
                            <svg class="heart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <h1 class="product-title">${this.product.name}</h1>
                    <div class="rating">
                        <div class="stars">
                            ${Array(5).fill().map((_, i) => `
                                <svg class="star" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.783.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.98 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z"/>
                                </svg>
                            `).join('')}
                        </div>
                        <span class="review-count">(${this.product.reviews} reviews)</span>
                    </div>
                </div>
                <div class="price-section">
                    <div class="price-row">
                        <span class="current-price">${formatPrice(this.product.currentPrice)}</span>
                        <span class="original-price">${formatPrice(this.product.originalPrice)}</span>
                        <span class="discount-badge">${this.product.discount}</span>
                    </div>
                    <span class="tax-info">(Inclusive of all taxes)</span>
                </div>
                <div class="product-info-card">
                    <div class="info-grid">
                        <div class="info-column">
                            ${this.product.info.slice(0, 3).map(item => `
                                <div class="info-item">
                                    <span class="info-label">${item.label}</span>
                                    <span class="info-value">${item.value}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="info-column">
                            ${this.product.info.slice(3).map(item => `
                                <div class="info-item">
                                    <span class="info-label">${item.label}</span>
                                    <span class="info-value">${item.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="size-section">
                    <div class="size-header">
                        <span class="size-title">Select Size</span>
                        <button class="size-chart-btn">Size Chart</button>
                    </div>
                    <div class="size-grid">
                        ${this.product.sizes.map(size => `
                            <button class="size-btn" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-primary" id="buyNowBtn" disabled>Buy Now</button>
                    <button class="btn-secondary" id="addToCartBtn" disabled>Add To Cart</button>
                </div>
                <div class="delivery-card">
                    ${this.product.delivery.map(item => `
                        <div class="delivery-item">
                            <div class="delivery-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="${item.iconPath}"/>
                                </svg>
                            </div>
                            <div>
                                <div class="delivery-title">${item.title}</div>
                                <div class="delivery-subtitle">${item.subtitle}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="company-card">
                    <div class="card-title">Company Details</div>
                    <div class="company-info">
                        ${this.product.company.map(item => `
                            <p><span class="company-label">${item.label}:</span> ${item.value}</p>
                        `).join('')}
                    </div>
                </div>
                <div class="description-card">
                    <div class="card-title">Product Details</div>
                    <p class="description-text">${this.product.description}</p>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Thumbnail navigation
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => this.changeImage(index));
        });

        // Carousel navigation
        document.getElementById('carouselPrev').addEventListener('click', () => this.moveCarousel(-1));
        document.getElementById('carouselNext').addEventListener('click', () => this.moveCarousel(1));

        // Zoom functionality
        const mainImageWrapper = document.getElementById('mainImageWrapper');
        mainImageWrapper.addEventListener('mousemove', (e) => this.handleImageHover(e));
        mainImageWrapper.addEventListener('mouseleave', () => this.hideZoom());

        // Size selection
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(button => {
            button.addEventListener('click', () => this.selectSize(button.dataset.size));
        });

        // Action buttons
        document.getElementById('buyNowBtn').addEventListener('click', () => this.buyNow());
        document.getElementById('addToCartBtn').addEventListener('click', () => this.addToCart());

        // Wishlist button
        document.querySelector('.wishlist-btn').addEventListener('click', () => this.toggleWishlist());
    }

    changeImage(index) {
        this.currentImageIndex = index;
        
        // Update main image
        const mainImage = document.getElementById('mainImage');
        mainImage.src = this.product.images[index];
        
        // Update zoom image
        const zoomImage = document.getElementById('zoomImage');
        if (zoomImage) {
            zoomImage.src = this.product.images[index];
            console.log('Zoom image source set to:', this.product.images[index]); // Debug log
        }
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    moveCarousel(direction) {
        const track = document.getElementById('carouselTrack');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const maxPosition = thumbnails.length - 4; // Show 4 thumbnails at a time
        
        this.carouselPosition = Math.max(0, Math.min(this.carouselPosition + direction, maxPosition));
        track.style.transform = `translateX(-${this.carouselPosition * 90}px)`; // 80px width + 10px margin
    }

    handleImageHover(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        this.zoomPosition = { x, y };
        const zoomImage = document.getElementById('zoomImage');
        if (zoomImage) {
            const scale = 3; // 3x zoom
            const translateX = -x * (scale - 1) * 100;
            const translateY = -y * (scale - 1) * 100;
            zoomImage.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
           
        }
    }

    hideZoom() {
        const zoomImage = document.getElementById('zoomImage');
        if (zoomImage) {
            zoomImage.style.transform = 'translate(0, 0) scale(1)'; // Reset on leave
        }
    }

    selectSize(size) {
        this.selectedSize = size;
        
        // Update size button states
        document.querySelectorAll('.size-btn').forEach(button => {
            button.classList.toggle('selected', button.dataset.size === size);
        });
        
        this.updateButtonStates();
    }

    updateButtonStates() {
        const buyNowBtn = document.getElementById('buyNowBtn');
        const addToCartBtn = document.getElementById('addToCartBtn');
        
        const isDisabled = !this.selectedSize;
        buyNowBtn.disabled = isDisabled;
        addToCartBtn.disabled = isDisabled;
    }

    buyNow() {
        if (!this.selectedSize) {
            showNotification('Please select a size first', 'error');
            return;
        }

        const selectedItem = {
            ...this.product,
            selectedSize: this.selectedSize
        };

        // Save selected item to localStorage for direct checkout
        localStorage.setItem('directCheckoutItem', JSON.stringify(selectedItem));

        // Redirect to checkout page
        window.location.href = "/src/pages/checkout/checkout.html"; 
    }


    addToCart() {
        if (!this.selectedSize) {
            showNotification('Please select a size first', 'error');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const itemToAdd = { ...this.product, selectedSize: this.selectedSize };
        cart.push(itemToAdd);

        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification(`Added to bag - Size ${this.selectedSize}`, 'success');
    }


    toggleWishlist() {
        const heartIcon = document.querySelector('.heart-icon');
        const isWishlisted = heartIcon.style.fill === 'currentColor';

        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        if (isWishlisted) {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item.name !== this.product.name);
            heartIcon.style.fill = 'none';
            showNotification('Removed from wishlist', 'info');
        } else {
            // Add to wishlist
            const itemToAdd = { ...this.product, selectedSize: this.selectedSize || null };
            wishlist.push(itemToAdd);
            heartIcon.style.fill = 'currentColor';
            showNotification('Added to wishlist', 'success');
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }


    
}

// Product data
const products = [
    {
        brand: 'SEVEN ALPHA',
        name: 'Men Pink Tailored Fit Linen Kent Shirt',
        reviews: 128,
        currentPrice: 157,
        originalPrice: 175,
        discount: '10% OFF',
        images: [
            '/public/images/Men%20Shirts/image-9.png',
            '/public/images/Men%20Shirts/image-10.png',
            '/public/images/Men%20Shirts/image-11.png',
            '/public/images/Men%20Shirts/image-12.png',
            '/public/images/Men%20Shirts/image-13.png',
            '/public/images/Men%20Shirts/image-14.png',
            '/public/images/Men%20Shirts/image-15.png'
        ],
        info: [
            { label: 'Style Code', value: '010200434SS25012' },
            { label: 'Color', value: 'Pink' },
            { label: 'Material', value: '100% Linen' },
            { label: 'Fit', value: 'Tailored Fit' },
            { label: 'Occasion', value: 'Casual' },
            { label: 'Care', value: 'Machine Wash' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        delivery: [
            { 
                title: 'Free Delivery', 
                subtitle: 'On orders above ₹1000',
                iconPath: 'M20 8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3h10a3 3 0 003-3V8zm-2 0H6v8a1 1 0 001 1h10a1 1 0 001-1V8z'
            },
            { 
                title: 'Easy Returns', 
                subtitle: '30-day return policy',
                iconPath: 'M9 5l-7 7 7 7m6-14l7 7-7 7'
            }
        ],
        company: [
            { label: 'Marketed By', value: 'Seven Alpha' },
            { label: 'Packed By', value: 'Luxury Fashion House Pvt. Ltd.' },
            { label: 'Country of Origin', value: 'United Kingdom' }
        ],
        description: 'Discover timeless elegance in this pink linen Kent shirt that masters the art of summer dressing. The tailored silhouette creates a refined shape while the distinctive Kent cutaway collar adds sophistication. Crafted from pure garment-dyed linen, it features clean details like an applied placket and subtle chest logo. This breathable piece promises both style and comfort for warm days.'
    }
    // Add more products here as needed
];

// Initialize the product detail functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const productData = localStorage.getItem('selectedProduct');
    if (productData) {
        const parsedProduct = JSON.parse(productData);

        // Convert old product format to new format if needed
        if (!parsedProduct.images) {
            parsedProduct.images = [parsedProduct.image]; // fallback
            parsedProduct.currentPrice = parsedProduct.price;
            parsedProduct.originalPrice = parsedProduct.price + 20;
            parsedProduct.discount = '10% OFF';
            parsedProduct.reviews = 25;
            parsedProduct.info = [
                { label: 'Color', value: parsedProduct.color },
                { label: 'Size', value: parsedProduct.size },
                { label: 'Type', value: parsedProduct.type },
                { label: 'Brand', value: parsedProduct.brand },
                { label: 'Material', value: 'Cotton' },
                { label: 'Care', value: 'Machine Wash' }
            ];
            parsedProduct.sizes = ['S', 'M', 'L', 'XL', 'XXL'];
            parsedProduct.delivery = [
                { 
                    title: 'Free Delivery', 
                    subtitle: 'On orders above ₹1000',
                    iconPath: 'M20 8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3h10a3 3 0 003-3V8zm-2 0H6v8a1 1 0 001 1h10a1 1 0 001-1V8z'
                },
                { 
                    title: 'Easy Returns', 
                    subtitle: '30-day return policy',
                    iconPath: 'M9 5l-7 7 7 7m6-14l7 7-7 7'
                }
            ];
            parsedProduct.company = [
                { label: 'Marketed By', value: 'Seven Alpha' },
                { label: 'Packed By', value: 'Luxury Fashion House Pvt. Ltd.' },
                { label: 'Country of Origin', value: 'India' }
            ];
            parsedProduct.description = 'This is a premium product from our exclusive Seven Alpha menswear collection.';
        }

        new ProductDetail(parsedProduct);
    } else {
        alert("No product data found!");
    }
});


// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card);
        color: var(--foreground);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-elegant);
        border: 1px solid var(--border);
        z-index: 1000;
        transition: var(--transition-smooth);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// load the header & Footer
$(function () {
    $(".nav-header").load("/src/components/navigation-bar/navigation.html");
    $(".site-footer").load("/src/components/footer/footer.html");
});