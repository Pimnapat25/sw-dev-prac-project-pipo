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
    <main className="px-6 py-10 sm:py-14">
      <section className="mx-auto max-w-2xl rounded-3xl border border-pink/10 bg-white p-7 shadow-[0_8px_28px_-20px_#de5c8e] sm:p-10">
        <Link
          href="/equipment"
          className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-grey transition-colors hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
        >
          <span aria-hidden="true">←</span> Back to equipment
        </Link>

        <header className="mt-5 rounded-2xl bg-pink-light/35 p-5 sm:p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-pink-dark sm:text-3xl">
            Add equipment
          </h1>
          <p className="mt-3 text-sm leading-7 text-grey">
            Add the details below so members can find what they need.
          </p>
        </header>

        <EquipmentForm />
      </section>
    </main>
  );
}
