import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, CalendarDays, Link2 } from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { catalogCategoryOptions } from "../../utils/inventory";
import { AD_STATUS_LABELS, formatDate, getAdStatus } from "../../utils/ads";

// Páginas a las que puede llevar un anuncio
const destinations = [
    { value: "/", label: "Catálogo (todos los productos)" },
    ...catalogCategoryOptions.map((o) => ({
        value: `/?categoria=${o.value}`,
        label: `Catálogo: ${o.label}`
    })),
    { value: "/crear-setup", label: "Armador de PC" },
    { value: "/comparar", label: "Comparador" },
    { value: "/inicio", label: "Inicio" }
];

const isoDate = (date) => date.toISOString().slice(0, 10);

function emptyAd() {
    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + 30);

    return {
        brand: "",
        title: "",
        text: "",
        cta: "Ver más",
        to: "/",
        image: "",
        accent: ["#7c3aed", "#1e90ff"],
        startsAt: isoDate(today),
        endsAt: isoDate(end)
    };
}

/* ========================================
   FORMULARIO (crear / editar)
======================================== */

function AdDialog({ editing, onSave, onClose }) {
    const ref = useRef(null);
    const [form, setForm] = useState(() => editing ?? emptyAd());
    const [error, setError] = useState("");

    useEffect(() => {
        const dialog = ref.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const setColor = (index, value) => {
        const accent = [...form.accent];
        accent[index] = value;
        setForm({ ...form, accent });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.brand.trim() || !form.title.trim() || !form.text.trim() || !form.cta.trim()) {
            setError("Completa la marca, el título, el texto y el texto del botón.");
            return;
        }

        if (!form.startsAt || !form.endsAt) {
            setError("Indica la fecha de inicio y la de fin.");
            return;
        }

        if (form.endsAt < form.startsAt) {
            setError("La fecha de fin no puede ser anterior a la de inicio.");
            return;
        }

        onSave({
            ...form,
            brand: form.brand.trim(),
            title: form.title.trim(),
            text: form.text.trim(),
            cta: form.cta.trim(),
            image: form.image.trim()
        });
        ref.current.close();
    };

    return (
        <dialog
            ref={ref}
            className="adm-dialog"
            aria-labelledby="ad-dialog-title"
            onClose={onClose}
            onClick={(e) => {
                if (e.target === ref.current) ref.current.close();
            }}
        >
            <form className="adm-form" onSubmit={handleSubmit} noValidate>
                <header>
                    <h2 id="ad-dialog-title">{editing ? "Editar anuncio" : "Nuevo anuncio"}</h2>
                    <button
                        type="button"
                        className="adm-icon-btn"
                        aria-label="Cerrar"
                        onClick={() => ref.current.close()}
                    >
                        <X size={18} />
                    </button>
                </header>

                {/* Vista previa */}
                <div
                    className="adm-ad-preview"
                    style={{
                        background: `linear-gradient(120deg, ${form.accent[0]}, ${form.accent[1]})`
                    }}
                    aria-label="Vista previa del anuncio"
                >
                    <span className="adm-ad-preview-tag">Publicidad</span>
                    <strong>{form.brand || "Marca"}</strong>
                    <h3>{form.title || "Título del anuncio"}</h3>
                    <p>{form.text || "Texto breve que describe la promoción."}</p>
                    <span className="adm-ad-preview-cta">{form.cta || "Ver más"}</span>
                </div>

                <div className="adm-form-grid">
                    <label className="adm-field">
                        <span>Marca *</span>
                        <input name="brand" value={form.brand} onChange={handleChange} autoFocus />
                    </label>

                    <label className="adm-field">
                        <span>Texto del botón *</span>
                        <input name="cta" value={form.cta} onChange={handleChange} />
                    </label>

                    <label className="adm-field wide">
                        <span>Título *</span>
                        <input name="title" value={form.title} onChange={handleChange} />
                    </label>

                    <label className="adm-field wide">
                        <span>Texto *</span>
                        <textarea name="text" rows="3" value={form.text} onChange={handleChange} />
                    </label>

                    <label className="adm-field wide">
                        <span>El botón lleva a</span>
                        <select name="to" value={form.to} onChange={handleChange}>
                            {destinations.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="adm-field wide">
                        <span>Imagen (ruta en public)</span>
                        <input
                            name="image"
                            placeholder="/images/ads/mi-marca.png"
                            value={form.image}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="adm-field">
                        <span>Color 1</span>
                        <input
                            type="color"
                            value={form.accent[0]}
                            onChange={(e) => setColor(0, e.target.value)}
                        />
                    </label>

                    <label className="adm-field">
                        <span>Color 2</span>
                        <input
                            type="color"
                            value={form.accent[1]}
                            onChange={(e) => setColor(1, e.target.value)}
                        />
                    </label>

                    <label className="adm-field">
                        <span>Inicia el *</span>
                        <input
                            name="startsAt"
                            type="date"
                            value={form.startsAt}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="adm-field">
                        <span>Termina el *</span>
                        <input
                            name="endsAt"
                            type="date"
                            value={form.endsAt}
                            onChange={handleChange}
                        />
                    </label>
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
                        {editing ? "Guardar cambios" : "Crear anuncio"}
                    </button>
                </footer>
            </form>
        </dialog>
    );
}

/* ========================================
   PÁGINA
======================================== */

function AdminAds() {
    const { ads, saveAd, deleteAd } = useInventory();

    // null = cerrado | { ad: null } = nuevo | { ad } = editar
    const [dialog, setDialog] = useState(null);

    const handleDelete = (ad) => {
        if (window.confirm(`¿Eliminar el anuncio de ${ad.brand}? Esta acción no se puede deshacer.`)) {
            deleteAd(ad.id);
        }
    };

    return (
        <main className="adm-page">
            <header className="adm-head">
                <div>
                    <h1>
                        Anuncios de <span className="gradient-text">marcas</span>
                    </h1>
                    <p>
                        Las marcas que promocionan sus productos. Solo se muestran en la tienda
                        los anuncios activos, según sus fechas.
                    </p>
                </div>

                <button
                    type="button"
                    className="adm-btn primary"
                    onClick={() => setDialog({ ad: null })}
                >
                    <Plus size={18} />
                    Nuevo anuncio
                </button>
            </header>

            {ads.length === 0 ? (
                <p className="adm-empty adm-panel">Aún no hay anuncios. Crea el primero.</p>
            ) : (
                <ul className="adm-ad-list">
                    {ads.map((ad) => {
                        const status = getAdStatus(ad);

                        return (
                            <li key={ad.id} className="adm-ad-item">
                                <span
                                    className="adm-swatch large"
                                    style={{
                                        background: `linear-gradient(135deg, ${ad.accent[0]}, ${ad.accent[1]})`
                                    }}
                                />

                                <div className="adm-ad-info">
                                    <div className="adm-ad-title">
                                        <strong>{ad.brand}</strong>
                                        <span className={"adm-badge-ad " + status}>
                                            {AD_STATUS_LABELS[status]}
                                        </span>
                                    </div>

                                    <p>{ad.title}</p>

                                    <div className="adm-ad-meta">
                                        <span>
                                            <CalendarDays size={14} />
                                            {formatDate(ad.startsAt)} – {formatDate(ad.endsAt)}
                                        </span>
                                        <span>
                                            <Link2 size={14} />
                                            {ad.to}
                                        </span>
                                    </div>
                                </div>

                                <div className="adm-actions">
                                    <button
                                        type="button"
                                        className="adm-icon-btn"
                                        aria-label={`Editar anuncio de ${ad.brand}`}
                                        onClick={() => setDialog({ ad })}
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        className="adm-icon-btn danger"
                                        aria-label={`Eliminar anuncio de ${ad.brand}`}
                                        onClick={() => handleDelete(ad)}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {dialog && (
                <AdDialog
                    editing={dialog.ad}
                    onSave={saveAd}
                    onClose={() => setDialog(null)}
                />
            )}
        </main>
    );
}

export default AdminAds;