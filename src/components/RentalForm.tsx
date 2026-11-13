"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CategoryIcon from "@/components/CategoryIcon";
import Snappy from "@/components/Snappy";
import createRental from "@/libs/createRental";
import updateRental from "@/libs/updateRental";
import formatBaht from "@/libs/formatBaht";
import { addDays, estimateTotal, rentalDays } from "@/libs/rentalInfo";
import validateRental, {
  MAX_QTY_PER_REQUEST,
  MAX_RENTAL_DAYS,
  todayBangkok,
} from "@/libs/validateRental";
import type { Equipment, Rental } from "@/types";

const STEPS = ["Pick gear", "Choose dates", "Confirm"];

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
  const today = todayBangkok();
  const [step, setStep] = useState(0);
  const [equipmentId, setEquipmentId] = useState(
    rental?.equipment?._id ?? defaultEquipmentId ?? "",
  );
  const [quantity, setQuantity] = useState(rental?.quantity ?? 1);
  const [startDate, setStartDate] = useState(
    rental?.startDate.slice(0, 10) ?? today,
  );
  const [returnDate, setReturnDate] = useState(
    rental?.returnDate.slice(0, 10) ?? today,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = equipments.find((e) => e._id === equipmentId);
  const maxQty = Math.min(MAX_QTY_PER_REQUEST, selected?.quantity ?? 1);
  const days = rentalDays(startDate, returnDate);
  const total = selected
    ? estimateTotal(quantity, selected.rentalRate, startDate, returnDate)
    : 0;

  const pickEquipment = (equipment: Equipment) => {
    setEquipmentId(equipment._id);
    setQuantity((q) =>
      Math.min(q, Math.min(MAX_QTY_PER_REQUEST, equipment.quantity)),
    );
  };

  const changeStart = (value: string) => {
    setStartDate(value);
    // keep the return date inside [start, start + 7 days]
    if (returnDate < value) setReturnDate(value);
    else if (returnDate > addDays(value, MAX_RENTAL_DAYS))
      setReturnDate(addDays(value, MAX_RENTAL_DAYS));
  };

  const validate = (): string | null => {
    if (!equipmentId || !selected) return "Please choose equipment.";
    return validateRental(
      { quantity, startDate, returnDate },
      selected.quantity,
    );
  };

  const next = () => {
    const message = step === 0 && !selected ? "Please choose equipment." : step === 1 ? validate() : null;
    setError(message ?? "");
    if (!message) setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 2) return next();
    if (loading || status === "loading") return;
    setError("");

    if (!session?.user.token) {
      setError("Please sign in to continue.");
      return;
    }
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    try {
      const data = { equipment: equipmentId, quantity, startDate, returnDate };
      if (rental) {
        await updateRental(rental._id, data, session.user.token);
      } else {
        await createRental(data, session.user.token);
      }
      router.push("/rentals?saved=1");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && !(err instanceof TypeError)
          ? err.message
          : "Oops, Snappy tripped! Try again?",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-6 lg:grid-cols-[1fr_17rem]"
    >
      <div>
        <ol className="flex flex-wrap gap-2" aria-label="Steps">
          {STEPS.map((label, i) => (
            <li
              key={label}
              aria-current={i === step ? "step" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                i === step
                  ? "bg-pink text-white"
                  : i < step
                    ? "bg-gold text-grey"
                    : "bg-white/70 text-grey"
              }`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <fieldset className="mt-6">
            <legend className="label">Equipment</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {equipments.map((equipment) => {
                const out = equipment.quantity < 1;
                return (
                  <label
                    key={equipment._id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pink-dark ${
                      equipment._id === equipmentId
                        ? "border-pink bg-white shadow-soft"
                        : "border-white/80 bg-white/50 hover:bg-white/80"
                    } ${out ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      type="radio"
                      name="equipment"
                      className="sr-only"
                      checked={equipment._id === equipmentId}
                      disabled={out}
                      onChange={() => pickEquipment(equipment)}
                    />
                    <CategoryIcon
                      category={equipment.category}
                      name={equipment.name}
                      icon={equipment.icon}
                      className="size-14 shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="block break-words text-sm font-bold text-pink-dark">
                        {equipment.name}
                      </span>
                      <span className="block text-xs text-grey">
                        {out ? "Out of stock" : `${equipment.quantity} left`} ·{" "}
                        {formatBaht(equipment.rentalRate)} / day
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-6">
              <p className="label" id="qty-label">
                Quantity (max {MAX_QTY_PER_REQUEST})
              </p>
              <div
                role="group"
                aria-labelledby="qty-label"
                className="inline-flex items-center gap-4 rounded-full bg-white/70 p-1.5"
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="btn btn-soft size-11 px-0 text-xl"
                >
                  -
                </button>
                <output className="w-6 text-center text-xl font-extrabold tabular-nums text-pink-dark">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= maxQty}
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn btn-soft size-11 px-0 text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="rental-start" className="label">
                Start date
              </label>
              <input
                id="rental-start"
                type="date"
                min={today}
                required
                value={startDate}
                onChange={(e) => changeStart(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="rental-return" className="label">
                Return date
              </label>
              <input
                id="rental-return"
                type="date"
                min={startDate || today}
                max={startDate ? addDays(startDate, MAX_RENTAL_DAYS) : undefined}
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="field"
              />
            </div>
            <p className="text-sm text-grey sm:col-span-2">
              Up to {MAX_RENTAL_DAYS} days per request. Same-day returns are
              fine.
            </p>
          </div>
        )}

        {step === 2 && (
          <p className="mt-6 rounded-2xl bg-white/60 p-4 text-base leading-7 text-grey">
            Check the summary, then send your request. Submitting does not
            change the available quantity.
          </p>
        )}

        {error && (
          <p role="alert" className="alert mt-5">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 && (
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => {
                setError("");
                setStep(step - 1);
              }}
            >
              Back
            </button>
          )}
          {step < 2 ? (
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || status === "loading"}
              className="btn btn-primary"
            >
              {loading ? "Saving…" : rental ? "Save changes" : "Send request"}
            </button>
          )}
        </div>
      </div>

      <aside
        aria-label="Request summary"
        className="glass h-fit rounded-card p-5 text-center"
      >
        <Snappy pose="clipboard" size={120} className="mx-auto" />
        <h2 className="mt-2 text-lg font-extrabold text-pink-dark">Summary</h2>
        <dl className="mt-3 space-y-2 text-left text-sm text-grey">
          <div className="flex justify-between gap-3">
            <dt>Item</dt>
            <dd className="break-words text-right font-semibold">
              {selected?.name ?? "Not chosen"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Quantity</dt>
            <dd className="font-semibold">{quantity}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Dates</dt>
            <dd className="text-right font-semibold">
              {startDate} to {returnDate}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Days</dt>
            <dd className="font-semibold">{Math.max(days, 1)}</dd>
          </div>
        </dl>
        <p className="mt-4 rounded-2xl bg-gold/40 px-3 py-2 text-lg font-extrabold tabular-nums text-grey">
          {formatBaht(total)}
          <span className="block text-xs font-medium">estimated total</span>
        </p>
      </aside>
    </form>
  );
}
