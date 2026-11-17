import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
    Search,
    Heart,
    ShoppingCart,
    User,
    ChevronDown,
    Home,
    ShoppingBag,
    Scale,
    Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { FavoritesPopover, CartPopover, UserPopover } from "./TopbarPopovers";
import "../assets/css/Layout.css";
import "../assets/css/TopbarMenus.css";

// El catálogo es la página principal ("/")
const navItems = [
    { to: "/inicio", label: "Inicio", icon: Home },
    { to: "/", label: "Catálogo", icon: ShoppingBag },
    { to: "/comparar", label: "Comparar", icon: Scale },
    { to: "/crear-setup", label: "Crear Setup", icon: Settings },
    { to: "/cuenta", label: "Mi cuenta", icon: User }
];

function Layout() {
    const { user, isLoggedIn } = useAuth();
    const { favorites, cartCount } = useStore();

    const [search, setSearch] = useState("");

    // Menú abierto: "favorites" | "cart" | "user" | null
    const [menu, setMenu] = useState(null);
    const actionsRef = useRef(null);

    const toggleMenu = (name) => setMenu(menu === name ? null : name);
    const closeMenu = () => setMenu(null);

    // Cierra el menú al hacer clic fuera o al presionar Escape
    useEffect(() => {
        if (!menu) return;

        const handlePointer = (e) => {
            if (actionsRef.current && !actionsRef.current.contains(e.target)) {
                setMenu(null);
            }
        };

        const handleKey = (e) => {
            if (e.key === "Escape") setMenu(null);
        };

        document.addEventListener("mousedown", handlePointer);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handlePointer);
            document.removeEventListener("keydown", handleKey);
        };
    }, [menu]);

    const firstName = user?.fullName?.trim().split(" ")[0] || "Usuario";

    return (
        <div className="app-shell">
            {/* ---------- Sidebar ---------- */}
            <aside className="sidebar">
                <Link to="/" className="sidebar-brand" aria-label="SetupWise, ir al catálogo">
                    <img src="/images/logo-setupwise.png" alt="" />
                    <span>
                        Setup<span className="brand-accent">Wise</span>
                    </span>
                </Link>

                <nav className="sidebar-nav" aria-label="Navegación principal">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end
                            className={({ isActive }) =>
                                "nav-link" + (isActive ? " active" : "")
                            }
                        >
                            <Icon size={24} strokeWidth={1.6} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-promo">
                    <h3>Tu setup ideal empieza aquí</h3>
                    <p>Encuentra los mejores productos gamer al mejor precio.</p>
                    <span className="promo-line"></span>
                </div>
            </aside>

            {/* ---------- Contenido ---------- */}
            <div className="app-main">
                <header className="topbar">
                    <label className="topbar-search">
                        <Search size={20} />
                        <input
                            type="search"
                            placeholder="Buscar productos, marcas, categorías..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>

                    <div className="topbar-actions" ref={actionsRef}>
                        {/* Favoritos */}
                        <div className="menu-anchor">
                            <button
                                type="button"
                                className={
                                    "icon-button" + (favorites.length > 0 ? " has-items" : "")
                                }
                                aria-label="Favoritos"
                                aria-haspopup="dialog"
                                aria-expanded={menu === "favorites"}
                                onClick={() => toggleMenu("favorites")}
                            >
                                <Heart
                                    size={24}
                                    strokeWidth={1.6}
                                    fill={favorites.length > 0 ? "currentColor" : "none"}
                                />
                            </button>

                            {menu === "favorites" && <FavoritesPopover onClose={closeMenu} />}
                        </div>

                        {/* Carrito */}
                        <div className="menu-anchor">
                            <button
                                type="button"
                                className="icon-button"
                                aria-label={`Carrito, ${cartCount} productos`}
                                aria-haspopup="dialog"
                                aria-expanded={menu === "cart"}
                                onClick={() => toggleMenu("cart")}
                            >
                                <ShoppingCart size={24} strokeWidth={1.6} />
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </button>

                            {menu === "cart" && <CartPopover onClose={closeMenu} />}
                        </div>

                        <span className="topbar-separator"></span>

                        {/* Cuenta: menú si hay sesión, botones si es visitante */}
                        {isLoggedIn && user ? (
                            <div className="menu-anchor">
                                <button
                                    type="button"
                                    className="user-menu"
                                    aria-haspopup="menu"
                                    aria-expanded={menu === "user"}
                                    onClick={() => toggleMenu("user")}
                                >
                                    <span className="user-avatar">
                                        <User size={22} strokeWidth={1.6} />
                                    </span>
                                    <span className="user-name">{firstName}</span>
                                    <ChevronDown size={18} />
                                </button>

                                {menu === "user" && <UserPopover onClose={closeMenu} />}
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="auth-link">
                                    Iniciar sesión
                                </Link>
                                <Link to="/registro" className="auth-cta">
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                <Outlet context={{ search }} />
            </div>
        </div>
    );
}

export default Layout;