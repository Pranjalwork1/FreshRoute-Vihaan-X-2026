"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("query", query.trim());
    }
    if (category && category !== "All categories") {
      params.set("category", category);
    }
    if (location.trim()) {
      params.set("location", location.trim());
    }
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <form className="srch" role="search" onSubmit={handleSearch}>
      <label>
        Produce
        <input
          placeholder="Crop name (e.g. Tomatoes)"
          aria-label="Produce search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <label>
        Category
        <select
          id="cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All categories</option>
          <option>Vegetables</option>
          <option>Fruits</option>
          <option>Grains</option>
          <option>Pulses</option>
          <option>Seasonal Produce</option>
          <option>Other Produce</option>
        </select>
      </label>
      <label>
        Location
        <input
          placeholder="Town or district"
          aria-label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <button type="submit" className="btn">
        Find Produce
      </button>
    </form>
  );
}
