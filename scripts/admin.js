const adminTable = document.querySelector("[data-admin-table]");
const productForm = document.querySelector("[data-product-form]");
const exportButton = document.querySelector("[data-export]");
const importInput = document.querySelector("[data-import]");
const resetButton = document.querySelector("[data-reset]");
const adminSummary = document.querySelector("[data-admin-summary]");

let products = [];

function renderSummary() {
  const totalItems = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const soldOut = products.filter((product) => product.stock === 0).length;

  adminSummary.innerHTML = `
    <span><strong>${products.length}</strong> produtos</span>
    <span><strong>${totalItems}</strong> itens em estoque</span>
    <span><strong>${lowStock}</strong> com estoque baixo</span>
    <span><strong>${soldOut}</strong> esgotados</span>
  `;
}

function renderAdminTable() {
  renderSummary();

  if (!products.length) {
    adminTable.innerHTML = '<p class="empty-state">Nenhum produto cadastrado ainda.</p>';
    return;
  }

  adminTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Categoria</th>
          <th>Preco</th>
          <th>Estoque</th>
          <th>Acoes</th>
        </tr>
      </thead>
      <tbody>
        ${products.map((product) => `
          <tr>
            <td>
              <strong>${product.name}</strong>
              <span>${product.brand}</span>
            </td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>
              <div class="stock-control">
                <button type="button" data-action="decrease" data-id="${product.id}">-</button>
                <input type="number" min="0" value="${product.stock}" data-action="set-stock" data-id="${product.id}">
                <button type="button" data-action="increase" data-id="${product.id}">+</button>
              </div>
            </td>
            <td><button class="danger" type="button" data-action="remove" data-id="${product.id}">Remover</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function persistAndRender() {
  products = saveProducts(products);
  renderAdminTable();
}

function handleTableClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, id } = button.dataset;
  const product = products.find((item) => item.id === id);
  if (!product) return;

  if (action === "increase") product.stock += 1;
  if (action === "decrease") product.stock = Math.max(0, product.stock - 1);
  if (action === "remove") products = products.filter((item) => item.id !== id);

  persistAndRender();
}

function handleStockInput(event) {
  if (event.target.dataset.action !== "set-stock") return;
  const product = products.find((item) => item.id === event.target.dataset.id);
  if (!product) return;
  product.stock = Math.max(0, Number.parseInt(event.target.value || 0, 10));
  persistAndRender();
}

function handleProductSubmit(event) {
  event.preventDefault();
  const formData = new FormData(productForm);
  const product = normalizeProduct(Object.fromEntries(formData.entries()));

  products = [product, ...products.filter((item) => item.id !== product.id)];
  productForm.reset();
  persistAndRender();
}

function downloadCsv() {
  const blob = new Blob([productsToCsv(products)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "catalogo-produtos.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function importCsv(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    products = parseCsv(String(reader.result));
    persistAndRender();
    importInput.value = "";
  });
  reader.readAsText(file, "UTF-8");
}

async function resetProducts() {
  localStorage.removeItem(STORAGE_KEY);
  products = await loadProducts();
  renderAdminTable();
}

async function initAdmin() {
  products = await loadProducts();
  renderAdminTable();

  adminTable.addEventListener("click", handleTableClick);
  adminTable.addEventListener("change", handleStockInput);
  productForm.addEventListener("submit", handleProductSubmit);
  exportButton.addEventListener("click", downloadCsv);
  importInput.addEventListener("change", importCsv);
  resetButton.addEventListener("click", resetProducts);
}

initAdmin();
