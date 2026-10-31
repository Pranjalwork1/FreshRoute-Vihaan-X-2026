"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BusinessSettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Farmer / Producer");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [operatingRegion, setOperatingRegion] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("not_submitted");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("business_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (data) {
            setBusinessName(data.business_name || "");
            setBusinessType(data.business_type || "");
            setDescription(data.description || "");
            setContactPhone(data.contact_phone || "");
            setOperatingRegion(data.operating_region || "");
            setVerificationStatus(data.verification_status || "not_submitted");
          }
        }
      } else {
        const stored = localStorage.getItem("freshroute_demo_onboarding");
        if (stored) {
          const parsed = JSON.parse(stored);
          setBusinessName(parsed.businessName || "");
          setBusinessType(parsed.roles?.join(", ") || "Farmer / Producer");
          setDescription(parsed.crops ? `Crops: ${parsed.crops}` : "");
        }
      }
    } catch (err) {
      console.warn("Failed to load business profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("business_profiles").upsert({
            user_id: user.id,
            business_name: businessName,
            business_type: businessType,
            description: description,
            contact_phone: contactPhone,
            operating_region: operatingRegion,
            updated_at: new Date().toISOString(),
          });
        }
      }
      setMsg("Business profile updated successfully.");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitVerification = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("business_profiles")
            .update({ verification_status: "pending" })
            .eq("user_id", user.id);

          await supabase.from("verification_requests").insert({
            user_id: user.id,
            document_type: "Farmer KYC / Land Record / Trade License",
            notes: "Submitted via business settings",
            status: "pending",
          });
        }
      }
      setVerificationStatus("pending");
      setMsg("Verification request submitted for admin review.");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg("Error submitting request: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[var(--mute)]">Loading business profile...</div>;
  }

  return (
    <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[var(--line)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)]">Commercial Profile</h2>
          <p className="text-xs text-[var(--mute)]">
            Disclose enterprise name and operating areas for buyer trust.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--mute)]">Verification:</span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
              verificationStatus === "verified"
                ? "bg-green-100 text-green-800"
                : verificationStatus === "pending"
                ? "bg-amber-100 text-amber-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {verificationStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <label>
          Farm / Business Name
          <input
            required
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Sahyadri Organic Cultivators"
          />
        </label>

        <label>
          Business Entity Type
          <input
            required
            type="text"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            placeholder="e.g. Farmer / FPO / Wholesaler"
          />
        </label>

        <label>
          Direct Commercial Contact Phone
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+91 98220 00000"
          />
        </label>

        <label>
          Primary Operating Corridors / Mandis
          <input
            type="text"
            value={operatingRegion}
            onChange={(e) => setOperatingRegion(e.target.value)}
            placeholder="e.g. Nashik, Pune, Mumbai APMC"
          />
        </label>

        <label>
          Business Overview & Produce Specialities
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your harvest capacity, cold storage access, or bulk requirements..."
          />
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn text-xs disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Business Profile"}
          </button>

          {verificationStatus === "not_submitted" && (
            <button
              type="button"
              onClick={handleSubmitVerification}
              className="btn g text-xs"
            >
              Request Admin Verification
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

