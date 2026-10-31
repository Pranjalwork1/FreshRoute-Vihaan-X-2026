"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DEFAULT_PRODUCE_CATALOG } from "@/lib/data/catalog";
import { ProduceSvg } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/client";

const SELLER_NAV = [
  { label: "Overview", href: "/dashboard/seller" },
  { label: "Add New Produce", href: "/dashboard/seller/listings/new" },
  { label: "My Listings", href: "/dashboard/seller/listings" },
  { label: "Marketplace", href: "/marketplace" },
];

export default function NewListingWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState("Vegetables");
  const [produceName, setProduceName] = useState("Tomatoes (Hybrid)");
  const [variety, setVariety] = useState("");
  const [description, setDescription] = useState("");

  const [quantityTotal, setQuantityTotal] = useState(500);
  const [quantityAvailable, setQuantityAvailable] = useState(500);
  const [unit, setUnit] = useState("kg");
  const [pricePerUnit, setPricePerUnit] = useState(20);
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState(50);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [bulkPricingDetails, setBulkPricingDetails] = useState("");

  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [qualityGrade, setQualityGrade] = useState("Grade B");
  const [currentCondition, setCurrentCondition] = useState("Freshly harvested");
  const [storageCondition, setStorageCondition] = useState("Covered shade");
  const [packagingType, setPackagingType] = useState("Plastic crates (20 kg)");
  const [availabilityDeadline, setAvailabilityDeadline] = useState("");

  const [imageFiles, setImageFiles] = useState<{ url: string; file?: File }[]>(
    []
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const [pickupAddress, setPickupAddress] = useState("Farm Gate, Gat No. 42");
  const [district, setDistrict] = useState("Nashik");
  const [state, setState] = useState("Maharashtra");
  const [postalCode, setPostalCode] = useState("422001");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  // Filter catalog items for selected category
  const filteredCatalog = DEFAULT_PRODUCE_CATALOG.filter(
    (c) => c.category === category
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > 5) {
      setError("Maximum 5 photographs allowed per batch.");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 5 MB limit.`);
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError(`File ${file.name} must be JPEG, PNG, or WebP.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageFiles((prev) => [
          ...prev,
          { url: reader.result as string, file },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setError(null);
        },
        (err) => {
          setError("Could not retrieve GPS coordinates: " + err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const nextStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (!produceName.trim()) {
        setError("Please enter or select a produce name.");
        return;
      }
    }
    if (currentStep === 2) {
      if (quantityTotal <= 0 || quantityAvailable <= 0 || pricePerUnit <= 0) {
        setError("Quantities and price must be greater than zero.");
        return;
      }
      if (quantityAvailable > quantityTotal) {
        setError("Available quantity cannot exceed total quantity.");
        return;
      }
    }
    if (currentStep === 5) {
      if (!pickupAddress.trim() || !district.trim() || !postalCode.trim()) {
        setError("Please enter the complete pickup address and PIN code.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePublish = async (status: "active" | "draft") => {
    setLoading(true);
    setError(null);

    try {
      let finalImageUrls = imageFiles.map((img) => img.url);

      // Attempt to upload images to Supabase Storage if authenticated and configured
      const supabase = createClient();
      if (supabase && imageFiles.some((img) => img.file)) {
        setUploadingImage(true);
        const uploadedUrls: string[] = [];

        for (const item of imageFiles) {
          if (item.file) {
            const ext = item.file.name.split(".").pop() || "jpg";
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { data, error: uploadErr } = await supabase.storage
              .from("produce-images")
              .upload(fileName, item.file);

            if (!uploadErr && data) {
              const { data: publicData } = supabase.storage
                .from("produce-images")
                .getPublicUrl(data.path);
              uploadedUrls.push(publicData.publicUrl);
            } else {
              // If bucket doesn't exist yet, preserve the preview data URL
              uploadedUrls.push(item.url);
            }
          } else {
            uploadedUrls.push(item.url);
          }
        }
        finalImageUrls = uploadedUrls;
        setUploadingImage(false);
      }

      const payload = {
        produceName,
        category,
        variety,
        description,
        quantityTotal: Number(quantityTotal),
        quantityAvailable: Number(quantityAvailable),
        unit,
        pricePerUnit: Number(pricePerUnit),
        minimumOrderQuantity: Number(minimumOrderQuantity),
        isNegotiable,
        bulkPricingDetails,
        qualityGrade,
        harvestDate,
        currentCondition,
        storageCondition,
        packagingType,
        availabilityDeadline: availabilityDeadline || undefined,
        pickupAddress,
        district,
        state,
        postalCode,
        latitude,
        longitude,
        imageUrls: finalImageUrls,
      };

      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to publish listing");
      }

      router.push(`/dashboard/seller/listings?published=true`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      roleTitle="Farmer & Seller"
      roleSubtitle="Produce Listing Studio"
      navItems={SELLER_NAV}
    >
      <div className="max-w-3xl mx-auto">
        {/* Wizard Header & Progress */}
        <div className="mb-6">
          <Link
            href="/dashboard/seller/listings"
            className="text-xs text-[var(--mute)] hover:text-[var(--ink)] mb-2 inline-block font-semibold"
          >
            ← Back to My Listings
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">List New Produce</h1>
          <p className="text-sm text-[var(--mute)]">
            Create an active batch listing for verified buyers across the network.
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center justify-between mt-6 border-b border-[var(--line)] pb-4">
            {[
              { num: 1, label: "Select Produce" },
              { num: 2, label: "Quantity & Price" },
              { num: 3, label: "Harvest & Grade" },
              { num: 4, label: "Photographs" },
              { num: 5, label: "Pickup Location" },
              { num: 6, label: "Preview & Publish" },
            ].map((s) => (
              <div
                key={s.num}
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => setCurrentStep(s.num)}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === s.num
                      ? "bg-[var(--acc)] text-white shadow-sm"
                      : currentStep > s.num
                      ? "bg-[var(--tint)] text-[var(--acc)]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-xs hidden lg:inline font-medium ${
                    currentStep === s.num
                      ? "text-[var(--ink)] font-bold"
                      : "text-[var(--mute)]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* STEP 1: Select Produce */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold border-b border-[var(--line)] pb-2">
                Step 1: Select Produce Details
              </h3>

              <label>
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                  <option>Pulses</option>
                  <option>Seasonal Produce</option>
                  <option>Other Produce</option>
                </select>
              </label>

              <label>
                Crop / Produce Name (Catalog Standard)
                <select
                  value={produceName}
                  onChange={(e) => setProduceName(e.target.value)}
                >
                  {filteredCatalog.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} ({item.aliases.join(", ")})
                    </option>
                  ))}
                  <option value="custom">Other / Custom Variety...</option>
                </select>
              </label>

              {produceName === "custom" && (
                <label>
                  Enter Custom Produce Name
                  <input
                    type="text"
                    placeholder="e.g. Organic Baby Carrots"
                    onChange={(e) => setProduceName(e.target.value)}
                  />
                </label>
              )}

              <label>
                Variety / Cultivar (Optional)
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Abhinav 2024, Kufri Jyoti, F1 Hybrid"
                />
              </label>

              <label>
                Description & Handling Guidance
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Direct farm harvest, packed in plastic crates, protected from moisture..."
                />
              </label>
            </div>
          )}

          {/* STEP 2: Quantity and Pricing */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold border-b border-[var(--line)] pb-2">
                Step 2: Quantity & Pricing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label>
                  Total Harvest Quantity
                  <input
                    type="number"
                    min={1}
                    value={quantityTotal}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setQuantityTotal(v);
                      if (quantityAvailable > v) setQuantityAvailable(v);
                    }}
                  />
                </label>

                <label>
                  Available for Immediate Sale
                  <input
                    type="number"
                    min={1}
                    value={quantityAvailable}
                    onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                  />
                </label>

                <label>
                  Unit
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal (100 kg)</option>
                    <option value="metric_tonne">Metric Tonne (1,000 kg)</option>
                    <option value="crate">Crate (approx 20-25 kg)</option>
                    <option value="piece">Piece / Unit</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label>
                  Selling Price per Unit (₹)
                  <input
                    type="number"
                    min={0.1}
                    step={0.5}
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                  />
                </label>

                <label>
                  Minimum Order Quantity (MOQ)
                  <input
                    type="number"
                    min={1}
                    value={minimumOrderQuantity}
                    onChange={(e) =>
                      setMinimumOrderQuantity(Number(e.target.value))
                    }
                  />
                </label>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <input
                    id="negotiable"
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="w-4 h-4 text-[var(--acc)] rounded"
                  />
                  <label htmlFor="negotiable" className="text-sm font-semibold cursor-pointer">
                    Price is negotiable for bulk wholesale buyers
                  </label>
                </div>
              </div>

              {isNegotiable && (
                <label>
                  Bulk Discount Terms (Optional)
                  <input
                    type="text"
                    value={bulkPricingDetails}
                    onChange={(e) => setBulkPricingDetails(e.target.value)}
                    placeholder="e.g. ₹18/kg for orders exceeding 200 kg"
                  />
                </label>
              )}
            </div>
          )}

          {/* STEP 3: Harvest & Quality */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold border-b border-[var(--line)] pb-2">
                Step 3: Harvest & Quality Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label>
                  Harvest Date
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                  />
                </label>

                <label>
                  Quality Grade (Seller-Declared)
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                  >
                    <option>Grade A (Premium / Export Quality)</option>
                    <option>Grade B (Standard Market Quality)</option>
                    <option>Grade C (Processing / Second Grade)</option>
                    <option>Ungraded (Mixed Orchard Run)</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label>
                  Current Condition
                  <input
                    type="text"
                    value={currentCondition}
                    onChange={(e) => setCurrentCondition(e.target.value)}
                    placeholder="e.g. Freshly plucked, firm, green stem"
                  />
                </label>

                <label>
                  Storage Condition
                  <input
                    type="text"
                    value={storageCondition}
                    onChange={(e) => setStorageCondition(e.target.value)}
                    placeholder="e.g. Covered shade, ambient 20°C"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label>
                  Packaging Type
                  <input
                    type="text"
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    placeholder="e.g. Plastic Crates, Jute Bags, Corrugated Boxes"
                  />
                </label>

                <label>
                  Availability Deadline (Must sell/dispatch by)
                  <input
                    type="datetime-local"
                    value={availabilityDeadline}
                    onChange={(e) => setAvailabilityDeadline(e.target.value)}
                  />
                </label>
              </div>

              <p className="text-xs text-[var(--mute)] bg-[var(--tint)] p-3 rounded-lg">
                ℹ️ Note: Grades are seller-declared unless independently verified by a FreshRoute inspection partner. Accurately disclosing current crop condition builds repeat buyer trust.
              </p>
            </div>
          )}

          {/* STEP 4: Photographs */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold border-b border-[var(--line)] pb-2">
                Step 4: Produce Photographs
              </h3>
              <p className="text-xs text-[var(--mute)]">
                Upload up to 5 clear photos of the produce batch. Buyers prioritize listings with real harvest photos. (JPEG, PNG, WebP up to 5 MB each).
              </p>

              <div className="border-2 border-dashed border-[var(--line)] rounded-2xl p-6 text-center hover:border-[var(--acc)] transition">
                <input
                  id="img-upload"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="img-upload"
                  className="cursor-pointer block space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--tint)] text-[var(--acc)] mx-auto flex items-center justify-center font-bold text-xl">
                    📷
                  </div>
                  <div className="font-semibold text-sm text-[var(--ink)]">
                    Click to select or drag & drop photographs
                  </div>
                  <div className="text-xs text-[var(--mute)]">
                    {5 - imageFiles.length} photo slots remaining
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3">
                  {imageFiles.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-square border border-[var(--line)] bg-[var(--tint)] group"
                    >
                      <img
                        src={img.url}
                        alt={`Produce preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow hover:bg-red-700"
                        title="Remove image"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Photo {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Pickup Location */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold border-b border-[var(--line)] pb-2">
                Step 5: Farm Gate / Pickup Location
              </h3>
              <p className="text-xs text-[var(--mute)]">
                Provide accurate location details where the buyer or freight truck can collect the produce.
              </p>

              <label>
                Farm Address / Mandi Stall / Gate
                <input
                  required
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. Survey No. 42, Pimpalgaon Farm Road"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label>
                  District / City
                  <input
                    required
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Nashik"
                  />
                </label>

                <label>
                  State
                  <input
                    required
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                  />
                </label>

                <label>
                  PIN Code
                  <input
                    required
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 422001"
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="btn g text-xs py-2 px-3 inline-flex items-center gap-1.5"
                >
                  📍 Capture Current GPS Location
                </button>
                {latitude && longitude && (
                  <span className="text-xs text-[var(--acc)] ml-3 font-semibold">
                    ✓ GPS Attached ({latitude.toFixed(4)}, {longitude.toFixed(4)})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Preview & Publish */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-[var(--line)] pb-2">
                Step 6: Preview Your Listing
              </h3>

              {/* Preview Card */}
              <div className="border border-[var(--line)] rounded-2xl p-6 bg-[var(--tint)] flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-white border border-[var(--line)] flex items-center justify-center shrink-0">
                  {imageFiles.length > 0 ? (
                    <img
                      src={imageFiles[0].url}
                      alt={produceName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProduceSvg name="tomato" className="w-20 h-20" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-[var(--acc)] border border-[var(--line)]">
                    {qualityGrade}
                  </div>
                  <h4 className="text-2xl font-extrabold">{produceName}</h4>
                  {variety && (
                    <p className="text-xs text-[var(--mute)]">
                      Variety: {variety}
                    </p>
                  )}
                  <p className="text-xs text-[var(--mute)]">
                    📍 {pickupAddress}, {district}, {state} - {postalCode}
                  </p>

                  <div className="text-2xl font-black text-[var(--acc)] pt-2">
                    ₹{pricePerUnit}
                    <span className="text-xs text-[var(--mute)] font-medium">
                      /{unit}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--mute)] pt-2 border-t border-[var(--line)]">
                    <div>
                      <strong>Available:</strong> {quantityAvailable} {unit}
                    </div>
                    <div>
                      <strong>Min. Order:</strong> {minimumOrderQuantity} {unit}
                    </div>
                    <div>
                      <strong>Harvest:</strong> {harvestDate}
                    </div>
                    <div>
                      <strong>Condition:</strong> {currentCondition}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--line)]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="btn g text-xs"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn text-xs"
              >
                Next Step →
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handlePublish("draft")}
                  className="btn g text-xs"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handlePublish("active")}
                  className="btn text-xs"
                >
                  {loading
                    ? uploadingImage
                      ? "Uploading photos..."
                      : "Publishing..."
                    : "Publish to Marketplace"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

