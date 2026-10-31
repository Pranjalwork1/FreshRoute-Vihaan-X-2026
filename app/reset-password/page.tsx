"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to update password.");
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
            Set New Password
          </h2>
          <p className="text-xs text-[var(--mute)] mt-1">
            Choose a strong password for your FreshRoute account
          </p>
        </div>

        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 shadow-sm">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-[var(--tint)] text-[var(--acc)] rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ✓
              </div>
              <h3 className="text-base font-bold mb-1">Password Updated</h3>
              <p className="text-xs text-[var(--mute)] mb-4">
                Your password has been changed. Redirecting to login...
              </p>
              <Link href="/login" className="btn w-full text-center text-xs">
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <label>
                  New Password (min. 6 characters)
                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </label>

                <label>
                  Confirm New Password
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full mt-4 text-center text-xs disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

