import { createClient } from "@/lib/supabase/server";
import { ProduceBatch, BatchImage } from "@/lib/types";

// In-memory store for fallback/demo when Supabase is not connected
export const INITIAL_SAMPLE_BATCHES: ProduceBatch[] = [
  {
    id: "sample-batch-tomato",
    seller_id: "seller-patil-farm",
    batch_code: "FR-VEG-902144",
    produce_name: "Tomatoes (Hybrid)",
    category: "Vegetables",
    variety: "Abhinav F1",
    description: "Firm, uniform ripe red tomatoes packed in ventilated 20kg plastic crates. Harvested early morning to prevent sun scald.",
    quantity_total: 500,
    quantity_available: 500,
    quantity_reserved: 0,
    quantity_sold: 0,
    unit: "kg",
    price_per_unit: 20,
    minimum_order_quantity: 50,
    is_negotiable: true,
    bulk_pricing_details: "₹18/kg for orders exceeding 200 kg",
    quality_grade: "Grade B",
    harvest_date: new Date().toISOString().split("T")[0],
    current_condition: "Firm, mature red",
    storage_condition: "Covered shade at 16°C",
    packaging_type: "Plastic crates (20 kg)",
    availability_deadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    pickup_location_text: "Gat No. 42, Pimpalgaon Mandi Road, Nashik, Maharashtra - 422001",
    latitude: 20.0059,
    longitude: 73.7898,
    status: "active",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    images: [],
    seller: {
      id: "seller-patil-farm",
      full_name: "Ramesh Patil",
      business_name: "Patil Agro Producer Co.",
      phone: "+91 98220 12345",
      avatar_url: null,
    },
  },
  {
    id: "sample-batch-potato",
    seller_id: "seller-sharma-farm",
    batch_code: "FR-VEG-881203",
    produce_name: "Potatoes (Jyoti)",
    category: "Vegetables",
    variety: "Kufri Jyoti",
    description: "Dry-cured soil-free medium to large size potatoes. Stored in dark ventilated warehouse.",
    quantity_total: 300,
    quantity_available: 300,
    quantity_reserved: 0,
    quantity_sold: 0,
    unit: "kg",
    price_per_unit: 18,
    minimum_order_quantity: 50,
    is_negotiable: false,
    quality_grade: "Grade A",
    harvest_date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split("T")[0],
    current_condition: "Cured, dry skin, no sprouting",
    storage_condition: "Ventilated shed",
    packaging_type: "Jute gunny bags (50 kg)",
    availability_deadline: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    pickup_location_text: "Agra Road Warehouse, Kolar, Karnataka - 563101",
    latitude: 13.1367,
    longitude: 78.1291,
    status: "active",
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    images: [],
    seller: {
      id: "seller-sharma-farm",
      full_name: "Suresh Sharma",
      business_name: "Golden Earth Farms",
      phone: "+91 98450 54321",
      avatar_url: null,
    },
  },
  {
    id: "sample-batch-onion",
    seller_id: "seller-jadhav-farm",
    batch_code: "FR-VEG-774192",
    produce_name: "Red Onions (Nashik)",
    category: "Vegetables",
    variety: "Garwa Red",
    description: "Premium cured red onions with thick skin and low moisture. Ready for long-distance transport.",
    quantity_total: 800,
    quantity_available: 800,
    quantity_reserved: 0,
    quantity_sold: 0,
    unit: "kg",
    price_per_unit: 16,
    minimum_order_quantity: 100,
    is_negotiable: true,
    bulk_pricing_details: "₹15/kg for 500+ kg",
    quality_grade: "Grade A",
    harvest_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split("T")[0],
    current_condition: "Well dried, firm bulb",
    storage_condition: "Ambient dry airflow rack",
    packaging_type: "Mesh net bags (40 kg)",
    availability_deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    pickup_location_text: "Lasalgaon Market Yard, Nashik, Maharashtra - 422306",
    latitude: 20.1472,
    longitude: 74.2255,
    status: "active",
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    images: [],
    seller: {
      id: "seller-jadhav-farm",
      full_name: "Baburao Jadhav",
      business_name: "Sahyadri Farmer Producer Co.",
      phone: "+91 94231 99887",
      avatar_url: null,
    },
  },
  {
    id: "sample-batch-chilli",
    seller_id: "seller-reddy-farm",
    batch_code: "FR-VEG-662910",
    produce_name: "Green Chillies (G4)",
    category: "Vegetables",
    variety: "G4 Pusa Jwala",
    description: "Crisp dark green chillies with intact stalks. High pungency, packed in breathable mesh crates.",
    quantity_total: 120,
    quantity_available: 120,
    quantity_reserved: 0,
    quantity_sold: 0,
    unit: "kg",
    price_per_unit: 45,
    minimum_order_quantity: 20,
    is_negotiable: false,
    quality_grade: "Grade A",
    harvest_date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split("T")[0],
    current_condition: "Fresh green, firm stalk",
    storage_condition: "Cool room at 10°C",
    packaging_type: "Perforated crates (10 kg)",
    availability_deadline: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
    pickup_location_text: "Guntur Rural Market Yard, Andhra Pradesh - 522004",
    latitude: 16.3067,
    longitude: 80.4365,
    status: "active",
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    images: [],
    seller: {
      id: "seller-reddy-farm",
      full_name: "Venkatesh Reddy",
      business_name: "Krishna Valley Fresh",
      phone: "+91 99890 11223",
      avatar_url: null,
    },
  },
];

let localBatches: ProduceBatch[] = [...INITIAL_SAMPLE_BATCHES];

export async function getMarketplaceListings(options?: {
  category?: string;
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  grade?: string;
  sortBy?: "newest" | "price_low" | "price_high";
  limit?: number;
}): Promise<ProduceBatch[]> {
  const supabase = await createClient();

  if (supabase) {
    try {
      let query = supabase
        .from("produce_batches")
        .select(`
          *,
          batch_images (
            id,
            batch_id,
            storage_path,
            display_order
          ),
          profiles:seller_id (
            id,
            full_name,
            phone,
            avatar_url
          )
        `)
        .eq("status", "active")
        .gt("quantity_available", 0);

      if (options?.category && options.category !== "All categories") {
        query = query.eq("category", options.category);
      }

      if (options?.grade && options.grade !== "All grades") {
        query = query.eq("quality_grade", options.grade);
      }

      if (options?.location) {
        query = query.ilike("pickup_location_text", `%${options.location}%`);
      }

      if (options?.query) {
        query = query.ilike("produce_name", `%${options.query}%`);
      }

      if (options?.minPrice) {
        query = query.gte("price_per_unit", options.minPrice);
      }

      if (options?.maxPrice) {
        query = query.lte("price_per_unit", options.maxPrice);
      }

      if (options?.sortBy === "price_low") {
        query = query.order("price_per_unit", { ascending: true });
      } else if (options?.sortBy === "price_high") {
        query = query.order("price_per_unit", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (!error && data) {
        return data.map((b: any) => ({
          ...b,
          images: b.batch_images || [],
          seller: b.profiles || null,
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local store:", err);
    }
  }

  // Fallback to local store
  let filtered = [...localBatches].filter(
    (b) => b.status === "active" && b.quantity_available > 0
  );

  if (options?.category && options.category !== "All categories") {
    filtered = filtered.filter((b) => b.category === options.category);
  }

  if (options?.location) {
    const loc = options.location.toLowerCase();
    filtered = filtered.filter((b) =>
      b.pickup_location_text?.toLowerCase().includes(loc)
    );
  }

  if (options?.query) {
    const q = options.query.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.produce_name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }

  if (options?.grade && options.grade !== "All grades") {
    filtered = filtered.filter((b) => b.quality_grade === options.grade);
  }

  if (options?.sortBy === "price_low") {
    filtered.sort((a, b) => a.price_per_unit - b.price_per_unit);
  } else if (options?.sortBy === "price_high") {
    filtered.sort((a, b) => b.price_per_unit - a.price_per_unit);
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getListingById(id: string): Promise<ProduceBatch | null> {
  const supabase = await createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("produce_batches")
        .select(`
          *,
          batch_images (
            id,
            batch_id,
            storage_path,
            display_order
          ),
          profiles:seller_id (
            id,
            full_name,
            phone,
            avatar_url
          )
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return {
          ...data,
          images: data.batch_images || [],
          seller: data.profiles || null,
        };
      }
    } catch (err) {
      console.warn("Supabase single batch fetch failed:", err);
    }
  }

  const local = localBatches.find((b) => b.id === id);
  return local || null;
}

export async function getSellerListings(sellerId: string): Promise<ProduceBatch[]> {
  const supabase = await createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("produce_batches")
        .select(`
          *,
          batch_images (
            id,
            batch_id,
            storage_path,
            display_order
          )
        `)
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((b: any) => ({
          ...b,
          images: b.batch_images || [],
        }));
      }
    } catch (err) {
      console.warn("Error fetching seller listings:", err);
    }
  }

  return localBatches.filter((b) => b.seller_id === sellerId);
}

export async function saveLocalBatch(batch: ProduceBatch): Promise<ProduceBatch> {
  const existingIdx = localBatches.findIndex((b) => b.id === batch.id);
  if (existingIdx >= 0) {
    localBatches[existingIdx] = batch;
  } else {
    localBatches.unshift(batch);
  }
  return batch;
}

export async function updateBatchStatus(
  id: string,
  sellerId: string,
  newStatus: "active" | "paused" | "archived"
): Promise<boolean> {
  const supabase = await createClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from("produce_batches")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("seller_id", sellerId);

      if (!error) return true;
    } catch (err) {
      console.warn("Failed to update status on Supabase:", err);
    }
  }

  const batch = localBatches.find((b) => b.id === id && b.seller_id === sellerId);
  if (batch) {
    batch.status = newStatus;
    batch.updated_at = new Date().toISOString();
    return true;
  }

  return false;
}

export async function getMarketplaceMetrics() {
  const supabase = await createClient();

  if (supabase) {
    try {
      const [batchesRes, sellersRes] = await Promise.all([
        supabase
          .from("produce_batches")
          .select("quantity_total, quantity_sold, status", { count: "exact" }),
        supabase
          .from("user_roles")
          .select("user_id", { count: "exact", head: true })
          .eq("role", "farmer"),
      ]);

      const batches = batchesRes.data || [];
      const totalListed = batches.reduce(
        (sum, b) => sum + (Number(b.quantity_total) || 0),
        0
      );
      const totalSold = batches.reduce(
        (sum, b) => sum + (Number(b.quantity_sold) || 0),
        0
      );

      return {
        produceListed: totalListed > 0 ? `${totalListed.toLocaleString()} kg` : "–",
        produceSold: totalSold > 0 ? `${totalSold.toLocaleString()} kg` : "–",
        completedDeliveries: "–",
        activeFarmers: sellersRes.count ? String(sellersRes.count) : "–",
        activeBuyers: "–",
        divertedWaste: totalSold > 0 ? `${totalSold.toLocaleString()} kg` : "–",
      };
    } catch (err) {
      console.warn("Failed to fetch live stats:", err);
    }
  }

  const totalListed = localBatches.reduce(
    (sum, b) => sum + (Number(b.quantity_total) || 0),
    0
  );
  const activeSellersCount = new Set(localBatches.map((b) => b.seller_id)).size;

  return {
    produceListed: totalListed > 0 ? `${totalListed.toLocaleString()} kg` : "–",
    produceSold: "–",
    completedDeliveries: "–",
    activeFarmers: activeSellersCount > 0 ? String(activeSellersCount) : "–",
    activeBuyers: "–",
    divertedWaste: "–",
  };
}

