// Mirrors backend rental rules so users get feedback before submitting.
// Dates are YYYY-MM-DD strings compared in UTC, same as the backend.
export const MAX_QTY_PER_REQUEST = 3;
export const MAX_RENTAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export function todayUTC(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export default function validateRental(
  input: { quantity: number; startDate: string; returnDate: string },
  availableQuantity?: number,
  now: Date = new Date(),
): string | null {
  const { quantity, startDate, returnDate } = input;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return "Quantity must be at least 1.";
  }
  if (quantity > MAX_QTY_PER_REQUEST) {
    return `You can rent at most ${MAX_QTY_PER_REQUEST} items per request.`;
  }
  if (availableQuantity !== undefined && quantity > availableQuantity) {
    return `Only ${availableQuantity} available.`;
  }
  if (!startDate || !returnDate) {
    return "Start and return dates are required.";
  }
  if (startDate < todayUTC(now)) {
    return "Start date cannot be in the past.";
  }
  if (returnDate < startDate) {
    return "Return date cannot be before the start date.";
  }
  const days = (Date.parse(returnDate) - Date.parse(startDate)) / DAY_MS;
  if (days > MAX_RENTAL_DAYS) {
    return `Rental period cannot exceed ${MAX_RENTAL_DAYS} days.`;
  }
  return null;
}
