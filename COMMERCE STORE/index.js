const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 500,
    img: "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 350,
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 200,
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "USB Cable",
    price: 100,
    img: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=400&q=80"
  }
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productContainer = document.getElementById("products");
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("searchInput");

// DISPLAY PRODUCTS
function displayProducts(filter = "") {
  productContainer.innerHTML = "";

  products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(product => {

      const div = document.createElement("div");
      div.classList.add("product");

      div.innerHTML = `
        <img src="${product.img}">
        <h3>${product.name}</h3>
        <p>R${product.price}</p>
        <button onclick="addToCart(${product.id})">Add</button>
      `;

      productContainer.appendChild(div);
    });
}

// ADD TO CART (with quantity)
function addToCart(id) {
  let item = cart.find(p => p.id === id);

  if (item) {
    item.qty += 1;
  } else {
    let product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCart();
}

// REMOVE ITEM
function removeItem(id) {
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
  cart = [];
  saveCart();
  updateCart();
}

// SAVE
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// UPDATE CART
function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {

    const li = document.createElement("li");

    li.innerHTML = `
      ${item.name} (x${item.qty})
      <div>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <button onclick="removeItem(${item.id})">X</button>
      </div>
    `;

    cartList.appendChild(li);

    total += item.price * item.qty;
  });

  totalEl.textContent = total;
}

// SEARCH
searchInput.addEventListener("input", (e) => {
  displayProducts(e.target.value);
});

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

function completeOrder() {
  alert("Order placed successfully 🎉");
  clearCart();
  closeCheckout();
}

// INIT
displayProducts();
updateCart();