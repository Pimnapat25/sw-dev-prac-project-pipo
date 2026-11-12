import type { ApiResponse, Rental } from "@/types";

export default async function getRental(
  id: string,
  token: string,
): Promise<ApiResponse<Rental>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rentals/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Unable to load this rental request.");
  }

  return await response.json();
}
