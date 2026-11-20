import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Settings,
    Cpu,
    Gamepad2,
    Plus,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    ShoppingCart,
    Monitor,
    Lock,
    ArrowRight,
    AlertTriangle
} from "lucide-react";
import SafeImage from "../components/SafeImage";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";
import {
    builderCategories,
    getOptions,
    getIncompatibility,
    getWarnings
} from "../data/builder";
import { formatPrice } from "../utils/formatPrice";
import "../assets/css/Builder.css";

function Builder() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    const inventory = useInventory();
    const { getProduct } = inventory;

    // selection = { cpu: [101], ram: [121, 121], ... } (ids de productos)
    const [selection, setSelection] = useState({});
    const [openId, setOpenId] = useState(null);
    const [tab, setTab] = useState("components");
    const [saved, setSaved] = useState(false);

    const componentsRef = useRef(null);
    const peripheralsRef = useRef(null);

    // Se descartan los productos que ya no existen (por ejemplo, eliminados por el administrador)
    const itemsOf = (categoryId) =>
        (selection[categoryId] || []).filter((id) => getProduct(id));

    const add = (category, productId) => {
        const next = [...itemsOf(category.id), productId];
        setSelection({ ...selection, [category.id]: next });
        if (next.length >= category.max) setOpenId(null);
        setSaved(false);
    };

    const remove = (categoryId, index) => {
        setSelection({
            ...selection,
            [categoryId]: itemsOf(categoryId).filter((_, i) => i !== index)
        });
        setSaved(false);
    };

    const goToTab = (name) => {
        setTab(name);
        const target = name === "components" ? componentsRef : peripheralsRef;
        target.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleSave = () => {
        // Guardar un setup requiere una cuenta
        if (!isLoggedIn) {
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        // Pendiente: guardar el setup en la base de datos.
        setSaved(true);
    };

    const chosen = builderCategories.flatMap((category) =>
        itemsOf(category.id).map((id, index) => ({
            category,
            index,
            product: getProduct(id)
        }))
    );

    const total = chosen.reduce((sum, item) => sum + item.product.price, 0);
    const warnings = getWarnings(selection, getProduct);

    const renderCategory = (category) => {
        const Icon = category.icon;
        const items = itemsOf(category.id);
        const isOpen = openId === category.id;
        const isFull = items.length >= category.max;

        return (
            <li key={category.id} className="builder-item">
                <div className="builder-row">
                    <span className="row-icon">
                        <Icon size={30} strokeWidth={1.4} />
                    </span>

                    <div className="row-text">
                        <strong>{category.label}</strong>
                        <span>{category.desc}</span>
                    </div>

                    <span className="row-count">
                        {items.length} / {category.max}{" "}
                        {category.max === 1 ? "seleccionado" : "seleccionados"}
                    </span>

                    <button
                        type="button"
                        className="row-toggle"
                        aria-label={isOpen ? "Cerrar opciones" : "Ver opciones"}
                        aria-expanded={isOpen}
                        onClick={() => setOpenId(isOpen ? null : category.id)}
                    >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <button
                        type="button"
                        className={"row-add" + (isFull ? " full" : "")}
                        disabled={isFull}
                        onClick={() => setOpenId(isOpen ? null : category.id)}
                    >
                        {isFull ? <Check size={15} /> : <Plus size={15} />}
                        {isFull ? "Completo" : "Agregar"}
                    </button>
                </div>

                {items.length > 0 && (
                    <ul className="chosen-list">
                        {items.map((id, index) => {
                            const product = getProduct(id);

                            return (
                                <li key={`${category.id}-${index}-${id}`}>
                                    <span className="thumb">
                                        <SafeImage src={product.image} alt="" />
                                    </span>
                                    <span className="chosen-name">{product.name}</span>
                                    <span className="chosen-price">
                                        {formatPrice(product.price)}
                                    </span>
                                    <button
                                        type="button"
                                        className="chosen-remove"
                                        aria-label={`Quitar ${product.name}`}
                                        onClick={() => remove(category.id, index)}
                                    >
                                        <X size={16} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {isOpen && !isFull && (
                    <ul className="options-list">
                        {getOptions(category, inventory).map((product) => {
                            const outOfStock = product.stock === 0;
                            const conflict = outOfStock
                                ? null
                                : getIncompatibility(category.id, product, selection, getProduct);
                            const disabled = outOfStock || Boolean(conflict);

                            let note = null;
                            if (outOfStock) note = { text: "Agotado", level: "out" };
                            else if (conflict) note = { text: conflict, level: "out" };
                            else if (product.stock <= 5)
                                note = { text: `Últimas ${product.stock} unidades`, level: "low" };

                            return (
                                <li key={product.id}>
                                    <button
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => add(category, product.id)}
                                    >
                                        <span className="thumb">
                                            <SafeImage src={product.image} alt="" />
                                        </span>

                                        <span className="option-info">
                                            <strong>{product.name}</strong>
                                            <small>{product.detail || product.brand}</small>
                                        </span>

                                        {note && (
                                            <span className={"option-note " + note.level}>
                                                {note.text}
                                            </span>
                                        )}

                                        <span className="option-price">
                                            {formatPrice(product.price)}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <main className="builder">
            {/* ---------- Banner ---------- */}
            <section className="builder-hero">
                <div className="builder-hero-top">
                    <button type="button" className="back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        Volver
                    </button>

                    <span className="builder-tag">
                        <Settings size={11} />
                        CONFIGURADOR
                    </span>
                </div>

                <h1>
                    Arma tu <span className="gradient-text">PC Pro</span>
                </h1>
                <p>
                    Selecciona los componentes y periféricos que desees para crear tu
                    setup personalizado.
                </p>

                <div className="builder-tabs" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "components"}
                        className={tab === "components" ? "active" : ""}
                        onClick={() => goToTab("components")}
                    >
                        <Cpu size={24} />
                        Componentes
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "peripherals"}
                        className={tab === "peripherals" ? "active" : ""}
                        onClick={() => goToTab("peripherals")}
                    >
                        <Gamepad2 size={24} />
                        Periféricos
                    </button>
                </div>
            </section>

            <div className="builder-layout">
                {/* ---------- Listas ---------- */}
                <div className="builder-lists">
                    <ul className="builder-card" ref={componentsRef}>
                        {builderCategories
                            .filter((c) => c.group === "components")
                            .map(renderCategory)}
                    </ul>

                    <div className="builder-card" ref={peripheralsRef}>
                        <h2 className="builder-card-title">
                            <Gamepad2 size={26} />
                            Periféricos
                        </h2>

                        <ul className="builder-list">
                            {builderCategories
                                .filter((c) => c.group === "peripherals")
                                .map(renderCategory)}
                        </ul>
                    </div>
                </div>

                {/* ---------- Tu Setup ---------- */}
                <aside className="setup-panel">
                    <header className="setup-header">
                        <span className="setup-header-icon">
                            <ShoppingCart size={20} />
                        </span>
                        <h2>Tu Setup</h2>
                    </header>

                    {chosen.length === 0 ? (
                        <div className="setup-empty">
                            <span className="setup-empty-icon">
                                <Monitor size={92} strokeWidth={1.3} />
                                <span className="plus-badge">
                                    <Plus size={18} />
                                </span>
                            </span>

                            <p className="setup-empty-title">
                                Aún no has agregado componentes o periféricos
                            </p>
                            <p className="setup-empty-text">
                                Selecciona los productos del catálogo para comenzar a
                                armar tu setup.
                            </p>
                        </div>
                    ) : (
                        <ul className="setup-items">
                            {chosen.map(({ category, index, product }) => (
                                <li key={`${category.id}-${index}-${product.id}`}>
                                    <span className="thumb">
                                        <SafeImage src={product.image} alt="" />
                                    </span>

                                    <div>
                                        <small>{category.label}</small>
                                        <strong>{product.name}</strong>
                                        <span>{formatPrice(product.price)}</span>
                                    </div>

                                    <button
                                        type="button"
                                        aria-label={`Quitar ${product.name}`}
                                        onClick={() => remove(category.id, index)}
                                    >
                                        <X size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {warnings.length > 0 && (
                        <ul className="setup-warnings" role="status">
                            {warnings.map((text) => (
                                <li key={text}>
                                    <AlertTriangle size={16} />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="setup-total">
                        <span>Total estimado:</span>
                        <strong>{formatPrice(total)}</strong>
                    </div>

                    <button
                        type="button"
                        className="setup-save"
                        disabled={chosen.length === 0 || saved}
                        onClick={handleSave}
                    >
                        {saved ? <Check size={20} /> : <Lock size={20} />}
                        {saved
                            ? "Setup guardado"
                            : isLoggedIn
                              ? "Guardar Setup"
                              : "Inicia sesión para guardar"}
                        {!saved && <ArrowRight size={20} />}
                    </button>
                </aside>
            </div>
        </main>
    );
}

export default Builder;