import type { ApiResponse, Equipment, EquipmentUpdate } from "@/types";

export default async function updateEquipment(
  id: string,
  equipment: EquipmentUpdate,
  token: string,
): Promise<ApiResponse<Equipment>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(equipment),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      "Unable to update equipment. Please check your details and admin access.",
    );
  }

  return data;
}
