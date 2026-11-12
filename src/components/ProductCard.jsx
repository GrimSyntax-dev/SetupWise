import { useState } from "react";
import { Heart, Star, ArrowRight, ImageOff } from "lucide-react";

function formatPrice(value) {
    return (
        "S/ " +
        value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    );
}

function stockLabel(stock) {
    if (stock === 0) return { text: "Agotado", level: "out" };
    if (stock <= 5) return { text: `Últimas ${stock} unidades`, level: "low" };
    return null;
}

function ProductCard({ product }) {
    const [favorite, setFavorite] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const stock = stockLabel(product.stock);

    return (
        <article className={"product-card" + (product.stock === 0 ? " is-out" : "")}>
            <div className="product-media">
                {product.featured && <span className="tag-featured">Destacado</span>}

                <button
                    type="button"
                    className={"favorite-button" + (favorite ? " active" : "")}
                    aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    aria-pressed={favorite}
                    onClick={() => setFavorite(!favorite)}
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

                <button type="button" className="details-button">
                    Ver detalles
                    <ArrowRight size={16} />
                </button>
            </div>
        </article>
    );
}

export default ProductCard;