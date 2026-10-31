import React from "react";
import Link from "next/link";
import { ProduceCard, ProduceItem } from "./ProduceCard";

export const SAMPLE_PRODUCE: ProduceItem[] = [
  {
    id: "corn",
    name: "Sweet corn",
    locality: "Karnal, Haryana",
    qty: 400,
    price: 14,
    grade: "Grade B, seller-declared",
    harvest: "Harvested today",
    deadlineHours: 14,
    minQty: 40,
  },
  {
    id: "tomato",
    name: "Tomatoes",
    locality: "Nashik, Maharashtra",
    qty: 500,
    price: 20,
    grade: "Grade B, seller-declared",
    harvest: "Harvested today",
    deadlineHours: 18,
    minQty: 50,
  },
  {
    id: "eggplant",
    name: "Brinjal",
    locality: "Pune, Maharashtra",
    qty: 220,
    price: 24,
    grade: "Grade B, seller-declared",
    harvest: "Harvested today",
    deadlineHours: 20,
    minQty: 25,
  },
  {
    id: "pepper",
    name: "Green capsicum",
    locality: "Meerut, Uttar Pradesh",
    qty: 120,
    price: 45,
    grade: "Grade A, seller-declared",
    harvest: "Harvested yesterday",
    deadlineHours: 30,
    minQty: 20,
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    locality: "Agra, Uttar Pradesh",
    qty: 260,
    price: 28,
    grade: "Grade A, seller-declared",
    harvest: "Harvested yesterday",
    deadlineHours: 36,
    minQty: 30,
  },
  {
    id: "beetroot",
    name: "Beetroot",
    locality: "Kolar, Karnataka",
    qty: 180,
    price: 22,
    grade: "Grade A, seller-declared",
    harvest: "Harvested 2 days ago",
    deadlineHours: 96,
    minQty: 20,
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    locality: "Solapur, Maharashtra",
    qty: 150,
    price: 65,
    grade: "Grade A, seller-declared",
    harvest: "Harvested 4 days ago",
    deadlineHours: 120,
    minQty: 15,
  },
  {
    id: "potato",
    name: "Red potatoes",
    locality: "Jalandhar, Punjab",
    qty: 300,
    price: 18,
    grade: "Grade A, seller-declared",
    harvest: "Harvested 3 days ago",
    deadlineHours: 144,
    minQty: 50,
  },
  {
    id: "apple",
    name: "Golden apples",
    locality: "Shimla, Himachal Pradesh",
    qty: 200,
    price: 80,
    grade: "Grade A, seller-declared",
    harvest: "Harvested 5 days ago",
    deadlineHours: 168,
    minQty: 20,
  },
  {
    id: "onion",
    name: "Red onions",
    locality: "Lasalgaon, Maharashtra",
    qty: 800,
    price: 16,
    grade: "Grade A, seller-declared",
    harvest: "Cured 2 days ago",
    deadlineHours: null,
    minQty: 100,
  },
];

export function ClosingSoonSection() {
  const closingSoonItems = SAMPLE_PRODUCE.filter(
    (item) => item.deadlineHours !== null
  ).slice(0, 5);

  return (
    <section id="closing-soon" style={{ padding: "56px 0 24px" }}>
      <div className="hd">
        <div>
          <h2>Closing soon</h2>
          <p className="sub" style={{ margin: 0 }}>
            Sellers set these deadlines. The sooner one closes, the sooner a buyer is needed.
          </p>
        </div>
        <Link className="btn g" href="/marketplace?filter=closing-soon">
          View All Produce
        </Link>
      </div>

      <div className="rw" id="rw" style={{ marginTop: "24px" }}>
        {closingSoonItems.map((item) => (
          <ProduceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

