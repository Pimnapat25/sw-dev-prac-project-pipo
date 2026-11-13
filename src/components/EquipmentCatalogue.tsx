"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import formatBaht from "@/libs/formatBaht";
import type { Equipment } from "@/types";

type Sort = "default" | "name" | "priceLow" | "priceHigh" | "stock";
const SORTS: Record<Sort, (a: Equipment, b: Equipment) => number> = {
  default: () => 0,
  name: (a, b) => a.name.localeCompare(b.name),
  priceLow: (a, b) => a.rentalRate - b.rentalRate,
  priceHigh: (a, b) => b.rentalRate - a.rentalRate,
  stock: (a, b) => b.quantity - a.quantity,
};

export default function EquipmentCatalogue({
  equipments,
  role,
}: {
  equipments: Equipment[];
  role?: "admin" | "member";
}) {
  const categories = ["All", ...new Set(equipments.map((e) => e.category))];
  const [selected, setSelected] = useState("All");
  // Restore the filter after returning from the add/edit pages (they remount this list).
  useEffect(() => {
    const saved = sessionStorage.getItem("equipmentCategory");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setSelected(saved);
  }, []);
  // A deleted last item removes its category; fall back to "All" instead of showing nothing.
  const current = categories.includes(selected) ? selected : "All";
  const active = categories.indexOf(current);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const needle = query.trim().toLowerCase();
  const visible = equipments
    .filter((e) => current === "All" || e.category === current)
    .filter(
      (e) =>
        !needle ||
        `${e.name} ${e.category} ${e.description}`.toLowerCase().includes(needle),
    )
    .sort(SORTS[sort]);

  return (
    <>
      {categories.length > 2 && (
        <div className="mt-8 flex max-w-full justify-start overflow-x-auto overflow-y-hidden px-1 pb-5 -mb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <LiquidNavbar
            tone="light"
            compact={false}
            items={categories.map((label) => ({ label, fx: "none" as const }))}
            active={active}
            onChange={(i) => {
              setSelected(categories[i]);
              sessionStorage.setItem("equipmentCategory", categories[i]);
            }}
            className="shrink-0"
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search equipment"
          aria-label="Search equipment"
          className="field max-w-xs flex-1"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort equipment"
          className="field w-auto"
        >
          <option value="default">Sort: Default</option>
          <option value="name">Name A–Z</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
          <option value="stock">Most available</option>
        </select>
      </div>

      <p className="mt-4 text-sm font-medium text-grey" aria-live="polite">
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
