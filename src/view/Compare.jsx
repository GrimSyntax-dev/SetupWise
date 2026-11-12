import { useState } from "react";
import {
    Scale,
    Package,
    Plus,
    X,
    BarChart3,
    Trophy,
    Bookmark,
    Check,
    Minus,
    Star,
    StarHalf,
    ImageOff,
    Tag
} from "lucide-react";
import { products } from "../data/products";
import { compareSpecs, specsById } from "../data/compareSpecs";
import { formatPrice } from "../utils/formatPrice";
import "../assets/css/Compare.css";

const MAX_PRODUCTS = 3;

/* ---------- Utilidades ---------- */

function SafeImage({ src, alt }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span className="img-fallback" aria-hidden="true">
                <ImageOff size={28} strokeWidth={1.2} />
            </span>
        );
    }

    return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function Stars({ rating }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;

    return (
        <span className="stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => {
                if (i <= full) return <Star key={i} size={17} fill="currentColor" />;
                if (i === full + 1 && half) return <StarHalf key={i} size={17} fill="currentColor" />;
                return <Star key={i} size={17} className="star-empty" />;
            })}
        </span>
    );
}

function formatReviews(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function displayValue(spec, value) {
    if (typeof value === "boolean") return value ? "Sí" : "No";
    return spec.format ? spec.format(value) : value;
}

function joinReasons(list) {
    if (list.length <= 1) return list[0] ?? "";
    return list.slice(0, -1).join(", ") + " y " + list[list.length - 1];
}

// Elige el producto con más "victorias" (mejor precio y mejores especificaciones).
function getRecommendation(items, specs) {
    if (items.length < 2) return null;

    const wins = new Map(items.map((p) => [p.id, []]));

    const award = (valueOf, better, label) => {
        const values = items.map(valueOf);
        if (values.some((v) => typeof v !== "number")) return;

        const best = better === "high" ? Math.max(...values) : Math.min(...values);
        const winners = items.filter((_, i) => values[i] === best);

        if (winners.length === 1) wins.get(winners[0].id).push(label);
    };

    award((p) => p.price, "low", "mejor precio");
    specs
        .filter((s) => s.better)
        .forEach((s) => award((p) => specsById[p.id][s.key], s.better, s.win));

    const ranked = [...items].sort(
        (a, b) => wins.get(b.id).length - wins.get(a.id).length || a.price - b.price
    );

    const winner = ranked[0];
    const reasons = wins.get(winner.id);
    const text = reasons.length
        ? joinReasons(reasons)
        : "mejor equilibrio entre precio y características";

    return { product: winner, reason: text.charAt(0).toUpperCase() + text.slice(1) + "." };
}

/* ---------- Página ---------- */

function Compare() {
    // Selección inicial de ejemplo (Logitech G502 y Razer DeathAdder V3)
    const [selectedIds, setSelectedIds] = useState([10, 2]);
    const [picking, setPicking] = useState(false);
    const [saved, setSaved] = useState(false);

    const selected = selectedIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);

    const category = selected[0]?.category;
    const specs = category ? compareSpecs[category] : [];

    // Solo se pueden comparar productos de la misma categoría y con especificaciones
    const candidates = products.filter(
        (p) =>
            specsById[p.id] &&
            !selectedIds.includes(p.id) &&
            (!category || p.category === category)
    );

    const recommendation = getRecommendation(selected, specs);
    const summarySpecs = specs.filter((s) => s.summary);

    const add = (id) => {
        setSelectedIds([...selectedIds, id]);
        setPicking(false);
        setSaved(false);
    };

    const remove = (id) => {
        setSelectedIds(selectedIds.filter((x) => x !== id));
        setSaved(false);
    };

    const handleSave = () => {
        // Pendiente: guardar la comparación en la base de datos.
        setSaved(true);
    };

    return (
        <main className="compare">
            {/* ---------- Banner ---------- */}
            <section className="compare-hero">
                <div className="compare-hero-title">
                    <Scale size={58} strokeWidth={1.3} />
                    <h1>
                        Comparador <span className="gradient-text">de productos</span>
                    </h1>
                </div>
                <p>Compara características y precios para elegir el mejor setup.</p>
            </section>

            <div className="compare-grid">
                {/* ---------- Productos seleccionados ---------- */}
                <section className="compare-panel selected-panel">
                    <header className="panel-header">
                        <Package size={30} strokeWidth={1.5} />
                        <h2>Productos seleccionados</h2>
                        <span className="count-badge">
                            {selected.length}/{MAX_PRODUCTS}
                        </span>
                    </header>

                    <ul className="selected-list">
                        {selected.map((p) => (
                            <li key={p.id} className="selected-item">
                                <span className="selected-thumb">
                                    <SafeImage src={p.image} alt="" />
                                </span>

                                <div className="selected-info">
                                    <strong>{p.name}</strong>
                                    <span>{formatPrice(p.price)}</span>
                                </div>

                                <button
                                    type="button"
                                    className="remove-plain"
                                    aria-label={`Quitar ${p.name}`}
                                    onClick={() => remove(p.id)}
                                >
                                    <X size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="add-product"
                        disabled={selected.length >= MAX_PRODUCTS}
                        aria-expanded={picking}
                        onClick={() => setPicking(!picking)}
                    >
                        <Plus size={24} />
                        {selected.length >= MAX_PRODUCTS
                            ? "Máximo 3 productos"
                            : "Agregar producto"}
                    </button>

                    {picking && (
                        <div className="picker">
                            {candidates.length > 0 ? (
                                <ul>
                                    {candidates.map((p) => (
                                        <li key={p.id}>
                                            <button type="button" onClick={() => add(p.id)}>
                                                <span className="selected-thumb small">
                                                    <SafeImage src={p.image} alt="" />
                                                </span>
                                                <span className="picker-name">{p.name}</span>
                                                <span className="picker-price">
                                                    {formatPrice(p.price)}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="picker-empty">
                                    No hay más productos comparables en esta categoría.
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* ---------- Tarjetas de producto ---------- */}
                <div className="compare-cards">
                    {selected.length === 0 && (
                        <div className="compare-empty">
                            <Scale size={46} strokeWidth={1.2} />
                            <p>Agrega productos para compararlos</p>
                            <small>Puedes elegir hasta 3 de la misma categoría.</small>
                        </div>
                    )}

                    {selected.map((p) => (
                        <article key={p.id} className="compare-card">
                            <button
                                type="button"
                                className="remove-circle"
                                aria-label={`Quitar ${p.name}`}
                                onClick={() => remove(p.id)}
                            >
                                <X size={17} />
                            </button>

                            <div className="compare-card-media">
                                <SafeImage src={p.image} alt={p.name} />
                            </div>

                            <h3>{p.name}</h3>
                            <p className="compare-price">{formatPrice(p.price)}</p>

                            <div className="compare-rating">
                                <Stars rating={p.rating} />
                                <span>
                                    {p.rating} ({formatReviews(p.reviews)} reseñas)
                                </span>
                            </div>

                            <dl className="spec-table">
                                {specs.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <div key={s.key} className="spec-row">
                                            <dt>
                                                <Icon size={18} strokeWidth={1.6} />
                                                {s.label}
                                            </dt>
                                            <dd>{displayValue(s, specsById[p.id][s.key])}</dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        </article>
                    ))}
                </div>

                {/* ---------- Resumen ---------- */}
                <aside className="compare-panel summary-panel">
                    <header className="panel-header">
                        <BarChart3 size={30} strokeWidth={1.8} />
                        <h2>Resumen de comparación</h2>
                    </header>

                    {selected.length < 2 ? (
                        <p className="summary-empty">
                            Selecciona al menos 2 productos para ver la comparación.
                        </p>
                    ) : (
                        <>
                            <div className="summary-products">
                                {selected.map((p, i) => (
                                    <div key={p.id} className="summary-product">
                                        {i > 0 && <span className="vs">VS</span>}
                                        <span className="summary-thumb">
                                            <SafeImage src={p.image} alt={p.name} />
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="summary-table"
                                style={{ "--cols": selected.length }}
                            >
                                <div className="summary-row">
                                    <span className="summary-label">
                                        <Tag size={18} strokeWidth={1.6} />
                                        Precio
                                    </span>
                                    {selected.map((p) => (
                                        <span key={p.id} className="summary-value">
                                            {formatPrice(p.price)}
                                        </span>
                                    ))}
                                </div>

                                {summarySpecs.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <div key={s.key} className="summary-row">
                                            <span className="summary-label">
                                                <Icon size={18} strokeWidth={1.6} />
                                                {s.label}
                                            </span>

                                            {selected.map((p) => {
                                                const value = specsById[p.id][s.key];

                                                return (
                                                    <span key={p.id} className="summary-value">
                                                        {typeof value === "boolean" ? (
                                                            value ? (
                                                                <Check
                                                                    size={18}
                                                                    className="yes"
                                                                    aria-label="Sí"
                                                                />
                                                            ) : (
                                                                <Minus
                                                                    size={18}
                                                                    className="no"
                                                                    aria-label="No"
                                                                />
                                                            )
                                                        ) : (
                                                            displayValue(s, value)
                                                        )}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>

                            {recommendation && (
                                <div className="recommended">
                                    <h3>
                                        <Trophy size={24} />
                                        Recomendado
                                    </h3>
                                    <strong>{recommendation.product.name}</strong>
                                    <p>{recommendation.reason}</p>
                                </div>
                            )}

                            <button
                                type="button"
                                className="save-compare"
                                onClick={handleSave}
                                disabled={saved}
                            >
                                {saved ? <Check size={20} /> : <Bookmark size={20} />}
                                {saved ? "Comparación guardada" : "Guardar comparación"}
                            </button>
                        </>
                    )}
                </aside>
            </div>
        </main>
    );
}

export default Compare;