const productsGrid = document.querySelector("[data-products]");
const searchInput = document.querySelector("[data-search]");
const categoryButtons = document.querySelector("[data-categories]");
const cartList = document.querySelector("[data-cart-list]");
const cartCountLabels = document.querySelectorAll("[data-cart-count]");
const cartTotalLabels = document.querySelectorAll("[data-cart-total]");
const whatsappButtons = document.querySelectorAll("[data-whatsapp-cart]");
const clearCartButtons = document.querySelectorAll("[data-clear-cart]");

let products = [];
let selectedCategory = "Todos";
let cart = {};

function getCartItems() {
  return Object.entries(cart).map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return product && quantity > 0 ? { product, quantity, subtotal: product.price * quantity } : null;
  }).filter(Boolean);
}

function cartTotals() {
  const items = getCartItems();
  return { items, count: items.reduce((sum, item) => sum + item.quantity, 0), total: items.reduce((sum, item) => sum + item.subtotal, 0) };
}

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  return products.filter((product) => {
    const searchable = [product.name, product.brand, product.category, product.description].join(" ").toLowerCase();
    return searchable.includes(searchTerm) && (selectedCategory === "Todos" || product.category === selectedCategory);
  });
}

function renderCategories() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];
  categoryButtons.innerHTML = categories.map((category) => `<button class="chip ${category === selectedCategory ? "active" : ""}" type="button" data-category="${category}">${category}</button>`).join("");
}

function renderProducts() {
  const visibleProducts = filterProducts();
  if (!visibleProducts.length) {
    productsGrid.innerHTML = `<div class="empty-state"><h3>Não encontrei esse produto</h3><p>Tente buscar por outra palavra ou categoria.</p></div>`;
    return;
  }

  productsGrid.innerHTML = visibleProducts.map((product) => {
    const quantity = cart[product.id] || 0;
    return `
      <article class="shop-card">
        <div class="shop-image" style="background-image: url('${product.image}')">${product.tag ? `<span class="tag-pill">${product.tag}</span>` : ""}</div>
        <div class="shop-info">
          <p class="eyebrow">${product.category}</p>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <strong class="price">${formatCurrency(product.price)}</strong>
          <div class="big-actions">
            <button type="button" data-action="decrease" data-id="${product.id}">-</button>
            <span>${quantity}</span>
            <button type="button" data-action="increase" data-id="${product.id}">+</button>
          </div>
          <button class="button add-button" type="button" data-action="increase" data-id="${product.id}">Colocar no carrinho</button>
        </div>
      </article>`;
  }).join("");
}

function renderCart() {
  const { items, count, total } = cartTotals();
  cartCountLabels.forEach((label) => { label.textContent = `${count} item${count === 1 ? "" : "s"}`; });
  cartTotalLabels.forEach((label) => { label.textContent = formatCurrency(total); });
  whatsappButtons.forEach((button) => {
    button.classList.toggle("disabled", !items.length);
    button.href = items.length ? buildCartWhatsAppLink(items, total) : "#";
  });
  clearCartButtons.forEach((button) => { button.disabled = !items.length; });

  cartList.innerHTML = items.length ? items.map(({ product, quantity, subtotal }) => `
    <div class="cart-row"><div><strong>${quantity}x ${product.name}</strong><span>${formatCurrency(subtotal)}</span></div><button type="button" data-action="remove" data-id="${product.id}">tirar</button></div>
  `).join("") : '<p class="cart-empty">Seu carrinho está vazio. Toque no + dos produtos.</p>';
}

function updateCart(productId, amount) {
  cart[productId] = Math.max(0, (cart[productId] || 0) + amount);
  if (cart[productId] === 0) delete cart[productId];
  renderProducts(); renderCart();
}

async function initCatalog() {
  products = await loadProducts();
  renderCategories(); renderProducts(); renderCart();
  searchInput.addEventListener("input", renderProducts);
  productsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button"); if (!button) return;
    if (button.dataset.action === "increase") updateCart(button.dataset.id, 1);
    if (button.dataset.action === "decrease") updateCart(button.dataset.id, -1);
  });
  cartList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='remove']"); if (!button) return;
    delete cart[button.dataset.id]; renderProducts(); renderCart();
  });
  clearCartButtons.forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("Tem certeza que deseja limpar o carrinho?")) return;
    cart = {}; renderProducts(); renderCart();
  }));
  categoryButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button"); if (!button) return;
    selectedCategory = button.dataset.category; renderCategories(); renderProducts();
  });
}

initCatalog();
