import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="border-b border-pink-light bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        {" "}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <Link href="/" className="font-bold text-pink-dark">
            Equipment Rental
          </Link>

          <Link
            href="/equipment"
            className="rounded text-sm font-medium text-grey transition-colors hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
          >
            Equipment
          </Link>

          {session && (
            <Link
              href="/rentals"
              className="rounded text-sm font-medium text-grey transition-colors hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
            >
              {session.user.role === "admin" ? "All rentals" : "My rentals"}
            </Link>
          )}
        </div>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-grey">
              Hello, {session.user.name}
            </span>

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
        )}{" "}
      </div>
    </nav>
  );
}
