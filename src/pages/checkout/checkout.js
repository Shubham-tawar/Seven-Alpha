// Initialize variables for Stripe
let stripe;
let elements;
let paymentElement;
let clientSecret;
let orderId;

document.addEventListener('DOMContentLoaded', () => {
  const directCheckoutItem = JSON.parse(localStorage.getItem('directCheckoutItem'));
  let cart = [];

  if (directCheckoutItem) {
    cart = [directCheckoutItem];
    localStorage.removeItem('directCheckoutItem');
  } else {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  }

  const orderList = document.getElementById('orderList');
  const totalAmount = document.getElementById('totalAmount');
  const paymentMethodRadios = document.querySelectorAll('input[name="payment"]');
  const cardPaymentContainer = document.getElementById('card-payment-container');

  let total = 0;

  cart.forEach(item => {
    const price = item.price || item.currentPrice || 0;
    const quantity = item.quantity || 1;
    const subtotal = price * quantity;
    total += subtotal;

    const li = document.createElement('li');
    li.textContent = `${item.name} (${item.selectedSize || 'Free Size'}) x ${quantity} — $${subtotal}`;
    orderList.appendChild(li);
  });

  totalAmount.textContent = total;

  // Handle payment method selection
  paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'card') {
        cardPaymentContainer.style.display = 'block';
        initializeStripe();
      } else {
        cardPaymentContainer.style.display = 'none';
      }
    });
  });

  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const customerData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      paymentMethod: formData.get('payment')
    };
    
    // Create order first
    try {
      const orderResponse = await createOrder(cart, customerData);
      orderId = orderResponse.order.id;
      
      if (customerData.paymentMethod === 'card') {
        // Process Stripe payment
        await handleStripePayment(orderId, total);
      } else {
        // For COD or other payment methods
        showSuccessMessage('Order placed successfully!');
        clearCartAndRedirect();
      }
    } catch (error) {
      console.error('Error processing order:', error);
      showErrorMessage('There was a problem processing your order. Please try again.');
    }
  });
});

// Initialize Stripe
async function initializeStripe() {
  try {
    // Fetch the publishable key
    const response = await fetch('/api/payment/config');
    const { publishableKey } = await response.json();
    
    // Initialize Stripe
    stripe = Stripe(publishableKey);
    
    // Create payment element
    elements = stripe.elements();
    
    // Create and mount the Payment Element
    paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    showErrorMessage('Could not initialize payment system. Please try again later.');
  }
}

// Create order in the backend
async function createOrder(cart, customerData) {
  try {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('You must be logged in to place an order');
    }
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart.map(item => ({
          productId: item.productId || item.id,
          variantId: item.variantId,
          quantity: item.quantity || 1,
          price: item.price || item.currentPrice
        })),
        shippingAddress: {
          fullName: customerData.name,
          phoneNumber: customerData.phone,
          email: customerData.email,
          addressLine1: customerData.address,
          city: customerData.city,
          state: customerData.state,
          postalCode: customerData.zip,
          country: 'US' // Default country
        },
        billingAddress: {
          fullName: customerData.name,
          phoneNumber: customerData.phone,
          email: customerData.email,
          addressLine1: customerData.address,
          city: customerData.city,
          state: customerData.state,
          postalCode: customerData.zip,
          country: 'US' // Default country
        },
        paymentMethod: customerData.paymentMethod,
        notes: 'Order placed from checkout page'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    showErrorMessage(error.message);
    throw error;
  }
}

// Handle Stripe payment
async function handleStripePayment(orderId, amount) {
  try {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('You must be logged in to make a payment');
    }
    
    // Create a payment intent
    const response = await fetch('/api/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        orderId: orderId
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment intent');
    }
    
    const { clientSecret } = await response.json();
    
    // Show processing message
    showProcessingMessage('Processing your payment...');
    
    // Confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // Make sure to change the URL to your domain
        return_url: window.location.origin + '/src/pages/thankyou-page.html?order_id=' + orderId,
      },
    });
    
    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      throw new Error(error.message);
    }
    
    // Payment succeeded
    showSuccessMessage('Payment successful! Redirecting...');
    clearCartAndRedirect();
  } catch (error) {
    console.error('Payment error:', error);
    showErrorMessage('Payment failed: ' + error.message);
  }
}

// Helper functions
function showSuccessMessage(message) {
  const paymentMessage = document.getElementById('payment-message');
  paymentMessage.textContent = message;
  paymentMessage.style.color = '#4caf50';
  paymentMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
  paymentMessage.classList.remove('hidden');
  
  // Also show an alert for immediate feedback
  alert(message);
}

function showErrorMessage(message) {
  const paymentMessage = document.getElementById('payment-message');
  paymentMessage.textContent = message;
  paymentMessage.style.color = '#ff6b6b';
  paymentMessage.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
  paymentMessage.classList.remove('hidden');
  setTimeout(() => {
    paymentMessage.classList.add('hidden');
  }, 5000);
}

function showProcessingMessage(message) {
  const paymentMessage = document.getElementById('payment-message');
  paymentMessage.textContent = message;
  paymentMessage.style.color = '#2196f3';
  paymentMessage.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
  paymentMessage.classList.remove('hidden');
}

function clearCartAndRedirect() {
  localStorage.removeItem('cart');
  window.location.href = '/src/pages/thankyou-page.html';
}

// function to load the header and footer 
$(function () {
    $(".nav-header").load("/src/components/navigation-bar/navigation.html");
    $(".site-footer").load("/src/components/footer/footer.html");
});


