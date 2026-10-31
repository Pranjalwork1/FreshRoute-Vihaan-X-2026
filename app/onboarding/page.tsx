"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";
import { RoleType } from "@/lib/types";

const ROLE_OPTIONS = [
  {
    id: "farmer",
    label: "Farmer / Agricultural Producer",
    desc: "Grow crops and list surplus harvest directly for commercial buyers.",
    icon: "🌾",
  },
  {
    id: "local_vendor",
    label: "Local Vendor / Mandi Trader",
    desc: "Aggregate regional harvests and supply local retailers and consumers.",
    icon: "🏪",
  },
  {
    id: "retailer",
    label: "Retailer / Shop Owner",
    desc: "Procure fresh produce for retail grocery stores and food outlets.",
    icon: "🛒",
  },
  {
    id: "wholesaler",
    label: "Wholesaler / Bulk Buyer",
    desc: "Purchase metric-tonne lots, food processing inputs, and institutional orders.",
    icon: "📦",
  },
  {
    id: "logistics_provider",
    label: "Logistics & Transport Provider",
    desc: "Provide freight transport, vehicle trips, or cold-storage facilities.",
    icon: "🚚",
  },
];

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");

  const [step, setStep] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [village, setVillage] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [crops, setCrops] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState("");
  const [coldChainAvailable, setColdChainAvailable] = useState(false);
  const [typicalQuantity, setTypicalQuantity] = useState("");
  const [shopType, setShopType] = useState("Retail Kirana / Vegetable Mandi");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (intent === "sell" || intent === "farmer") {
      setSelectedRoles(["farmer"]);
    } else if (intent === "buy" || intent === "retailer") {
      setSelectedRoles(["retailer"]);
    } else if (intent === "wholesaler") {
      setSelectedRoles(["wholesaler"]);
    } else if (intent === "logistics_provider") {
      setSelectedRoles(["logistics_provider"]);
    }
  }, [intent]);

  const toggleRole = (role: RoleType) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const isFarmer = selectedRoles.includes("farmer");
  const isVendor = selectedRoles.includes("local_vendor");
  const isRetailer = selectedRoles.includes("retailer");
  const isWholesaler = selectedRoles.includes("wholesaler");
  const isLogistics = selectedRoles.includes("logistics_provider");

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      setError("Please select at least one role to proceed.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      setError("Please select at least one role to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      if (!supabase) {
        const demoOnboarding = {
          roles: selectedRoles,
          businessName,
          location: { village, city, district, state, postalCode },
          crops,
          typicalQuantity,
          vehicleTypes,
          coldChainAvailable,
        };
        localStorage.setItem(
          "freshroute_demo_onboarding",
          JSON.stringify(demoOnboarding)
        );

        if (isFarmer || isVendor) {
          router.push("/dashboard/seller");
        } else if (isRetailer) {
          router.push("/dashboard/buyer");
        } else if (isWholesaler) {
          router.push("/dashboard/wholesaler");
        } else {
          router.push("/dashboard/logistics");
        }
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // 1. Insert Roles
      for (const role of selectedRoles) {
        await supabase.from("user_roles").upsert(
          {
            user_id: user.id,
            role: role,
            status: "active",
          },
          { onConflict: "user_id,role" }
        );
      }

      // 2. Insert Business Profile (Status: not_submitted initially)
      await supabase.from("business_profiles").insert({
        user_id: user.id,
        business_name: businessName || `${user.user_metadata?.full_name || "Enterprise"}`,
        business_type: selectedRoles.join(", "),
        description: crops ? `Categories: ${crops}` : "Agricultural marketplace participant",
        verification_status: "not_submitted",
        operating_region: district ? `${district}, ${state}` : null,
      });

      // 3. Insert Address
      if (district || state || postalCode) {
        await supabase.from("addresses").insert({
          user_id: user.id,
          address_line: village || city || district,
          village: village || null,
          city: city || null,
          district: district || null,
          state: state || null,
          postal_code: postalCode || null,
          is_default: true,
        });
      }

      // 4. Insert Role Profile Details
      for (const role of selectedRoles) {
        let details: Record<string, unknown> = {};
        if (role === "farmer") {
          details = { crops, village, district, state };
        } else if (role === "local_vendor") {
          details = { shopType, crops, city };
        } else if (role === "retailer") {
          details = { typicalQuantity, categories: crops };
        } else if (role === "wholesaler") {
          details = { typicalQuantity, warehouseLocation: city || district };
        } else if (role === "logistics_provider") {
          details = { vehicleTypes, coldChainAvailable };
        }

        await supabase.from("role_profiles").upsert(
          {
            user_id: user.id,
            role,
            details,
          },
          { onConflict: "user_id,role" }
        );
      }

      if (isFarmer || isVendor) {
        router.push("/dashboard/seller");
      } else if (isRetailer) {
        router.push("/dashboard/buyer");
      } else if (isWholesaler) {
        router.push("/dashboard/wholesaler");
      } else {
        router.push("/dashboard/logistics");
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save profile settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg)]">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="logo inline-flex text-2xl font-extrabold mb-3">
            <FreshRouteLogo className="w-8 h-8" />
            FreshRoute
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Setup Your Capabilities
          </h2>
          <p className="text-xs text-[var(--mute)] mt-1">
            FreshRoute supports multi-role accounts. You can select both producer and buyer capabilities.
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step === 1 ? "text-[var(--acc)]" : "text-[var(--mute)]"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 1 ? "bg-[var(--acc)] text-white" : "bg-gray-200"
                }`}
              >
                1
              </span>
              <span>Role Selection</span>
            </div>
            <div className="w-8 h-0.5 bg-[var(--line)]" />
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step === 2 ? "text-[var(--acc)]" : "text-[var(--mute)]"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 2 ? "bg-[var(--acc)] text-white" : "bg-gray-200"
                }`}
              >
                2
              </span>
              <span>Commercial Details</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <form onSubmit={handleStep1Continue} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[var(--ink)] mb-3 block">
                  Select all business activities that apply to you
                </label>
                <div className="grid gap-3">
                  {ROLE_OPTIONS.map((opt) => {
                    const isChecked = selectedRoles.includes(opt.id as RoleType);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleRole(opt.id as RoleType)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                          isChecked
                            ? "border-[var(--acc)] bg-[var(--tint)]"
                            : "border-[var(--line)] bg-[var(--sf)] hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 text-[var(--acc)] rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                          </div>
                          <p className="text-xs text-[var(--mute)] mt-1">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn w-full text-center text-xs py-3">
                Continue to Details →
              </button>
            </form>
          )}

          {/* STEP 2: Role-Specific Details & Location */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[var(--mute)] hover:text-[var(--ink)] font-bold mb-4 inline-block"
                >
                  ← Change Selected Roles
                </button>
                <h3 className="text-base font-bold text-[var(--ink)]">
                  Commercial & Location Information
                </h3>
              </div>

              {/* General Business / Farm Name */}
              <label>
                Enterprise / Farm / Business Name
                <input
                  required
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Patil Organic Farms / Green Mandi Trading"
                />
              </label>

              {/* Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label>
                  Village / Locality
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Pimpalgaon"
                  />
                </label>

                <label>
                  Town / City
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Nashik"
                  />
                </label>

                <label>
                  District
                  <input
                    required
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Nashik"
                  />
                </label>

                <label>
                  State
                  <input
                    required
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                  />
                </label>

                <label className="sm:col-span-2">
                  PIN Code
                  <input
                    required
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 422001"
                  />
                </label>
              </div>

              {/* Farmer Section */}
              {isFarmer && (
                <div className="p-4 bg-[var(--tint)] rounded-xl border border-[var(--line)] space-y-3">
                  <h4 className="font-bold text-xs text-[var(--acc)] uppercase tracking-wider">
                    🌾 Farmer / Producer Preferences
                  </h4>
                  <label>
                    Main Crops / Produce Categories
                    <input
                      type="text"
                      value={crops}
                      onChange={(e) => setCrops(e.target.value)}
                      placeholder="e.g. Tomatoes, Onions, Potatoes, Grapes"
                    />
                  </label>
                </div>
              )}

              {/* Local Vendor Section */}
              {isVendor && (
                <div className="p-4 bg-[var(--tint)] rounded-xl border border-[var(--line)] space-y-3">
                  <h4 className="font-bold text-xs text-[var(--acc)] uppercase tracking-wider">
                    🏪 Local Vendor Details
                  </h4>
                  <label>
                    Shop / Stall Type
                    <input
                      type="text"
                      value={shopType}
                      onChange={(e) => setShopType(e.target.value)}
                      placeholder="e.g. Mandi Wholesaler, Kirana Produce, Retail Stall"
                    />
                  </label>
                </div>
              )}

              {/* Retailer Section */}
              {isRetailer && (
                <div className="p-4 bg-[var(--tint)] rounded-xl border border-[var(--line)] space-y-3">
                  <h4 className="font-bold text-xs text-[var(--acc)] uppercase tracking-wider">
                    🛒 Retailer Procurement Needs
                  </h4>
                  <label>
                    Typical Weekly Purchasing Volume
                    <input
                      type="text"
                      value={typicalQuantity}
                      onChange={(e) => setTypicalQuantity(e.target.value)}
                      placeholder="e.g. 200 - 500 kg per delivery"
                    />
                  </label>
                </div>
              )}

              {/* Wholesaler Section */}
              {isWholesaler && (
                <div className="p-4 bg-[var(--tint)] rounded-xl border border-[var(--line)] space-y-3">
                  <h4 className="font-bold text-xs text-[var(--acc)] uppercase tracking-wider">
                    📦 Wholesaler Institutional Volume
                  </h4>
                  <label>
                    Typical Bulk Lot Demand
                    <input
                      type="text"
                      value={typicalQuantity}
                      onChange={(e) => setTypicalQuantity(e.target.value)}
                      placeholder="e.g. 5 to 20 Metric Tonnes per contract"
                    />
                  </label>
                </div>
              )}

              {/* Logistics Section */}
              {isLogistics && (
                <div className="p-4 bg-[var(--tint)] rounded-xl border border-[var(--line)] space-y-3">
                  <h4 className="font-bold text-xs text-[var(--acc)] uppercase tracking-wider">
                    🚚 Logistics Fleet Capabilities
                  </h4>
                  <label>
                    Vehicle Categories & Capacity
                    <input
                      type="text"
                      value={vehicleTypes}
                      onChange={(e) => setVehicleTypes(e.target.value)}
                      placeholder="e.g. 1-Tonne Pickup, 3-Tonne Eicher Truck"
                    />
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="coldchain"
                      type="checkbox"
                      checked={coldChainAvailable}
                      onChange={(e) => setColdChainAvailable(e.target.checked)}
                      className="w-4 h-4 text-[var(--acc)] rounded cursor-pointer"
                    />
                    <label htmlFor="coldchain" className="text-xs font-semibold cursor-pointer">
                      Refrigerated / Temperature-controlled transit available
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn g text-xs"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn flex-1 text-xs py-3 text-center disabled:opacity-50"
                >
                  {loading ? "Saving Profile..." : "Complete Setup & Enter Workspace"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading onboarding wizard...</div>}>
      <OnboardingForm />
    </Suspense>
  );
}
