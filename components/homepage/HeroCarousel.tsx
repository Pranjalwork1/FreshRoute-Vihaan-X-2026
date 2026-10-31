"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ProducePhoto } from "@/components/icons/ProduceIcons";

interface Slide {
  h: string;
  p: string;
  b: [string, string, string][];
  ph: string[];
  fc?: number;
}

const SLIDES: Slide[] = [
  {
    h: "Don’t let your surplus harvest go to waste.",
    p: "FreshRoute helps farmers and sellers connect with retailers, wholesalers and logistics providers to find better opportunities for surplus produce.",
    b: [
      ["Start Selling", "btn o", "/register?role=seller"],
      ["Watch a rescue in action", "btn g", "#demo"],
    ],
    ph: ["tomato", "potato", "onion", "pepper", "corn"],
    fc: 1,
  },
  {
    h: "Buy fresh produce directly from sellers.",
    p: "Search active listings by produce, quantity and location, see the full landed cost, and make an offer without leaving the platform.",
    b: [
      ["Explore Marketplace", "btn", "/marketplace"],
      ["Join as a Buyer", "btn g", "/register?role=buyer"],
    ],
    ph: ["eggplant", "cauliflower", "beetroot", "pomegranate", "apple"],
  },
  {
    h: "Reliable transport for every batch.",
    p: "Logistics and storage partners find delivery jobs that fit their vehicles and routes, and sellers see their options before they decide.",
    b: [
      ["Join as a Provider", "btn o", "/register?role=logistics"],
      ["See how it works", "btn g", "#how"],
    ],
    ph: ["tomato", "tomato2", "ginger", "potato", "corn"],
  },
];

// [left%, top%, width%, --z (px), --r (deg)]
const CARD_POSITIONS = [
  [28, 14, 38, 90, -4],
  [2, 40, 28, 30, 6],
  [66, 4, 28, 50, 5],
  [58, 48, 30, 70, -6],
  [10, 2, 22, 10, 4],
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const hsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hsRef.current) return;
    const r = hsRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    hsRef.current.style.setProperty("--rx", `${x * 9}deg`);
    hsRef.current.style.setProperty("--ry", `${y * -7}deg`);
  };

  const handlePointerLeave = () => {
    if (!hsRef.current) return;
    hsRef.current.style.setProperty("--rx", "0deg");
    hsRef.current.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      className="hs"
      id="hs"
      ref={hsRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Slides */}
      {SLIDES.map((slide, sIdx) => (
        <div
          key={sIdx}
          className={`sl ${sIdx === current ? "on" : ""}`}
          style={{ display: sIdx === current ? "grid" : "none" }}
        >
          <div>
            <h1>{slide.h}</h1>
            <p className="lead">{slide.p}</p>
            <div className="cta">
              {slide.b.map(([label, btnClass, href], bIdx) =>
                href.startsWith("#") ? (
                  <a key={bIdx} className={btnClass} href={href}>
                    {label}
                  </a>
                ) : (
                  <Link key={bIdx} className={btnClass} href={href}>
                    {label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="cg">
            {slide.ph.map((produceName, pIdx) => {
              const pos = CARD_POSITIONS[pIdx] || [20, 20, 30, 20, 0];
              return (
                <div
                  key={pIdx}
                  className="ct"
                  style={
                    {
                      left: `${pos[0]}%`,
                      top: `${pos[1]}%`,
                      width: `${pos[2]}%`,
                      "--z": `${pos[3]}px`,
                      "--r": `${pos[4]}deg`,
                      "--i": pIdx,
                    } as React.CSSProperties
                  }
                >
                  <ProducePhoto name={produceName} alt={produceName} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Prev / Next buttons */}
      <button
        type="button"
        className="ar p"
        id="pv"
        aria-label="Previous slide"
        onClick={() =>
          setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
        }
      >
        ‹
      </button>
      <button
        type="button"
        className="ar n"
        id="nx"
        aria-label="Next slide"
        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
      >
        ›
      </button>

      {/* Indicator dots */}
      <div className="hn" id="hn">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={i === current ? "on" : ""}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

