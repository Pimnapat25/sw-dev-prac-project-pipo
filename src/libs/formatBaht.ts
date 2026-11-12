export default function formatBaht(amount: number): string {
  return `฿${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
