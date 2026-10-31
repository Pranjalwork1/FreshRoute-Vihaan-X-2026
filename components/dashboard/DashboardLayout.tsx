"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FreshRouteLogo, ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export interface NavItem {
  label: string;
  href: string;
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
  userName,
  children,
}: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div id="app" style={{ display: "block", minHeight: "100vh" }}>
      <ProduceSvgDefs />

      {/* Top Mobile Bar - Only visible on small screens (< 981px), completely outside .wk grid */}
      <header className="dash-mob-bar">
        <Link href="/" className="logo text-lg font-bold flex items-center gap-2">
          <FreshRouteLogo className="w-5 h-5" />
          FreshRoute
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-[var(--tint)] text-[var(--acc)]">
            {roleTitle}
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 border border-[var(--line)] rounded text-sm bg-[var(--sf)]"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Standard 2-Column Grid: Child 1 is <aside class="sd">, Child 2 is <main class="mn"> */}
      <div className="wk" id="wk">
        <aside className={`sd ${mobileOpen ? "open" : ""}`}>
          <Link className="logo flex items-center gap-2 font-bold" href="/">
            <FreshRouteLogo className="w-[26px] h-[26px]" />
            FreshRoute
          </Link>

          <div className="rb" id="rbn">
            <b>{userName || "Active Partner"}</b>
            <span>{roleSubtitle || `${roleTitle} workspace`}</span>
          </div>

          <nav id="sdn" aria-label="Workspace">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "active" : ""}
                  aria-current={active ? "page" : undefined}
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
          </nav>

          <div className="sd-role-box">
            <small>Workspace Switch</small>
            <div className="sd-role-grid">
              <Link
                href="/dashboard/seller"
                className={
                  roleTitle.toLowerCase().includes("farmer") ||
                  roleTitle.toLowerCase().includes("seller")
                    ? "on"
                    : ""
                }
                onClick={() => setMobileOpen(false)}
              >
                Farmer
              </Link>
              <Link
                href="/dashboard/buyer"
                className={
                  roleTitle.toLowerCase().includes("buyer") ||
                  roleTitle.toLowerCase().includes("retailer")
                    ? "on"
                    : ""
                }
                onClick={() => setMobileOpen(false)}
              >
                Buyer
              </Link>
              <Link
                href="/dashboard/wholesaler"
                className={
                  roleTitle.toLowerCase().includes("wholesaler") ? "on" : ""
                }
                onClick={() => setMobileOpen(false)}
              >
                Wholesale
              </Link>
              <Link
                href="/dashboard/logistics"
                className={
                  roleTitle.toLowerCase().includes("logistics") ? "on" : ""
                }
                onClick={() => setMobileOpen(false)}
              >
                Logistics
              </Link>
            </div>
          </div>

          <div className="sd-foot">
            <Link
              href="/marketplace"
              className="sd-back"
              onClick={() => setMobileOpen(false)}
            >
              ← Back to Marketplace
            </Link>
            <form action="/auth/logout" method="post">
              <button type="submit" className="lo">
                Log out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Dashboard Workspace Content */}
        <main className="mn" id="mnb">
          {children}
        </main>
      </div>
    </div>
  );
}
