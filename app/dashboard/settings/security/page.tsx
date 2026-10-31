"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPassword.length < 6) {
      setMsg({ text: "New password must be at least 6 characters.", error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ text: "Passwords do not match.", error: true });
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          setMsg({ text: error.message, error: true });
          return;
        }
      }

      setMsg({ text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      setMsg({ text: err.message || "Failed to update password.", error: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink)]">Security & Session</h2>
        <p className="text-xs text-[var(--mute)]">
          Manage your authentication credentials and session tokens.
        </p>
      </div>

      {msg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold ${
            msg.error
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-800"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Change Password Form */}
      <div className="border border-[var(--line)] rounded-xl p-5 max-w-lg space-y-4">
        <h3 className="font-bold text-sm text-[var(--ink)]">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <label>
            New Password
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
            disabled={saving}
            className="btn text-xs disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Session Management */}
      <div className="border border-[var(--line)] rounded-xl p-5 max-w-lg space-y-3">
        <h3 className="font-bold text-sm text-[var(--ink)]">Active Session</h3>
        <p className="text-xs text-[var(--mute)]">
          You are currently signed in with cookie-based SSR session tokens secured with HTTPOnly flags.
        </p>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="py-2 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition"
          >
            Sign Out of All Sessions
          </button>
        </form>
      </div>
    </div>
  );
}

