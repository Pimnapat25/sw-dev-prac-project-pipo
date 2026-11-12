import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getRentals from "@/libs/getRentals";
import DeleteRentalButton from "@/components/DeleteRentalButton";

const formatDate = (value: string) => value.slice(0, 10);

export default async function RentalsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";
  const rentalsResponse = await getRentals(session.user.token);
  const rentals = rentalsResponse.data;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-pink-dark sm:text-4xl">
            {isAdmin ? "All rental requests" : "My rental requests"}
          </h1>
          <p className="mt-3 text-sm leading-7 text-grey">
            {isAdmin
              ? "View, edit or delete any member's request."
              : "View, edit or delete your requests."}
          </p>
        </div>
        {!isAdmin && (
          <Link
            href="/rentals/new"
            className="inline-flex min-h-11 items-center rounded-full bg-pink-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-dark/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
          >
            New request
          </Link>
        )}
      </header>

      {rentals.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-pink-light/35 px-6 py-12 text-center text-sm text-grey">
          No rental requests yet.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rentals.map((rental) => (
            <article
              key={rental._id}
              className="flex min-w-0 flex-col rounded-3xl border border-pink/10 bg-white p-6 shadow-[0_8px_28px_-20px_#de5c8e]"
            >
              <p className="w-fit max-w-full break-words rounded-full bg-pink-light/50 px-3 py-1 text-xs font-medium text-pink-dark">
                {rental.equipment?.category ?? "Unknown"}
              </p>
              <h2 className="mt-4 break-words text-xl font-semibold text-foreground">
                {rental.equipment?.name ?? "Equipment unavailable"}
              </h2>
              <dl className="mt-4 flex-1 space-y-1 text-sm text-grey">
                <div className="flex justify-between gap-4">
                  <dt>Quantity</dt>
                  <dd className="font-medium text-foreground">
                    {rental.quantity}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Start</dt>
                  <dd className="font-medium text-foreground">
                    {formatDate(rental.startDate)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Return</dt>
                  <dd className="font-medium text-foreground">
                    {formatDate(rental.returnDate)}
                  </dd>
                </div>
                {isAdmin && rental.user && (
                  <div className="flex justify-between gap-4">
                    <dt>Requested by</dt>
                    <dd className="break-all text-right font-medium text-foreground">
                      {rental.user.name}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-5 flex flex-wrap items-start gap-3">
                <Link
                  href={`/rentals/${rental._id}/edit`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-pink-light/60 px-5 py-2 text-sm font-semibold text-pink-dark transition-colors hover:bg-pink-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
                >
                  Edit
                </Link>
                <DeleteRentalButton id={rental._id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
