export function formatPrice(value) {
    return (
        "S/ " +
        value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    );
}