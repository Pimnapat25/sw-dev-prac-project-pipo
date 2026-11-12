import type { ApiError } from "@/types";

export default async function deleteRental(
  id: string,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rentals/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      (data as ApiError).error || "Unable to delete rental request.",
    );
  }
}
