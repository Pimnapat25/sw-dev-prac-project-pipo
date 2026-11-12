import Snappy from "@/components/Snappy";

// Split layout: Snappy on a pink panel, glass form on the right.
export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="px-6 py-10 sm:py-14">
      <div className="glass mx-auto grid max-w-4xl overflow-hidden rounded-card md:grid-cols-[1fr_1.15fr]">
        <div className="relative flex flex-col items-center justify-center bg-linear-to-br from-pink to-pink-dark p-8 text-center text-white">
          <div
            aria-hidden="true"
            className="absolute -left-10 -top-10 size-40 rounded-full bg-white/15"
          />
          <Snappy pose="wave" size={190} className="relative drop-shadow-lg" />
          <p className="relative mt-4 text-2xl font-extrabold">Hi, I am Snappy!</p>
          <p className="relative mt-1 text-base font-medium">
            Your friendly gear-lending buddy.
          </p>
        </div>
        <div className="p-7 sm:p-10">
          <header className="mb-7">
            <h1 className="text-2xl font-extrabold tracking-tight text-pink-dark sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-base leading-7 text-grey">{subtitle}</p>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
