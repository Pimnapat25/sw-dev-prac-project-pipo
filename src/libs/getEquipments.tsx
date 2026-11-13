import type { ApiResponse, Equipment } from "@/types";
import { withIcon } from "@/libs/equipmentIcon";

export default async function getEquipments(): Promise<
  ApiResponse<Equipment[]>
> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }

  const body: ApiResponse<Equipment[]> = await response.json();
  return { ...body, data: (body.data ?? []).map((e) => withIcon(e)) };
}
