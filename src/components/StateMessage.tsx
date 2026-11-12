import Snappy, { type SnappyPose } from "@/components/Snappy";

// Friendly empty / error / info block with Snappy.
export default function StateMessage({
  pose,
  title,
  children,
  actions,
}: {
  pose: SnappyPose;
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="glass mx-auto flex max-w-lg flex-col items-center rounded-card px-6 py-10 text-center">
      <Snappy pose={pose} size={150} />
      <h2 className="mt-4 text-2xl font-bold text-pink-dark">{title}</h2>
      {children && <p className="mt-2 text-base leading-7 text-grey">{children}</p>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
