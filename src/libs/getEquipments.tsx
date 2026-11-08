import type { ApiResponse, Equipment } from "@/types";

export default async function getEquipments(): Promise<
  ApiResponse<Equipment[]>
> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }

  return await response.json();
}
