import { todayBangkok } from "./validateRental.ts";

const DAY_MS = 24 * 60 * 60 * 1000;

export type RentalStatus = "Upcoming" | "Active" | "Past";

// Dates are YYYY-MM-DD strings (or ISO strings, only the first 10 chars count).
export function rentalStatus(
  startDate: string,
  returnDate: string,
  now: Date = new Date(),
): RentalStatus {
  const today = todayBangkok(now);
  if (returnDate.slice(0, 10) < today) return "Past";
  if (startDate.slice(0, 10) > today) return "Upcoming";
  return "Active";
}

export function rentalDays(startDate: string, returnDate: string): number {
  const diff =
    (Date.parse(returnDate.slice(0, 10)) - Date.parse(startDate.slice(0, 10))) /
    DAY_MS;
  return Number.isFinite(diff) ? Math.max(diff, 0) : 0;
}

// A same-day rental still costs one day.
export function estimateTotal(
  quantity: number,
  rate: number,
  startDate: string,
  returnDate: string,
): number {
  return quantity * rate * Math.max(rentalDays(startDate, returnDate), 1);
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(date) + days * DAY_MS).toISOString().slice(0, 10);
}

// YYYY-MM-DD (or ISO) -> DD-MM-YY for display.
export function formatDate(value: string): string {
  const [y, m, d] = value.slice(0, 10).split("-");
  return y && m && d ? `${d}-${m}-${y.slice(2)}` : value;
}

// "Returns in 3 days" for active rentals due within 3 days; null otherwise.
export function rentalCountdown(
  startDate: string,
  returnDate: string,
  now: Date = new Date(),
): string | null {
  if (rentalStatus(startDate, returnDate, now) !== "Active") return null;
  const n = rentalDays(todayBangkok(now), returnDate);
  return n >= 1 && n <= 3 ? `Returns in ${n} ${n === 1 ? "day" : "days"}` : null;
}
