"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import deleteRental from "@/libs/deleteRental";

export default function DeleteRentalButton({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (loading || status === "loading") return;
    setError("");

    if (!session?.user.token) {
      setError("Please sign in to continue.");
      return;
    }
    if (!window.confirm("Delete this rental request?")) return;

    setLoading(true);
    try {
      await deleteRental(id, session.user.token);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete rental request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading || status === "loading"}
        className="min-h-11 cursor-pointer rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
