import type { ApiError, ApiResponse, AuthData } from "@/types";

export default async function userLogin(
  userEmail: string,
  userPassword: string,
): Promise<ApiResponse<AuthData>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || "Failed to log in");
  }

  return data;
}
