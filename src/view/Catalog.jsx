import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Package,
    Keyboard,
    Mouse,
    Headphones,
    Monitor,
    Square,
    Gamepad2,
    Flame,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    SearchX
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/Products";
import "../assets/css/Catalog.css";

const PAGE_SIZE = 8;

const categoryIcons = {
    todos: Package,
    teclados: Keyboard,
    mouse: Mouse,
    audifonos: Headphones,
    monitores: Monitor,
    mousepads: Square,
    accesorios: Gamepad2
};

function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function Catalog() {
    const { search } = useOutletContext();
    const [category, setCategory] = useState("todos");
    const [page, setPage] = useState(1);

    const query = normalize(search.trim());

    const filtered = products.filter((product) => {
        const matchesCategory = category === "todos" || product.category === category;
        const matchesSearch =
            query === "" ||
            normalize(`${product.name} ${product.brand} ${product.category}`).includes(query);

        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const visible = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const selectCategory = (id) => {
        setCategory(id);
        setPage(1);
    };

    return (
        <main className="catalog">
            {/* ---------- Categorías ---------- */}
            <nav className="category-bar" aria-label="Categorías">
                {categories.map(({ id, label }) => {
                    const Icon = categoryIcons[id];

                    return (
                        <button
                            key={id}
                            type="button"
                            className={"category-chip" + (category === id ? " active" : "")}
                            aria-pressed={category === id}
                            onClick={() => selectCategory(id)}
                        >
                            <Icon size={22} strokeWidth={1.6} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* ---------- Banner ---------- */}
            <section className="catalog-hero">
                <span className="hero-eyebrow">CATÁLOGO</span>
                <h1>
                    Catálogo de <span className="gradient-text">productos</span>
                </h1>
                <p>
                    Explora nuestra selección de accesorios y componentes gamer de
                    las mejores marcas.
                </p>
            </section>

            {/* ---------- Productos ---------- */}
            <section className="catalog-content">
                <div className="section-header">
                    <h2>
                        <Flame size={22} />
                        Productos destacados
                    </h2>

                    <button
                        type="button"
                        className="see-all"
                        onClick={() => selectCategory("todos")}
                    >
                        Ver todos
                        <ArrowRight size={15} />
                    </button>
                </div>

                {visible.length > 0 ? (
                    <div className="product-grid">
                        {visible.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <SearchX size={44} strokeWidth={1.3} />
                        <p>No encontramos productos con esa búsqueda.</p>
                        <small>Prueba con otra palabra o cambia de categoría.</small>
                    </div>
                )}

                {totalPages > 1 && (
                    <nav className="pagination" aria-label="Paginación">
                        <button
                            type="button"
                            aria-label="Página anterior"
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                type="button"
                                className={n === currentPage ? "active" : ""}
                                aria-current={n === currentPage ? "page" : undefined}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}

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
            </section>
        </main>
    );
}

export default Catalog;