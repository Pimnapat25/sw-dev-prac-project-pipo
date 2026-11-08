"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import createEquipment from "@/libs/createEquipment";
import updateEquipment from "@/libs/updateEquipment";
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
        description: description.trim(),
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
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="equipment-name"
          className="mb-1 block text-sm font-semibold text-grey"
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
          className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
        />
      </div>
      <div>
        <label
          htmlFor="equipment-category"
          className="mb-1 block text-sm font-semibold text-grey"
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
          className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
        />
      </div>

      <div>
        <label
          htmlFor="equipment-description"
          className="mb-1 block text-sm font-semibold text-grey"
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
          className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
        />
      </div>
      <div>
        <label
          htmlFor="equipment-quantity"
          className="mb-1 block text-sm font-semibold text-grey"
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
          className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
        />
      </div>

      <div>
        <label
          htmlFor="equipment-rate"
          className="mb-1 block text-sm font-semibold text-grey"
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
          className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || status === "loading"}
        className="w-full rounded-full bg-pink px-6 py-2 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Saving…" : equipment ? "Save changes" : "Add equipment"}
      </button>
    </form>
  );
}
