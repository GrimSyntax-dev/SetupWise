import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as seedProducts } from "../data/products";
import { componentProducts as seedComponents } from "../data/builder";
import { ads as seedAds } from "../data/ads";

// Inventario compartido: productos del catálogo, componentes y anuncios.
//
// Por ahora vive en el navegador (localStorage) y se sincroniza entre pestañas, así
// que si el administrador cambia el stock en una pestaña, la tienda abierta en otra
// se actualiza sola. Cuando exista el backend, estas funciones llaman a la API y la
// sincronización pasa a ser por WebSocket; las pantallas no cambian.

const KEY = "setupwise_inventory_v1";

const InventoryContext = createContext(null);

const createSeed = () => ({
    products: seedProducts,
    components: seedComponents,
    ads: seedAds
});

const isValid = (data) =>
    data &&
    Array.isArray(data.products) &&
    Array.isArray(data.components) &&
    Array.isArray(data.ads);

function load() {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
            const data = JSON.parse(raw);
            if (isValid(data)) return data;
        }
    } catch {
        /* se usan los datos de ejemplo */
    }

    return createSeed();
}

const nextId = (items) => items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

export function InventoryProvider({ children }) {
    const [data, setData] = useState(load);

    // Guarda cada cambio
    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch {
            /* sin almacenamiento disponible */
        }
    }, [data]);

    // Recibe los cambios hechos en otras pestañas
    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key !== KEY || !event.newValue) return;

            try {
                const incoming = JSON.parse(event.newValue);
                if (isValid(incoming)) setData(incoming);
            } catch {
                /* se ignora un valor dañado */
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const allProducts = useMemo(
        () => [...data.products, ...data.components],
        [data.products, data.components]
    );

    const byId = useMemo(
        () => new Map(allProducts.map((p) => [p.id, p])),
        [allProducts]
    );

    const getProduct = (id) => byId.get(id);

    /* ---------- Stock y productos ---------- */

    const updateStock = (id, stock) => {
        const safe = Math.max(0, Math.floor(Number(stock) || 0));
        const apply = (list) => list.map((p) => (p.id === id ? { ...p, stock: safe } : p));

        setData((prev) => ({
            ...prev,
            products: apply(prev.products),
            components: apply(prev.components)
        }));
    };

    // Crea o actualiza. Los componentes llevan "type"; los del catálogo, "category".
    const saveProduct = (item) => {
        const target = item.type ? "components" : "products";
        const other = target === "components" ? "products" : "components";

        setData((prev) => {
            const id = item.id ?? nextId([...prev.products, ...prev.components]);
            const saved = { ...item, id };
            const exists = prev[target].some((p) => p.id === id);

            return {
                ...prev,
                [target]: exists
                    ? prev[target].map((p) => (p.id === id ? saved : p))
                    : [...prev[target], saved],
                [other]: prev[other].filter((p) => p.id !== id)
            };
        });
    };

    const deleteProduct = (id) => {
        setData((prev) => ({
            ...prev,
            products: prev.products.filter((p) => p.id !== id),
            components: prev.components.filter((p) => p.id !== id)
        }));
    };

    /* ---------- Anuncios ---------- */

    const saveAd = (ad) => {
        setData((prev) => {
            const id = ad.id ?? nextId(prev.ads);
            const saved = { ...ad, id };
            const exists = prev.ads.some((a) => a.id === id);

            return {
                ...prev,
                ads: exists
                    ? prev.ads.map((a) => (a.id === id ? saved : a))
                    : [...prev.ads, saved]
            };
        });
    };

    const deleteAd = (id) => {
        setData((prev) => ({ ...prev, ads: prev.ads.filter((a) => a.id !== id) }));
    };

    const resetInventory = () => setData(createSeed());

    return (
        <InventoryContext.Provider
            value={{
                products: data.products,
                components: data.components,
                ads: data.ads,
                allProducts,
                getProduct,
                updateStock,
                saveProduct,
                deleteProduct,
                saveAd,
                deleteAd,
                resetInventory
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);

    if (!context) {
        throw new Error("useInventory debe usarse dentro de InventoryProvider");
    }

    return context;
}