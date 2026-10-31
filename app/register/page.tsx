"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FreshRouteLogo, ProduceSvg } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";
import { registerSchema } from "@/lib/validations/auth";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Compute password strength
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, text: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score: 2, text: "Medium", color: "bg-amber-500" };
    return { score: 3, text: "Strong", color: "bg-green-600" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = registerSchema.safeParse({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      termsConsent,
    });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        // Fallback demo account persistence when Supabase credentials are not yet configured
        const demoUser = {
          id: "demo-user-" + Date.now(),
          email,
          phone,
          full_name: fullName,
        };
        localStorage.setItem("freshroute_demo_user", JSON.stringify(demoUser));
        router.push(`/onboarding?intent=${encodeURIComponent(intent)}`);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          phone: phone,
        });

        router.push(`/onboarding?intent=${encodeURIComponent(intent)}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg)]">
      {/* Left Branding & Benefits Panel (Hidden on small screens) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[var(--tint)] border-r border-[var(--line)] p-12 flex-col justify-between relative overflow-hidden">
        <div>
          <Link href="/" className="logo text-2xl font-extrabold flex items-center gap-2 mb-8">
            <FreshRouteLogo className="w-8 h-8" />
            FreshRoute
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--acc)] bg-white/70 px-2.5 py-1 rounded-full border border-[var(--line)]">
            Phase 1 • Commercial Account Creation
          </span>

          <h1 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mt-4 mb-3">
            From Surplus to Opportunity.
          </h1>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-8">
            Join the agricultural marketplace connecting cultivators, vendors, retailers, wholesalers, and transporters across regional supply corridors.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--acc)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--ink)]">Multi-Role Architecture</h4>
                <p className="text-xs text-[var(--mute)]">
                  Act as a farmer and buyer under one unified account without signing up twice.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--acc)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--ink)]">Zero Hidden Brokerage</h4>
                <p className="text-xs text-[var(--mute)]">
                  Disclose harvest specifications directly with transparent unit rates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--acc)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--ink)]">Prevent Post-Harvest Waste</h4>
                <p className="text-xs text-[var(--mute)]">
                  Reach serious buyers before perishable crops lose commercial viability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative crop illustration preview */}
        <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--line)] flex items-center justify-center">
            <ProduceSvg name="tomato" className="w-8 h-8" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--line)] flex items-center justify-center">
            <ProduceSvg name="wheat" className="w-8 h-8" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--line)] flex items-center justify-center">
            <ProduceSvg name="crate" className="w-8 h-8" />
          </div>
          <div className="text-xs text-[var(--mute)]">
            Verified agricultural supply network
          </div>
        </div>
      </div>

      {/* Right Registration Form Panel */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-lg">
          <div className="lg:hidden mb-6 text-center">
            <Link href="/" className="logo text-2xl font-extrabold inline-flex items-center gap-2">
              <FreshRouteLogo className="w-7 h-7" />
              FreshRoute
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
              Create your FreshRoute Account
            </h2>
            <p className="text-xs text-[var(--mute)] mt-1">
              Step 1 of 2: Create account credentials, then select your business capabilities.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label>
                Full Name
                <input
                  required
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                />
              </label>

              <label>
                Phone Number
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                />
              </label>
            </div>

            <label>
              Email Address
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
                <span>Password (min. 6 characters)</span>
                {strength.text && (
                  <span className="text-[11px] font-semibold text-[var(--mute)]">
                    Strength: <strong className={strength.score === 3 ? "text-green-700" : "text-amber-600"}>{strength.text}</strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--mute)] font-semibold hover:text-[var(--ink)]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* Password strength bar */}
            {password && (
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden -mt-2">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: `${(strength.score / 3) * 100}%` }}
                />
              </div>
            )}

            <label>
              Confirm Password
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--mute)] font-semibold hover:text-[var(--ink)]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="flex items-start gap-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={termsConsent}
                onChange={(e) => setTermsConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--acc)] focus:ring-[var(--acc)] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[var(--mute)] leading-tight font-normal cursor-pointer">
                I agree to the FreshRoute Terms of Service and Privacy Policy, and confirm my business details will be accurately declared.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full mt-4 text-center disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Continue to Role Selection"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--line)] text-center text-xs text-[var(--mute)]">
            Already registered on FreshRoute?{" "}
            <Link href="/login" className="font-bold text-[var(--acc)] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
