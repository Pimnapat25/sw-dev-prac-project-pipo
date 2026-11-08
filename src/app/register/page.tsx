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
    <main className="flex min-h-screen items-center justify-center bg-pink-light px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-pink">
          Create an account
        </h1>

        <p className="mt-2 text-center text-sm text-grey">
          Join us to manage your equipment rentals.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-semibold text-grey"
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
              className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-grey"
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
              className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
            />
          </div>

          <div>
            <label
              htmlFor="tel"
              className="mb-1 block text-sm font-semibold text-grey"
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
              className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold text-grey"
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
              className="w-full rounded-xl border border-pink-light px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-semibold text-grey"
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
              className="w-full rounded-xl border border-pink-light bg-white px-4 py-2 text-grey outline-none focus:border-pink focus:ring-2 focus:ring-pink-light"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink px-6 py-2 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-grey">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-pink">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
