import type { ApiError, ApiResponse, Rental, RentalUpdate } from "@/types";

export default async function updateRental(
  id: string,
  rental: RentalUpdate,
  token: string,
): Promise<ApiResponse<Rental>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rentals/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rental),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (data as ApiError).error || "Unable to update rental request.",
    );
  }

  return data;
}
