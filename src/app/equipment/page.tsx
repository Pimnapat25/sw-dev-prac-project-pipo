import getEquipments from "@/libs/getEquipments";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import EquipmentCatalogue from "@/components/EquipmentCatalogue";
import StateMessage from "@/components/StateMessage";
import type { Equipment } from "@/types";

export default async function EquipmentPage() {
  const session = await getServerSession(authOptions);

  let equipments: Equipment[] = [];
  let failed = false;
  try {
    equipments = (await getEquipments()).data;
  } catch {
    failed = true;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <section aria-labelledby="catalogue-title">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1
              id="catalogue-title"
              className="text-3xl font-extrabold tracking-tight text-pink-dark sm:text-4xl"
            >
              Browse equipment
            </h1>
            <p className="mt-3 text-base leading-7 text-grey">
              Find what you need for your next project.
            </p>
          </div>
          {session?.user.role === "admin" && (
            <Link href="/equipment/new" className="btn btn-primary">
              Add equipment
            </Link>
          )}
        </header>

        {failed ? (
          <div className="mt-10">
            <StateMessage
              pose="confused"
              title="Oops, Snappy tripped!"
              actions={
                <Link href="/equipment" className="btn btn-primary">
                  Try again
                </Link>
              }
            >
              We could not load the equipment list. Please try again in a moment.
            </StateMessage>
          </div>
        ) : equipments.length === 0 ? (
          <div className="mt-10">
            <StateMessage pose="sleeping" title="No equipment yet">
              Nothing to borrow right now. Snappy is bored.
            </StateMessage>
          </div>
        ) : (
          <EquipmentCatalogue equipments={equipments} role={session?.user.role} />
        )}
      </section>
    </main>
  );
}
