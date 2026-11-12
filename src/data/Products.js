// Datos de ejemplo. Más adelante se reemplazan por la base de datos.
// "stock" es la cantidad disponible: luego la actualizará el administrador en tiempo real.

export const categories = [
    { id: "todos", label: "Todos" },
    { id: "teclados", label: "Teclados" },
    { id: "mouse", label: "Mouse" },
    { id: "audifonos", label: "Audífonos" },
    { id: "monitores", label: "Monitores" },
    { id: "mousepads", label: "Mousepads" },
    { id: "accesorios", label: "Accesorios" }
];

export const products = [
    {
        id: 1,
        name: "Teclado Mecánico HyperX Alloy Origins 60",
        brand: "HyperX",
        category: "teclados",
        price: 499,
        rating: 4.8,
        reviews: 124,
        stock: 18,
        featured: true,
        image: "/images/products/teclado-hyperx-alloy.png"
    },
    {
        id: 2,
        name: "Mouse Gamer Razer DeathAdder V3",
        brand: "Razer",
        category: "mouse",
        price: 349,
        rating: 4.7,
        reviews: 98,
        stock: 25,
        featured: true,
        image: "/images/products/mouse-razer-deathadder.png"
    },
    {
        id: 3,
        name: "Audífonos HyperX Cloud II",
        brand: "HyperX",
        category: "audifonos",
        price: 299,
        rating: 4.9,
        reviews: 178,
        stock: 4,
        featured: true,
        image: "/images/products/audifonos-hyperx-cloud2.png"
    },
    {
        id: 4,
        name: "Monitor AOC 24G2SP",
        brand: "AOC",
        category: "monitores",
        price: 759,
        rating: 4.6,
        reviews: 87,
        stock: 9,
        featured: true,
        image: "/images/products/monitor-aoc-24g2sp.png"
    },
    {
        id: 5,
        name: "Mousepad SteelSeries QcK Prism",
        brand: "SteelSeries",
        category: "mousepads",
        price: 129,
        rating: 4.5,
        reviews: 63,
        stock: 40,
        featured: false,
        image: "/images/products/mousepad-steelseries-qck.png"
    },
    {
        id: 6,
        name: "Tarjeta Gráfica MSI RTX 4060 Ventus 2X",
        brand: "MSI",
        category: "accesorios",
        price: 1599,
        rating: 4.8,
        reviews: 112,
        stock: 0,
        featured: false,
        image: "/images/products/gpu-msi-rtx4060.png"
    },
    {
        id: 7,
        name: "Silla Gamer Cougar Armor S",
        brand: "Cougar",
        category: "accesorios",
        price: 899,
        rating: 4.6,
        reviews: 76,
        stock: 7,
        featured: false,
        image: "/images/products/silla-cougar-armor.png"
    },
    {
        id: 8,
        name: "Gabinete MSI MAG Forge 100R",
        brand: "MSI",
        category: "accesorios",
        price: 399,
        rating: 4.7,
        reviews: 91,
        stock: 15,
        featured: false,
        image: "/images/products/gabinete-msi-forge.png"
    },
    {
        id: 9,
        name: "Teclado Logitech G Pro X TKL",
        brand: "Logitech",
        category: "teclados",
        price: 589,
        rating: 4.7,
        reviews: 142,
        stock: 12,
        featured: false,
        image: "/images/products/teclado-logitech-gpro.png"
    },
    {
        id: 10,
        name: "Mouse Logitech G502 Hero",
        brand: "Logitech",
        category: "mouse",
        price: 229,
        rating: 4.8,
        reviews: 305,
        stock: 30,
        featured: false,
        image: "/images/products/mouse-logitech-g502.png"
    },
    {
        id: 11,
        name: "Audífonos Razer BlackShark V2",
        brand: "Razer",
        category: "audifonos",
        price: 449,
        rating: 4.6,
        reviews: 84,
        stock: 3,
        featured: false,
        image: "/images/products/audifonos-razer-blackshark.png"
    },
    {
        id: 12,
        name: "Monitor LG UltraGear 27GP850",
        brand: "LG",
        category: "monitores",
        price: 1199,
        rating: 4.8,
        reviews: 59,
        stock: 6,
        featured: false,
        image: "/images/products/monitor-lg-ultragear.png"
    }
];