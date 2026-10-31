import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateBatchStatus, getSellerListings } from "@/lib/data/listings";

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const supabase = await createClient();

    let sellerId = "demo-seller-id";
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) sellerId = user.id;
    }

    const success = await updateBatchStatus(id, sellerId, status);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    let sellerId = "demo-seller-id";

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) sellerId = user.id;
    }

    const listings = await getSellerListings(sellerId);
    return NextResponse.json({ listings });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

