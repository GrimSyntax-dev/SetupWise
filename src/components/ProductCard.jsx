import { useEffect, useState } from "react";
import { Heart, Star, ArrowRight, ImageOff, ShoppingCart, Check } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../utils/formatPrice";

function stockLabel(stock) {
    if (stock === 0) return { text: "Agotado", level: "out" };
    if (stock <= 5) return { text: `Últimas ${stock} unidades`, level: "low" };
    return null;
}

function ProductCard({ product }) {
    const { isFavorite, toggleFavorite, addToCart, quantityInCart } = useStore();

    const [imageFailed, setImageFailed] = useState(false);
    const [added, setAdded] = useState(false);

    const favorite = isFavorite(product.id);
    const stock = stockLabel(product.stock);
    const cannotAdd = product.stock === 0 || quantityInCart(product.id) >= product.stock;

    // El check de "agregado" desaparece solo
    useEffect(() => {
        if (!added) return;
        const timer = setTimeout(() => setAdded(false), 1200);
        return () => clearTimeout(timer);
    }, [added]);

    const handleAdd = () => {
        addToCart(product.id);
        setAdded(true);
    };

    return (
        <article className={"product-card" + (product.stock === 0 ? " is-out" : "")}>
            <div className="product-media">
                {product.featured && <span className="tag-featured">Destacado</span>}

                <button
                    type="button"
                    className={"favorite-button" + (favorite ? " active" : "")}
                    aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    aria-pressed={favorite}
                    onClick={() => toggleFavorite(product.id)}
                >
                    <Heart size={20} fill={favorite ? "currentColor" : "none"} />
                </button>

                {imageFailed ? (
                    <div className="product-placeholder" aria-hidden="true">
                        <ImageOff size={40} strokeWidth={1.2} />
                    </div>
                ) : (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                )}

                {stock && (
                    <span className={"stock-badge " + stock.level}>{stock.text}</span>
                )}
            </div>

            <div className="product-body">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>

                <div className="product-meta">
                    <strong className="product-price">{formatPrice(product.price)}</strong>

                    <span className="product-rating">
                        <Star size={13} fill="currentColor" />
                        {product.rating} ({product.reviews})
                    </span>
                </div>

                <div className="product-actions">
                    <button type="button" className="details-button">
                        Ver detalles
                        <ArrowRight size={16} />
                    </button>

                    <button
                        type="button"
                        className={"cart-button" + (added ? " added" : "")}
                        aria-label={`Agregar ${product.name} al carrito`}
                        disabled={cannotAdd}
                        onClick={handleAdd}
                    >
                        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;