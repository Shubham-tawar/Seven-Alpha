// cart.js (in cart folder)

// Function to add item to cart from product page
function addToCart(productId) {
    
        // Add more products as needed
   

    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showPopup(`${product.name} added to cart!`);
    renderCart(); // Update cart display if on cart page
}

// Function to show pop-up confirmation
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('show'), 10);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => document.body.removeChild(popup), 500);
    }, 2000);
}

// Function to render cart items
function renderCart() {
    const cartTableBody = document.querySelector('.woocommerce-cart-form__contents tbody');
    if (!cartTableBody) {
        console.error("Cart table body not found");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartTableBody.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItemKey = `item_${item.id}_${index}`;

        const row = `
            <tr class="woocommerce-cart-form__cart-item cart_item">
                <td class="product-name" data-title="Product">
                    <div class="d-flex">
                        <div class="img">
                            <a href="#" class="remove-button essential-set-multiply" onclick="removeItem(${index})" aria-label="Remove this item" data-product_id="${item.id}"></a>
                            <img width="300" height="300" src="${item.image}" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="${item.name}" />
                        </div>
                        <div class="p-content">
                            <a href="#">${item.name} (${item.color || 'N/A'}, ${item.size || 'N/A'})</a>
                        </div>
                    </div>
                </td>
                <td class="product-price" data-title="Price">
                    <span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>${item.price}</bdi></span>
                </td>
                <td class="product-quantity" data-title="Quantity">
                    <div class="quantity">
                        <a href="#" class="down" onclick="updateQuantity(${index}, ${item.quantity - 1})"></a>
                        <input
                            type="number"
                            id="quantity_${cartItemKey}"
                            class="input-text qty text"
                            step="1"
                            min="0"
                            max=""
                            name="cart[${cartItemKey}][qty]"
                            value="${item.quantity}"
                            title="Qty"
                            size="4"
                            pattern="[0-9]*"
                            inputmode="numeric"
                            aria-labelledby="${item.name} quantity"
                            onchange="updateQuantity(${index}, this.value)"
                        />
                        <a href="#" class="up" onclick="updateQuantity(${index}, ${item.quantity + 1})"></a>
                    </div>
                </td>
                <td class="product-subtotal" data-title="Total">
                    <span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>${itemTotal}</bdi></span>
                </td>
            </tr>
        `;
        cartTableBody.innerHTML += row;
    });

    // Update subtotal and total
    const subtotalElement = document.querySelector('.cart-subtotal td span');
    const totalElement = document.querySelector('.order-total td span');
    if (subtotalElement && totalElement) {
        subtotalElement.innerHTML = `<bdi><span class="woocommerce-Price-currencySymbol">$</span>${subtotal}</bdi>`;
        totalElement.innerHTML = `<bdi><span class="woocommerce-Price-currencySymbol">$</span>${subtotal}</bdi>`;
    }
}

// Function to update quantity
function updateQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    quantity = parseInt(quantity);
    if (quantity <= 0) {
        cart.splice(index, 1); // Remove item if quantity is 0
    } else {
        cart[index].quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Function to remove item
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    const updateCartButton = document.querySelector('.button[name="update_cart"]');
    if (updateCartButton) {
        updateCartButton.addEventListener('click', renderCart);
    }
});