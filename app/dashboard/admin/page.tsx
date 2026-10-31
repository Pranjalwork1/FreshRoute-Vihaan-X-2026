import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_NAV = [
  { label: "Admin Overview", href: "/dashboard/admin" },
  { label: "Producer Verifications", href: "/dashboard/admin" },
  { label: "User Accounts", href: "/dashboard/admin" },
  { label: "Audit Logs", href: "/dashboard/admin" },
  { label: "Return to Farmer Workspace", href: "/dashboard/seller" },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  let isAdmin = false;
  let userEmail = "";
  let userName = "Operator";
  let verificationList: any[] = [];
  let userList: any[] = [];

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userEmail = user.email || "";
      userName = user.user_metadata?.full_name || "Platform Operator";

      // Verify admin role strictly on server
      const { data: roleCheck } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (roleCheck) {
        isAdmin = true;

        // Fetch verification requests
        const { data: requests } = await supabase
          .from("verification_requests")
          .select("*, profiles:user_id(full_name, phone)")
          .order("created_at", { ascending: false })
          .limit(10);
        verificationList = requests || [];

        // Fetch recent profiles
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*, user_roles(role)")
          .order("created_at", { ascending: false })
          .limit(10);
        userList = profiles || [];
      }
    }
  }

  if (!isAdmin) {
    return (
      <DashboardLayout
        roleTitle="Access Denied"
        roleSubtitle="Restricted Area"
        navItems={[{ label: "Overview", href: "/dashboard/seller" }]}
      >
        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-10 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold mb-2">Operator Clearance Required</h2>
          <p className="text-xs text-[var(--mute)] mb-6 leading-relaxed">
            The FreshRoute Administrator Workspace is strictly protected. User accounts cannot assign themselves administrative privileges. Clearance must be provisioned through server-side authorization.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard/seller" className="btn text-xs">
              Open Seller Workspace
            </Link>
            <Link href="/dashboard/buyer" className="btn g text-xs">
              Open Buyer Workspace
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      roleTitle="Platform Operator"
      roleSubtitle="Administrative Control"
      navItems={ADMIN_NAV}
      userEmail={userEmail}
      userName={userName}
    >
      <div className="space-y-6">
        <div className="bg-[var(--tint)] border border-[var(--line)] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--acc)] bg-white px-2 py-0.5 rounded">
              Operator Clearance Verified
            </span>
            <h1 className="text-2xl font-black text-[var(--ink)] tracking-tight mt-1">
              Admin & Governance Workspace
            </h1>
            <p className="text-xs text-[var(--mute)]">
              Audit registrations, approve KYC verifications, and monitor marketplace integrity.
            </p>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-[var(--ink)]">
            Producer & Vendor Verification Queue ({verificationList.length})
          </h3>

          {verificationList.length === 0 ? (
            <p className="text-xs text-[var(--mute)] py-4 text-center">
              No pending verification requests awaiting operator review.
            </p>
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {verificationList.map((req) => (
                <div key={req.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold">{req.profiles?.full_name || "Applicant"}</span>
                    <span className="text-[var(--mute)] ml-2">({req.document_type})</span>
                    <div className="text-[11px] text-[var(--mute)]">{req.notes}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registered User Accounts */}
        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-[var(--ink)]">
            Registered Accounts ({userList.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--line)] text-[var(--mute)]">
                <tr>
                  <th className="py-2">User</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Assigned Roles</th>
                  <th className="py-2">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {userList.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2.5 font-bold">{u.full_name || "User"}</td>
                    <td className="py-2.5 text-[var(--mute)]">{u.phone || "—"}</td>
                    <td className="py-2.5">
                      {u.user_roles?.map((r: any) => r.role).join(", ") || "None"}
                    </td>
                    <td className="py-2.5 text-[var(--mute)]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

