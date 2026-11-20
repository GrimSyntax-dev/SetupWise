import { Link, useNavigate } from "react-router-dom";
import {
    Heart,
    ShoppingCart,
    Trash2,
    Minus,
    Plus,
    X,
    User,
    Repeat,
    LogOut,
    ShieldCheck
} from "lucide-react";
import SafeImage from "./SafeImage";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useInventory } from "../context/InventoryContext";
import { formatPrice } from "../utils/formatPrice";

/* ========================================
   FAVORITOS
======================================== */

export function FavoritesPopover({ onClose }) {
    const { favorites, toggleFavorite, addToCart, quantityInCart } = useStore();
    const { getProduct } = useInventory();

    const items = favorites.map(getProduct).filter(Boolean);

    return (
        <div className="popover" role="dialog" aria-label="Favoritos">
            <header className="popover-header">
                <Heart size={18} />
                <h2>Favoritos</h2>
                <span className="popover-count">{items.length}</span>
            </header>

            {items.length === 0 ? (
                <div className="popover-empty">
                    <Heart size={34} strokeWidth={1.3} />
                    <p>Aún no tienes favoritos</p>
                    <small>Toca el corazón de un producto para guardarlo aquí.</small>
                </div>
            ) : (
                <ul className="popover-list">
                    {items.map((product) => {
                        const cannotAdd =
                            product.stock === 0 || quantityInCart(product.id) >= product.stock;

                        return (
                            <li key={product.id} className="pop-item">
                                <span className="pop-thumb">
                                    <SafeImage src={product.image} alt="" size={20} />
                                </span>

                                <div className="pop-info">
                                    <strong>{product.name}</strong>
                                    <span>{formatPrice(product.price)}</span>
                                </div>

                                <button
                                    type="button"
                                    className="pop-icon-btn"
                                    aria-label={`Agregar ${product.name} al carrito`}
                                    disabled={cannotAdd}
                                    onClick={() => addToCart(product.id)}
                                >
                                    <ShoppingCart size={16} />
                                </button>

                                <button
                                    type="button"
                                    className="pop-icon-btn danger"
                                    aria-label={`Quitar ${product.name} de favoritos`}
                                    onClick={() => toggleFavorite(product.id)}
                                >
                                    <X size={16} />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            <footer className="popover-footer">
                <Link to="/cuenta?tab=favoritos" onClick={onClose} className="popover-link">
                    Ver todos en Mi cuenta
                </Link>
            </footer>
        </div>
    );
}

/* ========================================
   CARRITO
======================================== */

export function CartPopover({ onClose }) {
    const { cartItems, cartCount, cartTotal, setQuantity, removeFromCart, clearCart } =
        useStore();

    return (
        <div className="popover" role="dialog" aria-label="Carrito">
            <header className="popover-header">
                <ShoppingCart size={18} />
                <h2>Carrito</h2>
                <span className="popover-count">{cartCount}</span>
            </header>

            {cartItems.length === 0 ? (
                <div className="popover-empty">
                    <ShoppingCart size={34} strokeWidth={1.3} />
                    <p>Tu carrito está vacío</p>
                    <small>Agrega productos desde el catálogo.</small>
                    <Link to="/catalogo" onClick={onClose} className="popover-link">
                        Ir al catálogo
                    </Link>
                </div>
            ) : (
                <>
                    <ul className="popover-list">
                        {cartItems.map(({ product, qty }) => (
                            <li key={product.id} className="pop-item">
                                <span className="pop-thumb">
                                    <SafeImage src={product.image} alt="" size={20} />
                                </span>

                                <div className="pop-info">
                                    <strong>{product.name}</strong>
                                    <span>{formatPrice(product.price * qty)}</span>

                                    <div className="qty">
                                        <button
                                            type="button"
                                            aria-label="Disminuir cantidad"
                                            onClick={() => setQuantity(product.id, qty - 1)}
                                        >
                                            <Minus size={13} />
                                        </button>
                                        <span aria-live="polite">{qty}</span>
                                        <button
                                            type="button"
                                            aria-label="Aumentar cantidad"
                                            disabled={qty >= product.stock}
                                            onClick={() => setQuantity(product.id, qty + 1)}
                                        >
                                            <Plus size={13} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="pop-icon-btn danger"
                                    aria-label={`Quitar ${product.name} del carrito`}
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <footer className="popover-footer cart-footer">
                        <div className="cart-total">
                            <span>Total estimado</span>
                            <strong>{formatPrice(cartTotal)}</strong>
                        </div>

                        <button type="button" className="clear-cart" onClick={clearCart}>
                            Vaciar carrito
                        </button>
                    </footer>
                </>
            )}
        </div>
    );
}

/* ========================================
   CUENTA
======================================== */

export function UserPopover({ onClose }) {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        onClose();
        signOut();
        navigate("/", { replace: true });
    };

    // Cierra la sesión y olvida la cuenta guardada para entrar con otra
    const handleSwitch = () => {
        onClose();
        signOut({ forget: true });
        navigate("/login", { replace: true });
    };

    return (
        <div className="popover user-popover" role="menu" aria-label="Cuenta">
            <div className="user-popover-head">
                <span className="user-avatar">
                    <User size={22} strokeWidth={1.6} />
                </span>

                <div>
                    <strong>{user.fullName}</strong>
                    {user.email && <span>{user.email}</span>}
                </div>
            </div>

            <Link to="/cuenta" role="menuitem" className="menu-item" onClick={onClose}>
                <User size={18} />
                Ver mi cuenta
            </Link>

            {user.role === "admin" && (
                <Link to="/admin" role="menuitem" className="menu-item" onClick={onClose}>
                    <ShieldCheck size={18} />
                    Panel de administrador
                </Link>
            )}

            <button type="button" role="menuitem" className="menu-item" onClick={handleSwitch}>
                <Repeat size={18} />
                Cambiar cuenta
            </button>

            <button
                type="button"
                role="menuitem"
                className="menu-item danger"
                onClick={handleSignOut}
            >
                <LogOut size={18} />
                Cerrar sesión
            </button>
        </div>
    );
}