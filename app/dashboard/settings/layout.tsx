"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const SETTINGS_NAV = [
  { label: "Farmer Workspace", href: "/dashboard/seller" },
  { label: "Buyer Workspace", href: "/dashboard/buyer" },
  { label: "Profile", href: "/dashboard/settings/profile" },
  { label: "Business Details", href: "/dashboard/settings/business" },
  { label: "Active Roles", href: "/dashboard/settings/roles" },
  { label: "Security & Session", href: "/dashboard/settings/security" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: "Personal Profile", href: "/dashboard/settings/profile" },
    { label: "Business Profile", href: "/dashboard/settings/business" },
    { label: "Manage Roles", href: "/dashboard/settings/roles" },
    { label: "Security", href: "/dashboard/settings/security" },
  ];

  return (
    <DashboardLayout
      roleTitle="Account"
      roleSubtitle="Profile & Settings"
      navItems={SETTINGS_NAV}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            Account Settings
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Manage your personal profile, business verification, and active capabilities.
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-[var(--line)] gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-2.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? "border-[var(--acc)] text-[var(--acc)]"
                    : "border-transparent text-[var(--mute)] hover:text-[var(--ink)]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {children}
      </div>
    </DashboardLayout>
  );
}

