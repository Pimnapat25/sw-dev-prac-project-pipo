import type { ApiResponse, AuthData, RegisterInput } from "@/types";

export default async function userRegister(
  user: RegisterInput,
): Promise<ApiResponse<AuthData>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      "Unable to register. Please check your details and try again.",
    );
  }

  return data;
}
