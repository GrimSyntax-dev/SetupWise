import { useEffect, useRef, useState } from "react";
import {
    Search,
    Plus,
    Minus,
    Pencil,
    Trash2,
    X,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Radio
} from "lucide-react";
import SafeImage from "../../components/SafeImage";
import { useInventory } from "../../context/InventoryContext";
import {
    COMPONENT_TYPES,
    STOCK_LABELS,
    catalogCategoryOptions,
    componentCategoryOptions,
    getCategoryKey,
    getCategoryLabel,
    getStockLevel,
    normalize
} from "../../utils/inventory";
import { formatPrice } from "../../utils/formatPrice";

const PAGE_SIZE = 10;

// Datos extra que usa el armador de PC para validar compatibilidad
const extraFields = {
    cpu: [
        { key: "socket", label: "Socket", type: "text", placeholder: "AM4, AM5, LGA1700" },
        { key: "tdp", label: "Consumo (W)", type: "number" }
    ],
    mobo: [
        { key: "socket", label: "Socket", type: "text", placeholder: "AM4, AM5, LGA1700" },
        { key: "ramType", label: "Tipo de RAM", type: "ram" }
    ],
    ram: [{ key: "ramType", label: "Tipo de RAM", type: "ram" }],
    gpu: [{ key: "tdp", label: "Consumo (W)", type: "number" }],
    psu: [{ key: "watts", label: "Potencia (W)", type: "number" }]
};

const statusFilters = [
    { id: "all", label: "Todos" },
    { id: "ok", label: "Disponibles" },
    { id: "low", label: "Stock bajo" },
    { id: "out", label: "Agotados" }
];

/* ========================================
   CELDA DE STOCK (editable)
======================================== */

function StockCell({ product, onChange }) {
    const [draft, setDraft] = useState(String(product.stock));

    // Si el stock cambia desde otro lugar (otra pestaña, botón +10...), se actualiza
    useEffect(() => {
        setDraft(String(product.stock));
    }, [product.stock]);

    const commit = () => {
        const value = Number(draft);

        if (draft.trim() === "" || Number.isNaN(value)) {
            setDraft(String(product.stock));
            return;
        }

        onChange(value);
    };

    return (
        <div className="adm-stock">
            <button
                type="button"
                aria-label={`Restar una unidad a ${product.name}`}
                disabled={product.stock === 0}
                onClick={() => onChange(product.stock - 1)}
            >
                <Minus size={14} />
            </button>

            <input
                type="number"
                min="0"
                inputMode="numeric"
                aria-label={`Stock de ${product.name}`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                }}
            />

            <button
                type="button"
                aria-label={`Sumar una unidad a ${product.name}`}
                onClick={() => onChange(product.stock + 1)}
            >
                <Plus size={14} />
            </button>
        </div>
    );
}

/* ========================================
   FORMULARIO (crear / editar)
======================================== */

function ProductDialog({ editing, onSave, onClose }) {
    const ref = useRef(null);

    const [form, setForm] = useState(() =>
        editing
            ? {
                  name: editing.name,
                  brand: editing.brand,
                  category: getCategoryKey(editing),
                  price: String(editing.price),
                  stock: String(editing.stock),
                  image: editing.image ?? "",
                  featured: Boolean(editing.featured),
                  detail: editing.detail ?? "",
                  socket: editing.socket ?? "",
                  ramType: editing.ramType ?? "DDR4",
                  tdp: editing.tdp != null ? String(editing.tdp) : "",
                  watts: editing.watts != null ? String(editing.watts) : ""
              }
            : {
                  name: "",
                  brand: "",
                  category: "teclados",
                  price: "",
                  stock: "0",
                  image: "",
                  featured: false,
                  detail: "",
                  socket: "",
                  ramType: "DDR4",
                  tdp: "",
                  watts: ""
              }
    );
    const [error, setError] = useState("");

    useEffect(() => {
        const dialog = ref.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    const isComponent = COMPONENT_TYPES.includes(form.category);
    const extras = extraFields[form.category] || [];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const price = Number(form.price);
        const stock = Number(form.stock);

        if (!form.name.trim() || !form.brand.trim()) {
            setError("Escribe el nombre y la marca del producto.");
            return;
        }

        if (form.price === "" || Number.isNaN(price) || price <= 0) {
            setError("El precio debe ser mayor que cero.");
            return;
        }

        if (form.stock === "" || Number.isNaN(stock) || stock < 0) {
            setError("El stock no puede ser negativo.");
            return;
        }

        const missing = extras.find((field) => String(form[field.key]).trim() === "");
        if (missing) {
            setError(`Completa el campo "${missing.label}": se usa para validar compatibilidad.`);
            return;
        }

        // Se parte del producto original para no perder datos (reseñas, etc.)
        const item = { ...(editing || {}) };
        ["type", "category", "featured", "detail", "socket", "ramType", "tdp", "watts"].forEach(
            (key) => delete item[key]
        );

        Object.assign(item, {
            name: form.name.trim(),
            brand: form.brand.trim(),
            price,
            stock: Math.floor(stock),
            image: form.image.trim()
        });

        if (isComponent) {
            item.type = form.category;
            item.detail = form.detail.trim();

            extras.forEach((field) => {
                item[field.key] =
                    field.type === "number" ? Number(form[field.key]) : form[field.key].trim();
            });
        } else {
            item.category = form.category;
            item.featured = form.featured;
            item.rating = editing?.rating ?? 0;
            item.reviews = editing?.reviews ?? 0;
        }

        onSave(item);
        ref.current.close();
    };

    return (
        <dialog
            ref={ref}
            className="adm-dialog"
            aria-labelledby="product-dialog-title"
            onClose={onClose}
            onClick={(e) => {
                // Clic en el fondo oscuro
                if (e.target === ref.current) ref.current.close();
            }}
        >
            <form className="adm-form" onSubmit={handleSubmit} noValidate>
                <header>
                    <h2 id="product-dialog-title">
                        {editing ? "Editar producto" : "Nuevo producto"}
                    </h2>
                    <button
                        type="button"
                        className="adm-icon-btn"
                        aria-label="Cerrar"
                        onClick={() => ref.current.close()}
                    >
                        <X size={18} />
                    </button>
                </header>

                <div className="adm-form-grid">
                    <label className="adm-field wide">
                        <span>Nombre *</span>
                        <input name="name" value={form.name} onChange={handleChange} autoFocus />
                    </label>

                    <label className="adm-field">
                        <span>Marca *</span>
                        <input name="brand" value={form.brand} onChange={handleChange} />
                    </label>

                    <label className="adm-field">
                        <span>Categoría *</span>
                        <select name="category" value={form.category} onChange={handleChange}>
                            <optgroup label="Periféricos y accesorios">
                                {catalogCategoryOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Componentes de PC">
                                {componentCategoryOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </label>

                    <label className="adm-field">
                        <span>Precio (S/) *</span>
                        <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="adm-field">
                        <span>Stock *</span>
                        <input
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            value={form.stock}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="adm-field wide">
                        <span>Imagen (ruta en public)</span>
                        <input
                            name="image"
                            placeholder="/images/products/mi-producto.png"
                            value={form.image}
                            onChange={handleChange}
                        />
                    </label>

                    {isComponent && (
                        <>
                            <label className="adm-field wide">
                                <span>Detalle corto</span>
                                <input
                                    name="detail"
                                    placeholder="AM4 · 6 núcleos · 65 W"
                                    value={form.detail}
                                    onChange={handleChange}
                                />
                            </label>

                            {extras.map((field) => (
                                <label key={field.key} className="adm-field">
                                    <span>{field.label} *</span>

                                    {field.type === "ram" ? (
                                        <select
                                            name={field.key}
                                            value={form[field.key]}
                                            onChange={handleChange}
                                        >
                                            <option value="DDR4">DDR4</option>
                                            <option value="DDR5">DDR5</option>
                                        </select>
                                    ) : (
                                        <input
                                            name={field.key}
                                            type={field.type}
                                            min={field.type === "number" ? "0" : undefined}
                                            placeholder={field.placeholder}
                                            value={form[field.key]}
                                            onChange={handleChange}
                                        />
                                    )}
                                </label>
                            ))}
                        </>
                    )}

                    {!isComponent && (
                        <label className="adm-check wide">
                            <input
                                name="featured"
                                type="checkbox"
                                checked={form.featured}
                                onChange={handleChange}
                            />
                            Mostrar como producto destacado
                        </label>
                    )}
                </div>

                {error && (
                    <p className="adm-error" role="alert">
                        {error}
                    </p>
                )}

                <footer>
                    <button type="button" className="adm-btn ghost" onClick={() => ref.current.close()}>
                        Cancelar
                    </button>
                    <button type="submit" className="adm-btn primary">
                        {editing ? "Guardar cambios" : "Crear producto"}
                    </button>
                </footer>
            </form>
        </dialog>
    );
}

/* ========================================
   PÁGINA
======================================== */

function AdminInventory() {
    const { allProducts, updateStock, saveProduct, deleteProduct, resetInventory } =
        useInventory();

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

    // null = cerrado | { product: null } = nuevo | { product } = editar
    const [dialog, setDialog] = useState(null);

    const q = normalize(query.trim());

    const filtered = allProducts.filter((p) => {
        const key = getCategoryKey(p);

        return (
            (category === "all" || key === category) &&
            (status === "all" || getStockLevel(p.stock) === status) &&
            (q === "" || normalize(`${p.name} ${p.brand} ${getCategoryLabel(key)}`).includes(q))
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const resetPage = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const handleDelete = (product) => {
        if (window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
            deleteProduct(product.id);
        }
    };

    const handleReset = () => {
        if (
            window.confirm(
                "Se restablecerán los productos y anuncios a los datos de ejemplo. ¿Continuar?"
            )
        ) {
            resetInventory();
        }
    };

    return (
        <main className="adm-page">
            <header className="adm-head">
                <div>
                    <h1>
                        <span className="gradient-text">Inventario</span> y stock
                    </h1>
                    <p>
                        <Radio size={14} className="adm-live" />
                        Los cambios se reflejan al instante en la tienda.
                    </p>
                </div>

                <div className="adm-head-actions">
                    <button type="button" className="adm-btn ghost" onClick={handleReset}>
                        <RotateCcw size={16} />
                        Restablecer datos
                    </button>

                    <button
                        type="button"
                        className="adm-btn primary"
                        onClick={() => setDialog({ product: null })}
                    >
                        <Plus size={18} />
                        Nuevo producto
                    </button>
                </div>
            </header>

            {/* ---------- Filtros ---------- */}
            <section className="adm-toolbar" aria-label="Filtros">
                <label className="adm-search">
                    <Search size={18} />
                    <input
                        type="search"
                        placeholder="Buscar por nombre, marca o categoría..."
                        value={query}
                        onChange={(e) => resetPage(setQuery)(e.target.value)}
                    />
                </label>

                <select
                    className="adm-select"
                    aria-label="Filtrar por categoría"
                    value={category}
                    onChange={(e) => resetPage(setCategory)(e.target.value)}
                >
                    <option value="all">Todas las categorías</option>
                    <optgroup label="Periféricos y accesorios">
                        {catalogCategoryOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="Componentes de PC">
                        {componentCategoryOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </optgroup>
                </select>

                <div className="adm-chips" role="group" aria-label="Estado del stock">
                    {statusFilters.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            className={status === f.id ? "active" : ""}
                            aria-pressed={status === f.id}
                            onClick={() => resetPage(setStatus)(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* ---------- Tabla ---------- */}
            <section className="adm-table-wrap">
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {visible.map((product) => {
                            const level = getStockLevel(product.stock);

                            return (
                                <tr key={product.id}>
                                    <td>
                                        <div className="adm-product">
                                            <span className="adm-thumb">
                                                <SafeImage src={product.image} alt="" size={20} />
                                            </span>
                                            <div>
                                                <strong>{product.name}</strong>
                                                <span>{product.brand}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{getCategoryLabel(getCategoryKey(product))}</td>
                                    <td className="adm-price">{formatPrice(product.price)}</td>

                                    <td>
                                        <StockCell
                                            product={product}
                                            onChange={(value) => updateStock(product.id, value)}
                                        />
                                    </td>

                                    <td>
                                        <span className={"adm-badge-stock " + level}>
                                            {STOCK_LABELS[level]}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="adm-actions">
                                            <button
                                                type="button"
                                                className="adm-icon-btn"
                                                aria-label={`Editar ${product.name}`}
                                                onClick={() => setDialog({ product })}
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                className="adm-icon-btn danger"
                                                aria-label={`Eliminar ${product.name}`}
                                                onClick={() => handleDelete(product)}
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {visible.length === 0 && (
                    <p className="adm-empty">No hay productos que coincidan con los filtros.</p>
                )}
            </section>

            <footer className="adm-table-foot">
                <span>
                    {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
                </span>

                {totalPages > 1 && (
                    <nav className="adm-pagination" aria-label="Paginación">
                        <button
                            type="button"
                            aria-label="Página anterior"
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <span>
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            type="button"
                            aria-label="Página siguiente"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </nav>
                )}
            </footer>

            {dialog && (
                <ProductDialog
                    editing={dialog.product}
                    onSave={saveProduct}
                    onClose={() => setDialog(null)}
                />
            )}
        </main>
    );
}

export default AdminInventory;