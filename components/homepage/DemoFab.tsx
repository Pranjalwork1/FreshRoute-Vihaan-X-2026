"use client";

import React, { useState, useEffect } from "react";

export function DemoFab() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const demoEl = document.getElementById("demo");
      if (demoEl) {
        const r = demoEl.getBoundingClientRect();
        setHidden(r.top < window.innerHeight && r.bottom > 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      className={`fab ${hidden ? "hide" : ""}`}
      id="fab"
      href="#demo"
      aria-label="Jump to rescue simulation"
    >
      ▶ Watch the live demo
    </a>
  );
}
