const productsGrid = document.querySelector("[data-products]");
const searchInput = document.querySelector("[data-search]");
const categoryFilter = document.querySelector("[data-category]");
const stockFilter = document.querySelector("[data-stock-filter]");
const productCount = document.querySelector("[data-product-count]");

let products = [];

function stockLabel(stock) {
  if (stock === 0) return "Esgotado";
  if (stock <= 5) return `Ultimas ${stock} un.`;
  return `${stock} em estoque`;
}

function renderCategories() {
  const categories = [...new Set(products.map((product) => product.category))].sort();
  categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
}

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedStock = stockFilter.value;

  return products.filter((product) => {
    const matchesSearch = [product.name, product.brand, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStock = selectedStock === "available" ? product.stock > 0 : true;
    return matchesSearch && matchesCategory && matchesStock;
  });
}

function productCard(product) {
  const isSoldOut = product.stock === 0;

  return `
    <article class="product-card ${isSoldOut ? "is-sold-out" : ""}">
      <div class="product-image" style="background-image: url('${product.image}')">
        <span class="stock-pill">${stockLabel(product.stock)}</span>
      </div>
      <div class="product-info">
        <p class="eyebrow">${product.brand} / ${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <strong>${formatCurrency(product.price)}</strong>
          <a class="button small ${isSoldOut ? "secondary disabled" : ""}" href="${buildWhatsAppLink(product)}" target="_blank" rel="noreferrer">
            ${isSoldOut ? "Indisponivel" : "Chamar no WhatsApp"}
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const visibleProducts = filterProducts();
  productCount.textContent = `${visibleProducts.length} produto${visibleProducts.length === 1 ? "" : "s"}`;

  if (!visibleProducts.length) {
    productsGrid.innerHTML = `
      <div class="empty-state">
        <h3>Nenhum produto encontrado</h3>
        <p>Tente ajustar a busca ou os filtros para ver mais opcoes.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = visibleProducts.map(productCard).join("");
}

async function initCatalog() {
  products = await loadProducts();
  renderCategories();
  renderProducts();

  [searchInput, categoryFilter, stockFilter].forEach((element) => {
    element.addEventListener("input", renderProducts);
  });
}

initCatalog();
