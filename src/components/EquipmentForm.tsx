"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import createEquipment from "@/libs/createEquipment";
import updateEquipment from "@/libs/updateEquipment";
import CategoryIcon from "@/components/CategoryIcon";
import { ICON_OPTIONS } from "@/libs/categoryArt";
import { encodeDescription } from "@/libs/equipmentIcon";
import type { Equipment } from "@/types";

export default function EquipmentForm({
  equipment,
}: {
  equipment?: Equipment;
}) {
  const [name, setName] = useState(equipment?.name ?? "");
  const [category, setCategory] = useState(equipment?.category ?? "");
  const [description, setDescription] = useState(equipment?.description ?? "");
  const [quantity, setQuantity] = useState(
    equipment ? String(equipment.quantity) : "",
  );
  const [rentalRate, setRentalRate] = useState(
    equipment ? String(equipment.rentalRate) : "",
  );
  const [icon, setIcon] = useState(equipment?.icon ?? "");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || status === "loading") return;
    setError("");

    if (session?.user.role !== "admin" || !session.user.token) {
      setError("Please sign in with an admin account.");
      return;
    }

    if (!name.trim() || !category.trim() || !description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    const quantityNumber = Number(quantity);
    const rateNumber = Number(rentalRate);

    if (
      quantity.trim() === "" ||
      !Number.isInteger(quantityNumber) ||
      quantityNumber < 0
    ) {
      setError("Quantity must be a non-negative whole number.");
      return;
    }

    if (
      rentalRate.trim() === "" ||
      !Number.isFinite(rateNumber) ||
      rateNumber < 0
    ) {
      setError("Rental rate must be a non-negative number.");
      return;
    }

    setLoading(true);

    try {
      const equipmentData = {
        name: name.trim(),
        category: category.trim(),
        description: encodeDescription(description.trim(), icon || undefined),
        quantity: quantityNumber,
        rentalRate: rateNumber,
      };

      if (equipment) {
        await updateEquipment(equipment._id, equipmentData, session.user.token);
      } else {
        await createEquipment(equipmentData, session.user.token);
      }

      router.push("/equipment");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save equipment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <div>
        <label
          htmlFor="equipment-name"
          className="label"
        >
          Equipment name
        </label>

        <input
          id="equipment-name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Canon EOS R50"
          className="field"
        />
      </div>
      <div>
        <label
          htmlFor="equipment-category"
          className="label"
        >
          Category
        </label>

        <input
          id="equipment-category"
          name="category"
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Camera"
          className="field"
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="equipment-description"
          className="label"
        >
          Description
        </label>

        <textarea
          id="equipment-description"
          name="description"
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the equipment and what is included."
          className="field"
        />
      </div>
      <fieldset className="sm:col-span-2">
        <legend className="label">Icon</legend>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          <button
            type="button"
            aria-pressed={icon === ""}
            onClick={() => setIcon("")}
            className={`flex flex-col items-center gap-1 rounded-2xl p-2 text-xs font-semibold text-grey ${
              icon === "" ? "bg-pink-light ring-2 ring-pink" : "bg-white/50"
            }`}
          >
            <CategoryIcon category={category} name={name} className="size-12" />
            Automatic
          </button>
          {ICON_OPTIONS.map((o) => (
            <button
              key={o.kind}
              type="button"
              aria-pressed={icon === o.kind}
              onClick={() => setIcon(o.kind)}
              className={`flex flex-col items-center gap-1 rounded-2xl p-2 text-xs font-semibold text-grey ${
                icon === o.kind ? "bg-pink-light ring-2 ring-pink" : "bg-white/50"
              }`}
            >
              <CategoryIcon category="" icon={o.kind} className="size-12" />
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label
          htmlFor="equipment-quantity"
          className="label"
        >
          Available quantity
        </label>

        <input
          id="equipment-quantity"
          name="quantity"
          type="number"
          min={0}
          step={1}
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 5"
          className="field"
        />
      </div>

      <div>
        <label
          htmlFor="equipment-rate"
          className="label"
        >
          Rental rate
        </label>

        <input
          id="equipment-rate"
          name="rentalRate"
          type="number"
          min={0}
          step="0.01"
          required
          value={rentalRate}
          onChange={(e) => setRentalRate(e.target.value)}
          placeholder="e.g. 250.00"
          className="field"
        />
      </div>
      {error && (
        <p
          role="alert"
          className="alert sm:col-span-2"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || status === "loading"}
        className="btn btn-primary w-full sm:col-span-2"
      >
        {loading ? "Saving…" : equipment ? "Save changes" : "Add equipment"}
      </button>
    </form>
  );
}
