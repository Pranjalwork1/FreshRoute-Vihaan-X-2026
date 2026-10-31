"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { FreshRouteLogo, ProducePhoto } from "@/components/icons/ProduceIcons";

export function AuthBrandedPanel() {
  const aubRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!aubRef.current) return;
    const r = aubRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    aubRef.current.style.setProperty("--rx", `${x * 10}deg`);
    aubRef.current.style.setProperty("--ry", `${y * -8}deg`);
  };

  const handlePointerLeave = () => {
    if (!aubRef.current) return;
    aubRef.current.style.setProperty("--rx", "0deg");
    aubRef.current.style.setProperty("--ry", "0deg");
  };

  return (
    <aside
      className="au-b"
      id="aub"
      ref={aubRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Link className="logo" href="/">
        <FreshRouteLogo />
        FreshRoute
      </Link>
      <h2>From surplus to opportunity.</h2>
      <p>
        One account to sell, buy, move and store produce, with every account type getting its own workspace.
      </p>

      <ul>
        <li>Reach buyers who can really take your batch</li>
        <li>See who has checked every claim</li>
        <li>Exact locations stay private until an order is accepted</li>
      </ul>

      <div className="cg" id="aucg">
        <div
          className="ct"
          style={
            {
              left: "30%",
              top: "4%",
              width: "34%",
              "--z": "80px",
              "--r": "-4deg",
              "--i": 0,
            } as React.CSSProperties
          }
        >
          <ProducePhoto name="tomato" alt="Tomato" />
        </div>
        <div
          className="ct"
          style={
            {
              left: "4%",
              top: "28%",
              width: "26%",
              "--z": "30px",
              "--r": "6deg",
              "--i": 1,
            } as React.CSSProperties
          }
        >
          <ProducePhoto name="potato" alt="Potato" />
        </div>
        <div
          className="ct"
          style={
            {
              left: "62%",
              top: "20%",
              width: "26%",
              "--z": "50px",
              "--r": "5deg",
              "--i": 2,
            } as React.CSSProperties
          }
        >
          <ProducePhoto name="corn" alt="Corn" />
        </div>
      </div>
    </aside>
  );
}
