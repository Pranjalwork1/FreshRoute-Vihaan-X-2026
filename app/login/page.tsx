"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/seller";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(urlError);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        // Fallback demo login when Supabase credentials are not yet configured
        if (email && password.length >= 6) {
          localStorage.setItem(
            "freshroute_demo_user",
            JSON.stringify({
              email,
              id: "demo-user-" + Date.now(),
              full_name: email.split("@")[0],
            })
          );
          router.push(redirectTo);
          return;
        } else {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="logo inline-flex text-2xl font-extrabold mb-3">
            <FreshRouteLogo className="w-8 h-8" />
            FreshRoute
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            Sign in to your account
          </h2>
          <p className="text-sm text-[var(--mute)] mt-1">
            Access your seller, buyer or logistics workspace
          </p>
        </div>

        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label>
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </label>

            <label>
              <div className="flex justify-between items-center">
                <span>Password</span>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--acc)] font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full mt-4 text-center disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--line)] text-center text-sm text-[var(--mute)]">
            Don’t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-[var(--acc)] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

