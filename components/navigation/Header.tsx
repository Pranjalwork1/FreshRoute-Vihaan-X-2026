"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";

export function Header({ user }: { user?: { email?: string; fullName?: string } | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="w nv">
        <Link className="logo" href="/">
          <FreshRouteLogo />
          FreshRoute
        </Link>
        <nav className="nl" aria-label="Main">
          <Link href="/">Home</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/for-farmers">For Farmers</Link>
          <Link href="/for-buyers">For Buyers</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="na">
          {user ? (
            <>
              <Link className="btn g" href="/dashboard/seller">
                Dashboard
              </Link>
              <form action="/auth/logout" method="post" className="inline">
                <button type="submit" className="btn">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="btn g" href="/login">
                Login
              </Link>
              <Link className="btn" href="/register">
                Join FreshRoute
              </Link>
            </>
          )}

          <details
            className="mm"
            open={menuOpen}
            onToggle={(e) => setMenuOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary>Menu</summary>
            <div>
              <Link href="/marketplace" onClick={() => setMenuOpen(false)}>
                Marketplace
              </Link>
              <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>
                How it works
              </Link>
              <Link href="/for-farmers" onClick={() => setMenuOpen(false)}>
                For Farmers
              </Link>
              <Link href="/for-buyers" onClick={() => setMenuOpen(false)}>
                For Buyers
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard/seller" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <form action="/auth/logout" method="post">
                    <button
                      type="submit"
                      className="text-left w-full py-2 px-3 text-red-600 font-medium text-sm"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="font-bold text-[#176B45]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Join FreshRoute
                  </Link>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

