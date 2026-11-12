// Clay-style category illustrations as tiny SVG strings (viewBox 0 0 120 120).
// Reused by cards, the home hero and the carousel, so no image files to load.
export type CategoryKind = "camera" | "projector" | "laptop" | "ball" | "box";

const P = "#DE5C8E";
const L = "#F8E1EA";
const G = "#E9C869";
const D = "#58595B";
const shadow = `<ellipse cx="60" cy="104" rx="38" ry="6" fill="${D}" opacity=".15"/>`;
const shine = (x: number, y: number, rx: number, ry: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45"/>`;

const ART: Record<CategoryKind, string> = {
  camera:
    shadow +
    `<rect x="40" y="26" width="30" height="16" rx="7" fill="${P}"/>` +
    `<rect x="78" y="24" width="14" height="9" rx="4" fill="${G}"/>` +
    `<rect x="12" y="36" width="96" height="64" rx="22" fill="${P}"/>` +
    `<rect x="12" y="84" width="96" height="16" rx="8" fill="#A83260" opacity=".18"/>` +
    shine(32, 48, 14, 5) +
    `<circle cx="60" cy="68" r="26" fill="${L}"/><circle cx="60" cy="68" r="17" fill="${D}"/>` +
    `<circle cx="54" cy="62" r="5" fill="#fff"/><circle cx="67" cy="75" r="2.5" fill="#fff"/>`,
  projector:
    shadow +
    `<rect x="12" y="40" width="96" height="52" rx="18" fill="${L}" stroke="${P}" stroke-width="3"/>` +
    `<rect x="12" y="78" width="96" height="14" rx="7" fill="${P}" opacity=".2"/>` +
    shine(32, 50, 12, 4) +
    `<circle cx="82" cy="66" r="18" fill="${G}"/><circle cx="82" cy="66" r="11" fill="${D}"/>` +
    `<circle cx="78" cy="62" r="3.5" fill="#fff"/>` +
    `<path d="M26 58h22M26 68h22M26 78h14" stroke="${P}" stroke-width="4" stroke-linecap="round"/>` +
    `<rect x="26" y="92" width="14" height="6" rx="3" fill="${P}"/><rect x="80" y="92" width="14" height="6" rx="3" fill="${P}"/>`,
  laptop:
    shadow +
    `<rect x="24" y="22" width="72" height="54" rx="10" fill="${P}"/>` +
    `<rect x="31" y="29" width="58" height="40" rx="5" fill="${L}"/>` +
    shine(44, 36, 10, 3) +
    `<circle cx="60" cy="49" r="8" fill="${G}"/>` +
    `<path d="M8 80h104l-8 16a6 6 0 0 1-5 3H21a6 6 0 0 1-5-3Z" fill="${G}"/>` +
    `<rect x="48" y="82" width="24" height="5" rx="2.5" fill="#fff" opacity=".6"/>`,
  ball:
    shadow +
    `<circle cx="60" cy="58" r="40" fill="${G}"/>` +
    `<path d="M60 18v80M20 58h80M32 30q28 28 0 56M88 30q-28 28 0 56" stroke="${P}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
    shine(44, 40, 12, 7),
  box:
    shadow +
    `<rect x="16" y="40" width="88" height="58" rx="14" fill="${P}"/>` +
    `<rect x="12" y="30" width="96" height="22" rx="10" fill="${L}"/>` +
    `<rect x="52" y="30" width="16" height="68" fill="${G}"/>` +
    `<path d="M60 30q-18-20-24-8t24 8Zm0 0q18-20 24-8t-24 8Z" fill="${G}"/>` +
    shine(30, 66, 10, 4),
};

export function categoryKind(category: string): CategoryKind {
  const c = category.toLowerCase();
  if (c.includes("camera")) return "camera";
  if (c.includes("project")) return "projector";
  if (/notebook|laptop|computer/.test(c)) return "laptop";
  if (/sport|ball/.test(c)) return "ball";
  return "box";
}

export function categoryArt(category: string): string {
  return ART[categoryKind(category)];
}

export function categoryImage(category: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${categoryArt(category)}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const ACCENTS = ["#DE5C8E", "#E9C869", "#A83260", "#F08DB0"];
