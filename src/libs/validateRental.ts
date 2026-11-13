// Mirrors backend rental rules so users get feedback before submitting.
// Dates are YYYY-MM-DD strings. "Today" is the Asia/Bangkok calendar day so
// users in Thailand are not offered yesterday between 00:00 and 06:59.
// Note: the backend still compares against the UTC day, which is never later
// than the Bangkok day, so anything accepted here is accepted there too.
export const MAX_QTY_PER_REQUEST = 3;
export const MAX_RENTAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

export function todayBangkok(now: Date = new Date()): string {
  return new Date(now.getTime() + BANGKOK_OFFSET_MS).toISOString().slice(0, 10);
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
  if (startDate < todayBangkok(now)) {
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
