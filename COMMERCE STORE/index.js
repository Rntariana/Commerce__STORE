const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 500,
    category: "audio",
    img: "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=400&q=80",
    description: "Premium noise-cancelling wireless headphones"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 350,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80",
    description: "RGB mechanical gaming keyboard"
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 200,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=400&q=80",
    description: "High-precision gaming mouse"
  },
  {
    id: 4,
    name: "USB Cable",
    price: 100,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=400&q=80",
    description: "Fast charging USB-C cable"
  },
  {
    id: 5,
    name: "Laptop Stand",
    price: 150,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a5a?auto=format&fit=crop&w=400&q=80",
    description: "Adjustable aluminum laptop stand"
  },
  {
    id: 6,
    name: "Webcam HD",
    price: 300,
    category: "audio",
    img: "https://images.unsplash.com/photo-1596495578673-f4711ae32689?auto=format&fit=crop&w=400&q=80",
    description: "1080p HD webcam with microphone"
  },
  {
    id: 7,
    name: "Monitor 27\"",
    price: 800,
    category: "display",
    img: "https://images.unsplash.com/photo-1527443225342-922bdeb752b2?auto=format&fit=crop&w=400&q=80",
    description: "4K Ultra HD monitor"
  },
  {
    id: 8,
    name: "Desk Lamp",
    price: 80,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    description: "LED desk lamp with adjustable brightness"
  }
];

const categories = [
  { id: "all", name: "All Products" },
  { id: "audio", name: "Audio" },
  { id: "accessories", name: "Accessories" },
  { id: "display", name: "Display" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productContainer = document.getElementById("products");
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("searchInput");
let currentCategory = "all";
let currentSearch = "";

// DISPLAY PRODUCTS
function displayProducts(category = "all", search = "") {
  showLoadingState();
  
  setTimeout(() => {
    productContainer.innerHTML = "";

    let filteredProducts = products;
    
    if (category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filteredProducts.length === 0) {
      productContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      hideLoadingState();
      return;
    }

    filteredProducts.forEach((product, index) => {
      setTimeout(() => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.style.opacity = "0";
        div.style.transform = "translateY(20px)";

        div.innerHTML = `
          <img src="${product.img}" alt="${product.name}" loading="lazy">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">R${product.price}</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productContainer.appendChild(div);
        
        // Animate product appearance
        setTimeout(() => {
          div.style.transition = "all 0.3s ease";
          div.style.opacity = "1";
          div.style.transform = "translateY(0)";
        }, 50);
      }, index * 100);
    });
    
    hideLoadingState();
  }, 300);
}

// ADD TO CART (with quantity)
function addToCart(id) {
  let item = cart.find(p => p.id === id);
  const product = products.find(p => p.id === id);

  if (item) {
    item.qty += 1;
    showNotification(`${product.name} quantity updated!`);
  } else {
    cart.push({ ...product, qty: 1 });
    showNotification(`${product.name} added to cart!`);
  }

  saveCart();
  updateCart();
  
  // Add animation to cart
  const cartElement = document.querySelector('.cart');
  cartElement.classList.add('cart-bounce');
  setTimeout(() => cartElement.classList.remove('cart-bounce'), 500);
}

// SHOW NOTIFICATION
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// LOADING STATES
function showLoadingState() {
  productContainer.style.opacity = '0.5';
  productContainer.style.pointerEvents = 'none';
}

function hideLoadingState() {
  productContainer.style.opacity = '1';
  productContainer.style.pointerEvents = 'auto';
}

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

// REMOVE ITEM
function removeItem(id) {
  const item = cart.find(p => p.id === id);
  if (item) {
    showNotification(`${item.name} removed from cart`);
  }
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
}

// CHANGE QTY
function changeQty(id, amount) {
  let item = cart.find(p => p.id === id);

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    removeItem(id);
  }

  saveCart();
  updateCart();
}

// CLEAR CART
function clearCart() {
  if (cart.length === 0) return;
  
  if (confirm('Are you sure you want to clear your entire cart?')) {
    cart = [];
    saveCart();
    updateCart();
    showNotification('Cart cleared');
  }
}

// SAVE
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// UPDATE CART
function updateCart() {
  cartList.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  if (cart.length === 0) {
    cartList.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    totalEl.textContent = '0';
    updateCartButton(0);
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    const itemTotal = item.price * item.qty;
    
    li.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">R${item.price} x ${item.qty} = R${itemTotal}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        <button class="remove-btn" onclick="removeItem(${item.id})" title="Remove item">×</button>
      </div>
    `;

    cartList.appendChild(li);
    total += itemTotal;
    itemCount += item.qty;
  });

  totalEl.textContent = total;
  updateCartButton(itemCount);
}

// UPDATE CART BUTTON INDICATOR
function updateCartButton(count) {
  // Remove existing indicator if any
  const existingIndicator = document.querySelector('.cart-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Add indicator if there are items
  if (count > 0) {
    const indicator = document.createElement('div');
    indicator.className = 'cart-indicator';
    indicator.textContent = count;
    indicator.title = `${count} item${count > 1 ? 's' : ''} in cart`;
    
    const cartSection = document.querySelector('.cart h2');
    cartSection.style.position = 'relative';
    cartSection.appendChild(indicator);
  }
}

// SEARCH
let searchTimeout;
searchInput.addEventListener("input", (e) => {
  const searchSpinner = document.getElementById('searchSpinner');
  
  clearTimeout(searchTimeout);
  searchSpinner.style.display = 'block';
  
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value;
    displayProducts(currentCategory, currentSearch);
    searchSpinner.style.display = 'none';
  }, 500);
});

// CATEGORY FILTER
function filterByCategory(category) {
  currentCategory = category;
  displayProducts(currentCategory, currentSearch);
  
  // Update active category button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
}

// CHECKOUT
function openCheckout() {
  const modal = document.getElementById("checkoutModal");
  const summary = document.getElementById("summary");

  let text = cart.map(i => `${i.name} x${i.qty}`).join(", ");
  summary.textContent = `You ordered: ${text} | Total: R${totalEl.textContent}`;

  modal.style.display = "block";
}

function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
}

// CHECKOUT FORM HANDLING
function handleCheckoutSubmit(event) {
  event.preventDefault();
  
  const formData = {
    name: document.getElementById('customerName').value,
    email: document.getElementById('customerEmail').value,
    phone: document.getElementById('customerPhone').value,
    address: document.getElementById('customerAddress').value,
    agreeTerms: document.getElementById('agreeTerms').checked
  };
  
  // Validate form
  if (!validateCheckoutForm(formData)) {
    return;
  }
  
  completeOrder(formData);
}

function validateCheckoutForm(data) {
  if (!data.name.trim() || data.name.length < 3) {
    showNotification('Please enter a valid name (at least 3 characters)', 'error');
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showNotification('Please enter a valid email address', 'error');
    return false;
  }
  
  if (!data.phone.trim() || data.phone.length < 10) {
    showNotification('Please enter a valid phone number', 'error');
    return false;
  }
  
  if (!data.address.trim() || data.address.length < 10) {
    showNotification('Please enter a complete delivery address', 'error');
    return false;
  }
  
  if (!data.agreeTerms) {
    showNotification('Please agree to the terms and conditions', 'error');
    return false;
  }
  
  return true;
}

function completeOrder(customerData) {
  const orderTotal = totalEl.textContent;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  
  showLoadingOverlay();
  
  // Simulate order processing
  setTimeout(() => {
    hideLoadingOverlay();
    
    showNotification(`Order placed successfully! ${itemCount} item${itemCount > 1 ? 's' : ''} for R${orderTotal}`);
    
    // Store order details (in real app, this would go to a server)
    const order = {
      id: Date.now(),
      customer: customerData,
      items: cart,
      total: orderTotal,
      date: new Date().toISOString()
    };
    
    console.log('Order placed:', order);
    
    setTimeout(() => {
      clearCart();
      closeCheckout();
      // Reset form
      document.getElementById('checkoutForm').reset();
    }, 1500);
  }, 2000);
}

// INIT
function init() {
  renderCategories();
  displayProducts();
  updateCart();
}

// RENDER CATEGORIES
function renderCategories() {
  const categoryContainer = document.createElement('div');
  categoryContainer.className = 'category-filter';
  categoryContainer.innerHTML = `
    <div class="category-buttons">
      ${categories.map(cat => `
        <button class="category-btn ${cat.id === 'all' ? 'active' : ''}" 
                data-category="${cat.id}" 
                onclick="filterByCategory('${cat.id}')">
          ${cat.name}
        </button>
      `).join('')}
    </div>
  `;
  
  const searchBox = document.querySelector('.search-box');
  searchBox.parentNode.insertBefore(categoryContainer, searchBox.nextSibling);
}

// Start the app
init();
 
