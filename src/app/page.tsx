import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <section className="overflow-hidden rounded-[2rem] border border-pink/10 bg-pink-light/40">
        <div className="grid items-center gap-8 px-7 py-10 sm:px-12 lg:grid-cols-2 lg:gap-12 lg:py-12">
          <div>
            <p className="inline-flex rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-pink-dark">
              Equipment rental
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-pink-dark sm:text-5xl">
              Ready for your
              <br />
              next project.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-grey">
              Find the equipment you need for coursework, activities and
              everything in between.
            </p>

            <Link
              href="/equipment"
              className="mt-7 inline-flex min-h-12 items-center gap-5 rounded-full bg-pink-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-dark/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
            >
              Browse equipment
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto flex aspect-[5/4] w-full max-w-sm items-center justify-center"
          >
            <div className="absolute inset-5 rounded-[40%] bg-white/60" />

            <svg
              viewBox="0 0 320 250"
              fill="none"
              className="relative w-full text-pink-dark"
            >
              <rect
                x="167"
                y="45"
                width="111"
                height="84"
                rx="12"
                fill="#fffaf8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M155 139h135l-10 10H165l-10-10Z"
                fill="#f8e1ea"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M70 109l12-20h49l12 20"
                fill="#fffaf8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <rect
                x="43"
                y="109"
                width="158"
                height="100"
                rx="20"
                fill="#fffaf8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="122"
                cy="159"
                r="33"
                fill="#f8e1ea"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="122"
                cy="159"
                r="22"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M111 148a16 16 0 0 1 22 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="58"
                y="122"
                width="18"
                height="10"
                rx="3"
                fill="#e9c869"
              />
              <path
                d="M31 225h258"
                stroke="currentColor"
                strokeOpacity=".2"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="px-7 pb-7 sm:px-12">
          <ul
            aria-label="Equipment categories"
            className="flex flex-wrap gap-2"
          >
            {["Cameras", "Notebooks", "Projectors", "Sports equipment"].map(
              (category) => (
                <li
                  key={category}
                  className="rounded-full bg-white/60 px-3 py-1.5 text-xs text-grey"
                >
                  {category}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <section className="mt-9 flex flex-col justify-between gap-5 px-1 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Start with the catalogue
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-7 text-grey">
            Browse equipment and check available quantities. Sign in with a
            member account when you are ready to rent.
          </p>
        </div>

        <Link
          href="/register"
          className="inline-flex min-h-11 shrink-0 items-center self-start rounded-full bg-pink-light/50 px-5 py-2 text-sm font-semibold text-pink-dark transition-colors hover:bg-pink-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
        >
          Create an account
        </Link>
      </section>
    </main>
  );
}
