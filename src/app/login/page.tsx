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
    <main className="flex min-h-screen items-center justify-center bg-pink-light px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-pink">
          Welcome back
        </h1>
        <div className="mb-6 text-center text-s font-bold text-black">
          Sign in to browse and manage equipment rentals.
        </div>
        <label className="mb-1 block text-sm text-grey" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-full border border-pink px-4 py-2 text-grey outline-none focus:ring-2 focus:ring-pink"
        />

        <label className="mb-1 block text-sm text-grey" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-full border border-pink px-4 py-2 text-grey outline-none focus:ring-2 focus:ring-pink"
        />

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-pink py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link
          href="/register"
          className="flex items-center h-full px-2 text-cyan-600 text-sm"
        >
          New here? Create an account
        </Link>
      </form>
    </main>
  );
}
