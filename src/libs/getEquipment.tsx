import type { ApiResponse, Equipment } from "@/types";
import { NotFoundError } from "@/libs/apiErrors";

export default async function getEquipment(
  id: string,
): Promise<ApiResponse<Equipment>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
    { cache: "no-store" },
  );

  if (response.status === 404) throw new NotFoundError();
  if (!response.ok) {
    throw new Error("Failed to fetch equipment details");
  }

  return await response.json();
}
