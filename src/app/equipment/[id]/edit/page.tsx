import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getEquipment from "@/libs/getEquipment";
import EquipmentForm from "@/components/EquipmentForm";
import StateMessage from "@/components/StateMessage";
import { NotFoundError } from "@/libs/apiErrors";
import type { Equipment } from "@/types";

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/equipment");
  }

  const { id } = await params;
  let equipment: Equipment | null = null;
  try {
    equipment = (await getEquipment(id)).data;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
  }

  if (!equipment) {
    return (
      <main className="px-6 py-14">
        <StateMessage
          pose="confused"
          title="Oops, Snappy tripped!"
          actions={
            <Link href="/equipment" className="btn btn-primary">
              Back to equipment
            </Link>
          }
        >
          We could not load this equipment. Please try again in a moment.
        </StateMessage>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 sm:py-14">
      <section className="mx-auto max-w-2xl glass rounded-card p-7 sm:p-10">
        <Link
          href="/equipment"
          className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-grey transition-colors hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
        >
          <span aria-hidden="true">←</span> Back to equipment
        </Link>

        <header className="mt-5 rounded-2xl bg-white/50 p-5 sm:p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-pink-dark sm:text-3xl">
            Edit equipment
          </h1>
          <p className="mt-3 break-words text-sm leading-7 text-grey">
            Update the details for{" "}
            <span className="font-medium text-foreground">
              {equipment.name}
            </span>
            .
          </p>
        </header>
        <EquipmentForm key={equipment._id} equipment={equipment} />
      </section>
    </main>
  );
}
