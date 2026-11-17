const pesoFormatter = new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 });

/** 15000 -> "₱15,000" */
export function formatPeso(amount: number): string {
  return `₱${pesoFormatter.format(Math.round(amount))}`;
}

/** Locale-aware number with fixed decimals: (25000) -> "25,000", (4.9, 1) -> "4.9" */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Menu price label: "₱650" or "from ₱2,800" */
export function formatPrice(item: { price: number; from?: boolean }): string {
  return item.from ? `from ${formatPeso(item.price)}` : formatPeso(item.price);
}
