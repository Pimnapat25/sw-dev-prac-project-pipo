"use client";

import { useState } from "react";
import RentalTicket from "@/components/RentalTicket";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import { rentalStatus } from "@/libs/rentalInfo";
import type { Rental } from "@/types";

const TABS = ["All", "Upcoming", "Active", "Past"] as const;

export default function RentalList({
  rentals,
  isAdmin,
}: {
  rentals: Rental[];
  isAdmin: boolean;
}) {
  const [tab, setTab] = useState(0);
  const withStatus = rentals.map((r) => ({
    rental: r,
    status: rentalStatus(r.startDate, r.returnDate),
  }));
  const count = (t: (typeof TABS)[number]) =>
    t === "All" ? rentals.length : withStatus.filter((r) => r.status === t).length;
  const visible = withStatus.filter((r) => tab === 0 || r.status === TABS[tab]);

  return (
    <>
      <div className="mt-8 flex max-w-full justify-start overflow-x-auto overflow-y-hidden px-1 pb-5 -mb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <LiquidNavbar
          tone="light"
          compact={false}
          items={TABS.map((t) => ({ label: `${t} (${count(t)})`, fx: "none" as const }))}
          active={tab}
          onChange={(i) => setTab(i)}
          className="shrink-0"
        />
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-grey">No {TABS[tab].toLowerCase()} rentals.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ rental }) => (
            <RentalTicket key={rental._id} rental={rental} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </>
  );
}
