import React from "react";

export function WhySection() {
  return (
    <section className="why" id="why">
      <span className="ey">Why this matters</span>
      <h2>Fresh produce can’t wait for the next market day.</h2>
      <p className="thesis">
        FreshRoute is built around one idea: surplus should reach a buyer, a truck or cold storage before it loses its value.
      </p>

      <div className="sn">
        <div>
          <b>14%</b>
          <span>of the world’s food is lost between harvest and retail</span>
        </div>
        <div>
          <b>&gt;20%</b>
          <span>is lost in Central and Southern Asia</span>
        </div>
        <div>
          <b>Higher</b>
          <span>losses for fruits and vegetables than for cereals and pulses</span>
        </div>
      </div>

      <p className="src">Source: FAO, The State of Food and Agriculture 2019.</p>
    </section>
  );
}
