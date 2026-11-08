"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Unable to sign in. Please check your email and password.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-start justify-center px-6 py-12 sm:py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-pink/10 bg-white p-7 shadow-[0_8px_28px_-20px_#de5c8e] sm:p-10"
      >
        <header className="mb-7 rounded-2xl bg-pink-light/35 px-4 py-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-pink-dark sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-7 text-grey">
            Sign in to browse and manage equipment rentals.
          </p>
        </header>
        <label
          className="mb-2 block text-sm font-medium text-foreground"
          htmlFor="email"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 min-h-12 w-full rounded-2xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light"
        />

        <label
          className="mb-2 block text-sm font-medium text-foreground"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 min-h-12 w-full rounded-2xl border border-pink/20 bg-pink-light/10 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-grey/60 hover:border-pink/50 focus:border-pink-dark focus:bg-white focus:ring-2 focus:ring-pink-light"
        />

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-pink/20 bg-pink-light/40 px-4 py-3 text-sm leading-6 text-pink-dark"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-full bg-pink-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-dark/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-6 pt-1 text-center text-sm text-grey">
          New here?{" "}
          <Link
            href="/register"
            className="rounded font-semibold text-pink-dark underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
          >
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
