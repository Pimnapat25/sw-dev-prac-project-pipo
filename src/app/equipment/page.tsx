import getEquipments from "@/libs/getEquipments";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";

export default async function EquipmentPage() {
  const equipmentResponse = await getEquipments();
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-pink-light px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-pink">Equipment</h1>

        <p className="mt-2 text-sm text-grey">
          Browse equipment for your next rental.
        </p>

        {session?.user.role === "admin" && (
          <Link
            href="/equipment/new"
            className="mt-6 inline-block rounded-full bg-pink px-6 py-2 font-semibold text-white"
          >
            Add equipment
          </Link>
        )}

        <p className="mt-6 text-grey">
          Available equipment: {equipmentResponse.data.length}
        </p>
        {equipmentResponse.data.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-6 text-center text-grey">
            No equipment available yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipmentResponse.data.map((equipment) => (
              <article
                key={equipment._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-pink">
                  {equipment.category}
                </p>

                <h2 className="mt-2 text-xl font-bold text-grey">
                  {equipment.name}
                </h2>

                <p className="mt-3 text-sm text-grey">
                  {equipment.description}
                </p>

                <p className="mt-4 text-sm text-grey">
                  Available quantity: {equipment.quantity}
                </p>

                <p className="mt-2 font-semibold text-pink">
                  Rental rate: {equipment.rentalRate}
                </p>
                {session?.user.role === "admin" && (
                  <div className="mt-4 flex flex-wrap items-start gap-3">
                    <Link
                      href={`/equipment/${equipment._id}/edit`}
                      className="inline-block rounded-full border border-pink px-5 py-2 text-sm font-semibold text-pink hover:bg-pink-light"
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
