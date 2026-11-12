"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import createRental from "@/libs/createRental";
import updateRental from "@/libs/updateRental";
import validateRental, {
  MAX_QTY_PER_REQUEST,
  todayBangkok,
} from "@/libs/validateRental";
import type { Equipment, Rental } from "@/types";

const fieldClass =
  "min-h-12 w-full rounded-xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light";
const labelClass = "mb-2 block text-sm font-medium text-foreground";

export default function RentalForm({
  equipments,
  rental,
  defaultEquipmentId,
}: {
  equipments: Equipment[];
  rental?: Rental;
  defaultEquipmentId?: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [equipmentId, setEquipmentId] = useState(
    rental?.equipment._id ?? defaultEquipmentId ?? "",
  );
  const [quantity, setQuantity] = useState(String(rental?.quantity ?? 1));
  const [startDate, setStartDate] = useState(
    rental?.startDate.slice(0, 10) ?? todayBangkok(),
  );
  const [returnDate, setReturnDate] = useState(
    rental?.returnDate.slice(0, 10) ?? todayBangkok(),
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = equipments.find((e) => e._id === equipmentId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || status === "loading") return;
    setError("");

    if (!session?.user.token) {
      setError("Please sign in to continue.");
      return;
    }
    if (!equipmentId) {
      setError("Please choose equipment.");
      return;
    }

    const message = validateRental(
      { quantity: Number(quantity), startDate, returnDate },
      selected?.quantity,
    );
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    try {
      const data = {
        equipment: equipmentId,
        quantity: Number(quantity),
        startDate,
        returnDate,
      };
      if (rental) {
        await updateRental(rental._id, data, session.user.token);
      } else {
        await createRental(data, session.user.token);
      }
      router.push("/rentals");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save rental request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="rental-equipment" className={labelClass}>
          Equipment
        </label>
        <select
          id="rental-equipment"
          required
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
          className={fieldClass}
        >
          <option value="" disabled>
            Select equipment
          </option>
          {equipments.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name} ({e.quantity} available)
            </option>
          ))}
        </select>
        {equipmentId && (
          <p className="mt-2 break-all text-xs text-grey">
            Equipment ID: {equipmentId}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="rental-quantity" className={labelClass}>
          Quantity (max {MAX_QTY_PER_REQUEST})
        </label>
        <input
          id="rental-quantity"
          type="number"
          min={1}
          max={MAX_QTY_PER_REQUEST}
          step={1}
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="rental-start" className={labelClass}>
          Start date
        </label>
        <input
          id="rental-start"
          type="date"
          min={todayBangkok()}
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="rental-return" className={labelClass}>
          Return date
        </label>
        <input
          id="rental-return"
          type="date"
          min={startDate || todayBangkok()}
          required
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className={fieldClass}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-pink/20 bg-pink-light/40 px-4 py-3 text-sm leading-6 text-pink-dark sm:col-span-2"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || status === "loading"}
        className="min-h-12 w-full rounded-full bg-pink-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-dark/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
      >
        {loading ? "Saving…" : rental ? "Save changes" : "Create request"}
      </button>
    </form>
  );
}
