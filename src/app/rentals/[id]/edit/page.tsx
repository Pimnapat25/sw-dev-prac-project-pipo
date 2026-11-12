import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getEquipments from "@/libs/getEquipments";
import getRental from "@/libs/getRental";
import { NotFoundError, UnauthorizedError } from "@/libs/apiErrors";
import { todayBangkok } from "@/libs/validateRental";
import formatBaht from "@/libs/formatBaht";
import DeleteRentalButton from "@/components/DeleteRentalButton";
import RentalForm from "@/components/RentalForm";
import Snappy from "@/components/Snappy";
import StateMessage from "@/components/StateMessage";
import type { Equipment, Rental } from "@/types";

export default async function EditRentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  let rental: Rental | null = null;
  let equipments: Equipment[] = [];
  let missing = false;
  let expired = false;
  try {
    const [rentalResponse, equipmentResponse] = await Promise.all([
      getRental(id, session.user.token),
      getEquipments(),
    ]);
    rental = rentalResponse.data;
    equipments = equipmentResponse.data;
  } catch (error) {
    if (error instanceof UnauthorizedError) expired = true;
    else if (error instanceof NotFoundError) missing = true;
  }
  if (expired) redirect("/login?expired=1");
  if (missing) notFound();

  if (!rental) {
    return (
      <main className="px-6 py-14">
        <StateMessage
          pose="confused"
          title="Oops, Snappy tripped!"
          actions={
            <Link href={`/rentals/${id}/edit`} className="btn btn-primary">
              Try again
            </Link>
          }
        >
          We could not load this request. Please try again in a moment.
        </StateMessage>
      </main>
    );
  }

  // The backend only accepts a start date from today onwards, and inactive
  // equipment is hidden from the list, so some requests can only be deleted.
  const equipmentGone =
    !rental.equipment ||
    !equipments.some((e) => e._id === rental.equipment._id);
  const startPassed = rental.startDate.slice(0, 10) < todayBangkok();
  const readOnlyReason = equipmentGone
    ? "This equipment is no longer available, so the request cannot be edited. You can still delete it."
    : startPassed
      ? "This request has already started, so it can no longer be edited. You can still delete it."
      : null;

  return (
    <main className="px-6 py-10 sm:py-14">
      <section className="glass mx-auto max-w-4xl rounded-card p-7 sm:p-10">
        <Link
          href="/rentals"
          className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-grey transition-colors hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
        >
          <span aria-hidden="true">←</span> Back to requests
        </Link>
        <header className="mt-5 rounded-2xl bg-white/50 p-5 sm:p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-pink-dark sm:text-3xl">
            {readOnlyReason ? "Rental request" : "Edit rental request"}
          </h1>
        </header>

        {readOnlyReason ? (
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row">
            <Snappy pose="sleeping" size={140} />
            <div className="w-full flex-1">
              <p role="status" className="alert">
                {readOnlyReason}
              </p>
              <dl className="mt-5 space-y-2 text-base text-grey">
                <div className="flex justify-between gap-4">
                  <dt>Equipment</dt>
                  <dd className="text-right font-semibold">
                    {rental.equipment?.name ?? "Equipment"}
                    {equipmentGone && (
                      <span className="ml-2 rounded-full bg-grey/15 px-2 py-0.5 text-xs">
                        no longer available
                      </span>
                    )}
                  </dd>
                </div>
                {rental.equipment && (
                  <div className="flex justify-between gap-4">
                    <dt>Rate</dt>
                    <dd className="font-semibold">
                      {formatBaht(rental.equipment.rentalRate)} / day
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt>Quantity</dt>
                  <dd className="font-semibold">{rental.quantity}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Start</dt>
                  <dd className="font-semibold">{rental.startDate.slice(0, 10)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Return</dt>
                  <dd className="font-semibold">{rental.returnDate.slice(0, 10)}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <DeleteRentalButton id={rental._id} redirectTo="/rentals" />
              </div>
            </div>
          </div>
        ) : (
          <RentalForm key={rental._id} equipments={equipments} rental={rental} />
        )}
      </section>
    </main>
  );
}
