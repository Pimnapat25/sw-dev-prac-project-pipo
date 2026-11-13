"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import formatBaht from "@/libs/formatBaht";
import type { Equipment } from "@/types";

export default function EquipmentCatalogue({
  equipments,
  role,
}: {
  equipments: Equipment[];
  role?: "admin" | "member";
}) {
  const categories = ["All", ...new Set(equipments.map((e) => e.category))];
  const [selected, setSelected] = useState("All");
  // A deleted last item removes its category; fall back to "All" instead of showing nothing.
  const current = categories.includes(selected) ? selected : "All";
  const active = categories.indexOf(current);
  const visible =
    current === "All"
      ? equipments
      : equipments.filter((e) => e.category === current);

  return (
    <>
      {categories.length > 2 && (
        <div className="mt-8 flex max-w-full justify-start overflow-x-auto pb-2">
          <LiquidNavbar
            tone="light"
            compact={false}
            items={categories.map((label) => ({ label, fx: "none" as const }))}
            active={active}
            onChange={(i) => setSelected(categories[i])}
            className="shrink-0"
          />
        </div>
      )}

      <p className="mt-6 text-sm font-medium text-grey" aria-live="polite">
        {visible.length} {visible.length === 1 ? "item" : "items"} to browse
      </p>

      <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((equipment) => (
          <article
            key={equipment._id}
            className="glass tilt relative flex min-w-0 flex-col rounded-card p-6 pt-14"
          >
            <CategoryIcon
              category={equipment.category}
              name={equipment.name}
              icon={equipment.icon}
              className="absolute -top-9 left-5 size-24 drop-shadow-md"
            />
            <div className="absolute right-5 top-5 flex flex-col items-end gap-2">
              <p
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  equipment.quantity > 0 ? "bg-gold text-grey" : "bg-grey/15 text-grey"
                }`}
              >
                {equipment.quantity > 0 ? `${equipment.quantity} left` : "Out"}
              </p>
              <p className="max-w-full break-words rounded-full bg-pink-light px-3 py-1 text-xs font-semibold text-pink-dark">
                {equipment.category}
              </p>
            </div>

            <h2 className="mt-5 break-words text-xl font-bold text-pink-dark">
              {equipment.name}
            </h2>
            <p className="mt-2 flex-1 break-words whitespace-pre-line text-sm leading-7 text-grey">
              {equipment.description}
            </p>

            <p className="mt-5 text-2xl font-bold tabular-nums text-pink-dark">
              {formatBaht(equipment.rentalRate)}{" "}
              <span className="text-sm font-medium text-grey">/ day</span>
            </p>

            {role === "member" && (
              <div className="mt-4">
                {equipment.quantity > 0 ? (
                  <Link
                    href={`/rentals/new?equipment=${equipment._id}`}
                    className="btn btn-primary"
                  >
                    Request rental
                  </Link>
                ) : (
                  <p className="text-sm text-grey">Snappy is out of stock.</p>
                )}
              </div>
            )}
            {role === "admin" && (
              <div className="mt-4 flex flex-wrap items-start gap-3">
                <Link
                  href={`/equipment/${equipment._id}/edit`}
                  className="btn btn-soft"
                >
                  Edit
                </Link>
                <DeleteEquipmentButton id={equipment._id} name={equipment.name} />
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
