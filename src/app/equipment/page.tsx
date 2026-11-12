import getEquipments from "@/libs/getEquipments";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";

export default async function EquipmentPage() {
  const equipmentResponse = await getEquipments();
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <section aria-labelledby="catalogue-title">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1
              id="catalogue-title"
              className="text-3xl font-semibold tracking-tight text-pink-dark sm:text-4xl"
            >
              Browse equipment
            </h1>
            <p className="mt-3 text-sm leading-7 text-grey">
              Find what you need for your next project.
            </p>
          </div>
          {session?.user.role === "admin" && (
            <Link
              href="/equipment/new"
              className="inline-flex min-h-11 items-center rounded-full bg-pink-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-dark/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
            >
              Add equipment
            </Link>
          )}
        </header>

        <p className="mt-7 text-sm text-grey">
          {equipmentResponse.data.length}{" "}
          {equipmentResponse.data.length === 1 ? "item" : "items"} to browse
        </p>
        {equipmentResponse.data.length === 0 ? (
          <p className="mt-5 rounded-3xl bg-pink-light/35 px-6 py-12 text-center text-sm text-grey">
            No equipment available yet.
          </p>
        ) : (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipmentResponse.data.map((equipment) => (
              <article
                key={equipment._id}
                className="flex min-w-0 flex-col rounded-3xl border border-pink/10 bg-white p-6 shadow-[0_8px_28px_-20px_#de5c8e]"
              >
                <p className="w-fit max-w-full break-words rounded-full bg-pink-light/50 px-3 py-1 text-xs font-medium text-pink-dark">
                  {equipment.category}
                </p>

                <h2 className="mt-4 break-words text-xl font-semibold text-foreground">
                  {equipment.name}
                </h2>

                <p className="mt-3 flex-1 break-words whitespace-pre-line text-sm leading-7 text-grey">
                  {equipment.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-pink-light/35 p-4">
                  <div>
                    <p className="text-xs text-grey">Rental rate</p>
                    <p className="mt-1 break-words text-xl font-semibold tabular-nums text-pink-dark">
                      {equipment.rentalRate.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-grey">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 shrink-0 rounded-full ${equipment.quantity > 0 ? "bg-pink" : "bg-grey/50"}`}
                    />
                    <span className="break-words">
                      {equipment.quantity > 0
                        ? `${equipment.quantity.toLocaleString("en-US")} available`
                        : "Currently unavailable"}
                    </span>
                  </p>
                </div>
                {session?.user.role === "member" && equipment.quantity > 0 && (
                  <div className="mt-5">
                    <Link
                      href={`/rentals/new?equipment=${equipment._id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-pink-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-dark/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
                    >
                      Request rental
                    </Link>
                  </div>
                )}
                {session?.user.role === "admin" && (
                  <div className="mt-5 flex flex-wrap items-start gap-3">
                    <Link
                      href={`/equipment/${equipment._id}/edit`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-pink-light/60 px-5 py-2 text-sm font-semibold text-pink-dark transition-colors hover:bg-pink-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
                    >
                      Edit
                    </Link>

                    <DeleteEquipmentButton
                      id={equipment._id}
                      name={equipment.name}
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
