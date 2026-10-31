"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FreshRouteLogo, ProduceSvgDefs } from "@/components/icons/ProduceIcons";

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
  ctaText?: string;
  ctaHref?: string;
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div id="app" style={{ display: "block" }}>
      <ProduceSvgDefs />
      <div className="wk" id="wk" style={{ display: "grid" }}>
        {/* Mobile menu toggle bar */}
        <div className="md:hidden col-span-2 bg-[var(--sf)] border-b border-[var(--line)] p-4 flex items-center justify-between">
          <Link href="/" className="logo text-lg font-bold flex items-center gap-2">
            <FreshRouteLogo className="w-5 h-5" />
            FreshRoute
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--tint)] text-[var(--acc)]">
              {roleTitle}
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 border border-[var(--line)] rounded text-sm"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* 250px Vertical Sidebar */}
        <aside
          className={`sd ${mobileOpen ? "block" : "hidden md:flex"}`}
          style={{ height: "100vh", position: "sticky", top: 0 }}
        >
          <Link className="logo" href="/">
            <FreshRouteLogo className="w-[26px] h-[26px]" />
            FreshRoute
          </Link>

          <div className="rb" id="rbn">
            <b>{userName || "Active Partner"}</b>
            <span>{roleSubtitle || `${roleTitle} workspace`}</span>
          </div>

          <nav id="sdn" aria-label="Workspace" style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, marginTop: "12px" }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-left text-sm py-2 px-3 rounded-lg font-medium transition flex items-center justify-between ${
                    active
                      ? "bg-[var(--tint)] text-[var(--acc)] font-bold"
                      : "text-[var(--mute)] hover:bg-[#F2F6F3] hover:text-[var(--ink)]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--acc)] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="my-2 border-t border-[var(--line)] pt-2">
              <span className="text-[11px] font-bold text-[var(--mute)] px-3 uppercase tracking-wider block mb-1">
                Role switch
              </span>
              <div className="flex flex-col gap-1">
                <Link
                  href="/dashboard/seller"
                  className="text-xs px-3 py-1 text-[var(--mute)] hover:text-[var(--acc)]"
                >
                  • Farmer / Seller
                </Link>
                <Link
                  href="/dashboard/buyer"
                  className="text-xs px-3 py-1 text-[var(--mute)] hover:text-[var(--acc)]"
                >
                  • Retailer / Buyer
                </Link>
                <Link
                  href="/dashboard/wholesaler"
                  className="text-xs px-3 py-1 text-[var(--mute)] hover:text-[var(--acc)]"
                >
                  • Wholesaler (Bulk)
                </Link>
                <Link
                  href="/dashboard/logistics"
                  className="text-xs px-3 py-1 text-[var(--mute)] hover:text-[var(--acc)]"
                >
                  • Logistics
                </Link>
              </div>
            </div>
          </nav>

          <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2">
            <Link href="/marketplace" className="text-xs text-[var(--mute)] hover:underline">
              ← Marketplace
            </Link>
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="lo w-full text-left text-xs text-red-600 font-semibold py-1.5 px-3 rounded hover:bg-red-50"
              >
                Log out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="mn" id="mnb">
          {children}
        </main>
      </div>
    </div>
  );
}
