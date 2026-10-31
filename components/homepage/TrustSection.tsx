import React from "react";

const TRUST_FEATURES = [
  {
    icon: "i-sh",
    title: "Never oversells",
    desc: "Stock is reserved in one database transaction, so two buyers can never take the same kilo.",
  },
  {
    icon: "i-tg",
    title: "Labelled evidence",
    desc: "Every claim says who stands behind it: the seller, the platform or an independent source.",
  },
  {
    icon: "i-lk",
    title: "Private by default",
    desc: "Exact pickup locations stay hidden until an order is accepted.",
  },
  {
    icon: "i-l",
    title: "Every action logged",
    desc: "Sensitive actions record who did what and when, so disputes can be settled fairly.",
  },
];

export function TrustSection() {
  return (
    <section id="trust">
      <span className="ey">Built to be trusted</span>
      <h2>Marketplaces run on trust, so we built it in.</h2>

      <div className="tg" id="tg" style={{ marginTop: "28px" }}>
        {TRUST_FEATURES.map((item) => (
          <div key={item.title} className="fe">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <use href={`#${item.icon}`} />
            </svg>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
