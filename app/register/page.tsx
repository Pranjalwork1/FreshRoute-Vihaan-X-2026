"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthBrandedPanel } from "@/components/auth/AuthBrandedPanel";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";

const STEP_NAMES = [
  "Account",
  "Activities",
  "Business",
  "Location",
  "Verify",
];

const ACTIVITIES = [
  {
    id: "sell",
    title: "Sell produce",
    desc: "Farmers and local vendors",
    role: "seller",
  },
  {
    id: "buy",
    title: "Buy produce",
    desc: "Retailers and shops",
    role: "buyer",
  },
  {
    id: "bulk",
    title: "Buy in bulk",
    desc: "Wholesalers and institutional buyers",
    role: "wholesaler",
  },
  {
    id: "haul",
    title: "Transport or storage",
    desc: "Logistics providers and cold rooms",
    role: "logistics",
  },
];

const STATES = [
  "Uttar Pradesh",
  "Delhi",
  "Haryana",
  "Punjab",
  "Maharashtra",
  "Karnataka",
  "Madhya Pradesh",
  "Rajasthan",
  "Gujarat",
  "Bihar",
  "West Bengal",
  "Tamil Nadu",
  "Other",
];

function RegisterWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "seller";

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    initialRole === "buyer"
      ? "buy"
      : initialRole === "wholesaler"
      ? "bulk"
      : initialRole === "logistics"
      ? "haul"
      : "sell",
  ]);

  // Business state
  const [businessData, setBusinessData] = useState<Record<string, string>>({
    sell_name: "",
    sell_crops: "",
    sell_area: "",
    buy_name: "",
    buy_items: "",
    bulk_name: "",
    bulk_capacity: "5000",
    bulk_produce: "",
    haul_type: "Pickup",
    haul_capacity: "1500",
    haul_area: "",
  });

  // Location state
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");

  // Verification state
  const [verifyChoice, setVerifyChoice] = useState("later");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength (0 to 4)
  const calculatePasswordStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = calculatePasswordStrength(password);

  const toggleActivity = (id: string) => {
    if (selectedActivities.includes(id)) {
      if (selectedActivities.length > 1) {
        setSelectedActivities(selectedActivities.filter((a) => a !== id));
      }
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };

  const validateStep = (s: number) => {
    const errs: Record<string, string> = {};

    if (s === 0) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        errs.fullName = "Enter your full name";
      }
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone.trim());
      const isPhone = /^\+?\d{10,13}$/.test(emailOrPhone.replace(/[\s-]/g, ""));
      if (!isEmail && !isPhone) {
        errs.emailOrPhone = "Enter a valid email or 10-digit phone number";
      }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        errs.password = "Use at least 8 characters, with a letter and a number";
      }
    } else if (s === 1) {
      if (selectedActivities.length === 0) {
        errs.activities = "Choose at least one activity";
      }
    } else if (s === 2) {
      if (selectedActivities.includes("sell") && !businessData.sell_name.trim()) {
        errs.sell_name = "Farm or shop name is required";
      }
      if (selectedActivities.includes("buy") && !businessData.buy_name.trim()) {
        errs.buy_name = "Business name is required";
      }
      if (selectedActivities.includes("bulk") && !businessData.bulk_name.trim()) {
        errs.bulk_name = "Business name is required";
      }
    } else if (s === 3) {
      if (!stateName) {
        errs.state = "Choose your state";
      }
      if (!district.trim()) {
        errs.district = "Enter your district";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmitRegistration();
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 0) setStep(step - 1);
  };

  const getPrimaryRole = () => {
    if (selectedActivities.includes("sell")) return "seller";
    if (selectedActivities.includes("bulk")) return "wholesaler";
    if (selectedActivities.includes("haul")) return "logistics";
    return "buyer";
  };

  const handleSubmitRegistration = async () => {
    setLoading(true);
    setErrors({});

    try {
      const primaryRole = getPrimaryRole();
      const supabase = createClient();

      // 1. Call server-side registration endpoint with admin confirmation
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          emailOrPhone: emailOrPhone.trim(),
          password,
          role: primaryRole,
          activities: selectedActivities,
          state: stateName,
          district: district.trim(),
          pincode: pincode.trim(),
          verified: verifyChoice === "now",
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setErrors({ form: resData.error || "Failed to complete registration" });
        setLoading(false);
        return;
      }

      // 2. Client-side sign in to establish browser session
      if (supabase && resData.user?.email) {
        try {
          await supabase.auth.signInWithPassword({
            email: resData.user.email,
            password,
          });
        } catch (authErr) {
          console.warn("Client session sign-in notice:", authErr);
        }
      }

      // 3. Store local demo session as well
      localStorage.setItem(
        "freshroute_demo_user",
        JSON.stringify({
          email: resData.user?.email || emailOrPhone,
          full_name: fullName,
          role: primaryRole,
          activities: selectedActivities,
          state: stateName,
          district,
        })
      );

      setLoading(false);
      setComplete(true);
    } catch (err: any) {
      setErrors({ form: err?.message || "Failed to complete registration" });
      setLoading(false);
    }
  };

  return (
    <main id="app" style={{ display: "block", minHeight: "100vh" }}>
      <ProduceSvgDefs />
      <div className="au" id="au">
        <AuthBrandedPanel />

        <section className="au-f">
          <div className="tb" role="tablist">
            <Link
              role="tab"
              id="tl"
              aria-selected="false"
              href="/login"
              className="flex items-center justify-center"
            >
              Log in
            </Link>
            <button role="tab" id="tr" aria-selected="true">
              Create account
            </button>
          </div>

          <div id="rv">
            {complete ? (
              <div className="wp wz text-center py-6">
                <svg
                  className="w-14 h-14 mx-auto text-[var(--acc)] mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 12 3 3 5-6" />
                </svg>
                <h3>You’re all set, {fullName.split(" ")[0]}</h3>
                <p className="sub2">
                  You chose:{" "}
                  {selectedActivities
                    .map(
                      (a) =>
                        ACTIVITIES.find((x) => x.id === a)?.title.toLowerCase()
                    )
                    .join(", ")}
                  . Your workspace is configured and ready.
                </p>
                <div className="cta flex gap-3 justify-center mt-6">
                  <Link
                    className="btn"
                    href={`/dashboard/${getPrimaryRole()}`}
                  >
                    Open my workspace
                  </Link>
                  <Link className="btn g" href="/">
                    Back to homepage
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* 5-step progress indicators */}
                <div className="sg">
                  {STEP_NAMES.map((_, i) => (
                    <i key={i} className={i <= step ? "on" : ""} />
                  ))}
                </div>
                <div className="sgl">
                  Step {step + 1} of 5: {STEP_NAMES[step]}
                </div>

                <div className="wp wz">
                  {/* STEP 0: Account */}
                  {step === 0 && (
                    <>
                      <h3>Create your account</h3>
                      <p className="sub2">
                        One account for everything you do on FreshRoute.
                      </p>

                      <label className={`fl ${errors.fullName ? "bad" : ""}`}>
                        Full name
                        <input
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Ramesh Kumar"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <span className="er" role="alert">
                          {errors.fullName ? `• ${errors.fullName}` : ""}
                        </span>
                      </label>

                      <label className={`fl ${errors.emailOrPhone ? "bad" : ""}`}>
                        Email or phone number
                        <input
                          name="id"
                          type="text"
                          autoComplete="username"
                          placeholder="you@example.com or 9876543210"
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                        />
                        <span className="er" role="alert">
                          {errors.emailOrPhone ? `• ${errors.emailOrPhone}` : ""}
                        </span>
                      </label>

                      <div className={`fl ${errors.password ? "bad" : ""}`}>
                        <label htmlFor="rp">Password</label>
                        <span className="pw">
                          <input
                            id="rp"
                            name="pw"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="At least 8 chars, letter & number"
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
                        <div className="sm" id="sm">
                          <i className={strength >= 1 ? "on" : ""} />
                          <i className={strength >= 2 ? "on" : ""} />
                          <i className={strength >= 3 ? "on" : ""} />
                          <i className={strength >= 4 ? "on" : ""} />
                        </div>
                        <span className="er" role="alert">
                          {errors.password ? `• ${errors.password}` : ""}
                        </span>
                      </div>
                    </>
                  )}

                  {/* STEP 1: Activities */}
                  {step === 1 && (
                    <>
                      <h3>What will you do here?</h3>
                      <p className="sub2">
                        Pick one or more. You can add more later.
                      </p>

                      <div className="opts">
                        {ACTIVITIES.map((act) => (
                          <label key={act.id} className="opt">
                            <input
                              type="checkbox"
                              value={act.id}
                              checked={selectedActivities.includes(act.id)}
                              onChange={() => toggleActivity(act.id)}
                            />
                            <b>{act.title}</b>
                            <small>{act.desc}</small>
                          </label>
                        ))}
                      </div>
                      {errors.activities && (
                        <span className="er block mt-2" role="alert">
                          • {errors.activities}
                        </span>
                      )}
                      <p className="fn">
                        Admin accounts are assigned by operators and can’t be chosen here.
                      </p>
                    </>
                  )}

                  {/* STEP 2: Business details */}
                  {step === 2 && (
                    <>
                      <h3>Tell us about your business</h3>
                      <p className="sub2">
                        Only what we need to get you started.
                      </p>

                      {selectedActivities.includes("sell") && (
                        <fieldset className="fs">
                          <legend>Sell produce</legend>
                          <label className={`fl ${errors.sell_name ? "bad" : ""}`}>
                            Farm or shop name
                            <input
                              type="text"
                              placeholder="e.g. Green Valley Farm"
                              value={businessData.sell_name}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  sell_name: e.target.value,
                                })
                              }
                            />
                            <span className="er" role="alert">
                              {errors.sell_name ? `• ${errors.sell_name}` : ""}
                            </span>
                          </label>
                          <label className="fl">
                            Main crops or products
                            <input
                              type="text"
                              placeholder="tomato, onion, potato"
                              value={businessData.sell_crops}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  sell_crops: e.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="fl">
                            Usual selling area
                            <input
                              type="text"
                              placeholder="e.g. Nashik District"
                              value={businessData.sell_area}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  sell_area: e.target.value,
                                })
                              }
                            />
                          </label>
                        </fieldset>
                      )}

                      {selectedActivities.includes("buy") && (
                        <fieldset className="fs">
                          <legend>Buy produce</legend>
                          <label className={`fl ${errors.buy_name ? "bad" : ""}`}>
                            Shop or business name
                            <input
                              type="text"
                              placeholder="e.g. Fresh Daily Mart"
                              value={businessData.buy_name}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  buy_name: e.target.value,
                                })
                              }
                            />
                            <span className="er" role="alert">
                              {errors.buy_name ? `• ${errors.buy_name}` : ""}
                            </span>
                          </label>
                          <label className="fl">
                            What do you usually buy?
                            <input
                              type="text"
                              placeholder="vegetables, fruits"
                              value={businessData.buy_items}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  buy_items: e.target.value,
                                })
                              }
                            />
                          </label>
                        </fieldset>
                      )}

                      {selectedActivities.includes("bulk") && (
                        <fieldset className="fs">
                          <legend>Buy in bulk</legend>
                          <label className={`fl ${errors.bulk_name ? "bad" : ""}`}>
                            Business name
                            <input
                              type="text"
                              placeholder="e.g. Apex Agri Trade"
                              value={businessData.bulk_name}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  bulk_name: e.target.value,
                                })
                              }
                            />
                            <span className="er" role="alert">
                              {errors.bulk_name ? `• ${errors.bulk_name}` : ""}
                            </span>
                          </label>
                          <label className="fl">
                            Procurement capacity (kg per week)
                            <input
                              type="number"
                              placeholder="5000"
                              value={businessData.bulk_capacity}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  bulk_capacity: e.target.value,
                                })
                              }
                            />
                          </label>
                        </fieldset>
                      )}

                      {selectedActivities.includes("haul") && (
                        <fieldset className="fs">
                          <legend>Transport or storage</legend>
                          <label className="fl">
                            Vehicle type
                            <select
                              value={businessData.haul_type}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  haul_type: e.target.value,
                                })
                              }
                            >
                              <option>Pickup</option>
                              <option>Mini truck</option>
                              <option>Truck</option>
                              <option>Refrigerated van</option>
                            </select>
                          </label>
                          <label className="fl">
                            Load capacity (kg)
                            <input
                              type="number"
                              placeholder="1500"
                              value={businessData.haul_capacity}
                              onChange={(e) =>
                                setBusinessData({
                                  ...businessData,
                                  haul_capacity: e.target.value,
                                })
                              }
                            />
                          </label>
                        </fieldset>
                      )}
                    </>
                  )}

                  {/* STEP 3: Location */}
                  {step === 3 && (
                    <>
                      <h3>Where are you based?</h3>
                      <p className="sub2">
                        Your exact pickup location stays private until an order is accepted.
                      </p>

                      <label className={`fl ${errors.state ? "bad" : ""}`}>
                        State
                        <select
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                        >
                          <option value="">Choose a state</option>
                          {STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <span className="er" role="alert">
                          {errors.state ? `• ${errors.state}` : ""}
                        </span>
                      </label>

                      <label className={`fl ${errors.district ? "bad" : ""}`}>
                        District
                        <input
                          type="text"
                          placeholder="e.g. Meerut, Pune, Karnal"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                        <span className="er" role="alert">
                          {errors.district ? `• ${errors.district}` : ""}
                        </span>
                      </label>

                      <label className="fl">
                        Pincode (optional)
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="110001"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                        />
                      </label>
                    </>
                  )}

                  {/* STEP 4: Verification */}
                  {step === 4 && (
                    <>
                      <h3>Verification</h3>
                      <p className="sub2">
                        You can start without it. We only ask for documents when there is a clear business or verification need, such as before large orders.
                      </p>

                      <div className="opts">
                        <label className="opt">
                          <input
                            type="radio"
                            name="vf"
                            value="later"
                            checked={verifyChoice === "later"}
                            onChange={() => setVerifyChoice("later")}
                          />
                          <b>Verify later</b>
                          <small>Recommended to start</small>
                        </label>

                        <label className="opt">
                          <input
                            type="radio"
                            name="vf"
                            value="now"
                            checked={verifyChoice === "now"}
                            onChange={() => setVerifyChoice("now")}
                          />
                          <b>Add details now</b>
                          <small>Earns a trust label sooner</small>
                        </label>
                      </div>

                      {errors.form && (
                        <div
                          className="nt mt-4"
                          style={{
                            background: "#FBEAE8",
                            color: "#D9473A",
                            borderColor: "#F0B9B3",
                          }}
                        >
                          {errors.form}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="wb">
                  <button
                    type="button"
                    className="btn g"
                    onClick={handleBack}
                    style={{ visibility: step > 0 ? "visible" : "hidden" }}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={handleNext}
                  >
                    {loading ? (
                      <span className="spin" style={{ margin: "0 auto" }} />
                    ) : step === 4 ? (
                      "Create account"
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="spin" />
        </div>
      }
    >
      <RegisterWizardContent />
    </Suspense>
  );
}
