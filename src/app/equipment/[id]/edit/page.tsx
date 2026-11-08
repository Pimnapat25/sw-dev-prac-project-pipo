import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getEquipment from "@/libs/getEquipment";
import EquipmentForm from "@/components/EquipmentForm";

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
  const equipmentResponse = await getEquipment(id);
  const equipment = equipmentResponse.data;

  return (
    <main className="min-h-screen bg-pink-light px-6 py-10">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">
        <Link href="/equipment" className="text-sm font-semibold text-pink">
          Back to equipment
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-pink">Edit equipment</h1>

        <p className="mt-4 text-grey">Selected equipment: {equipment.name}</p>
        <EquipmentForm key={equipment._id} equipment={equipment} />
      </section>
    </main>
  );
}
