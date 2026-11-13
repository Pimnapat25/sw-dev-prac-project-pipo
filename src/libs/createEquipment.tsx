import type { ApiError, ApiResponse, Equipment, EquipmentInput } from "@/types";

export default async function createEquipment(
  equipment: EquipmentInput,
  token: string,
): Promise<ApiResponse<Equipment>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(equipment),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (data as ApiError).error ||
        "Unable to add equipment. Please check your details and admin access.",
    );
  }

  return data;
}
