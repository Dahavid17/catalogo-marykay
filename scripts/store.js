const STORAGE_KEY = "makeup_catalog_products";
const CLIENT_PHONE = "5511999999999";

function normalizeProduct(product) {
  const fallbackId = `${product.name || "produto"}-${Date.now()}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: product.id || fallbackId,
    name: product.name?.trim() || "Produto sem nome",
    brand: product.brand?.trim() || "Marca nao informada",
    category: product.category?.trim() || "Outros",
    price: Number(product.price || 0),
    stock: Math.max(0, Number.parseInt(product.stock || 0, 10)),
    image: product.image?.trim() || "",
    description: product.description?.trim() || "Sem descricao cadastrada."
  };
}

async function loadProducts() {
  const storedProducts = localStorage.getItem(STORAGE_KEY);

  if (storedProducts) {
    return JSON.parse(storedProducts).map(normalizeProduct);
  }

  const response = await fetch("data/products.json");
  const products = await response.json();
  saveProducts(products);
  return products.map(normalizeProduct);
}

function saveProducts(products) {
  const normalized = products.map(normalizeProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function buildWhatsAppLink(product) {
  const text = `Ola! Tenho interesse no produto ${product.name}. Ainda tem disponivel?`;
  return `https://wa.me/${CLIENT_PHONE}?text=${encodeURIComponent(text)}`;
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[,"\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function productsToCsv(products) {
  const headers = ["id", "name", "brand", "category", "price", "stock", "image", "description"];
  const rows = products.map((product) => headers.map((header) => csvEscape(product[header])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function parseCsv(csvText) {
  const rows = [];
  let current = "";
  let row = [];
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current || row.length) {
    row.push(current);
    rows.push(row);
  }

  const [headers, ...values] = rows.filter((line) => line.some(Boolean));
  if (!headers) return [];

  return values.map((line) => {
    const product = {};
    headers.forEach((header, index) => {
      product[header.trim()] = line[index];
    });
    return normalizeProduct(product);
  });
}
