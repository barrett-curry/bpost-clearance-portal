# bpost Export & Customs Platform

Demo application for bpost — a customs clearance platform powered by Zonos APIs.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Zonos API Configuration

The app connects to the Zonos GraphQL API (`https://api.zonos.com/graphql`) for live classification, restriction screening, and landed cost calculation.

### Option 1: Connect via the UI (recommended)

1. Navigate to **System > Connect Zonos** in the sidebar
2. Paste a Zonos credential token (format: `credential_live_...`)
3. Click **Save & Validate** — the app validates the token against Zonos
4. Token is stored in an HTTP-only cookie (30-day expiry)
5. To disconnect, click **Disconnect** on the same page

### Option 2: Environment variable

Create `.env.local`:

```
ZONOS_CREDENTIAL_TOKEN=credential_live_your_token_here
ZONOS_API_URL=https://api.zonos.com/graphql
```

### Token priority

1. Cookie set via Connect Zonos UI
2. `ZONOS_CREDENTIAL_TOKEN` env var
3. If neither is set → **demo mode** with mock data

### Getting a token

Ask Barrett for a temporary credential token. These can be cycled or revoked at any time.

## What's Wired to Zonos APIs

Four features make live API calls when a valid token is connected. Everything else in the app is static demo data. Defaults are set to Belgium (BE) as origin and EUR currency.

### 1. AI Classification → Classify tab

**Page:** Sidebar > AI Classification > **Classify** tab
**Zonos mutation:** `classificationsCalculate`

**Inputs:** Product name, categories (optional), ship-to country code
**Returns:** HS code, confidence score, customs description, tariff hierarchy fragments, alternative classifications with probability

### 2. AI Classification → Vision tab

**Page:** Sidebar > AI Classification > **Vision** tab
**Zonos mutation:** `itemsExtract`

**Inputs:** Product image (drag & drop or file picker)
**Returns:** HS code classification, country of origin inference with confidence, estimated value with range

### 3. Screening & Compliance → Live Restriction Check

**Page:** Sidebar > Screening & Compliance > **Live Restriction Check** section
**Zonos mutation:** `restrictionApply`

**Inputs:** Product description, product name, HS code, ship-from country, ship-to country
**Returns:** List of applicable restrictions with confidence (HIGH/MEDIUM/LOW), imposing country, HS code, measure direction, and detailed summary

**Note:** `description`, `hsCode`, and `name` are all required by Zonos. If the user leaves HS code blank, the app sends `"0000.00"` as a placeholder.

### 4. Landed Cost Calculator

**Page:** Sidebar > Landed Cost
**Zonos mutation:** Chained workflow (`partyCreateWorkflow` → `itemCreateWorkflow` → `cartonizeWorkflow` → `landedCostCalculateWorkflow`)

**Inputs:** Origin/destination countries, item details (description, value, weight, quantity)
**Returns:** Full cost breakdown — individual duty, tax, and fee line items with descriptions, formulas, and notes, plus summary totals

## "See the API Call" Button

Every live Zonos API call surfaces a **"SEE THE API CALL"** button after results load. Click it to open a slide-out panel showing:

- **GraphQL mutation** name
- **Input variables** — the exact JSON sent to Zonos (collapsible, with copy button)
- **Full response** — the raw JSON returned (collapsible, with copy button)

This is on all three live API pages: Classify, Screening, and Landed Cost. Great for reviewers who want to see what's actually happening under the hood.

## Testing Checklist

With a valid token connected:

- [ ] **Classify tab** — Enter a product name (e.g. "cotton t-shirt"), set country to "US", click Classify. Expect HS code, confidence bar, tariff hierarchy, and alternates. Click "SEE THE API CALL" to inspect the request/response.
- [ ] **Vision tab** — Upload a product image, click Classify from Image. Expect HS code, country of origin, and value estimation. Click "SEE THE API CALL" to inspect.
- [ ] **Screening** — Enter product description + name + HS code, pick countries, click Check Restrictions. Expect restriction cards with confidence badges and summaries. Results are deduplicated by HS code (highest confidence kept). Click "SEE THE API CALL" to inspect.
- [ ] **Landed Cost** — Fill in the form (or use Quick Select from Catalog), click Calculate. Expect summary totals for duties, taxes, and fees. Click "SEE THE API CALL" to inspect the chained workflow.
- [ ] **Mobile** — Resize browser to <768px. Sidebar collapses to a hamburger menu. All pages should be usable on smaller screens.

Without a token (demo mode):

- All four features return realistic mock data so the UI can be demonstrated without API access.

## Things to Try

- **Quick Select from Catalog** on Landed Cost — pre-fills item details from the demo product catalog
- **"Don't know? Use the Classification Engine"** link on Landed Cost — takes you to Classify to look up the HS code first
- **Switch destinations** on Screening — try BE→US, BE→RU, BE→FR to see different restriction profiles
- **Upload different product images** on Vision tab — the Zonos vision model extracts HS codes, country of origin, and value estimates from photos
- **Connect Zonos page** (sidebar > System > Connect Zonos) — paste a token to switch from demo mode to live API calls

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4** with bpost brand colors
- **Radix UI** primitives for accessible components
- **Zonos GraphQL API** via Next.js API proxy routes

## Deployment

Deployed on Vercel with auto-deploy from the `main` branch. Push to main and Vercel picks it up.

```bash
git push origin main
```

Environment variables on Vercel: set `ZONOS_CREDENTIAL_TOKEN` in the Vercel project settings if you want the deployed version to work without the UI token flow.

## Project Structure

```
app/
  api/zonos/
    classify/route.ts    — classificationsCalculate
    vision/route.ts      — itemsExtract (image)
    restrict/route.ts    — restrictionApply
    landed-cost/route.ts — chained workflow (landed cost)
    collect/route.ts     — chained workflow (collect quote)
    token/route.ts       — token save/validate/check/delete
  dashboard/
    classify/page.tsx    — Classify + Vision tabs
    screening/page.tsx   — Live restriction check + static tables
    landed-cost/page.tsx — Landed cost calculator with breakdown
    connect/page.tsx     — Connect Zonos token UI
lib/
  zonos-token.ts         — Token resolution (cookie > env > demo)
  fake-data.ts           — All static demo data
```
