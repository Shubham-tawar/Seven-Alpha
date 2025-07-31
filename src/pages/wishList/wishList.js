document.addEventListener('DOMContentLoaded', () => {
  const wishlistGrid = document.getElementById('wishlistGrid');
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (wishlist.length === 0) {
    wishlistGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: #aaa;">
        <h3>No items in your wishlist.</h3>
        <p>Browse products and tap the ❤️ icon to add them here.</p>
      </div>
    `;
    return;
  }

  wishlistGrid.innerHTML = wishlist.map(item => `
    <div class="wishlist-card">
      <img src="${item.image || (item.images ? item.images[0] : '')}" alt="${item.name}" class="wishlist-image" />
      <div class="wishlist-content">
        <h3 class="wishlist-name">${item.name}</h3>
        <p class="wishlist-price">$${item.price || item.currentPrice}</p>

        <button class="cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        <button class="remove-btn" onclick="removeFromWishlist(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
});

function removeFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist = wishlist.filter(item => item.id !== id);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  location.reload();
}

function addToCart(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const product = wishlist.find(p => p.id === productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // Optional: toast/popup
  showPopup(`${product.name} added to cart`);
}

// Simple popup
function showPopup(message) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add('show'), 10);
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

// function to load the header and footer 
$(function () {
    $(".nav-header").load("/src/components/navigation-bar/navigation.html");
    $(".site-footer").load("/src/components/footer/footer.html");
});

function buyAllFromWishlist() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  if (wishlist.length === 0) {
    showPopup("Your wishlist is empty.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  wishlist.forEach(item => {
    // Optional: avoid duplicate same name+size combo
    const exists = cart.find(p => p.name === item.name && p.selectedSize === item.selectedSize);
    if (!exists) {
      cart.push({ ...item, quantity: 1 });
    }
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  showPopup("All wishlist items moved to bag");

  // Redirect to checkout/cart page (update URL as per your project)
  setTimeout(() => {
    window.location.href = "/src/pages/cart/cart.html";
  }, 1000);
}
