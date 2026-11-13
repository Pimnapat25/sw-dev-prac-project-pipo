# Frontend Fix & Improvement Plan

Status: UI direction and mascot (Snappy) approved — ready to build.

## Part 1 — Logic fixes

| # | Problem | Fix | Priority |
|---|---|---|---|
| F1 | "Today" is computed in UTC. In Thailand (UTC+7), from 00:00–06:59 the form defaults to and accepts yesterday's date. | Use Asia/Bangkok date for "today" in `validateRental.ts` and date-picker `min`. Backend (`controllers/rentals.js`) uses UTC too — align it (allowed: "ปรับแต่ง Backend ได้"). | High |
| F2 | Backend error = whole page crashes (`/equipment`, `/rentals`, `/rentals/[id]/edit`). | Catch fetch errors; show friendly message. Add `error.tsx` + `not-found.tsx` for those routes. | High |
| F3 | Session stays "logged in" after the user is gone from DB (JWT 365d) → every call 401s. | On 401 from API, sign out and redirect to `/login` with a message. | Medium |
| F4 | Old requests (start date already passed) can't be edited at all — backend rejects. | Edit page: detect past start date, show read-only view + explanation (delete still allowed). | Medium |
| F5 | Request for soft-deleted equipment: edit dropdown has no matching option; save fails. | Show the equipment as "no longer available" (disabled option) and explain; allow delete only. | Low |
| F6 | Register / equipment add-edit-delete show generic errors, hide backend reason (duplicate email, short password…). | Surface `data.error` from API like the rental libs do. | High |
| F7 | Rental rate shown with no unit. | Show "฿ / item / day". | Low |

## Part 2 — UI redesign

### Direction
"Soft industrial": structure inspired by the THEIA construction-equipment site
(big hero, equipment as the star, catalogue cards), but softened —
rounded shapes, pastel surfaces, hand-painted / clay-3D equipment illustrations,
and a cute mascot guiding the user.

### Colour (Chula palette, 60/30/10)
| Role | Share | Colour |
|---|---|---|
| Base / backgrounds | 60% | Chula Light Pink `#F8E1EA` (+ white cards) |
| Brand / primary actions, headers | 30% | Chula Pink `#DE5C8E` |
| Accent / highlights, badges, mascot details | 10% | Chula Mustard Gold `#E9C869` |
| Text | — | Chula Dark Grey `#58595B` |

Accessibility notes:
- White text on `#DE5C8E` is ~3.5:1 → OK for large/bold text and buttons ≥18px bold; for small text use a darker pink.
- Gold is never used for text on white/light pink (too low contrast) — fills, badges, icons only.

### 3D / illustration approach (fast-loading)
- No runtime 3D engine (three.js ≈ 600 KB+). Instead: clay-style 3D renders (Blender/Spline) **pre-rendered to AVIF/WebP**, ~30–80 KB each, via `next/image` with explicit sizes.
- Per-category illustration (camera, projector, notebook, sports) reused across cards instead of per-item photos.
- "Pop" via CSS only: soft shadows, slight tilt/float on hover, `prefers-reduced-motion` respected.
- Mascot as inline SVG (tiny, crisp, animatable with CSS).
- Budget: hero LCP image < 100 KB, total JS for a page close to current.

### Pages
1. Home — hero with mascot + floating 3D equipment, category chips, "How renting works" (3 steps: pick → request → return), CTA.
2. Equipment catalogue — category filter chips, cards with illustration, availability badge (gold), rate "/day", "Request rental".
3. Rental request — form beside a summary card (item, days, total estimate); live rule hints (max 3, ≤ 7 days).
4. My / all rentals — list with status chips (Upcoming / Active / Past), empty state with mascot.
5. Auth — split layout: mascot illustration + form.
6. Errors / empty / loading states — mascot poses (sleeping = empty, confused = error, running = loading).

### Decisions so far
- 60/30/10 = Light pink base / Pink primary / Gold accent.
- 3D: pre-rendered clay-style images (AVIF/WebP), no runtime 3D.
- Mascot: "living equipment" — a piece of gear with a face, little arms and legs.

### Mascot draft (to refine together)
- Body: rounded clay camera, Chula Pink `#DE5C8E` body, light pink `#F8E1EA` belly/lens ring.
- Accent: gold `#E9C869` shutter button / strap / tiny hard hat (10% rule).
- Face: lens = one big shiny eye *or* two dot eyes on the front with blush cheeks; outline in dark grey `#58595B`.
- Poses needed: wave (home), holding a clipboard (rental form), sleeping (empty list), confused "?" (error), running (loading), thumbs-up (success).
- Equipment type: **camera** (decided).
- Eye style: **one big lens-eye**, body **fluffy / plush** (scalloped fur outline, little fluff tuft on top).
- Name: **Snappy**.
- Personality: **clumsy and funny** — trips over its gold strap, sweat drop, wobbly smile. Errors feel playful, not scary.
- Copy tone examples: error "Oops, Snappy tripped! Try again?", empty list "Nothing rented yet… Snappy is bored.", success "Snap! Request saved."

### Design references (collecting — more coming from user)
1. **Hero style** (TerraElix supplement site): giant word behind a centered 3D product, glass pill nav, glass thumbnail strip bottom-left, short tagline right, trust badge bottom-right.
   → Ours: giant "RENT" / "EQUIPMENT" in light pink, clay-3D camera (Snappy) + floating gear centre, category thumbnails bottom-left, live "N items available" badge from API.
2. **Liquid glass navbar** (`liquid-glass-navbar.tsx`, WebGL water pill, no deps, CSS fallback).
   → Replaces `TopMenu`. Wrap in a client component using `next/link` + `usePathname` for the active item. Items: Home, Equipment, My rentals, Sign in / profile. Tone `light`.
3. **Dish orbit carousel** (`dish-orbit-carousel.tsx`, needs `gsap`).
   → Featured-equipment showcase on Home only. Map: title=category, subtitle=name, image=category clay render, accent=palette colour; drop rating/chef/likes/food buttons → "Request rental" / "View details".
   → Performance cautions: GSAP + ScrollTrigger (~70 KB gz), scroll-pinning hijacks page scroll, embedded base64 font. Load with `next/dynamic`, pass `fontSrc={null}`, consider turning off scroll pinning.

4. **Suggested extras (to confirm with user):**
   - Equipment cards: category clay image *pops out* above the card edge, gold "N left" badge, "฿/day", tilt on hover.
   - Category filter: pill chips using the same liquid-glass indicator as the navbar.
   - "How it works" bento (3 tiles, pink / white / gold) with Snappy poses.
   - Rental form as 3 steps (pick gear → dates → confirm) with a date-range picker that greys out days past 7, a 1–3 quantity stepper, and a live summary card (qty × rate × days).
   - My rentals as ticket cards (perforated edge, status chip Upcoming / Active / Past, estimated total).
   - Auth pages split: Snappy waving + glass form.
   - Pink shimmer skeleton loaders, Snappy toasts, squishy button press.

### Component setup notes
- Project: Next.js 16 + TypeScript + Tailwind v4 — OK. **No shadcn** (`components.json` missing).
- Alias `@/*` → `src/*`, so `@/components/ui/...` = `src/components/ui/`. Create that folder for third-party / generic UI pieces (keeps them apart from app components like `RentalForm`; shadcn CLI and 21st.dev snippets import from that path).
- shadcn init is optional; only needed if we pull shadcn-based components later (`npx shadcn@latest init`).

## Part 3 — Order of work
1. F1, F2, F6 (fixes users hit first)
2. Design tokens (colours, radius, shadows, type) in `globals.css`
3. Mascot + illustration set
4. Page redesigns: Home → Catalogue → Rental form → Rentals list → Auth
5. F3, F4, F5, F7
6. Performance check (Lighthouse), accessibility check (contrast, keyboard)
