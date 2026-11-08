import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import EquipmentForm from "@/components/EquipmentForm";

export default async function NewEquipmentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/equipment");
  }

  return (
    <main className="min-h-screen bg-pink-light px-6 py-10">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">
        <Link href="/equipment" className="text-sm font-semibold text-pink">
          Back to equipment
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-pink">Add equipment</h1>

        <p className="mt-2 text-sm text-grey">
          Enter the details of the equipment you want to offer for rental.
        </p>

        <EquipmentForm />
      </section>
    </main>
  );
}
