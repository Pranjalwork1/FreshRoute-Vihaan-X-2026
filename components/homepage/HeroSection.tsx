"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";

export function HeroSection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const tilt = tiltRef.current;
    if (!scene || !tilt) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty("--rx", `${x * 10}deg`);
      tilt.style.setProperty("--ry", `${y * -8}deg`);
    };

    const handlePointerLeave = () => {
      tilt.style.setProperty("--rx", "0deg");
      tilt.style.setProperty("--ry", "0deg");
    };

    scene.addEventListener("pointermove", handlePointerMove);
    scene.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      scene.removeEventListener("pointermove", handlePointerMove);
      scene.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className="hero">
      <div>
        <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[var(--acc)] bg-[var(--tint)] px-3 py-1 rounded-full mb-3 border border-[var(--line)]">
          INTELLIGENT AGRICULTURAL MARKETPLACE
        </div>
        <h1>Don’t let your surplus harvest go to waste.</h1>
        <p className="lead">
          Connect directly with retailers, wholesalers and logistics providers.
          Find better selling opportunities and move your produce through a
          smarter supply network.
        </p>
        <div className="cta">
          <Link className="btn" href="/marketplace">
            Explore Marketplace
          </Link>
          <Link className="btn o" href="/register?intent=sell">
            Start Selling
          </Link>
          <Link className="btn g" href="/register?intent=buy">
            Join as a Buyer
          </Link>
        </div>
        <p className="hint">
          One platform. Farmers, buyers and logistics providers. Every surplus deserves a second chance.
        </p>
      </div>

      <div>
        <div className="scene" id="scene" ref={sceneRef}>
          <div className="tilt" id="tilt" ref={tiltRef}>
            <svg
              viewBox="0 0 420 320"
              aria-label="Illustration: a crate of fresh tomatoes with potatoes, onions and chillies at a market stall"
              role="img"
            >
              <circle cx="338" cy="64" r="32" fill="#F4A340" opacity=".9" />
              <path
                d="M0 230c60-50 120-40 180-14s150 8 240-36v140H0z"
                fill="#35A66F"
                opacity=".25"
              />
              <path
                d="M0 262c80-36 160-24 230-4s130 4 190-14v76H0z"
                fill="#176B45"
                opacity=".18"
              />
              <use href="#onion" x="40" y="150" width="84" height="84" />
              <use href="#potato" x="290" y="152" width="90" height="90" />
              <use href="#chilli" x="236" y="124" width="64" height="64" />
              <use href="#tomato" x="100" y="96" width="90" height="90" />
              <use href="#tomato" x="170" y="84" width="96" height="96" />
              <use href="#tomato" x="130" y="130" width="90" height="90" />
              <use href="#tomato" x="206" y="126" width="90" height="90" />
              <use href="#crate" x="70" y="170" width="280" height="168" />
            </svg>
            <div className="fc">
              <small>Available produce, verified listing</small>
              <b>Fresh tomatoes</b>
              <small>Nashik, Maharashtra</small>
              <small style={{ margin: "6px 0 2px" }}>500 kg available</small>
              <strong>₹20/kg</strong>
            </div>
          </div>
        </div>

        <div className="jr" aria-label="The FreshRoute journey">
          <span>Farmer</span>
          <span>FreshRoute</span>
          <span>Buyer</span>
          <span>Delivery</span>
        </div>
      </div>
    </div>
  );
}

