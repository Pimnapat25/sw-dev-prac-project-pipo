// Clay-style category illustrations as tiny SVG strings (viewBox 0 0 120 120).
// Reused by cards, the home hero and the carousel, so no image files to load.
export type CategoryKind =
  | "camera"
  | "projector"
  | "laptop"
  | "ball"
  | "box"
  | "actioncam"
  | "minipro"
  | "racket"
  | "soccer"
  | "drone"
  | "headphones"
  | "microphone"
  | "speaker"
  | "tripod"
  | "keyboard"
  | "mouse"
  | "phone"
  | "tablet"
  | "gamepad"
  | "light"
  | "powerbank"
  | "tent"
  | "bike"
  | "backpack"
  | "tennis";

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
  actioncam:
    shadow +
    `<rect x="30" y="30" width="60" height="58" rx="16" fill="${P}"/>` +
    `<rect x="38" y="36" width="30" height="10" rx="5" fill="${L}"/>` +
    `<rect x="74" y="38" width="10" height="14" rx="4" fill="${G}"/>` +
    shine(42, 40, 8, 3) +
    `<circle cx="60" cy="64" r="19" fill="${L}"/><circle cx="60" cy="64" r="12" fill="${D}"/>` +
    `<circle cx="56" cy="60" r="3.5" fill="#fff"/>` +
    `<rect x="46" y="88" width="28" height="10" rx="3" fill="${G}"/>`,
  minipro:
    shadow +
    `<rect x="26" y="34" width="68" height="62" rx="20" fill="${L}" stroke="${P}" stroke-width="3"/>` +
    shine(42, 46, 10, 4) +
    `<circle cx="60" cy="62" r="19" fill="${G}"/><circle cx="60" cy="62" r="12" fill="${D}"/>` +
    `<circle cx="56" cy="58" r="3.5" fill="#fff"/>` +
    `<path d="M42 86h36" stroke="${P}" stroke-width="4" stroke-linecap="round"/>`,
  racket:
    shadow +
    `<g transform="rotate(35 60 56)"><rect x="55" y="62" width="10" height="40" rx="5" fill="${G}"/>` +
    `<ellipse cx="60" cy="38" rx="24" ry="30" fill="${L}" stroke="${P}" stroke-width="5"/>` +
    `<path d="M60 10v56M40 24h40M38 38h44M40 52h40" stroke="${P}" stroke-width="2" opacity=".55"/></g>` +
    `<path d="M84 82l8 16 8-16Z" fill="#fff" stroke="${P}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<circle cx="92" cy="80" r="6" fill="${G}"/>`,
  soccer:
    shadow +
    `<circle cx="60" cy="58" r="40" fill="#fff" stroke="${P}" stroke-width="3"/>` +
    `<path d="M60 40l17 12-6 20H49l-6-20Z" fill="${D}"/>` +
    `<path d="M60 40V20M77 52l19-6M71 72l12 16M49 72L37 88M43 52l-19-6" stroke="${D}" stroke-width="3" stroke-linecap="round"/>` +
    shine(44, 34, 10, 5),
  drone:
    shadow +
    `<path d="M26 40L94 76M94 40L26 76" stroke="${P}" stroke-width="7" stroke-linecap="round"/>` +
    [[24, 36], [96, 36], [24, 72], [96, 72]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="5" fill="${L}" stroke="${P}" stroke-width="2.5"/>`)
      .join("") +
    `<rect x="42" y="42" width="36" height="28" rx="12" fill="${P}"/><circle cx="60" cy="58" r="8" fill="${D}"/>` +
    `<circle cx="57" cy="55" r="2.5" fill="#fff"/>`,
  headphones:
    shadow +
    `<path d="M24 74V58a36 36 0 0 1 72 0v16" fill="none" stroke="${P}" stroke-width="9" stroke-linecap="round"/>` +
    `<rect x="14" y="62" width="24" height="38" rx="11" fill="${G}"/><rect x="82" y="62" width="24" height="38" rx="11" fill="${G}"/>` +
    `<rect x="20" y="70" width="12" height="22" rx="6" fill="${P}"/><rect x="88" y="70" width="12" height="22" rx="6" fill="${P}"/>`,
  microphone:
    shadow +
    `<rect x="42" y="12" width="36" height="52" rx="18" fill="${P}"/>` +
    `<path d="M47 28h26M47 38h26M47 48h26" stroke="${L}" stroke-width="3" opacity=".7"/>` +
    shine(51, 24, 4, 7) +
    `<path d="M32 52a28 28 0 0 0 56 0" fill="none" stroke="${G}" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="M60 80v14" stroke="${G}" stroke-width="7"/><rect x="40" y="92" width="40" height="9" rx="4.5" fill="${G}"/>`,
  speaker:
    shadow +
    `<rect x="28" y="12" width="64" height="90" rx="18" fill="${P}"/>` +
    shine(40, 24, 5, 8) +
    `<circle cx="60" cy="36" r="9" fill="${L}"/><circle cx="60" cy="72" r="20" fill="${L}"/>` +
    `<circle cx="60" cy="72" r="12" fill="${D}"/><circle cx="56" cy="68" r="3" fill="#fff"/>`,
  tripod:
    shadow +
    `<path d="M60 52L30 100M60 52L90 100M60 52v48" stroke="${G}" stroke-width="7" stroke-linecap="round"/>` +
    `<rect x="38" y="38" width="44" height="18" rx="8" fill="${P}"/>` +
    `<rect x="46" y="12" width="28" height="28" rx="9" fill="${D}"/><circle cx="60" cy="26" r="7" fill="${L}"/>`,
  keyboard:
    shadow +
    `<rect x="10" y="32" width="100" height="62" rx="14" fill="${P}"/>` +
    [46, 60]
      .map((y, r) =>
        [0, 1, 2, 3, 4].map((i) => `<rect x="${20 + i * 17 + r * 6}" y="${y}" width="12" height="10" rx="3" fill="${L}"/>`).join(""),
      )
      .join("") +
    `<rect x="30" y="76" width="60" height="10" rx="4" fill="${G}"/>`,
  mouse:
    shadow +
    `<rect x="34" y="14" width="52" height="88" rx="26" fill="${P}"/>` +
    `<path d="M60 14v36M34 50h52" stroke="${L}" stroke-width="3" opacity=".7"/>` +
    `<rect x="55" y="24" width="10" height="16" rx="5" fill="${G}"/>` +
    shine(46, 30, 5, 9),
  phone:
    shadow +
    `<rect x="32" y="8" width="56" height="96" rx="14" fill="${P}"/>` +
    `<rect x="38" y="18" width="44" height="70" rx="6" fill="${L}"/>` +
    `<circle cx="60" cy="52" r="11" fill="${G}"/>` +
    shine(46, 26, 6, 3) +
    `<rect x="52" y="93" width="16" height="4" rx="2" fill="${L}"/>`,
  tablet:
    shadow +
    `<rect x="10" y="24" width="100" height="72" rx="14" fill="${P}"/>` +
    `<rect x="18" y="32" width="84" height="56" rx="6" fill="${L}"/>` +
    `<circle cx="60" cy="60" r="12" fill="${G}"/>` +
    shine(32, 40, 9, 3),
  gamepad:
    shadow +
    `<path d="M30 34h60q22 0 26 30t-14 32q-10 0-16-14H34q-6 14-16 14Q0 94 4 64t26-30Z" fill="${P}"/>` +
    `<path d="M30 56h18M39 47v18" stroke="${L}" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="82" cy="52" r="5.5" fill="${G}"/><circle cx="94" cy="64" r="5.5" fill="${L}"/>` +
    shine(42, 42, 12, 4),
  light:
    shadow +
    `<path d="M60 10a31 31 0 0 0-15 58v10h30V68a31 31 0 0 0-15-58Z" fill="${G}"/>` +
    shine(48, 30, 6, 11) +
    `<rect x="45" y="80" width="30" height="8" rx="4" fill="${P}"/><rect x="50" y="90" width="20" height="9" rx="4.5" fill="${P}"/>`,
  powerbank:
    shadow +
    `<rect x="30" y="12" width="60" height="90" rx="16" fill="${P}"/>` +
    `<rect x="38" y="22" width="44" height="18" rx="6" fill="${L}"/>` +
    `<path d="M65 50L50 74h11l-4 20 16-26H62Z" fill="${G}"/>` +
    shine(40, 52, 4, 9),
  tent:
    shadow +
    `<path d="M60 16L8 100h104Z" fill="${P}"/>` +
    `<path d="M60 16L34 100h52Z" fill="${L}"/>` +
    `<path d="M60 54L46 100h28Z" fill="${D}" opacity=".35"/>` +
    `<circle cx="60" cy="16" r="5" fill="${G}"/>`,
  bike:
    shadow +
    `<circle cx="28" cy="76" r="22" fill="none" stroke="${D}" stroke-width="6"/>` +
    `<circle cx="92" cy="76" r="22" fill="none" stroke="${D}" stroke-width="6"/>` +
    `<path d="M28 76L50 42h30L92 76M50 42l14 34H28M42 32h16M80 42l-4-12h12" fill="none" stroke="${P}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="64" cy="76" r="5.5" fill="${G}"/>`,
  backpack:
    shadow +
    `<rect x="28" y="20" width="64" height="82" rx="24" fill="${P}"/>` +
    `<path d="M44 22a16 16 0 0 1 32 0" fill="none" stroke="${G}" stroke-width="6"/>` +
    `<rect x="38" y="58" width="44" height="32" rx="11" fill="${L}"/>` +
    `<path d="M38 72h44" stroke="${P}" stroke-width="3"/><rect x="56" y="65" width="8" height="9" rx="2" fill="${G}"/>` +
    shine(42, 36, 5, 9),
  tennis:
    shadow +
    `<circle cx="60" cy="58" r="40" fill="#D9E36A"/>` +
    `<path d="M26 32q24 26 0 52M94 32q-24 26 0 52" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/>` +
    shine(44, 38, 12, 7),
};

export function categoryKind(category: string): CategoryKind {
  const c = category.toLowerCase();
  if (c.includes("camera")) return "camera";
  if (c.includes("project")) return "projector";
  if (/notebook|laptop|computer/.test(c)) return "laptop";
  if (/sport|ball/.test(c)) return "ball";
  return "box";
}

// Pick the most specific illustration: by item name first, then by category.
export function itemKind(category: string, name?: string, icon?: string): CategoryKind {
  if (icon && icon in ART) return icon as CategoryKind;
  const n = (name ?? "").toLowerCase();
  if (/racket|badminton|shuttle/.test(n)) return "racket";
  if (/futsal|soccer|football/.test(n)) return "soccer";
  if (/gopro|action/.test(n)) return "actioncam";
  if (/mogo|mini|portable/.test(n) && categoryKind(category) === "projector") return "minipro";
  return categoryKind(category);
}

export function categoryArt(category: string, name?: string, icon?: string): string {
  return ART[itemKind(category, name, icon)];
}

// Icons an admin can pick for a piece of equipment ("" = automatic).
export const ICON_OPTIONS: { kind: CategoryKind; label: string }[] = [
  { kind: "camera", label: "Camera" },
  { kind: "actioncam", label: "Action cam" },
  { kind: "drone", label: "Drone" },
  { kind: "tripod", label: "Tripod" },
  { kind: "light", label: "Light" },
  { kind: "projector", label: "Projector" },
  { kind: "minipro", label: "Mini projector" },
  { kind: "laptop", label: "Notebook" },
  { kind: "tablet", label: "Tablet" },
  { kind: "phone", label: "Phone" },
  { kind: "keyboard", label: "Keyboard" },
  { kind: "mouse", label: "Mouse" },
  { kind: "gamepad", label: "Controller" },
  { kind: "headphones", label: "Headphones" },
  { kind: "microphone", label: "Microphone" },
  { kind: "speaker", label: "Speaker" },
  { kind: "powerbank", label: "Power bank" },
  { kind: "ball", label: "Basketball" },
  { kind: "soccer", label: "Soccer ball" },
  { kind: "tennis", label: "Tennis ball" },
  { kind: "racket", label: "Racket" },
  { kind: "bike", label: "Bicycle" },
  { kind: "tent", label: "Tent" },
  { kind: "backpack", label: "Backpack" },
  { kind: "box", label: "Gift box" },
];

export function categoryImage(category: string, name?: string, icon?: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${categoryArt(category, name, icon)}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const ACCENTS = ["#DE5C8E", "#E9C869", "#A83260", "#F08DB0"];
