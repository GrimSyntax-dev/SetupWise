import { categories } from "../data/products";
import { builderCategories } from "../data/builder";

// A partir de esta cantidad un producto se considera con "stock bajo"
export const LOW_STOCK = 5;

export const COMPONENT_TYPES = ["cpu", "mobo", "ram", "gpu", "storage", "psu"];

export function getStockLevel(stock) {
    if (stock === 0) return "out";
    if (stock <= LOW_STOCK) return "low";
    return "ok";
}

export const STOCK_LABELS = {
    ok: "Disponible",
    low: "Stock bajo",
    out: "Agotado"
};

// Los productos del catálogo usan "category" y los componentes usan "type"
export const getCategoryKey = (product) => product.type ?? product.category;

export const catalogCategoryOptions = categories
    .filter((c) => c.id !== "todos")
    .map((c) => ({ value: c.id, label: c.label }));

export const componentCategoryOptions = builderCategories
    .filter((c) => c.group === "components")
    .map((c) => ({ value: c.id, label: c.label }));

export function getCategoryLabel(key) {
    const all = [...catalogCategoryOptions, ...componentCategoryOptions];
    return all.find((option) => option.value === key)?.label ?? key;
}

// Para buscar sin importar mayúsculas ni tildes
export function normalize(text) {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}