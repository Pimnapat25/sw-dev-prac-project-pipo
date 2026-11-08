import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-light bg-white px-6 py-4">
      <Link href="/" className="font-bold text-pink">
        Equipment Rental
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-grey">Hello, {session.user.name}</span>

          <Link
            href="/api/auth/signout"
            className="text-sm font-semibold text-pink"
          >
            Sign out
          </Link>
        </div>
      ) : (
        <Link href="/login" className="text-sm font-semibold text-pink">
          Sign in
        </Link>
      )}
    </nav>
  );
}
