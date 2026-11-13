import { categoryArt } from "@/libs/categoryArt";

// Static, trusted SVG markup from libs/categoryArt (no user input).
export default function CategoryIcon({
  category,
  name,
  icon,
  className,
}: {
  category: string;
  name?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: categoryArt(category, name, icon) }}
    />
  );
}
