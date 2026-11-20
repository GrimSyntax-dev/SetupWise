import { Link } from "react-router-dom";
import {
    Package,
    Boxes,
    AlertTriangle,
    PackageX,
    Megaphone,
    Banknote,
    Plus,
    ArrowRight
} from "lucide-react";
import SafeImage from "../../components/SafeImage";
import { useInventory } from "../../context/InventoryContext";
import {
    getStockLevel,
    getCategoryKey,
    getCategoryLabel
} from "../../utils/inventory";
import { getAdStatus, formatDate } from "../../utils/ads";
import { formatPrice } from "../../utils/formatPrice";

function AdminDashboard() {
    const { allProducts, ads, updateStock } = useInventory();

    const units = allProducts.reduce((sum, p) => sum + p.stock, 0);
    const inventoryValue = allProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

    const lowStock = allProducts.filter((p) => getStockLevel(p.stock) === "low");
    const outOfStock = allProducts.filter((p) => getStockLevel(p.stock) === "out");
    const activeAds = ads.filter((ad) => getAdStatus(ad) === "active");

    const needRestock = [...outOfStock, ...lowStock]
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6);

    // Unidades por categoría, para las barras
    const totals = {};
    allProducts.forEach((p) => {
        const key = getCategoryKey(p);
        totals[key] = (totals[key] || 0) + p.stock;
    });

    const byCategory = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const maxUnits = Math.max(1, ...byCategory.map(([, total]) => total));

    const stats = [
        { icon: Package, label: "Productos", value: allProducts.length, tone: "" },
        { icon: Boxes, label: "Unidades en stock", value: units.toLocaleString("en-US"), tone: "" },
        { icon: AlertTriangle, label: "Stock bajo", value: lowStock.length, tone: "low" },
        { icon: PackageX, label: "Agotados", value: outOfStock.length, tone: "out" },
        { icon: Megaphone, label: "Anuncios activos", value: activeAds.length, tone: "" },
        { icon: Banknote, label: "Valor del inventario", value: formatPrice(inventoryValue), tone: "" }
    ];

    return (
        <main className="adm-page">
            <header className="adm-head">
                <div>
                    <h1>
                        Resumen <span className="gradient-text">general</span>
                    </h1>
                    <p>Estado actual del inventario y de los anuncios de la tienda.</p>
                </div>
            </header>

            <section className="adm-stats" aria-label="Estadísticas">
                {stats.map(({ icon: Icon, label, value, tone }) => (
                    <div key={label} className={"adm-stat " + tone}>
                        <span className="adm-stat-icon">
                            <Icon size={22} strokeWidth={1.6} />
                        </span>
                        <div>
                            <span className="adm-stat-label">{label}</span>
                            <strong>{value}</strong>
                        </div>
                    </div>
                ))}
            </section>

            <div className="adm-grid-2">
                {/* ---------- Reposición ---------- */}
                <section className="adm-panel">
                    <header className="adm-panel-head">
                        <h2>Necesitan reposición</h2>
                        <Link to="/admin/inventario" className="adm-link">
                            Ir al inventario
                            <ArrowRight size={15} />
                        </Link>
                    </header>

                    {needRestock.length === 0 ? (
                        <p className="adm-empty">Todo el inventario tiene stock suficiente.</p>
                    ) : (
                        <ul className="adm-list">
                            {needRestock.map((product) => {
                                const level = getStockLevel(product.stock);

                                return (
                                    <li key={product.id}>
                                        <span className="adm-thumb">
                                            <SafeImage src={product.image} alt="" size={20} />
                                        </span>

                                        <div className="adm-list-info">
                                            <strong>{product.name}</strong>
                                            <span>{getCategoryLabel(getCategoryKey(product))}</span>
                                        </div>

                                        <span className={"adm-badge-stock " + level}>
                                            {level === "out" ? "Agotado" : `${product.stock} uds.`}
                                        </span>

                                        <button
                                            type="button"
                                            className="adm-btn small"
                                            aria-label={`Sumar 10 unidades a ${product.name}`}
                                            onClick={() => updateStock(product.id, product.stock + 10)}
                                        >
                                            <Plus size={14} />
                                            10
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                {/* ---------- Stock por categoría ---------- */}
                <section className="adm-panel">
                    <header className="adm-panel-head">
                        <h2>Stock por categoría</h2>
                    </header>

                    <ul className="adm-bars">
                        {byCategory.map(([key, total]) => (
                            <li key={key}>
                                <span className="adm-bar-label">{getCategoryLabel(key)}</span>
                                <span className="adm-bar-track">
                                    <span
                                        className="adm-bar-fill"
                                        style={{ width: `${(total / maxUnits) * 100}%` }}
                                    />
                                </span>
                                <span className="adm-bar-value">{total}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* ---------- Anuncios activos ---------- */}
            <section className="adm-panel">
                <header className="adm-panel-head">
                    <h2>Anuncios activos</h2>
                    <Link to="/admin/anuncios" className="adm-link">
                        Administrar anuncios
                        <ArrowRight size={15} />
                    </Link>
                </header>

                {activeAds.length === 0 ? (
                    <p className="adm-empty">No hay anuncios activos en este momento.</p>
                ) : (
                    <ul className="adm-list">
                        {activeAds.map((ad) => (
                            <li key={ad.id}>
                                <span
                                    className="adm-swatch"
                                    style={{
                                        background: `linear-gradient(135deg, ${ad.accent[0]}, ${ad.accent[1]})`
                                    }}
                                />

                                <div className="adm-list-info">
                                    <strong>
                                        {ad.brand} · {ad.title}
                                    </strong>
                                    <span>Hasta el {formatDate(ad.endsAt)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}

export default AdminDashboard;