import {
    Crosshair,
    Gauge,
    MousePointerClick,
    Weight,
    Cable,
    Palette,
    Keyboard,
    LayoutGrid,
    Headphones,
    Mic,
    Volume2,
    Ruler,
    Monitor,
    Zap,
    Timer,
    Layers
} from "lucide-react";

// Qué características se comparan en cada categoría.
//  - better: "high" | "low" -> sirve para calcular el producto recomendado
//  - win: texto que explica por qué gana ("mayor DPI")
//  - summary: true -> aparece en el panel "Resumen de comparación"
//  - format: cómo se muestra el valor
export const compareSpecs = {
    mouse: [
        { key: "sensor", label: "Sensor", icon: Crosshair },
        {
            key: "dpi",
            label: "DPI máximo",
            icon: Gauge,
            better: "high",
            win: "mayor DPI",
            summary: true,
            format: (v) => v.toLocaleString("en-US")
        },
        { key: "botones", label: "Botones", icon: MousePointerClick },
        {
            key: "peso",
            label: "Peso",
            icon: Weight,
            better: "low",
            win: "menor peso",
            summary: true,
            format: (v) => `${v} g`
        },
        { key: "conexion", label: "Conexión", icon: Cable, summary: true },
        { key: "rgb", label: "RGB", icon: Palette, summary: true }
    ],
    teclados: [
        { key: "switch", label: "Switch", icon: Keyboard },
        { key: "formato", label: "Formato", icon: LayoutGrid },
        { key: "conexion", label: "Conexión", icon: Cable, summary: true },
        {
            key: "peso",
            label: "Peso",
            icon: Weight,
            better: "low",
            win: "menor peso",
            summary: true,
            format: (v) => `${v} g`
        },
        { key: "rgb", label: "RGB", icon: Palette, summary: true }
    ],
    audifonos: [
        { key: "tipo", label: "Tipo", icon: Headphones },
        { key: "sonido", label: "Sonido", icon: Volume2, summary: true },
        { key: "conexion", label: "Conexión", icon: Cable, summary: true },
        { key: "microfono", label: "Micrófono", icon: Mic, summary: true },
        {
            key: "peso",
            label: "Peso",
            icon: Weight,
            better: "low",
            win: "menor peso",
            summary: true,
            format: (v) => `${v} g`
        }
    ],
    monitores: [
        {
            key: "tamano",
            label: "Tamaño",
            icon: Ruler,
            summary: true,
            format: (v) => `${v}"`
        },
        { key: "resolucion", label: "Resolución", icon: Monitor, summary: true },
        {
            key: "frecuencia",
            label: "Frecuencia",
            icon: Zap,
            better: "high",
            win: "mayor frecuencia",
            summary: true,
            format: (v) => `${v} Hz`
        },
        {
            key: "respuesta",
            label: "Tiempo de respuesta",
            icon: Timer,
            better: "low",
            win: "menor tiempo de respuesta",
            format: (v) => `${v} ms`
        },
        { key: "panel", label: "Panel", icon: Layers }
    ]
};

// Valores de ejemplo por id de producto (ver products.js).
// Solo los productos que están aquí se pueden comparar.
export const specsById = {
    1: { switch: "HyperX Red", formato: "60%", conexion: "USB-C", peso: 505, rgb: true },
    9: { switch: "GX Brown", formato: "TKL", conexion: "USB / Inalámbrico", peso: 961, rgb: true },
    10: { sensor: "HERO 25K", dpi: 25600, botones: 11, peso: 121, conexion: "USB", rgb: true },
    2: { sensor: "Focus Pro 30K", dpi: 30000, botones: 5, peso: 59, conexion: "USB / Inalámbrico", rgb: true },
    3: { tipo: "Cerrado", sonido: "7.1 virtual", conexion: "USB / 3.5 mm", microfono: true, peso: 320 },
    11: { tipo: "Cerrado", sonido: "THX 7.1", conexion: "USB / 3.5 mm", microfono: true, peso: 262 },
    4: { tamano: 24, resolucion: "1920 × 1080", frecuencia: 165, respuesta: 1, panel: "IPS" },
    12: { tamano: 27, resolucion: "2560 × 1440", frecuencia: 165, respuesta: 1, panel: "Nano IPS" }
};