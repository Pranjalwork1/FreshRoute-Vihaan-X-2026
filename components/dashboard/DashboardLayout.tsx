"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

interface Props {
  roleTitle: string;
  roleSubtitle: string;
  navItems: NavItem[];
  userEmail?: string;
  userName?: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  roleTitle,
  roleSubtitle,
  navItems,
  userEmail,
  userName,
  children,
}: Props) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[var(--sf)] border-b border-[var(--line)]">
        <div className="w flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="logo text-xl font-bold flex items-center gap-2">
              <FreshRouteLogo className="w-6 h-6" />
              FreshRoute
            </Link>
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--tint)] text-[var(--acc)]">
              <span>{roleTitle} Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="btn g py-2 px-3 text-xs hidden sm:inline-block">
              Marketplace
            </Link>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[var(--ink)]">
                {userName || "FreshRoute User"}
              </div>
              <div className="text-[11px] text-[var(--mute)]">
                {userEmail || "user@freshroute.in"}
              </div>
            </div>

            <form action="/auth/logout" method="post" className="inline">
              <button
                type="submit"
                className="py-1.5 px-3 rounded-lg border border-[var(--line)] hover:bg-gray-100 text-xs font-semibold transition"
              >
                Logout
              </button>
            </form>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-[var(--line)] text-sm"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className="w flex-1 flex flex-col md:flex-row gap-8 py-6">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:block w-full md:w-64 shrink-0`}
        >
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-4 sticky top-24">
            <div className="mb-4 pb-3 border-b border-[var(--line)]">
              <h2 className="text-sm font-bold text-[var(--ink)]">{roleTitle}</h2>
              <p className="text-xs text-[var(--mute)]">{roleSubtitle}</p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-[var(--acc)] text-white shadow-sm"
                        : "text-[var(--ink)] hover:bg-[var(--tint)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[var(--tint)] text-[var(--acc)]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-[var(--line)]">
              <div className="text-[11px] font-bold text-[var(--mute)] uppercase tracking-wider mb-2">
                Active Capabilities Switcher
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <Link
                  href="/dashboard/seller"
                  className={`p-2 rounded-lg border text-center font-medium transition ${
                    pathname.startsWith("/dashboard/seller")
                      ? "bg-[var(--acc)] text-white border-[var(--acc)] shadow-sm"
                      : "border-[var(--line)] text-[var(--ink)] hover:bg-[var(--tint)]"
                  }`}
                >
                  🌾 Farmer
                </Link>
                <Link
                  href="/dashboard/buyer"
                  className={`p-2 rounded-lg border text-center font-medium transition ${
                    pathname === "/dashboard/buyer"
                      ? "bg-[var(--acc)] text-white border-[var(--acc)] shadow-sm"
                      : "border-[var(--line)] text-[var(--ink)] hover:bg-[var(--tint)]"
                  }`}
                >
                  🛒 Buyer
                </Link>
                <Link
                  href="/dashboard/wholesaler"
                  className={`p-2 rounded-lg border text-center font-medium transition ${
                    pathname === "/dashboard/wholesaler"
                      ? "bg-[var(--acc)] text-white border-[var(--acc)] shadow-sm"
                      : "border-[var(--line)] text-[var(--ink)] hover:bg-[var(--tint)]"
                  }`}
                >
                  📦 Wholesale
                </Link>
                <Link
                  href="/dashboard/logistics"
                  className={`p-2 rounded-lg border text-center font-medium transition ${
                    pathname === "/dashboard/logistics"
                      ? "bg-[var(--acc)] text-white border-[var(--acc)] shadow-sm"
                      : "border-[var(--line)] text-[var(--ink)] hover:bg-[var(--tint)]"
                  }`}
                >
                  🚚 Logistics
                </Link>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--line)]">
                <Link
                  href="/dashboard/settings/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    pathname.startsWith("/dashboard/settings")
                      ? "bg-[var(--acc)] text-white"
                      : "text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--tint)]"
                  }`}
                >
                  ⚙️ Account Settings
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

