"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ACCENTS, categoryImage } from "@/libs/categoryArt";
import formatBaht from "@/libs/formatBaht";
import type { Dish } from "@/components/ui/dish-orbit-carousel";
import type { Equipment } from "@/types";

// GSAP + ScrollTrigger are only fetched on the client, after the hero paints.
const DishOrbitCarousel = dynamic(
  () => import("@/components/ui/dish-orbit-carousel"),
  {
    ssr: false,
    loading: () => <div className="skeleton h-[40rem]" aria-hidden="true" />,
  },
);

export default function FeaturedCarousel({
  equipments,
  role,
}: {
  equipments: Equipment[];
  role?: "admin" | "member";
}) {
  const router = useRouter();

  const dishes: Dish[] = equipments.map((e, i) => ({
    title: e.category,
    subtitle: e.name,
    image: categoryImage(e.category, e.name, e.icon),
    alt: `${e.category} illustration`,
    eyebrow: "Featured equipment",
    rating: e.quantity,
    chef: `${formatBaht(e.rentalRate)} / day`,
    ratingLabel: "available",
    description: e.description,
    likes: 0,
    ingredients: [e.category, "Up to 3 per request", "Up to 7 days"],
    accent: ACCENTS[i % ACCENTS.length],
  }));

  return (
    <DishOrbitCarousel
      dishes={dishes}
      height="42rem"
      pinScroll={false}
      orderLabel="Request rental"
      tabLabels={["Overview"]}
      eyebrowFallback={() => "Featured equipment"}
      likesLabel="likes"
      onOrder={
        role === "admin"
          ? undefined
          : (_, index) => {
              const id = equipments[index]?._id;
              if (role === "member") router.push(`/rentals/new?equipment=${id}`);
              else router.push("/login");
            }
      }
    />
  );
}
