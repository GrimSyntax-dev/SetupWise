import { useState } from "react";
import { ImageOff } from "lucide-react";

// Muestra un ícono si la imagen no existe, en lugar de una imagen rota.
function SafeImage({ src, alt = "", size = 26 }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span
                aria-hidden="true"
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#3b4678"
                }}
            >
                <ImageOff size={size} strokeWidth={1.2} />
            </span>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
    );
}

export default SafeImage;