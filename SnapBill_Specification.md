# Software Requirements Specification (SRS) & Development Prompt
## Project Name: SnapBill – Micro-SaaS Free Invoice Generator
## Target Architecture: Next.js (App Router), Tailwind CSS, Lucide Icons, Supabase (Auth & Database), Cloudflare Pages (Free Tier Deployment)

---

## 1. PROJECT OVERVIEW & GOALS
SnapBill is a lightweight, blazing-fast, and mobile-responsive Micro-SaaS application designed to help freelancers and small business owners generate professional invoices instantly. 
The business model relies on high organic traffic driven by SEO and monetized via Google AdSense. Security and permanent document storage are handled via Supabase, enabling a seamless workflow where users can create, edit, download, and track their invoices for free.

### Key Architectural Constraints for Cursor:
- **Framework:** Next.js 14+ (App Router) using React 18+.
- **Styling:** Tailwind CSS with a modern, high-contrast, professional tech-slate/warm-cream semantic palette.
- **Backend-as-a-Service:** Supabase (Client-side integration with Serverless Edge compatibility).
- **Hosting Target:** Cloudflare Pages (Requires fully static export capability `output: 'export'` or Cloudflare Workers Adapter compatibility; avoid standard Node.js-only server runtimes).
- **Monetization:** Seamless integration of non-intrusive Google AdSense slots.

---

## 2. DETAILED FEATURE REQUIREMENTS

### A. Authentication & Session Management (Supabase Auth)
- Implement email/password signup and login using `@supabase/supabase-js`.
- Provide third-party OAuth provider slots (Google Login) using Supabase's native redirect authentication.
- **Client-Side Auth State:** Handle conditional rendering via a reactive React state context (`UserProvider`) to check if a user is authenticated.
- **Guest Mode vs. Authenticated Mode:** - *Guest Mode:* Full access to the invoice creator and PDF export. Data is ephemeral (React state only). Show persistent, non-intrusive callouts inviting users to create an account to save their history permanently.
  - *Authenticated Mode:* Automatic persistence of invoices to the database. Access to the "My Invoices" management view dashboard.

### B. Dynamic Invoice Editor (Left Panel / Top Section on Mobile)
An interactive form containing the following input sections with real-time state synchronization to the preview pane:
1. **Header Metadata:**
   - Custom Logo Uploader (Base64 file converter for localized rendering; if authenticated, prepare schema for Supabase Storage bucket upload).
   - Company Name, Sender Name, Email, Address, Tax/VAT ID.
2. **Client Information:**
   - Client Name, Client Email, Client Billing Address.
3. **Invoice Metadata:**
   - Invoice Number (Auto-increment format placeholder, e.g., `INV-2026-001`).
   - Issue Date (Defaults to current system date).
   - Due Date (Defaults to current system date + 14 days).
4. **Line Items Grid (Dynamic Array):**
   - Editable columns: Description/Item Name, Quantity (numeric, integer >= 1), Unit Price (decimal, precision 2).
   - Actions: "Add Item" button (appends empty row), "Delete" button (removes item row).
5. **Financial Summaries & Calculations:**
   - Subtotal: Automatically computed dynamically (`Quantity * Unit Price` summed).
   - Tax Rate (% Input): Multiplies against subtotal.
   - Discount (% or flat amount input): Subtracts from subtotal.
   - Total Due: Dynamically computed (`Subtotal + Tax - Discount`).
6. **Footer Notes:**
   - Payment Terms / Bank Details (Text area).
   - Additional Notes/Thank You Message (Text area).

### C. Live Interactive Preview Pane (Right Panel / Bottom Section on Mobile)
- Modeled exactly as a standard physical A4 paper grid layout using custom CSS media printing utilities.
- Implements real-time data-binding (`onChange` rendering) without lagging.
- **Theme Support:** Clean, high-contrast monochrome design optimized for ink saving when printed. A dark-mode switch changes the *application UI*, but the *invoice sheet content container* must remain white background with black/slate text for legible reading and processing.

### D. Data Export Engine (Client-Side PDF Generation)
- Pure client-side generation using `html2pdf.js` or `jspdf` + `html2canvas`.
- Triggered via the "Download PDF" button.
- Must capture the A4 layout structural container, inject print-specific stylesheets to hide action buttons, and cleanly format a single-page or multi-page standard PDF document.
- Filename formatting pattern: `Invoice_[InvoiceNumber]_[ClientName].pdf`.

### E. "My Invoices" Management Dashboard (Authenticated Users Only)
A clean data table interface displaying previously saved invoices synced with Supabase:
- **Columns:** Invoice ID, Client Name, Total Amount, Issue Date, Status Badge (`Draft`, `Sent`, `Paid`, `Overdue`).
- **Inline Actions:**
  - *Edit:* Reloads selected invoice data schema directly back into the live dynamic editor state.
  - *Delete:* Pops up a safety modal, triggers a Supabase DB deletion transaction, and updates local state.
  - *Status Toggle:* Dropdown to seamlessly switch between `Sent`, `Paid`, or `Draft` statuses, instantly writing back to the database.

### F. Google AdSense Integration (SEO/Monetization Engine)
- Allocate distinct placeholders in the application layout:
  - 1 x Top Banner Slot (`728x90` desktop / `320x50` mobile grid wrapper).
  - 1 x Sidebar Vertical Banner Slot (`300x600` grid wrapper, visible only on wide viewport screens).
- Inject AdSense script dynamically or via a custom Next.js `Script` tag target inside the head layout wrapper.
- Add an explicit wrapper class to ensure ads do not break the responsive flexible layout structure on 768px viewports.

---

## 3. DATABASE SCHEMA (Supabase PostgreSQL Blueprint)

### Table 1: `profiles` (Auto-created via Trigger on user signup)
- `id`: uuid (Primary Key, references `auth.users.id`, cascade delete)
- `updated_at`: timestamp with time zone
- `company_name`: text
- `logo_url`: text

### Table 2: `invoices`
- `id`: uuid (Primary Key, default: `gen_random_uuid()`)
- `user_id`: uuid (References `auth.users.id`, authenticated creator, nullable for guests if local storage caching is used)
- `invoice_number`: text (Required)
- `status`: text (Check constraints: 'draft', 'sent', 'paid', 'overdue')
- `issue_date`: date
- `due_date`: date
- `sender_data`: jsonb (Stores company name, address, email, vat)
- `client_data`: jsonb (Stores client name, address, email)
- `items`: jsonb (Array of objects: `[{ description: text, quantity: int, unit_price: numeric }]`)
- `tax_rate`: numeric (Default 0)
- `discount_rate`: numeric (Default 0)
- `subtotal`: numeric
- `total_amount`: numeric
- `notes`: text
- `created_at`: timestamp with time zone (Default: `now()`)

### Row Level Security (RLS) Policies:
- Enable RLS on both tables.
- **Select Policy:** `auth.uid() = user_id` (Users can only view their own invoices).
- **Insert Policy:** `auth.uid() = user_id` (Authenticated users can write records associated with their session uuid).
- **Update/Delete Policy:** `auth.uid() = user_id` (Restricted mutation privileges).

---

## 4. INSTRUCTIONS FOR CURSOR AI (System Prompt Adaptation)
When modifying the workspace or generating new files, comply strictly with the rules below:

1. **Modular Code Separation:** Separate components into logical chunks under `@/components/invoice/` (`InvoiceEditor.tsx`, `InvoicePreview.tsx`, `LineItemsTable.tsx`, `AdSlot.tsx`).
2. **Zero-Hydration Mismatch:** Ensure client-only components (like date pickers or PDF export engines) use Next.js dynamic imports with `{ ssr: false }` to prevent rendering state desynchronization.
3. **No Bad Component Libraries:** Do not use heavy UI primitives unless manually built using primitive Tailwind utilities or radix-ui native hooks.
4. **Strict Typescript:** Declare explicit TypeScript Interfaces/Types for `Invoice`, `LineItem`, `ClientData`, and `SenderData`. Never use `any`.
5. **Cloudflare Compatibility:** Ensure code does not rely on Node.js core libraries (`fs`, `path`, `crypto`). Everything must execute purely inside modern Edge runtimes/V8 environments.

---

## 5. SEQUENTIAL STEP-BY-STEP IMPLEMENTATION ROADMAP

### Step 1: Frontend Setup & Core State Machine
- Initialize utility layout wrappers, establish global state using React Context API (`InvoiceStateContext`) to hold invoice fields data. Build the basic two-column desktop template (left form input, right paper template sheet).

### Step 2: Input Controls & PDF Engine Integration
- Code the reactive form input fields, arrays handling for items, and attach the PDF generation trigger. Verify responsiveness on fluid breakpoints.

### Step 3: Supabase Backend & Database Wiring
- Set up `@supabase/supabase-js` initialization client utility file. Build authorization wrappers. Wire form fields submit button to trigger insert query transactions to the `invoices` Postgres table.

### Step 4: AdSense Script Injection & SEO Optimization
- Configure metadata layout file inside Next.js App Router for optimal index scanning. Inject Google AdSense tracking tags and arrange adaptive CSS flex containment borders for advertisement blocks.
