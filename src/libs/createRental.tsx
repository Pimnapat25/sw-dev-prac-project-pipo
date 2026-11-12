import type { ApiError, ApiResponse, Rental, RentalInput } from "@/types";

export default async function createRental(
  rental: RentalInput,
  token: string,
): Promise<ApiResponse<Rental>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rentals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rental),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (data as ApiError).error || "Unable to create rental request.",
    );
  }

  return data;
}
