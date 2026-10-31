"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProducePhoto } from "@/components/icons/ProduceIcons";

interface BatchItem {
  id: string;
  name: string;
  qty: number;
  marketPrice: number;
  deadlineHours: number;
  splitPrices: [number, number];
  bulkPrice: number;
}

const BATCHES: BatchItem[] = [
  {
    id: "tomato",
    name: "Tomatoes",
    qty: 500,
    marketPrice: 20,
    deadlineHours: 18,
    splitPrices: [18, 16],
    bulkPrice: 15,
  },
  {
    id: "corn",
    name: "Sweet corn",
    qty: 400,
    marketPrice: 14,
    deadlineHours: 14,
    splitPrices: [13, 11],
    bulkPrice: 10,
  },
  {
    id: "eggplant",
    name: "Brinjal",
    qty: 220,
    marketPrice: 24,
    deadlineHours: 20,
    splitPrices: [22, 19],
    bulkPrice: 17,
  },
];

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function calculatePlans(b: BatchItem) {
  const q = b.qty;
  const l = b.marketPrice;
  const [p1, p2] = b.splitPrices;
  const q1 = Math.round(q * 0.6);
  const q2 = q - q1;

  const options = [
    {
      name: "Split between two buyers",
      desc: `${q1} kg to the retailer at ₹${p1}/kg, ${q2} kg to the wholesaler at ₹${p2}/kg, one shared van`,
      gross: q1 * p1 + q2 * p2,
      transport: Math.round(q * 1.2),
      net: q1 * p1 + q2 * p2 - Math.round(q * 1.2),
    },
    {
      name: "One bulk buyer",
      desc: `All ${q} kg to the wholesaler at ₹${b.bulkPrice}/kg, one van`,
      gross: q * b.bulkPrice,
      transport: q,
      net: q * b.bulkPrice - q,
    },
    {
      name: "Cold storage, sell later",
      desc: `Hold 2 days, then sell about 90% at ₹${l - 3}/kg`,
      gross: Math.round(q * 0.9) * (l - 3),
      transport: Math.round(q * 1.8),
      net: Math.round(q * 0.9) * (l - 3) - Math.round(q * 1.8),
    },
  ];

  let bestIdx = 0;
  options.forEach((opt, idx) => {
    if (opt.net > options[bestIdx].net) bestIdx = idx;
  });

  return { q1, q2, options, bestIdx };
}

export function RescueDemo() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [stepStage, setStepStage] = useState(4); // 0 to 4 steps visible
  const [progressWidth, setProgressWidth] = useState("100%");
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const activeBatch = BATCHES[selectedIdx];
  const { options, bestIdx } = calculatePlans(activeBatch);
  const h = activeBatch.deadlineHours;
  const urgencyLabel = h <= 24 ? "High" : h <= 72 ? "Medium" : "Low";

  const runSimulation = (idx: number) => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setSelectedIdx(idx);
    setStepStage(0);
    setProgressWidth("0%");

    const t1 = setTimeout(() => {
      setStepStage(1);
      setProgressWidth("25%");
    }, 200);

    const t2 = setTimeout(() => {
      setStepStage(2);
      setProgressWidth("50%");
    }, 600);

    const t3 = setTimeout(() => {
      setStepStage(3);
      setProgressWidth("75%");
    }, 1000);

    const t4 = setTimeout(() => {
      setStepStage(4);
      setProgressWidth("100%");
    }, 1400);

    timerRef.current = [t1, t2, t3, t4];
  };

  useEffect(() => {
    return () => timerRef.current.forEach(clearTimeout);
  }, []);

  return (
    <section id="demo">
      <span className="ey">Live demo, synthetic data</span>
      <h2>Watch one batch get rescued.</h2>
      <p className="sub">
        Pick a batch that is close to its deadline. FreshRoute checks urgency, finds buyers who can really take it, lines up transport and compares the plans.
      </p>

      <div className="dm">
        {/* Left: Batch Selector Buttons */}
        <div className="dt" id="dt">
          {BATCHES.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={selectedIdx === idx}
              onClick={() => runSimulation(idx)}
            >
              <span className="th">
                <ProducePhoto name={b.id} alt={b.name} />
              </span>
              <span>
                <b>
                  {b.name}, {b.qty} kg
                </b>
                <small>Closes in {b.deadlineHours} h (seller’s deadline)</small>
              </span>
            </button>
          ))}
        </div>

        {/* Right: Progressive Steps Panel */}
        <div>
          <div className="dp" id="dp">
            <div className="pg">
              <i id="pgb" style={{ width: progressWidth }} />
            </div>

            {/* Step 1: Urgency */}
            <div className={`ds ${stepStage >= 1 ? "on" : ""}`}>
              <h4>1. Urgency</h4>
              <span className="pl">{urgencyLabel} urgency</span>
              <p>Closes in {h} h.</p>
              <small>Basis: the seller’s own deadline.</small>
            </div>

            {/* Step 2: Matching Buyers */}
            <div className={`ds ${stepStage >= 2 ? "on" : ""}`}>
              <h4>2. Matching buyers</h4>
              <p>2 active buyers within radius</p>
              <small>
                Retailer A (wants up to 300 kg) & Wholesaler B (accepts bulk)
              </small>
            </div>

            {/* Step 3: Transport */}
            <div className={`ds ${stepStage >= 3 ? "on" : ""}`}>
              <h4>3. Transport</h4>
              <p>1 refrigerated van available</p>
              <small>
                Can pick up within 4 hours; shared route lowers unit cost
              </small>
            </div>

            {/* Step 4: Compared Plans */}
            <div className={`ds w4 ${stepStage >= 4 ? "on" : ""}`}>
              <h4>4. Compared plans</h4>
              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {options.map((opt, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: i === bestIdx ? "1.5px solid var(--acc)" : "1px solid var(--line)",
                      background: i === bestIdx ? "var(--tint)" : "var(--sf)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b>
                        {opt.name}{" "}
                        {i === bestIdx && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--acc)",
                              fontWeight: 700,
                              marginLeft: "6px",
                            }}
                          >
                            ★ HIGHEST NET
                          </span>
                        )}
                      </b>
                      <span style={{ fontWeight: 700, color: "var(--acc)" }}>
                        {inr(opt.net)} net
                      </span>
                    </div>
                    <small style={{ color: "var(--mute)", display: "block", marginTop: "2px" }}>
                      {opt.desc} (Transport: -{inr(opt.transport)})
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="fn">
            Everything in this demo is made up. Real plans use real listings, buyers and vehicles from the database, and show every assumption.
          </p>
        </div>
      </div>
    </section>
  );
}
