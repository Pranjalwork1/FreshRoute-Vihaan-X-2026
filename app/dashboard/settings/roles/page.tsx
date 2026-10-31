"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RoleType } from "@/lib/types";

const ALL_ROLES: { id: RoleType; label: string; desc: string; icon: string }[] = [
  {
    id: "farmer",
    label: "Farmer / Producer",
    desc: "Publish surplus harvest batches and connect with buyers.",
    icon: "🌾",
  },
  {
    id: "local_vendor",
    label: "Local Vendor / Mandi Trader",
    desc: "Aggregate regional harvests and sell to retail shops.",
    icon: "🏪",
  },
  {
    id: "retailer",
    label: "Retailer / Buyer",
    desc: "Procure fresh produce for retail grocery stores.",
    icon: "🛒",
  },
  {
    id: "wholesaler",
    label: "Wholesaler / Bulk Buyer",
    desc: "Procure high-volume metric-tonne lots and post demands.",
    icon: "📦",
  },
  {
    id: "logistics_provider",
    label: "Logistics & Transport Provider",
    desc: "Offer vehicle transport and reefer storage capacity.",
    icon: "🚚",
  },
];

export default function RolesSettingsPage() {
  const [activeRoles, setActiveRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);

          if (data && data.length > 0) {
            setActiveRoles(data.map((r: any) => r.role as RoleType));
            setLoading(false);
            return;
          }
        }
      }

      // Fallback
      const stored = localStorage.getItem("freshroute_demo_onboarding");
      if (stored) {
        const parsed = JSON.parse(stored);
        setActiveRoles(parsed.roles || ["farmer"]);
      } else {
        setActiveRoles(["farmer"]);
      }
    } catch (err) {
      console.warn("Failed to load roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (role: RoleType) => {
    if (activeRoles.includes(role)) return;
    setSaving(true);
    setMsg(null);

    try {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("user_roles").insert({
            user_id: user.id,
            role: role,
            status: "active",
          });
        }
      }

      const updated = [...activeRoles, role];
      setActiveRoles(updated);

      // Local storage sync
      const stored = localStorage.getItem("freshroute_demo_onboarding") || "{}";
      const parsed = JSON.parse(stored);
      parsed.roles = updated;
      localStorage.setItem("freshroute_demo_onboarding", JSON.stringify(parsed));

      setMsg(`Added capability: ${role}. You can now access its workspace.`);
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg("Error adding role: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[var(--mute)]">Loading capabilities...</div>;
  }

  return (
    <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink)]">Active Capabilities</h2>
        <p className="text-xs text-[var(--mute)]">
          FreshRoute’s multi-role system allows you to act as both a seller and a buyer without multiple logins.
        </p>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* List of active roles */}
      <div className="space-y-3">
        {ALL_ROLES.map((r) => {
          const isActive = activeRoles.includes(r.id);

          return (
            <div
              key={r.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                isActive
                  ? "border-[var(--acc)] bg-[var(--tint)]"
                  : "border-[var(--line)] bg-[var(--sf)] opacity-80"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[var(--ink)]">{r.label}</h4>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--acc)] text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--mute)] mt-0.5">{r.desc}</p>
                </div>
              </div>

              <div>
                {isActive ? (
                  <Link
                    href={
                      r.id === "farmer" || r.id === "local_vendor"
                        ? "/dashboard/seller"
                        : r.id === "retailer"
                        ? "/dashboard/buyer"
                        : r.id === "wholesaler"
                        ? "/dashboard/wholesaler"
                        : "/dashboard/logistics"
                    }
                    className="btn g text-xs py-1.5 px-3 inline-block"
                  >
                    Open Workspace →
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleAddRole(r.id)}
                    className="btn text-xs py-1.5 px-3"
                  >
                    + Add Capability
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
        🛡️ <strong>Security Note:</strong> Platform administrator rights cannot be assigned from this interface and require server-side cryptographic clearance.
      </div>
    </div>
  );
}

