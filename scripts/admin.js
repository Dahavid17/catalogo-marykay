const ADMIN_PASSWORD = "marykay2026";
const loginScreen = document.querySelector("[data-login-screen]");
const loginForm = document.querySelector("[data-login-form]");
const loginPassword = document.querySelector("[data-admin-password]");
const loginError = document.querySelector("[data-login-error]");
const adminContent = document.querySelector("[data-admin-content]");
const adminTable = document.querySelector("[data-admin-table]");
const productForm = document.querySelector("[data-product-form]");
const exportButton = document.querySelector("[data-export]");
const importInput = document.querySelector("[data-import]");
const resetButton = document.querySelector("[data-reset]");
const adminSummary = document.querySelector("[data-admin-summary]");

let products = [];
let adminStarted = false;

function renderSummary() {
  const totalItems = products.reduce((sum, product) => sum + product.stock, 0);
  adminSummary.innerHTML = `<span><strong>${products.length}</strong> produtos</span><span><strong>${totalItems}</strong> itens cadastrados</span>`;
}

function renderAdminTable() {
  renderSummary();
  if (!products.length) { adminTable.innerHTML = '<p class="empty-state">Nenhum produto cadastrado ainda.</p>'; return; }
  adminTable.innerHTML = `<table><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead><tbody>${products.map((product) => `
    <tr>
      <td><strong>${product.name}</strong><span>${product.brand}</span></td>
      <td>${product.category}</td>
      <td>${formatCurrency(product.price)}</td>
      <td><div class="stock-control"><button type="button" data-action="decrease" data-id="${product.id}">-</button><input type="number" min="0" value="${product.stock}" data-action="set-stock" data-id="${product.id}"><button type="button" data-action="increase" data-id="${product.id}">+</button></div></td>
      <td><button class="danger" type="button" data-action="remove" data-id="${product.id}">Remover</button></td>
    </tr>`).join("")}</tbody></table>`;
}

function persistAndRender() { products = saveProducts(products); renderAdminTable(); }

async function resetProducts() { localStorage.removeItem(STORAGE_KEY); products = await loadProducts(); renderAdminTable(); }

async function initAdmin() {
  adminStarted = true;
  products = await loadProducts(); renderAdminTable();
  adminTable.addEventListener("click", (event) => {
    const button = event.target.closest("button"); if (!button) return;
    const product = products.find((item) => item.id === button.dataset.id); if (!product) return;
    if (button.dataset.action === "increase") product.stock += 1;
    if (button.dataset.action === "decrease") product.stock = Math.max(0, product.stock - 1);
    if (button.dataset.action === "remove") products = products.filter((item) => item.id !== button.dataset.id);
    persistAndRender();
  });
  adminTable.addEventListener("change", (event) => {
    if (event.target.dataset.action !== "set-stock") return;
    const product = products.find((item) => item.id === event.target.dataset.id); if (!product) return;
    product.stock = Math.max(0, Number.parseInt(event.target.value || 0, 10)); persistAndRender();
  });
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const product = normalizeProduct(Object.fromEntries(new FormData(productForm).entries()));
    products = [product, ...products.filter((item) => item.id !== product.id)]; productForm.reset(); persistAndRender();
  });
  exportButton.addEventListener("click", () => {
    const blob = new Blob([productsToCsv(products)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a");
    link.href = url; link.download = "catalogo-produtos.csv"; link.click(); URL.revokeObjectURL(url);
  });
  importInput.addEventListener("change", (event) => {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => { products = parseCsv(String(reader.result)); persistAndRender(); importInput.value = ""; });
    reader.readAsText(file, "UTF-8");
  });
  resetButton.addEventListener("click", resetProducts);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (loginPassword.value === ADMIN_PASSWORD) {
    loginScreen.classList.add("is-hidden"); adminContent.classList.remove("is-locked"); if (!adminStarted) initAdmin(); return;
  }
  loginError.textContent = "Senha incorreta. Tente novamente."; loginPassword.select();
});
