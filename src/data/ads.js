// Anuncios de marcas. Datos de ejemplo: más adelante los administra el panel de
// administrador (marca, imagen, enlace y fechas de inicio y fin).
//
//  - to: página a la que lleva el anuncio (interna)
//  - accent: colores del degradado del anuncio
//  - startsAt / endsAt: el anuncio solo se muestra dentro de este rango de fechas

export const ads = [
    {
        id: 1,
        brand: "HyperX",
        title: "Escucha cada detalle",
        text: "Sonido envolvente y comodidad para tus partidas más largas. Conoce los audífonos de la marca.",
        cta: "Ver audífonos",
        to: "/?categoria=audifonos",
        image: "/images/ads/hyperx.png",
        accent: ["#7c3aed", "#1e90ff"],
        startsAt: "2026-01-01",
        endsAt: "2027-12-31"
    },
    {
        id: 2,
        brand: "Razer",
        title: "Precisión en cada movimiento",
        text: "Mouse y periféricos pensados para jugar sin límites. Descubre la línea completa.",
        cta: "Ver mouse",
        to: "/?categoria=mouse",
        image: "/images/ads/razer.png",
        accent: ["#15803d", "#0f766e"],
        startsAt: "2026-01-01",
        endsAt: "2027-12-31"
    },
    {
        id: 3,
        brand: "MSI",
        title: "Potencia tu setup",
        text: "Tarjetas gráficas, placas y gabinetes para armar la PC que siempre quisiste.",
        cta: "Armar mi PC",
        to: "/crear-setup",
        image: "/images/ads/msi.png",
        accent: ["#b91c1c", "#7c3aed"],
        startsAt: "2026-01-01",
        endsAt: "2027-12-31"
    },
    {
        id: 4,
        brand: "AOC",
        title: "Más fluidez, más victorias",
        text: "Monitores de alta frecuencia para ver cada fotograma con claridad.",
        cta: "Ver monitores",
        to: "/?categoria=monitores",
        image: "/images/ads/aoc.png",
        accent: ["#1d4ed8", "#0891b2"],
        startsAt: "2026-01-01",
        endsAt: "2027-12-31"
    }
];