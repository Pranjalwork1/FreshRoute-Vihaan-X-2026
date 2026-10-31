import React from "react";
import Link from "next/link";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";

export function Footer() {
  return (
    <footer>
      <div className="w">
        <div className="fg">
          <div>
            <Link className="logo" href="/">
              <FreshRouteLogo className="w-[26px] h-[26px]" />
              FreshRoute
            </Link>
            <p style={{ marginTop: "12px" }}>From surplus to opportunity.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <Link href="/about">About</Link>
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/for-farmers">For Farmers</Link>
            <Link href="/for-buyers">For Buyers</Link>
            <Link href="/how-it-works">How It Works</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link href="/contact">Help and Support</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h4>Follow</h4>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </div>
        <div className="cp">
          FreshRoute — Agricultural surplus and supply-chain marketplace. Every harvest deserves a market.
        </div>
      </div>
    </footer>
  );
}

