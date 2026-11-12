import type { ApiError } from "@/types";

export default async function deleteEquipment(
  id: string,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      (data as ApiError).error ||
        "Unable to delete equipment. Please check your admin access and try again.",
    );
  }
}
