import {
    Cpu,
    CircuitBoard,
    MemoryStick,
    Fan,
    HardDrive,
    Zap,
    Keyboard,
    Mouse,
    Headphones,
    Monitor,
    Puzzle
} from "lucide-react";

/* ========================================
   CATEGORÍAS DEL CONFIGURADOR
   - max: cuántos productos se pueden elegir
   - catalog: usa productos del catálogo (products.js)
   - sin catalog: usa los componentes de este archivo
======================================== */

export const builderCategories = [
    { id: "cpu", group: "components", label: "Procesadores (CPU)", desc: "Elige el cerebro de tu setup", icon: Cpu, max: 1 },
    { id: "mobo", group: "components", label: "Placas Madre", desc: "Conecta todos tus componentes", icon: CircuitBoard, max: 1 },
    { id: "ram", group: "components", label: "Memoria RAM", desc: "Mejora el rendimiento de tu equipo", icon: MemoryStick, max: 4 },
    { id: "gpu", group: "components", label: "Tarjetas Gráficas", desc: "Disfruta de un rendimiento visual superior", icon: Fan, max: 1 },
    { id: "storage", group: "components", label: "Almacenamiento (SSD / HDD)", desc: "Guarda tus juegos y archivos", icon: HardDrive, max: 2 },
    { id: "psu", group: "components", label: "Fuentes de Poder", desc: "Brinda energía estable a tu setup", icon: Zap, max: 1 },

    { id: "teclados", group: "peripherals", label: "Teclados", desc: "Controla con estilo", icon: Keyboard, max: 1, catalog: ["teclados"] },
    { id: "mouse", group: "peripherals", label: "Mouse", desc: "Precisión en cada movimiento", icon: Mouse, max: 1, catalog: ["mouse"] },
    { id: "audifonos", group: "peripherals", label: "Audífonos", desc: "Sumérgete en la experiencia", icon: Headphones, max: 1, catalog: ["audifonos"] },
    { id: "monitores", group: "peripherals", label: "Monitores", desc: "Vive tus juegos en alta calidad", icon: Monitor, max: 1, catalog: ["monitores"] },
    // La tarjeta gráfica del catálogo (id 6) se elige en su propia categoría
    { id: "otros", group: "peripherals", label: "Otros Accesorios", desc: "Completa tu setup", icon: Puzzle, max: 1, catalog: ["accesorios"], excludeIds: [6] }
];

/* ========================================
   COMPONENTES DE EJEMPLO
   (luego vendrán de la base de datos)
   - socket / ramType / tdp / watts se usan para validar compatibilidad
======================================== */

export const componentProducts = [
    // Procesadores
    { id: 101, type: "cpu", name: "AMD Ryzen 5 5600", brand: "AMD", price: 549, stock: 14, socket: "AM4", tdp: 65, detail: "AM4 · 6 núcleos · 65 W", image: "/images/products/cpu-ryzen-5-5600.png" },
    { id: 102, type: "cpu", name: "AMD Ryzen 7 7700X", brand: "AMD", price: 1199, stock: 5, socket: "AM5", tdp: 105, detail: "AM5 · 8 núcleos · 105 W", image: "/images/products/cpu-ryzen-7-7700x.png" },
    { id: 103, type: "cpu", name: "Intel Core i5-12400F", brand: "Intel", price: 599, stock: 11, socket: "LGA1700", tdp: 65, detail: "LGA1700 · 6 núcleos · 65 W", image: "/images/products/cpu-i5-12400f.png" },

    // Placas madre
    { id: 111, type: "mobo", name: "MSI MAG B550 Tomahawk", brand: "MSI", price: 679, stock: 8, socket: "AM4", ramType: "DDR4", detail: "AM4 · DDR4 · ATX", image: "/images/products/mobo-msi-b550.png" },
    { id: 112, type: "mobo", name: "Gigabyte B650 Aorus Elite", brand: "Gigabyte", price: 899, stock: 6, socket: "AM5", ramType: "DDR5", detail: "AM5 · DDR5 · ATX", image: "/images/products/mobo-gigabyte-b650.png" },
    { id: 113, type: "mobo", name: "ASUS Prime B660M-A", brand: "ASUS", price: 549, stock: 10, socket: "LGA1700", ramType: "DDR4", detail: "LGA1700 · DDR4 · mATX", image: "/images/products/mobo-asus-b660m.png" },

    // Memoria RAM
    { id: 121, type: "ram", name: "Kingston Fury Beast 16GB", brand: "Kingston", price: 189, stock: 30, ramType: "DDR4", detail: "DDR4 · 3200 MHz · 16 GB", image: "/images/products/ram-kingston-ddr4.png" },
    { id: 122, type: "ram", name: "Corsair Vengeance 16GB", brand: "Corsair", price: 279, stock: 4, ramType: "DDR5", detail: "DDR5 · 5600 MHz · 16 GB", image: "/images/products/ram-corsair-ddr5.png" },
    { id: 123, type: "ram", name: "Corsair Vengeance 32GB", brand: "Corsair", price: 329, stock: 12, ramType: "DDR4", detail: "DDR4 · 3200 MHz · 32 GB", image: "/images/products/ram-corsair-32-ddr4.png" },

    // Tarjetas gráficas
    { id: 131, type: "gpu", name: "MSI GeForce RTX 4060 Ventus 2X", brand: "MSI", price: 1599, stock: 3, tdp: 115, detail: "8 GB GDDR6 · 115 W", image: "/images/products/gpu-msi-rtx4060.png" },
    { id: 132, type: "gpu", name: "Gigabyte Radeon RX 7600 Gaming OC", brand: "Gigabyte", price: 1349, stock: 9, tdp: 165, detail: "8 GB GDDR6 · 165 W", image: "/images/products/gpu-gigabyte-rx7600.png" },
    { id: 133, type: "gpu", name: "ASUS Dual GeForce RTX 4070", brand: "ASUS", price: 2799, stock: 0, tdp: 200, detail: "12 GB GDDR6X · 200 W", image: "/images/products/gpu-asus-rtx4070.png" },

    // Almacenamiento
    { id: 141, type: "storage", name: "Kingston NV2 1TB NVMe", brand: "Kingston", price: 289, stock: 22, detail: "SSD NVMe · 1 TB", image: "/images/products/ssd-kingston-nv2.png" },
    { id: 142, type: "storage", name: "WD Blue 2TB", brand: "Western Digital", price: 259, stock: 16, detail: "HDD · 2 TB · 7200 RPM", image: "/images/products/hdd-wd-blue.png" },
    { id: 143, type: "storage", name: "Samsung 980 500GB NVMe", brand: "Samsung", price: 219, stock: 5, detail: "SSD NVMe · 500 GB", image: "/images/products/ssd-samsung-980.png" },

    // Fuentes de poder
    { id: 151, type: "psu", name: "Corsair CV650", brand: "Corsair", price: 289, stock: 13, watts: 650, detail: "650 W · 80 Plus Bronze", image: "/images/products/psu-corsair-cv650.png" },
    { id: 152, type: "psu", name: "MSI MAG A750GL", brand: "MSI", price: 449, stock: 7, watts: 750, detail: "750 W · 80 Plus Gold", image: "/images/products/psu-msi-a750gl.png" },
    { id: 153, type: "psu", name: "Cooler Master MWE 550", brand: "Cooler Master", price: 239, stock: 2, watts: 550, detail: "550 W · 80 Plus Bronze", image: "/images/products/psu-coolermaster-mwe550.png" }
];

/* ========================================
   UTILIDADES
======================================== */

// inventory = { products, components } (vienen del InventoryContext)
export function getOptions(category, inventory) {
    if (category.catalog) {
        return inventory.products.filter(
            (p) =>
                category.catalog.includes(p.category) &&
                !(category.excludeIds || []).includes(p.id)
        );
    }

    return inventory.components.filter((p) => p.type === category.id);
}

const firstOf = (selection, id, getProduct) => getProduct((selection[id] || [])[0]);

// Devuelve el motivo por el que un producto NO es compatible con lo ya elegido (o null).
export function getIncompatibility(categoryId, product, selection, getProduct) {
    const cpu = firstOf(selection, "cpu", getProduct);
    const mobo = firstOf(selection, "mobo", getProduct);
    const rams = (selection.ram || []).map(getProduct).filter(Boolean);

    if (categoryId === "cpu" && mobo && mobo.socket !== product.socket) {
        return `Socket ${product.socket} ≠ placa (${mobo.socket})`;
    }

    if (categoryId === "mobo") {
        if (cpu && cpu.socket !== product.socket) {
            return `Socket ${product.socket} ≠ CPU (${cpu.socket})`;
        }

        const badRam = rams.find((r) => r.ramType !== product.ramType);
        if (badRam) {
            return `Usa ${product.ramType}, tu RAM es ${badRam.ramType}`;
        }
    }

    if (categoryId === "ram") {
        if (mobo && mobo.ramType !== product.ramType) {
            return `La placa usa ${mobo.ramType}`;
        }

        if (rams.some((r) => r.ramType !== product.ramType)) {
            return "No mezcles DDR4 con DDR5";
        }
    }

    return null;
}

// Avisos generales sobre el setup completo.
export function getWarnings(selection, getProduct) {
    const warnings = [];

    const cpu = firstOf(selection, "cpu", getProduct);
    const gpu = firstOf(selection, "gpu", getProduct);
    const psu = firstOf(selection, "psu", getProduct);

    if (psu && (cpu || gpu)) {
        const needed = (cpu?.tdp || 0) + (gpu?.tdp || 0) + 150;
        const recommended = Math.ceil(needed / 50) * 50;

        if (psu.watts < recommended) {
            warnings.push(
                `La fuente de ${psu.watts} W podría quedarse corta. Se recomiendan al menos ${recommended} W.`
            );
        }
    }

    return warnings;
}