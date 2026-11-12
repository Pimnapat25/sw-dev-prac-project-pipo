import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getEquipments from "@/libs/getEquipments";
import RentalForm from "@/components/RentalForm";
import StateMessage from "@/components/StateMessage";
import type { Equipment } from "@/types";

export default async function NewRentalPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "member") redirect("/rentals");

  const { equipment } = await searchParams;

  let equipments: Equipment[] | null = null;
  try {
    equipments = (await getEquipments()).data;
  } catch {
    equipments = null;
  }

  if (!equipments) {
    return (
      <main className="px-6 py-14">
        <StateMessage
          pose="confused"
          title="Oops, Snappy tripped!"
          actions={
            <Link href="/rentals/new" className="btn btn-primary">
              Try again
            </Link>
          }
        >
          We could not load the equipment list. Please try again in a moment.
        </StateMessage>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 sm:py-14">
      <section className="glass mx-auto max-w-4xl rounded-card p-7 sm:p-10">
        <Link
          href="/rentals"
          className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-grey transition-colors hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
        >
          <span aria-hidden="true">←</span> Back to my requests
        </Link>
        <header className="mt-5 rounded-2xl bg-white/50 p-5 sm:p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-pink-dark sm:text-3xl">
            New rental request
          </h1>
          <p className="mt-3 text-base leading-7 text-grey">
            Up to 3 items per request, for no more than 7 days. Submitting a
            request does not change the available quantity.
          </p>
        </header>
        <RentalForm equipments={equipments} defaultEquipmentId={equipment} />
      </section>
    </main>
  );
}
