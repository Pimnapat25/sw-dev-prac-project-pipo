"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import userRegister from "@/libs/userRegister";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
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
        // Admins are created in the back office; the website only registers members.
        role: "member",
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
    <AuthLayout
      title="Create an account"
      subtitle="Join us to manage your equipment rentals."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="label">
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
            className="field"
          />
        </div>
        <div>
          <label htmlFor="email" className="label">
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
            className="field"
          />
        </div>
        <div>
          <label htmlFor="tel" className="label">
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
            className="field"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
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
            className="field"
          />
        </div>
        {error && (
          <p role="alert" className="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
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
    </AuthLayout>
  );
}
