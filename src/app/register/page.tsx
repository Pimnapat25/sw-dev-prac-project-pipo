"use client";

import { useState } from "react";
import Link from "next/link";
import userRegister from "@/libs/userRegister";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!name.trim() || !email.trim() || !tel.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      await userRegister({
        name: name.trim(),
        email: email.trim(),
        tel: tel.trim(),
        password,
        role,
      });

      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to register. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-start justify-center px-6 py-12 sm:py-16">
      <section className="w-full max-w-md rounded-3xl border border-pink/10 bg-white p-7 shadow-[0_8px_28px_-20px_#de5c8e] sm:p-10">
        <header className="mb-7 rounded-2xl bg-pink-light/35 px-4 py-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-pink-dark sm:text-3xl">
            Create an account
          </h1>

          <p className="mt-3 text-sm leading-7 text-grey">
            Join us to manage your equipment rentals.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="min-h-12 w-full rounded-2xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="min-h-12 w-full rounded-2xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light"
            />
          </div>
          <div>
            <label
              htmlFor="tel"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Telephone number
            </label>

            <input
              id="tel"
              name="tel"
              type="tel"
              autoComplete="tel"
              required
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="Your telephone number"
              className="min-h-12 w-full rounded-2xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="min-h-12 w-full rounded-2xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Account role
            </label>

            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value === "admin" ? "admin" : "member")
              }
              className="min-h-12 w-full rounded-2xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-pink/20 bg-pink-light/40 px-4 py-3 text-sm leading-6 text-pink-dark"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-full bg-pink-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-dark/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 pt-1 text-center text-sm text-grey">
          Already have an account?{" "}
          <Link
            href="/login"
            className="rounded font-semibold text-pink-dark underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
