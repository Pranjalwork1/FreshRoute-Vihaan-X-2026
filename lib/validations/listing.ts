import { z } from "zod";

export const produceBatchSchema = z.object({
  produceName: z.string().min(2, "Produce name is required"),
  category: z.enum([
    "Vegetables",
    "Fruits",
    "Grains",
    "Pulses",
    "Seasonal Produce",
    "Other Produce",
  ]),
  variety: z.string().optional(),
  description: z.string().optional(),
  quantityTotal: z.number().positive("Total quantity must be greater than 0"),
  quantityAvailable: z
    .number()
    .positive("Available quantity must be greater than 0"),
  unit: z.enum(["kg", "quintal", "metric_tonne", "crate", "piece"]),
  pricePerUnit: z.number().positive("Price must be greater than 0"),
  minimumOrderQuantity: z.number().min(1, "Minimum order must be at least 1"),
  isNegotiable: z.boolean().default(false),
  bulkPricingDetails: z.string().optional(),
  qualityGrade: z
    .enum(["Grade A", "Grade B", "Grade C", "Ungraded"])
    .default("Ungraded"),
  harvestDate: z.string().optional(),
  currentCondition: z.string().optional(),
  storageCondition: z.string().optional(),
  packagingType: z.string().optional(),
  availabilityDeadline: z.string().optional(),
  pickupAddress: z.string().min(3, "Pickup address is required"),
  district: z.string().min(2, "District/City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code / PIN is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrls: z.array(z.string()).max(5, "Maximum 5 images allowed").default([]),
});

export type ProduceBatchInput = z.infer<typeof produceBatchSchema>;

