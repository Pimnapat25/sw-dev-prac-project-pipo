import { useId } from "react";

export type SnappyPose =
  | "wave"
  | "clipboard"
  | "sleeping"
  | "confused"
  | "running"
  | "thumbsUp";

const PINK = "#DE5C8E";
const LIGHT = "#F8E1EA";
const GOLD = "#E9C869";
const INK = "#58595B";

// Scalloped fur outline: little circles around the body, covered by a fill.
const FUR = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2;
  return { x: 100 + Math.cos(a) * 64, y: 106 + Math.sin(a) * 52 };
});

const OUTLINE = { stroke: INK, strokeWidth: 3, strokeLinecap: "round" } as const;

// A stubby arm: grey outline stroke under a pink stroke, with a round hand.
function Arm({ d, hand }: { d: string; hand: [number, number] }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={17} strokeLinecap="round" fill="none" />
      <path d={d} stroke={PINK} strokeWidth={11} strokeLinecap="round" fill="none" />
      <circle cx={hand[0]} cy={hand[1]} r={8} fill={PINK} {...OUTLINE} />
    </g>
  );
}

function Eye({ pose }: { pose: SnappyPose }) {
  if (pose === "sleeping") {
    return (
      <g>
        <circle cx={100} cy={102} r={34} fill={LIGHT} {...OUTLINE} />
        <path d="M78 104q22 16 44 0" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d="M82 112l-5 5M100 116v7M118 112l5 5" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      </g>
    );
  }
  // pupil looks around depending on the pose
  const [px, py] = pose === "confused" ? [92, 96] : pose === "running" ? [108, 100] : [100, 102];
  const r = pose === "confused" ? 15 : 22;
  return (
    <g>
      <circle cx={100} cy={102} r={34} fill={LIGHT} {...OUTLINE} />
      <circle cx={px} cy={py} r={r} fill={INK} />
      <circle cx={px - r * 0.35} cy={py - r * 0.4} r={r * 0.3} fill="#fff" />
      <circle cx={px + r * 0.4} cy={py + r * 0.35} r={r * 0.14} fill="#fff" />
    </g>
  );
}

function Extras({ pose }: { pose: SnappyPose }) {
  switch (pose) {
    case "wave":
      return (
        <g>
          <g className="origin-[160px_110px] animate-wobble" style={{ transformBox: "view-box" }}>
            <Arm d="M156 112Q178 98 178 66" hand={[178, 62]} />
          </g>
          <Arm d="M44 116Q32 134 36 150" hand={[36, 152]} />
        </g>
      );
    case "clipboard":
      return (
        <g>
          <rect x={112} y={118} width={52} height={64} rx={7} fill="#fff" {...OUTLINE} transform="rotate(8 138 150)" />
          <g transform="rotate(8 138 150)">
            <rect x={128} y={112} width={20} height={11} rx={4} fill={GOLD} {...OUTLINE} />
            <path d="M121 138h34M121 150h34M121 162h22" stroke={PINK} strokeWidth={3} strokeLinecap="round" />
          </g>
          <Arm d="M156 124Q150 140 146 150" hand={[146, 152]} />
          <Arm d="M44 116Q40 138 108 164" hand={[118, 166]} />
        </g>
      );
    case "sleeping":
      return (
        <g fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M150 52h12l-12 14h12" className="animate-float" />
          <path d="M170 28h8l-8 10h8" className="animate-float" />
          <Arm d="M44 120Q34 140 42 154" hand={[43, 156]} />
          <Arm d="M156 120Q166 140 158 154" hand={[157, 156]} />
        </g>
      );
    case "confused":
      return (
        <g>
          <text x={150} y={58} fontSize={36} fontWeight={800} fill={INK} className="animate-wobble">?</text>
          <path d="M52 62q-8 12 0 18 8-6 0-18Z" fill="#9BD3F0" {...OUTLINE} strokeWidth={2} />
          <Arm d="M48 114Q36 80 64 58" hand={[66, 56]} />
          <Arm d="M156 118Q170 134 164 150" hand={[163, 152]} />
          <path d="M60 176q-26 6-30 -8t22 -4" fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case "running":
      return (
        <g>
          <path d="M14 104h22M6 124h26M16 144h18" stroke={INK} strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
          <Arm d="M50 118Q34 104 30 88" hand={[30, 84]} />
          <Arm d="M150 118Q166 134 176 128" hand={[178, 127]} />
        </g>
      );
    case "thumbsUp":
      return (
        <g>
          <Arm d="M156 118Q174 110 176 84" hand={[176, 80]} />
          <rect x={172} y={56} width={9} height={22} rx={4.5} fill={PINK} {...OUTLINE} strokeWidth={2.5} />
          <Arm d="M44 116Q32 134 36 150" hand={[36, 152]} />
          <path d="M34 30l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z" fill={GOLD} />
          <path d="M168 24l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" fill={GOLD} />
        </g>
      );
  }
}

export default function Snappy({
  pose = "wave",
  size = 160,
  className,
  title = "Snappy, the camera mascot",
}: {
  pose?: SnappyPose;
  size?: number | string;
  className?: string;
  title?: string;
}) {
  const titleId = useId();
  const feet: [number, number][] =
    pose === "running" ? [[66, 170], [138, 164]] : [[78, 170], [122, 170]];
  const tilt = pose === "running" ? "rotate(-8 100 110)" : pose === "sleeping" ? "rotate(4 100 110)" : undefined;

  return (
    <svg
      role="img"
      aria-labelledby={titleId}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      <title id={titleId}>{title}</title>
      <ellipse cx={100} cy={186} rx={52} ry={6} fill={INK} opacity={0.12} />
      <g transform={tilt}>
        {feet.map(([x, y]) => (
          <ellipse key={x} cx={x} cy={y} rx={15} ry={9} fill={GOLD} {...OUTLINE} />
        ))}
        {/* fur outline then body fill */}
        {FUR.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={13} fill={PINK} {...OUTLINE} />
        ))}
        <ellipse cx={100} cy={106} rx={64} ry={52} fill={PINK} />
        {/* fluff tuft */}
        <path d="M92 56q-10-14 2-20 2 8 6 10 4-14 14-12-2 10-6 14 8-2 10 4-10 10-26 4Z" fill={PINK} {...OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
        {/* shutter button */}
        <rect x={128} y={44} width={22} height={12} rx={5} fill={GOLD} {...OUTLINE} />
        <Eye pose={pose} />
        <circle cx={66} cy={142} r={8} fill="#fff" opacity={0.45} />
        <circle cx={134} cy={142} r={8} fill="#fff" opacity={0.45} />
        <path
          d={pose === "confused" ? "M86 152q7-6 14 0t14 0" : "M84 148q5 7 10 0t10 0t10 0t6 -1"}
          fill="none"
          stroke={INK}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <Extras pose={pose} />
      </g>
    </svg>
  );
}
