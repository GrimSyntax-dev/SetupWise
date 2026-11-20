// Devuelve "active" | "scheduled" | "expired" según las fechas del anuncio.
export function getAdStatus(ad, now = new Date()) {
    const start = new Date(`${ad.startsAt}T00:00:00`);
    const end = new Date(`${ad.endsAt}T23:59:59`);

    if (now < start) return "scheduled";
    if (now > end) return "expired";
    return "active";
}

export const AD_STATUS_LABELS = {
    active: "Activo",
    scheduled: "Programado",
    expired: "Vencido"
};

export function formatDate(iso) {
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso;

    return date.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}