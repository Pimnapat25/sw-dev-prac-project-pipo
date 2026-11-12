import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getRentals from "@/libs/getRentals";
import { UnauthorizedError } from "@/libs/apiErrors";
import RentalTicket from "@/components/RentalTicket";
import StateMessage from "@/components/StateMessage";
import type { Rental } from "@/types";

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { saved } = await searchParams;
  const isAdmin = session.user.role === "admin";

  let rentals: Rental[] = [];
  let failed = false;
  let expired = false;
  try {
    rentals = (await getRentals(session.user.token)).data;
  } catch (error) {
    if (error instanceof UnauthorizedError) expired = true;
    else failed = true;
  }
  if (expired) redirect("/login?expired=1");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-pink-dark sm:text-4xl">
            {isAdmin ? "All rental requests" : "My rental requests"}
          </h1>
          <p className="mt-3 text-base leading-7 text-grey">
            {isAdmin
              ? "View, edit or delete any member's request."
              : "View, edit or delete your requests."}
          </p>
        </div>
        {!isAdmin && !failed && rentals.length > 0 && (
          <Link href="/rentals/new" className="btn btn-primary">
            New request
          </Link>
        )}
      </header>

      {saved && !failed && (
        <p role="status" className="alert mt-6">
          Snap! Request saved.
        </p>
      )}

      {failed ? (
        <div className="mt-10">
          <StateMessage
            pose="confused"
            title="Oops, Snappy tripped!"
            actions={
              <Link href="/rentals" className="btn btn-primary">
                Try again
              </Link>
            }
          >
            We could not load the rental requests. Please try again in a moment.
          </StateMessage>
        </div>
      ) : rentals.length === 0 ? (
        <div className="mt-10">
          <StateMessage
            pose="sleeping"
            title="Nothing rented yet…"
            actions={
              !isAdmin && (
                <Link href="/equipment" className="btn btn-primary">
                  Browse equipment
                </Link>
              )
            }
          >
            Snappy is bored.
          </StateMessage>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rentals.map((rental) => (
            <RentalTicket key={rental._id} rental={rental} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </main>
  );
}
