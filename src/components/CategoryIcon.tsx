import { categoryArt } from "@/libs/categoryArt";

// Static, trusted SVG markup from libs/categoryArt (no user input).
export default function CategoryIcon({
  category,
  name,
  className,
}: {
  category: string;
  name?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: categoryArt(category, name) }}
    />
  );
}
