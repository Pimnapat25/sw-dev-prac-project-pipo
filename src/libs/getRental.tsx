import type { ApiResponse, Rental } from "@/types";
import { NotFoundError, UnauthorizedError } from "@/libs/apiErrors";
import { withIcon } from "@/libs/equipmentIcon";

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

  if (response.status === 401) throw new UnauthorizedError();
  if (response.status === 404) throw new NotFoundError();
  if (!response.ok) {
    throw new Error("Unable to load this rental request.");
  }

  const body: ApiResponse<Rental> = await response.json();
  return {
    ...body,
    data: body.data && { ...body.data, equipment: withIcon(body.data.equipment) },
  };
}
