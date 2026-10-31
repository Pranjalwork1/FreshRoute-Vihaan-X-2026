export type RoleType =
  | "farmer"
  | "local_vendor"
  | "retailer"
  | "wholesaler"
  | "logistics_provider"
  | "admin";

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: RoleType;
  status: "active" | "suspended" | "pending";
  created_at: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description: string | null;
  contact_phone?: string | null;
  verification_status: "not_submitted" | "pending" | "verified" | "rejected";
  operating_region?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_line: string;
  village?: string;
  city?: string;
  district?: string;
  state?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
}

export interface RoleProfile {
  id: string;
  user_id: string;
  role: RoleType;
  details: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: string;
  document_url?: string | null;
  notes?: string | null;
  status: "pending" | "approved" | "rejected";
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: string;
  notifications_email: boolean;
  notifications_sms: boolean;
  notifications_whatsapp: boolean;
  currency: string;
  created_at: string;
}

export interface ProduceCatalogItem {
  id: string;
  name: string;
  category: string;
  unit_type: string;
  aliases: string[];
  handling_guidance: string | null;
  created_at: string;
}

export interface BatchImage {
  id: string;
  batch_id: string;
  storage_path: string;
  display_order: number;
  created_at: string;
}

export interface ProduceBatch {
  id: string;
  seller_id: string;
  catalog_product_id?: string | null;
  batch_code: string;
  produce_name: string;
  category: string;
  variety?: string | null;
  description?: string | null;
  quantity_total: number;
  quantity_available: number;
  quantity_reserved: number;
  quantity_sold: number;
  unit: string;
  price_per_unit: number;
  minimum_order_quantity: number;
  is_negotiable: boolean;
  bulk_pricing_details?: string | null;
  quality_grade: "Grade A" | "Grade B" | "Grade C" | "Ungraded" | string;
  harvest_date?: string | null;
  current_condition?: string | null;
  storage_condition?: string | null;
  packaging_type?: string | null;
  availability_deadline?: string | null;
  pickup_address_id?: string | null;
  pickup_location_text?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  created_at: string;
  updated_at: string;
  images?: BatchImage[];
  seller?: {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    business_name?: string | null;
  };
}
