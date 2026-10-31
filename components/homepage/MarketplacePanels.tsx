import React from "react";
import Link from "next/link";
import { ProducePhoto } from "@/components/icons/ProduceIcons";

export function MarketplacePanels() {
  return (
    <div className="mo" id="mo">
      {/* Panel 1: Closing soon */}
      <div className="mc">
        <h3>Closing soon</h3>
        <div className="mg">
          <figure>
            <div className="pi">
              <ProducePhoto name="corn" alt="Sweet corn" />
            </div>
            Sweet corn, 14 h
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="tomato" alt="Tomatoes" />
            </div>
            Tomatoes, 18 h
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="eggplant" alt="Brinjal" />
            </div>
            Brinjal, 20 h
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="pepper" alt="Capsicum" />
            </div>
            Capsicum, 30 h
          </figure>
        </div>
        <a href="#closing-soon">See all closing soon</a>
      </div>

      {/* Panel 2: Shop by category */}
      <div className="mc">
        <h3>Shop by category</h3>
        <div className="mg">
          <figure>
            <div className="pi">
              <ProducePhoto name="tomato" alt="Vegetables" />
            </div>
            Vegetables
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="pomegranate" alt="Fruits" />
            </div>
            Fruits
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="corn" alt="Grains" />
            </div>
            Grains
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="cauliflower" alt="Seasonal" />
            </div>
            Seasonal
          </figure>
        </div>
        <Link href="/marketplace">See all categories</Link>
      </div>

      {/* Panel 3: Bulk for wholesalers */}
      <div className="mc">
        <h3>Bulk for wholesalers</h3>
        <div className="mg">
          <figure>
            <div className="pi">
              <ProducePhoto name="potato" alt="Red potatoes" />
            </div>
            Potatoes, 300 kg
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="onion" alt="Red onions" />
            </div>
            Red onions, 800 kg
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="corn" alt="Sweet corn" />
            </div>
            Sweet corn, 400 kg
          </figure>
          <figure>
            <div className="pi">
              <ProducePhoto name="apple" alt="Golden apples" />
            </div>
            Golden apples, 200 kg
          </figure>
        </div>
        <Link href="/marketplace">Browse bulk lots</Link>
      </div>

      {/* Panel 4: Sell your harvest */}
      <div className="mc">
        <h3>Sell your harvest</h3>
        <div className="mg">
          <figure>
            <div className="pi">
              <svg className="ic2" viewBox="0 0 24 24" aria-hidden="true">
                <use href="#i-l" />
              </svg>
            </div>
            List a batch
          </figure>
          <figure>
            <div className="pi">
              <svg className="ic2" viewBox="0 0 24 24" aria-hidden="true">
                <use href="#i-m" />
              </svg>
            </div>
            Get matched
          </figure>
          <figure>
            <div className="pi">
              <svg className="ic2" viewBox="0 0 24 24" aria-hidden="true">
                <use href="#i-t" />
              </svg>
            </div>
            Arrange transport
          </figure>
          <figure>
            <div className="pi">
              <svg className="ic2" viewBox="0 0 24 24" aria-hidden="true">
                <use href="#i-c" />
              </svg>
            </div>
            Complete the sale
          </figure>
        </div>
        <Link href="/register?role=seller">Start selling</Link>
      </div>
    </div>
  );
}

