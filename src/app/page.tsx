import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import CategoryIcon from "@/components/CategoryIcon";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Snappy, { type SnappyPose } from "@/components/Snappy";
import getEquipments from "@/libs/getEquipments";
import type { Equipment } from "@/types";

const DEFAULT_CATEGORIES = ["Camera", "Projector", "Notebook", "Sports"];

const STEPS: {
  title: string;
  text: string;
  pose: SnappyPose;
  tile: string;
}[] = [
  {
    title: "Pick your gear",
    text: "Browse cameras, projectors, notebooks and sports gear.",
    pose: "running",
    tile: "bg-pink text-white",
  },
  {
    title: "Choose dates",
    text: "Up to 3 items per request, for a maximum of 7 days.",
    pose: "clipboard",
    tile: "glass text-grey",
  },
  {
    title: "Snap, done",
    text: "Send the request and Snappy takes care of the rest.",
    pose: "thumbsUp",
    tile: "bg-gold text-grey",
  },
];

const floatingGear = [
  { category: "Camera", pos: "left-[28%] bottom-[18%]", rot: "-12deg", delay: "0s" },
  { category: "Projector", pos: "right-[6%] top-[40%]", rot: "10deg", delay: "-1.5s" },
  { category: "Notebook", pos: "left-[10%] bottom-[10%]", rot: "8deg", delay: "-3s" },
  { category: "Sports", pos: "right-[10%] bottom-[8%]", rot: "-8deg", delay: "-2s" },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  let equipments: Equipment[] = [];
  let apiUp = true;
  try {
    equipments = (await getEquipments()).data;
  } catch {
    apiUp = false;
  }

  const availableNow = equipments.reduce((sum, e) => sum + e.quantity, 0);
  const categories = apiUp && equipments.length > 0
    ? [...new Set(equipments.map((e) => e.category))].slice(0, 4)
    : DEFAULT_CATEGORIES;
  const featured = equipments.filter((e) => e.quantity > 0).slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden rounded-[2.5rem] bg-linear-to-b from-pink/35 via-pink-light to-pink-light"
      >
        <div className="relative flex min-h-[44rem] flex-col justify-between gap-8 p-6 sm:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row">
            <div className="max-w-md">
              <p className="glass inline-flex rounded-full px-4 py-2 text-sm font-semibold text-pink-dark">
                Cameras, projectors, notebooks, sports gear
              </p>
              <h1
                id="hero-title"
                className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-pink-dark sm:text-5xl"
              >
                Borrow the gear, keep the fun.
              </h1>
              <Link href="/equipment" className="btn btn-primary mt-7">
                Browse equipment <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="glass flex h-fit gap-3 self-start rounded-3xl p-3">
              {[
                { value: "3", label: "items max per request" },
                { value: "7", label: "days max per rental" },
              ].map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-gold text-2xl font-black text-grey">
                    {rule.value}
                  </span>
                  <span className="max-w-24 text-sm font-bold leading-5 text-pink-dark">
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* giant word behind Snappy and the floating gear */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative mx-auto h-72 w-full lg:absolute lg:inset-0 lg:h-auto"
          >
            <p className="absolute inset-0 flex select-none items-center justify-center whitespace-nowrap text-[clamp(5rem,21vw,17rem)] font-black leading-none tracking-tighter text-white/90">
              RENT IT
            </p>
            {floatingGear.map((g) => (
              <div
                key={g.category}
                className={`absolute ${g.pos} hidden animate-float sm:block`}
                style={{ "--r": g.rot, animationDelay: g.delay } as React.CSSProperties}
              >
                <CategoryIcon
                  category={g.category}
                  className="size-20 drop-shadow-[0_12px_12px_rgb(168_50_96/0.3)] lg:size-28"
                />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <Snappy
                pose="wave"
                size={300}
                className="max-w-[70%] drop-shadow-[0_18px_18px_rgb(168_50_96/0.35)]"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <ul aria-label="Equipment categories" className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <li
                  key={category}
                  className="glass flex items-center gap-2 rounded-2xl p-2 pr-4 text-sm font-semibold text-grey"
                >
                  <CategoryIcon category={category} className="size-10" />
                  {category}
                </li>
              ))}
            </ul>
            {apiUp && (
              <p className="glass rounded-2xl px-5 py-3 text-grey">
                <span className="text-3xl font-extrabold tabular-nums text-pink-dark">
                  {availableNow.toLocaleString("en-US")}
                </span>{" "}
                <span className="text-sm font-semibold">
                  {availableNow === 1 ? "item" : "items"} available now
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured-title" className="mt-16">
          <h2
            id="featured-title"
            className="text-3xl font-extrabold tracking-tight text-pink-dark sm:text-4xl"
          >
            Featured equipment
          </h2>
          <div className="mt-6">
            <FeaturedCarousel equipments={featured} role={session?.user.role} />
          </div>
        </section>
      )}

      <section aria-labelledby="how-title" className="mt-16">
        <h2
          id="how-title"
          className="text-3xl font-extrabold tracking-tight text-pink-dark sm:text-4xl"
        >
          How it works
        </h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className={`flex flex-col items-start rounded-card p-7 ${step.tile}`}
            >
              <span className="text-sm font-extrabold">Step {i + 1}</span>
              <h3 className="mt-1 text-2xl font-extrabold">{step.title}</h3>
              <p className="mt-2 flex-1 text-lg font-semibold leading-7">
                {step.text}
              </p>
              <Snappy pose={step.pose} size={110} className="mt-4 self-end" />
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
