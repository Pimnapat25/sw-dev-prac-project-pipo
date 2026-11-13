import type { Equipment } from "@/types";

// The backend has no icon field (it drops unknown properties), so the chosen
// icon rides along at the end of the description as "[icon:<kind>]".
const MARK = /\s*\[icon:([a-z]+)\]\s*$/;

export function encodeDescription(description: string, icon?: string): string {
  return icon ? `${description}\n[icon:${icon}]` : description;
}

export function withIcon<T extends Equipment | null | undefined>(equipment: T): T {
  if (!equipment || typeof equipment.description !== "string") return equipment;
  const match = equipment.description.match(MARK);
  if (!match) return equipment;
  return {
    ...equipment,
    description: equipment.description.replace(MARK, ""),
    icon: match[1],
  };
}
