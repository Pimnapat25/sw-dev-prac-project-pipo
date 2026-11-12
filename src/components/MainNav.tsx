"use client";

import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LiquidNavbar,
  NimbusIcons,
  type LiquidNavItem,
} from "@/components/ui/liquid-glass-navbar";

const icon = (d: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
);
const cameraIcon = icon(
  <>
    <rect x="3" y="7" width="18" height="13" rx="4" />
    <path d="M9 7l1.5-3h3L15 7" />
    <circle cx="12" cy="13.5" r="3.5" />
  </>,
);
const ticketIcon = icon(
  <>
    <path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 0 0-6V6H3Z" />
    <path d="M14 6v12" strokeDasharray="2 3" />
  </>,
);
const outIcon = icon(
  <>
    <path d="M10 4H5v16h5" />
    <path d="M15 8l4 4-4 4M19 12H9" />
  </>,
);

type NavItem = LiquidNavItem & { path: string };

export default function MainNav({
  user,
}: {
  user: { name: string; role: "admin" | "member" } | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const items: NavItem[] = [
    { label: "Home", path: "/", icon: NimbusIcons.home, fx: "glow" },
    { label: "Equipment", path: "/equipment", icon: cameraIcon, fx: "pop" },
  ];
  if (user) {
    items.push(
      {
        label: user.role === "admin" ? "All rentals" : "My rentals",
        path: "/rentals",
        icon: ticketIcon,
        fx: "pop",
      },
      { label: "Sign out", path: "", icon: outIcon, fx: "wave" },
    );
  } else {
    items.push({ label: "Sign in", path: "/login", icon: NimbusIcons.user, fx: "wave" });
  }

  // /register is part of the sign-in group; unknown pages fall back to Home.
  const current = pathname === "/register" ? "/login" : pathname;
  const found = items.findIndex(
    (item) =>
      item.path &&
      (item.path === "/" ? current === "/" : current.startsWith(item.path)),
  );

  return (
    <div className="pointer-events-none sticky top-3 z-50 flex items-center justify-center gap-3 px-3 pt-3">
      <div className="pointer-events-auto">
        <LiquidNavbar
          tone="light"
          items={items}
          active={found === -1 ? 0 : found}
          onChange={(_, item) => {
            const target = (item as NavItem).path;
            if (target) router.push(target);
            else signOut({ callbackUrl: "/" });
          }}
        />
      </div>
      {user && (
        <p className="glass pointer-events-auto hidden max-w-40 truncate rounded-full px-4 py-2 text-sm font-semibold text-pink-dark md:block">
          Hi, {user.name}
        </p>
      )}
    </div>
  );
}
