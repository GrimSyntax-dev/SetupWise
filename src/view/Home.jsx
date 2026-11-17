import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
    PackageCheck,
    Scale,
    Cpu,
    Tag,
    Keyboard,
    Mouse,
    Headphones,
    Monitor,
    Square,
    Gamepad2,
    Flame,
    UserPlus,
    LogIn
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import SafeImage from "../components/SafeImage";
import { useAuth } from "../context/AuthContext";
import { products, categories } from "../data/products";
import { ads } from "../data/ads";
import "../assets/css/Catalog.css";
import "../assets/css/Home.css";

const categoryIcons = {
    teclados: Keyboard,
    mouse: Mouse,
    audifonos: Headphones,
    monitores: Monitor,
    mousepads: Square,
    accesorios: Gamepad2
};

const offers = [
    {
        icon: PackageCheck,
        title: "Catálogo con stock al día",
        text: "Mira qué productos están disponibles y cuántas unidades quedan.",
        to: "/",
        cta: "Ver catálogo"
    },
    {
        icon: Scale,
        title: "Compara productos",
        text: "Pon hasta 3 productos lado a lado y descubre cuál te conviene más.",
        to: "/comparar",
        cta: "Comparar"
    },
    {
        icon: Cpu,
        title: "Arma tu PC",
        text: "Elige componentes compatibles y calcula el costo total de tu setup.",
        to: "/crear-setup",
        cta: "Crear setup"
    },
    {
        icon: Tag,
        title: "Promociones de marcas",
        text: "Entérate de las ofertas y lanzamientos de las marcas que te gustan."
    }
];

/* ========================================
   CARRUSEL DE ANUNCIOS
======================================== */

function AdCarousel({ items }) {
    const [index, setIndex] = useState(0);
    const [hovering, setHovering] = useState(false);

    // Quien prefiere menos movimiento no ve el cambio automático
    const [playing, setPlaying] = useState(
        () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const total = items.length;

    useEffect(() => {
        if (!playing || hovering || total < 2) return;

        const timer = setTimeout(() => setIndex((i) => (i + 1) % total), 6000);
        return () => clearTimeout(timer);
    }, [index, playing, hovering, total]);

    const go = (next) => setIndex((next + total) % total);
    const ad = items[index];

    return (
        <section
            className="ad-carousel"
            aria-roledescription="carousel"
            aria-label="Anuncios de marcas"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocus={() => setHovering(true)}
            onBlur={() => setHovering(false)}
        >
            <article
                key={ad.id}
                className="ad-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${total}`}
                style={{ "--a1": ad.accent[0], "--a2": ad.accent[1] }}
            >
                <div className="ad-text">
                    <span className="ad-tag">Publicidad</span>
                    <p className="ad-brand">{ad.brand}</p>
                    <h2>{ad.title}</h2>
                    <p className="ad-desc">{ad.text}</p>

                    <Link to={ad.to} className="ad-cta">
                        {ad.cta}
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="ad-media">
                    <SafeImage src={ad.image} alt="" size={64} />
                </div>
            </article>

            {total > 1 && (
                <div className="ad-controls">
                    <button type="button" aria-label="Anuncio anterior" onClick={() => go(index - 1)}>
                        <ChevronLeft size={18} />
                    </button>

                    <div className="ad-dots">
                        {items.map((item, i) => (
                            <button
                                key={item.id}
                                type="button"
                                className={i === index ? "active" : ""}
                                aria-label={`Ir al anuncio ${i + 1}: ${item.brand}`}
                                aria-current={i === index}
                                onClick={() => go(i)}
                            />
                        ))}
                    </div>

                    <button type="button" aria-label="Anuncio siguiente" onClick={() => go(index + 1)}>
                        <ChevronRight size={18} />
                    </button>

                    <button
                        type="button"
                        className="ad-play"
                        aria-label={playing ? "Pausar anuncios" : "Reanudar anuncios"}
                        onClick={() => setPlaying(!playing)}
                    >
                        {playing ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            )}
        </section>
    );
}

/* ========================================
   PÁGINA
======================================== */

function Home() {
    const { isLoggedIn } = useAuth();

    // Solo se muestran los anuncios que están dentro de su rango de fechas
    const now = new Date();
    const activeAds = ads.filter(
        (ad) => new Date(ad.startsAt) <= now && now <= new Date(`${ad.endsAt}T23:59:59`)
    );

    const featured = products.filter((p) => p.featured).slice(0, 4);
    const browsableCategories = categories.filter((c) => c.id !== "todos");

    return (
        <main className="home-page">
            {/* ---------- Bienvenida ---------- */}
            <section className="home-hero">
                <span className="home-eyebrow">BIENVENIDO A SETUPWISE</span>

                <h1>
                    Tu setup gamer, <span className="gradient-text">sin gastar de más</span>
                </h1>

                <p>
                    Encuentra los mejores accesorios, compara precios y arma el setup
                    ideal según tu presupuesto.
                </p>

                <div className="home-hero-actions">
                    <Link to="/" className="home-btn primary">
                        Explorar catálogo
                        <ArrowRight size={18} />
                    </Link>

                    <Link to="/crear-setup" className="home-btn secondary">
                        <Cpu size={18} />
                        Armar mi PC
                    </Link>
                </div>
            </section>

            <div className="home-content">
                {/* ---------- Anuncios ---------- */}
                {activeAds.length > 0 && <AdCarousel items={activeAds} />}

                {/* ---------- Lo que ofrece la página ---------- */}
                <section className="home-section">
                    <h2 className="home-title">Todo lo que necesitas para tu setup</h2>

                    <div className="offer-grid">
                        {offers.map(({ icon: Icon, title, text, to, cta }) => {
                            const body = (
                                <>
                                    <span className="offer-icon">
                                        <Icon size={26} strokeWidth={1.5} />
                                    </span>
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                    {cta && (
                                        <span className="offer-cta">
                                            {cta}
                                            <ArrowRight size={15} />
                                        </span>
                                    )}
                                </>
                            );

                            return to ? (
                                <Link key={title} to={to} className="offer-card link">
                                    {body}
                                </Link>
                            ) : (
                                <div key={title} className="offer-card">
                                    {body}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ---------- Categorías ---------- */}
                <section className="home-section">
                    <h2 className="home-title">Explora por categoría</h2>

                    <div className="category-grid">
                        {browsableCategories.map(({ id, label }) => {
                            const Icon = categoryIcons[id];
                            const count = products.filter((p) => p.category === id).length;

                            return (
                                <Link key={id} to={`/?categoria=${id}`} className="category-tile">
                                    <Icon size={28} strokeWidth={1.5} />
                                    <strong>{label}</strong>
                                    <span>
                                        {count} {count === 1 ? "producto" : "productos"}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* ---------- Destacados ---------- */}
                <section className="home-section">
                    <div className="home-title-row">
                        <h2 className="home-title">
                            <Flame size={22} />
                            Productos destacados
                        </h2>

                        <Link to="/" className="home-see-all">
                            Ver todos
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="product-grid">
                        {featured.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* ---------- Invitación para quienes no tienen sesión ---------- */}
                {!isLoggedIn && (
                    <section className="home-invite">
                        <div>
                            <h2>Crea tu cuenta gratis</h2>
                            <p>
                                Guarda tus setups y comparaciones y accede a
                                recomendaciones personalizadas.
                            </p>
                        </div>

                        <div className="home-invite-actions">
                            <Link to="/registro" className="home-btn primary">
                                <UserPlus size={18} />
                                Registrarme
                            </Link>

                            <Link to="/login" className="home-btn secondary">
                                <LogIn size={18} />
                                Iniciar sesión
                            </Link>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

export default Home;