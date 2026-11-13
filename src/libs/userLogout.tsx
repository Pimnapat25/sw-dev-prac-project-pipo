// Tells the backend to clear its login cookie. The JWT itself stays valid until it
// expires, so the caller must also drop it from the session (NextAuth signOut).
export default async function userLogout(token: string): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => undefined);
}
