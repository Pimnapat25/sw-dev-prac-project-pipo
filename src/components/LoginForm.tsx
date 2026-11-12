"use client";

import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function LoginForm({ expired }: { expired: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // The API rejected our token (account gone): drop the stale session.
  useEffect(() => {
    if (!expired) return;
    signOut({ redirect: false }).then(() => router.refresh());
  }, [expired, router]);

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
      setError("Oops, Snappy tripped! Unable to connect, try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to browse and manage equipment rentals."
    >
      <form onSubmit={handleSubmit}>
        {expired && (
          <p role="status" className="alert mb-5">
            Your session expired. Sign in again.
          </p>
        )}
        <label className="label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="field mb-5"
        />

        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          className="field mb-5"
        />

        {error && (
          <p role="alert" className="alert mb-5">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-6 pt-1 text-center text-sm text-grey">
          New here?{" "}
          <Link
            href="/register"
            className="rounded font-bold text-pink-dark underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
