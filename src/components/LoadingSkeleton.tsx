import Snappy from "@/components/Snappy";

// Shared loading.tsx body: pink shimmer cards while Snappy runs to fetch data.
export default function LoadingSkeleton({ title }: { title: string }) {
  return (
    <main
      className="mx-auto max-w-6xl px-6 py-10 sm:py-14"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <Snappy pose="running" size={96} />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-pink-dark">
            {title}
          </h1>
          <p className="mt-1 text-base text-grey">Snappy is on the way…</p>
        </div>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-64" />
        ))}
      </div>
    </main>
  );
}
