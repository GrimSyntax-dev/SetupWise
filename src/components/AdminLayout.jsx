import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Boxes,
    Megaphone,
    Store,
    LogOut,
    ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../assets/css/Layout.css";
import "../assets/css/Admin.css";

const navItems = [
    { to: "/admin", label: "Resumen", icon: LayoutDashboard, end: true },
    { to: "/admin/inventario", label: "Inventario", icon: Boxes },
    { to: "/admin/anuncios", label: "Anuncios", icon: Megaphone }
];

function AdminLayout() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
        navigate("/", { replace: true });
    };

    return (
        <div className="app-shell">
            {/* ---------- Sidebar ---------- */}
            <aside className="sidebar">
                <Link to="/admin" className="sidebar-brand" aria-label="SetupWise, panel de administrador">
                    <img src="/images/logo-setupwise.png" alt="" />
                    <span>
                        Setup<span className="brand-accent">Wise</span>
                    </span>
                </Link>

                <nav className="sidebar-nav" aria-label="Administración">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                "nav-link" + (isActive ? " active" : "")
                            }
                        >
                            <Icon size={24} strokeWidth={1.6} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="adm-side-foot">
                    <Link to="/" className="nav-link">
                        <Store size={24} strokeWidth={1.6} />
                        <span>Ver la tienda</span>
                    </Link>
                </div>
            </aside>

            {/* ---------- Contenido ---------- */}
            <div className="app-main">
                <header className="topbar">
                    <span className="adm-badge">
                        <ShieldCheck size={16} />
                        Panel de administrador
                    </span>

                    <div className="topbar-actions">
                        <span className="adm-user">{user?.fullName}</span>

                        <Link to="/" className="adm-btn ghost adm-hide-mobile">
                            <Store size={16} />
                            Ver tienda
                        </Link>

                        <button type="button" className="adm-btn ghost" onClick={handleSignOut}>
                            <LogOut size={16} />
                            Cerrar sesión
                        </button>
                    </div>
                </header>

                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;