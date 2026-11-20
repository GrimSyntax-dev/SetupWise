import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Heart,
    ShoppingCart,
    Check,
    AlertTriangle,
    CalendarDays,
    Save
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useInventory } from "../context/InventoryContext";
import "../assets/css/Catalog.css";
import "../assets/css/Account.css";

const TABS = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "favoritos", label: "Favoritos", icon: Heart },
    { id: "seguridad", label: "Seguridad", icon: Lock }
];

function formatMemberSince(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
}

/* ---------- Pestaña: Perfil ---------- */

function ProfileTab() {
    const { user, updateUser } = useAuth();

    const [form, setForm] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setStatus(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.fullName.trim().length < 2) {
            setStatus({ type: "error", text: "Ingresa tu nombre completo." });
            return;
        }

        // Pendiente: enviar los cambios al backend.
        updateUser({
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            city: form.city.trim()
        });
        setStatus({ type: "ok", text: "Cambios guardados." });
    };

    return (
        <form className="account-form" onSubmit={handleSubmit}>
            <div className="account-field">
                <label htmlFor="fullName">Nombre completo *</label>
                <div className="account-input">
                    <User size={18} />
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                    />
                </div>
            </div>

            <div className="account-field">
                <label htmlFor="email">Correo electrónico *</label>
                <div className="account-input">
                    <Mail size={18} />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                </div>
            </div>

            <div className="account-field-row">
                <div className="account-field">
                    <label htmlFor="phone">Teléfono</label>
                    <div className="account-input">
                        <Phone size={18} />
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Opcional"
                            value={form.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                        />
                    </div>
                </div>

                <div className="account-field">
                    <label htmlFor="city">Ciudad</label>
                    <div className="account-input">
                        <MapPin size={18} />
                        <input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Opcional"
                            value={form.city}
                            onChange={handleChange}
                            autoComplete="address-level2"
                        />
                    </div>
                </div>
            </div>

            {status && (
                <p className={"account-status " + status.type} role="status">
                    {status.type === "ok" ? <Check size={16} /> : <AlertTriangle size={16} />}
                    {status.text}
                </p>
            )}

            <button type="submit" className="account-submit">
                <Save size={18} />
                Guardar cambios
            </button>
        </form>
    );
}

/* ---------- Pestaña: Favoritos ---------- */

function FavoritesTab() {
    const { favorites } = useStore();
    const { getProduct } = useInventory();
    const items = favorites.map(getProduct).filter(Boolean);

    if (items.length === 0) {
        return (
            <div className="account-empty">
                <Heart size={44} strokeWidth={1.3} />
                <p>Aún no tienes productos favoritos</p>
                <small>Toca el corazón de un producto del catálogo para guardarlo aquí.</small>
                <Link to="/catalogo" className="account-link">
                    Explorar el catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="product-grid account-grid">
            {items.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

/* ---------- Pestaña: Seguridad ---------- */

function SecurityTab() {
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setStatus(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.next.length < 8) {
            setStatus({ type: "error", text: "La nueva contraseña debe tener al menos 8 caracteres." });
            return;
        }

        if (form.next !== form.confirm) {
            setStatus({ type: "error", text: "Las contraseñas no coinciden." });
            return;
        }

        // Pendiente: validar la contraseña actual y cambiarla en el backend.
        setForm({ current: "", next: "", confirm: "" });
        setStatus({
            type: "ok",
            text: "Datos válidos. El cambio se aplicará cuando se conecte el servidor."
        });
    };

    return (
        <form className="account-form" onSubmit={handleSubmit}>
            <div className="account-field">
                <label htmlFor="current">Contraseña actual *</label>
                <div className="account-input">
                    <Lock size={18} />
                    <input
                        id="current"
                        name="current"
                        type="password"
                        value={form.current}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                </div>
            </div>

            <div className="account-field">
                <label htmlFor="next">Nueva contraseña *</label>
                <div className="account-input">
                    <Lock size={18} />
                    <input
                        id="next"
                        name="next"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={form.next}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>
            </div>

            <div className="account-field">
                <label htmlFor="confirm">Confirmar nueva contraseña *</label>
                <div className="account-input">
                    <Lock size={18} />
                    <input
                        id="confirm"
                        name="confirm"
                        type="password"
                        value={form.confirm}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>
            </div>

            {status && (
                <p className={"account-status " + status.type} role="status">
                    {status.type === "ok" ? <Check size={16} /> : <AlertTriangle size={16} />}
                    {status.text}
                </p>
            )}

            <button type="submit" className="account-submit">
                <Lock size={18} />
                Cambiar contraseña
            </button>
        </form>
    );
}

/* ---------- Página ---------- */

function Account() {
    const { user } = useAuth();
    const { favorites, cartCount } = useStore();
    const [params, setParams] = useSearchParams();

    const requested = params.get("tab");
    const tab = TABS.some((t) => t.id === requested) ? requested : "perfil";

    const memberSince = formatMemberSince(user.memberSince);
    const initial = user.fullName.trim().charAt(0).toUpperCase() || "U";

    return (
        <main className="account">
            <section className="account-hero">
                <h1>
                    Mi <span className="gradient-text">cuenta</span>
                </h1>
                <p>Administra tus datos, tus favoritos y la seguridad de tu cuenta.</p>
            </section>

            <div className="account-layout">
                {/* ---------- Tarjeta de perfil ---------- */}
                <aside className="profile-card">
                    <span className="profile-avatar" aria-hidden="true">
                        {initial}
                    </span>

                    <h2>{user.fullName}</h2>
                    {user.email && <p className="profile-email">{user.email}</p>}

                    {memberSince && (
                        <p className="profile-since">
                            <CalendarDays size={15} />
                            Miembro desde {memberSince}
                        </p>
                    )}

                    <dl className="profile-stats">
                        <div>
                            <dt>
                                <Heart size={16} />
                                Favoritos
                            </dt>
                            <dd>{favorites.length}</dd>
                        </div>
                        <div>
                            <dt>
                                <ShoppingCart size={16} />
                                En el carrito
                            </dt>
                            <dd>{cartCount}</dd>
                        </div>
                    </dl>
                </aside>

                {/* ---------- Contenido ---------- */}
                <section className="account-content">
                    <div className="account-tabs" role="tablist">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={tab === id}
                                className={tab === id ? "active" : ""}
                                onClick={() => setParams(id === "perfil" ? {} : { tab: id })}
                            >
                                <Icon size={18} />
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="account-panel">
                        {tab === "perfil" && <ProfileTab />}
                        {tab === "favoritos" && <FavoritesTab />}
                        {tab === "seguridad" && <SecurityTab />}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Account;