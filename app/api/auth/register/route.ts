import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      emailOrPhone,
      password,
      role = "seller",
      activities = [],
      state = "",
      district = "",
      pincode = "",
      verified = false,
    } = body;

    if (!fullName || !emailOrPhone || !password) {
      return NextResponse.json(
        { error: "Full name, phone/email, and password are required." },
        { status: 400 }
      );
    }

    const cleanInput = emailOrPhone.trim();
    const isEmail = cleanInput.includes("@");
    const cleanPhone = cleanInput.replace(/\D/g, "");

    // Use valid public domain @freshroute.in for phone-based accounts (RFC 6762 prevents .local)
    const email = isEmail
      ? cleanInput.toLowerCase()
      : `${cleanPhone}@freshroute.in`;

    const admin = await createAdminClient();

    let userId: string = "demo-" + Date.now();

    if (admin) {
      // 1. Try to create the user with admin privileges (auto-confirm email to support phone signups)
      const { data: createData, error: createError } =
        await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName.trim(),
            phone: cleanPhone || null,
            role,
            activities,
            state,
            district,
            pincode,
            verified: !!verified,
          },
        });

      if (createError) {
        // If user already exists, update their password and confirm email so they can log in
        const msg = createError.message.toLowerCase();
        if (
          msg.includes("already") ||
          msg.includes("registered") ||
          msg.includes("exists") ||
          msg.includes("in use")
        ) {
          // Find user by email
          const { data: userList, error: listError } = await admin.auth.admin.listUsers();
          const existing = userList?.users?.find(
            (u) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
          );

          if (existing) {
            userId = existing.id;
            const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
              password,
              email_confirm: true,
              user_metadata: {
                full_name: fullName.trim(),
                phone: cleanPhone || null,
                role,
                activities,
                state,
                district,
                pincode,
                verified: !!verified,
              },
            });
            if (updateError) {
              console.error("Update existing user error:", updateError);
            }
          } else {
            return NextResponse.json(
              { error: "An account with this phone/email already exists. Please log in directly." },
              { status: 400 }
            );
          }
        } else {
          return NextResponse.json(
            { error: createError.message },
            { status: 400 }
          );
        }
      } else if (createData?.user) {
        userId = createData.user.id;
      }

      // 2. Map role to database schema
      let dbRole: "farmer" | "local_vendor" | "retailer" | "wholesaler" | "logistics_provider" = "farmer";
      if (role === "wholesaler") dbRole = "wholesaler";
      else if (role === "logistics") dbRole = "logistics_provider";
      else if (role === "buyer") dbRole = "retailer";
      else dbRole = "farmer";

      // 3. Upsert profiles
      try {
        await admin.from("profiles").upsert(
          {
            id: userId,
            full_name: fullName.trim(),
            phone: cleanPhone || null,
            preferred_language: "en",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (e) {
        console.warn("Profiles upsert warning:", e);
      }

      // 4. Upsert user_roles
      try {
        await admin.from("user_roles").upsert(
          {
            user_id: userId,
            role: dbRole,
            status: "active",
          },
          { onConflict: "user_id,role" }
        );
      } catch (e) {
        console.warn("User roles upsert warning:", e);
      }

      // 5. Upsert addresses if provided
      if (district || state || pincode) {
        try {
          await admin.from("addresses").insert({
            user_id: userId,
            district: district.trim(),
            state: state.trim(),
            postal_code: pincode.trim(),
            is_default: true,
          });
        } catch (e) {
          console.warn("Address insert warning:", e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        fullName: fullName.trim(),
        role,
      },
    });
  } catch (err: any) {
    console.error("Registration route error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error during registration." },
      { status: 500 }
    );
  }
}
