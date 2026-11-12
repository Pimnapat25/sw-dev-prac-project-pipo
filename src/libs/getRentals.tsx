import type { ApiResponse, Rental } from "@/types";

export default async function getRentals(
  token: string,
): Promise<ApiResponse<Rental[]>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rentals`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load rental requests.");
  }

  return await response.json();
}
