# FreshRoute — Agricultural Surplus & Supply-Chain Marketplace

> "From surplus to opportunity." FreshRoute connects farmers, local vendors, retailers, wholesalers, and logistics providers to rescue surplus perishable produce before it loses commercial value.

---

## 1. Phase 1 Implementation Scope

FreshRoute Phase 1 establishes the complete public web application, real authentication, flexible multi-role capability architecture, role-specific onboarding, account settings, and role-based workspaces.

### Deliverables Completed
1. **Public Website & Exact Design Fidelity**:
   - Section 1: Sticky responsive navigation bar with logo, links, and mobile menu.
   - Section 2: Two-column hero with eyebrow label, Plus Jakarta Sans typography, 3D tilt scene, and trust statement.
   - Section 3: Quick marketplace search bar (Produce, Category, Location, "Find Produce" action).
   - Section 4: Browse produce categories with agricultural cards and hover interactions.
   - Section 5: Recently listed produce showcase with honest launch states.
   - Section 6: How FreshRoute works in four visual steps (01 List produce, 02 Connect with buyers, 03 Arrange logistics, 04 Rescue produce).
   - Section 7: For Everyone in the Supply Chain (interactive flip cards for Farmer, Retailer, Wholesaler, Logistics Provider).
   - Section 8: FreshRoute Intelligence overview.
   - Section 9: Impact and Mission ("Building a Smarter, More Connected Food Supply Chain").
   - Section 10: Call to Action ("Have Produce to Sell? Looking for Better Supply Opportunities?").
   - Section 11: Footer with brand description, navigation, terms, privacy, and support links.
2. **Authentication System**:
   - `/register`: Premium two-column layout with agricultural benefit panel, password strength feedback, visibility toggles, phone number, and Zod validation.
   - `/login`: Email/password login with session persistence via `@supabase/ssr`.
   - `/forgot-password`: Password reset request flow.
   - `/reset-password`: Set new password workflow.
   - `/auth/callback`: OAuth / PKCE session exchange handler.
   - `/auth/logout`: Server-side session invalidation.
3. **Flexible Multi-Role Architecture**:
   - Supported normal roles: `farmer`, `local_vendor`, `retailer`, `wholesaler`, `logistics_provider`.
   - Single account can hold multiple roles simultaneously.
   - Multi-role switcher in all dashboard layouts allowing instant role switching without logging out.
4. **Role-Specific Onboarding**:
   - `/onboarding`: 2-step stepper collecting specific parameters for farmers, local vendors, retailers, wholesalers, and transporters.
   - Verification status tracking: `not_submitted`, `pending`, `verified`, `rejected`.
5. **Workspaces & Dashboards**:
   - `/dashboard/seller`: Farmer/Seller Overview and Produce studio.
   - `/dashboard/buyer`: Retailer Procurement Workspace.
   - `/dashboard/wholesaler`: Institutional Volume Workspace.
   - `/dashboard/logistics`: Fleet & Cold Storage Workspace.
   - `/dashboard/admin`: Protected operator clearance dashboard with user/KYC queue.
6. **Account Settings Suite**:
   - `/dashboard/settings/profile`: Full name, phone, language preference, operating location.
   - `/dashboard/settings/business`: Business entity, description, corridor details, KYC request.
   - `/dashboard/settings/roles`: View active roles and add additional capabilities without logging out.
   - `/dashboard/settings/security`: Password update and session management.
7. **Database Architecture**:
   - PostgreSQL schema with RLS on all tables: `profiles`, `user_roles`, `business_profiles`, `addresses`, `role_profiles`, `verification_requests`, `user_preferences`, `admin_audit_logs`, `produce_catalog`, `produce_batches`, `batch_images`.

---

## 2. Running the Application

### 1. Development Server
The application is currently running live on:
**[http://localhost:3000](http://localhost:3000)**

To run manually:
```bash
npm run dev
```

### 2. Connect Supabase
Open `.env.local` and add your project keys from [Supabase Dashboard](https://supabase.com) -> **Project Settings** -> **API**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then in the Supabase SQL Editor, run:
1. `supabase/migrations/20261031_freshroute_schema.sql`
2. `supabase/seed.sql`
