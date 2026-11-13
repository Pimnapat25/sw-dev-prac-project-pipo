import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import DeleteRentalButton from "@/components/DeleteRentalButton";
import formatBaht from "@/libs/formatBaht";
import { estimateTotal, formatDate, rentalStatus, type RentalStatus } from "@/libs/rentalInfo";
import type { Rental } from "@/types";

const CHIP: Record<RentalStatus, string> = {
  Upcoming: "bg-gold text-grey",
  Active: "bg-pink-dark text-white",
  Past: "bg-grey/15 text-grey",
};


export default function RentalTicket({
  rental,
  isAdmin,
}: {
  rental: Rental;
  isAdmin: boolean;
}) {
  const status = rentalStatus(rental.startDate, rental.returnDate);
  const equipment = rental.equipment;

  return (
    <article className="glass relative flex min-w-0 flex-col rounded-card">
      <div className="flex items-start gap-4 p-6 pb-5">
        <CategoryIcon
          category={equipment?.category ?? ""}
          name={equipment?.name}
          icon={equipment?.icon}
          className="size-16 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${CHIP[status]}`}>
            {status}
          </p>
          <h2 className="mt-2 break-words text-xl font-bold text-pink-dark">
            {equipment?.name ?? "Equipment unavailable"}
          </h2>
          <p className="text-sm text-grey">{equipment?.category ?? "Unknown"}</p>
        </div>
      </div>

      {/* tear line with side notches */}
      <div aria-hidden="true" className="relative h-0 border-t-2 border-dashed border-pink/40">
        <span className="absolute -left-3 -top-3 size-6 rounded-full bg-pink-light shadow-[inset_-2px_0_3px_rgb(0_0_0/0.06)]" />
        <span className="absolute -right-3 -top-3 size-6 rounded-full bg-pink-light shadow-[inset_2px_0_3px_rgb(0_0_0/0.06)]" />
      </div>

      <dl className="flex-1 space-y-1 p-6 pb-4 text-sm text-grey">
        <div className="flex justify-between gap-4">
          <dt>Quantity</dt>
          <dd className="font-semibold">{rental.quantity}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Start</dt>
          <dd className="font-semibold">{formatDate(rental.startDate)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Return</dt>
          <dd className="font-semibold">{formatDate(rental.returnDate)}</dd>
        </div>
        {rental.user && (
          <div className="flex justify-between gap-4">
            <dt>{isAdmin ? "Requested by" : "Account"}</dt>
            <dd className="min-w-0 text-right">
              <span className="block font-semibold">{rental.user.name}</span>
              <span className="block break-all text-xs">{rental.user.email}</span>
            </dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4 pt-2">
          <dt>Estimated total</dt>
          <dd className="text-xl font-extrabold tabular-nums text-pink-dark">
            {equipment
              ? formatBaht(
                  estimateTotal(
                    rental.quantity,
                    equipment.rentalRate,
                    rental.startDate,
                    rental.returnDate,
                  ),
                )
              : "-"}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-start gap-3 px-6 pb-6">
        <Link href={`/rentals/${rental._id}/edit`} className="btn btn-soft">
          Edit
        </Link>
        <DeleteRentalButton id={rental._id} />
      </div>
    </article>
  );
}
