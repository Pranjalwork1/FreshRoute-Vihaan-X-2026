import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { produceBatchSchema } from "@/lib/validations/listing";
import { saveLocalBatch } from "@/lib/data/listings";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parseResult = produceBatchSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const supabase = await createClient();

    let userId = "demo-seller-id";
    let sellerName = "FreshRoute Producer";

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
        sellerName = user.user_metadata?.full_name || user.email || "Verified Seller";
      }
    }

    const batchCode = `FR-${data.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const pickupLocationText = `${data.pickupAddress}, ${data.district}, ${data.state} - ${data.postalCode}`;

    if (supabase) {
      // 1. Insert into produce_batches
      const { data: batchData, error: batchError } = await supabase
        .from("produce_batches")
        .insert({
          seller_id: userId,
          batch_code: batchCode,
          produce_name: data.produceName,
          category: data.category,
          variety: data.variety || null,
          description: data.description || null,
          quantity_total: data.quantityTotal,
          quantity_available: data.quantityAvailable,
          quantity_reserved: 0,
          quantity_sold: 0,
          unit: data.unit,
          price_per_unit: data.pricePerUnit,
          minimum_order_quantity: data.minimumOrderQuantity,
          is_negotiable: data.isNegotiable,
          bulk_pricing_details: data.bulkPricingDetails || null,
          quality_grade: data.qualityGrade,
          harvest_date: data.harvestDate || null,
          current_condition: data.currentCondition || null,
          storage_condition: data.storageCondition || null,
          packaging_type: data.packagingType || null,
          availability_deadline: data.availabilityDeadline || null,
          pickup_location_text: pickupLocationText,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          status: "active",
        })
        .select()
        .single();

      if (batchError) {
        console.error("Batch insert error:", batchError);
        return NextResponse.json(
          { error: batchError.message },
          { status: 500 }
        );
      }

      // 2. Insert batch images
      if (data.imageUrls && data.imageUrls.length > 0) {
        const imageRows = data.imageUrls.map((url, idx) => ({
          batch_id: batchData.id,
          storage_path: url,
          display_order: idx,
        }));

        await supabase.from("batch_images").insert(imageRows);
      }

      return NextResponse.json({
        success: true,
        batchId: batchData.id,
        batchCode: batchCode,
      });
    }

    // Fallback in-memory save
    const newBatch = {
      id: "batch-" + Date.now(),
      seller_id: userId,
      batch_code: batchCode,
      produce_name: data.produceName,
      category: data.category,
      variety: data.variety,
      description: data.description,
      quantity_total: data.quantityTotal,
      quantity_available: data.quantityAvailable,
      quantity_reserved: 0,
      quantity_sold: 0,
      unit: data.unit,
      price_per_unit: data.pricePerUnit,
      minimum_order_quantity: data.minimumOrderQuantity,
      is_negotiable: data.isNegotiable,
      bulk_pricing_details: data.bulkPricingDetails,
      quality_grade: data.qualityGrade,
      harvest_date: data.harvestDate,
      current_condition: data.currentCondition,
      storage_condition: data.storageCondition,
      packaging_type: data.packagingType,
      availability_deadline: data.availabilityDeadline,
      pickup_location_text: pickupLocationText,
      status: "active" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: data.imageUrls.map((url, idx) => ({
        id: "img-" + idx,
        batch_id: "batch-" + Date.now(),
        storage_path: url,
        display_order: idx,
        created_at: new Date().toISOString(),
      })),
      seller: {
        id: userId,
        full_name: sellerName,
        phone: "9876543210",
        avatar_url: null,
      },
    };

    await saveLocalBatch(newBatch);

    return NextResponse.json({
      success: true,
      batchId: newBatch.id,
      batchCode: batchCode,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to create listing" },
      { status: 500 }
    );
  }
}

