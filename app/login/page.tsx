"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthBrandedPanel } from "@/components/auth/AuthBrandedPanel";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";

const DEMO_ACCOUNTS = [
  {
    role: "seller",
    title: "Farmer / Supplier",
    desc: "Lists batches, answers offers",
    icon: "i-l",
    dashboard: "/dashboard/seller",
  },
  {
    role: "buyer",
    title: "Retailer",
    desc: "Finds produce, places orders",
    icon: "i-m",
    dashboard: "/dashboard/buyer",
  },
  {
    role: "wholesaler",
    title: "Wholesaler / Bulk buyer",
    desc: "Posts demand, compares quotes",
    icon: "i-b",
    dashboard: "/dashboard/wholesaler",
  },
  {
    role: "logistics",
    title: "Logistics provider",
    desc: "Quotes and runs deliveries",
    icon: "i-t",
    dashboard: "/dashboard/logistics",
  },
  {
    role: "admin",
    title: "Admin (sandbox)",
    desc: "Reviews, resolves, audits",
    icon: "i-sh",
    dashboard: "/dashboard/admin",
  },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/seller";
  const urlError = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(urlError);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Enter your email or phone number");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        // Prototype mode fallback
        localStorage.setItem(
          "freshroute_demo_user",
          JSON.stringify({
            email: username,
            id: "demo-user-" + Date.now(),
            full_name: username.split("@")[0],
          })
        );
        router.push(redirectTo);
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: username,
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
      setError(err?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleDemoSignIn = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setDemoLoading(account.role);
    localStorage.setItem(
      "freshroute_demo_user",
      JSON.stringify({
        email: `${account.role}@freshroute.local`,
        id: `demo-${account.role}`,
        full_name: `Demo ${account.role.charAt(0).toUpperCase() + account.role.slice(1)}`,
        role: account.role,
      })
    );
    setTimeout(() => {
      router.push(account.dashboard);
    }, 400);
  };

  return (
    <div id="app" style={{ display: "block", minHeight: "100vh" }}>
      <ProduceSvgDefs />
      <div className="au" id="au">
        {/* Left Branded Panel */}
        <AuthBrandedPanel />

        {/* Right Form Panel */}
        <section className="au-f">
          <div className="tb" role="tablist">
            <button role="tab" id="tl" aria-selected="true">
              Log in
            </button>
            <Link
              role="tab"
              id="tr"
              aria-selected="false"
              href="/register"
              className="flex items-center justify-center"
            >
              Create account
            </Link>
          </div>

          <div id="lv">
            <form id="lf" noValidate onSubmit={handleSubmit}>
              <label className={`fl ${error && !username.trim() ? "bad" : ""}`}>
                Email or phone number
                <input
                  id="lu"
                  autoComplete="username"
                  placeholder="you@example.com or 9876543210"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="er" role="alert">
                  {error && !username.trim() ? `• ${error}` : ""}
                </span>
              </label>

              <div className={`fl ${error && !password ? "bad" : ""}`}>
                <label htmlFor="lp">Password</label>
                <span className="pw">
                  <input
                    id="lp"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </span>
                <span className="er" role="alert">
                  {error && !password ? `• ${error}` : ""}
                </span>
              </div>

              <div className="rw2">
                <label>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />{" "}
                  Remember this session
                </label>
                <Link href="/forgot-password" id="fg">
                  Forgot password?
                </Link>
              </div>

              {error && username.trim() && password && (
                <div
                  className="nt"
                  style={{
                    marginBottom: "16px",
                    background: "#FBEAE8",
                    color: "#D9473A",
                    borderColor: "#F0B9B3",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn"
                id="lb"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? <span className="spin" style={{ margin: "0 auto" }} /> : "Log in"}
              </button>
            </form>

            <div className="dv">or explore a demo account</div>

            <div className="dacc" id="dacc">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  className="da"
                  disabled={demoLoading !== null}
                  onClick={() => handleDemoSignIn(d)}
                >
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <use href={`#${d.icon}`} />
                  </svg>
                  <span>
                    <b>{d.title}</b>
                    <small>{d.desc}</small>
                  </span>
                  <span className="go">
                    {demoLoading === d.role ? (
                      <span className="spin" />
                    ) : (
                      "→"
                    )}
                  </span>
                </button>
              ))}
            </div>

            <p className="fn">
              New here?{" "}
              <Link href="/register">
                <b>Create an account</b>
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
