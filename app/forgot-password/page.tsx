"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        setSent(true);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/seller`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link.");
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
            Reset your password
          </h2>
          <p className="text-sm text-[var(--mute)] mt-1">
            Enter your email to receive recovery instructions
          </p>
        </div>

        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-[var(--tint)] text-[var(--acc)] rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold mb-2">Check your inbox</h3>
              <p className="text-sm text-[var(--mute)] mb-6">
                If an account exists for {email}, a password reset link has been dispatched.
              </p>
              <Link href="/login" className="btn w-full text-center">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full mt-4 text-center disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[var(--line)] text-center text-sm text-[var(--mute)]">
                Remember your credentials?{" "}
                <Link href="/login" className="font-semibold text-[var(--acc)] hover:underline">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

