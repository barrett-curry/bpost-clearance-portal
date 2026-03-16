# bpost Export & Customs Platform

## Overview

This is a **demo/prototype application** — a presentation tool for showing what a bpost Export & Customs Platform could look like, powered by Zonos APIs. There is no backend beyond the Zonos API proxy, and static demo data is used for non-API features.

All static data lives in `lib/fake-data.ts`. The demo company is "Rosie & Jack Kidswear Ltd." — a fictional children's clothing brand. Default origin is Belgium (BE) with EUR currency.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **React:** 19
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI primitives (`@radix-ui/react-*`)
- **Icons:** Lucide React
- **Brand:** bpost visual identity (red `#ef2636`, gray `#6d6e71`)

## Key Directories

- `app/` — Next.js App Router pages
- `components/fedex/` — Reusable branded components (PageHeader, StatusDot, Table, etc.) — legacy naming from template
- `components/ui/` — Radix-based UI primitives (Dialog, Input, etc.)
- `lib/fake-data.ts` — All demo data (products, shipments, orders, alerts, emails, integrations)

## Brand Colors (CSS Variables)

- `--bp-red` — Primary brand red (#ef2636)
- `--bp-yellow` — Secondary gray (#6d6e71)
- `--bp-green` — Success / connected state (#00A651)
- `--bp-gray` — Muted text (#6C6C6C)
- `--bp-dark` — Dark text (#2A2A2D)
- `--bp-light` — Light backgrounds (#fef2f2)

## RFP Feature Coverage

The platform demonstrates all Must Have and Should Have requirements from the bpost RFP:

### Account Customer Services
- Branded tooling with RM branding, white-label support
- Data quality tools (HS classification, address validation, PAF integration)
- Account dashboards with shipment status, customs progress, exceptions

### Consumer Services
- Pre-pay functionality for duties, taxes, and fees
- Landed cost calculator with real-time duty/VAT estimation
- HS code classification with confidence scoring
- Compliance scoring and route alerts
- Risk & compliance screening
- Regulatory & tariff update tracking

### Data Quality & Screening
- Screening APIs for restricted items, value validation, HS quality
- Goods screening against prohibited/restricted lists
- High-risk shipment identification with configurable rules
- UPU/WCO standards alignment (CN22/CN23)
- Data quality metrics (timeliness, completeness, accuracy, consistency)
- Fraud detection (gift misdeclarations, value understatement)

### PDDP Services
- EU postal partner integration for duty/VAT pre-payment
- Funds settlement between RMG and partner posts

### DAP Import Solution
- Lane-specific DAP estimation via API
- Customer notifications with payment links
- Operations integration for post-payment movement

### Export Validation
- PASS/FAIL logic for export readiness
- Detailed failure reason reporting
- Dashboards for pass/fail status and exceptions

### IOSS
- IOSS intermediary services for EU customers
- VAT calculation at checkout with invoice validation
- UK future scheme readiness

### Reporting & Reconciliation
- End-to-end reconciliation across export stages
- Charge breakdowns at item, parcel, and shipment level
- Invoice collection and customs documentation
- Reference linkage across the export lifecycle
- Variance and audit trail reporting

## Important Notes

- **No real APIs** — everything is client-side state with fake data
- **No authentication** — demo flows only
- **Simulated delays** — `setTimeout` is used to fake async operations
- The demo is designed for RFP presentations and sales conversations, not production use
