import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
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
import "../assets/css/Layout.css";

const navItems = [
    { to: "/home", label: "Inicio", icon: Home },
    { to: "/catalogo", label: "Catálogo", icon: ShoppingBag },
    { to: "/comparar", label: "Comparar", icon: Scale },
    { to: "/crear-setup", label: "Crear Setup", icon: Settings },
    { to: "/cuenta", label: "Mi cuenta", icon: User }
];

function Layout() {
    const [search, setSearch] = useState("");

    // Pendiente: tomar estos datos del usuario autenticado y del carrito.
    const userName = "Esau";
    const cartCount = 2;

    return (
        <div className="app-shell">
            {/* ---------- Sidebar ---------- */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <img src="/images/logo-setupwise.png" alt="" />
                    <span>
                        Setup<span className="brand-accent">Wise</span>
                    </span>
                </div>

                <nav className="sidebar-nav" aria-label="Navegación principal">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
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

                    <div className="topbar-actions">
                        <button type="button" className="icon-button" aria-label="Favoritos">
                            <Heart size={24} strokeWidth={1.6} />
                        </button>

                        <button type="button" className="icon-button" aria-label="Carrito">
                            <ShoppingCart size={24} strokeWidth={1.6} />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </button>

                        <span className="topbar-separator"></span>

                        <button type="button" className="user-menu">
                            <span className="user-avatar">
                                <User size={22} strokeWidth={1.6} />
                            </span>
                            <span className="user-name">{userName}</span>
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </header>

                <Outlet context={{ search }} />
            </div>
        </div>
    );
}

export default Layout;