import { createContext, useContext, useEffect, useState } from "react";
import { useInventory } from "./InventoryContext";

// Favoritos y carrito compartidos por toda la app.
// Se guardan en el navegador; luego se pueden sincronizar con el backend.

const StoreContext = createContext(null);

const FAVORITES_KEY = "setupwise_favorites";
const CART_KEY = "setupwise_cart";

function read(key) {
    try {
        const raw = localStorage.getItem(key);
        const value = raw ? JSON.parse(raw) : [];
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* sin almacenamiento disponible */
    }
}

export function StoreProvider({ children }) {
    const { getProduct } = useInventory();

    const [favorites, setFavorites] = useState(() => read(FAVORITES_KEY));
    const [cart, setCart] = useState(() => read(CART_KEY));

    useEffect(() => write(FAVORITES_KEY, favorites), [favorites]);
    useEffect(() => write(CART_KEY, cart), [cart]);

    /* ---------- Favoritos ---------- */

    const isFavorite = (id) => favorites.includes(id);

    const toggleFavorite = (id) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    /* ---------- Carrito ---------- */

    const quantityInCart = (id) => cart.find((item) => item.id === id)?.qty ?? 0;

    const addToCart = (id) => {
        const product = getProduct(id);
        if (!product || product.stock === 0) return;

        setCart((prev) => {
            const current = prev.find((item) => item.id === id);

            if (!current) return [...prev, { id, qty: 1 }];
            if (current.qty >= product.stock) return prev;

            return prev.map((item) =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            );
        });
    };

    const setQuantity = (id, qty) => {
        const product = getProduct(id);
        if (!product) return;

        if (qty < 1) {
            setCart((prev) => prev.filter((item) => item.id !== id));
            return;
        }

        const safeQty = Math.min(qty, product.stock);
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, qty: safeQty } : item))
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCart([]);

    // Se descartan ids que ya no existen en el catálogo
    const cartItems = cart
        .map((item) => ({ product: getProduct(item.id), qty: item.qty }))
        .filter((item) => item.product);

    const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    return (
        <StoreContext.Provider
            value={{
                favorites,
                isFavorite,
                toggleFavorite,
                cartItems,
                cartCount,
                cartTotal,
                quantityInCart,
                addToCart,
                setQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);

    if (!context) {
        throw new Error("useStore debe usarse dentro de StoreProvider");
    }

    return context;
}