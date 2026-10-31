"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileSettingsPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [locationText, setLocationText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setFullName(profile.full_name || "");
            setPhone(profile.phone || "");
            setPreferredLanguage(profile.preferred_language || "en");
          }

          const { data: address } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_default", true)
            .single();

          if (address) {
            setLocationText(
              `${address.village || address.address_line || ""}, ${address.district || ""}, ${address.state || ""}`
            );
          }
        }
      } else {
        // Fallback demo user
        const stored = localStorage.getItem("freshroute_demo_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setFullName(parsed.full_name || "");
          setEmail(parsed.email || "");
          setPhone(parsed.phone || "");
        }
      }
    } catch (err) {
      console.warn("Failed to load profile:", err);
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
          await supabase
            .from("profiles")
            .update({
              full_name: fullName,
              phone: phone,
              preferred_language: preferredLanguage,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
        }
      } else {
        const stored = localStorage.getItem("freshroute_demo_user") || "{}";
        const parsed = JSON.parse(stored);
        parsed.full_name = fullName;
        parsed.phone = phone;
        localStorage.setItem("freshroute_demo_user", JSON.stringify(parsed));
      }
      setMsg("Personal profile saved successfully.");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[var(--mute)]">Loading profile details...</div>;
  }

  return (
    <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-lg font-bold mb-4 text-[var(--ink)]">Personal Profile</h2>

      {msg && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <label>
          Full Name
          <input
            required
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            disabled
            value={email}
            className="opacity-70 cursor-not-allowed bg-gray-50"
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>

        <label>
          Preferred Interface Language
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
          >
            <option value="en">English (Primary)</option>
            <option value="hi">Hindi (हिंदी - Coming soon)</option>
            <option value="mr">Marathi (मराठी - Coming soon)</option>
          </select>
        </label>

        <label>
          Primary Operating Location
          <input
            type="text"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="e.g. Pimpalgaon, Nashik, Maharashtra"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="btn text-xs mt-2 disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

