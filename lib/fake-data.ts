// ============================================================
// Fake data store for bpost Export & Customs Platform demo
// All data is static - no backend needed
// ============================================================

export type Product = {
  id: string;
  name: string;
  sku: string;
  hsCode: string;
  coo: string; // country of origin ISO
  cooName: string;
  value: number;
  currency: string;
  unit: string;
  weight: number;
  weightUnit: string;
  pga: string[]; // e.g. ["FDA", "TTB"]
  restrictions: string[];
  classificationStatus: "classified" | "needs-review" | "unclassified" | "restricted";
  confidence: number;
  description: string;
  materials: string;
  imageUrl?: string;
};

export type Shipment = {
  id: string;
  trackingNumber: string;
  origin: string;
  originCountry: string;
  destination: string;
  destinationCountry: string;
  status: "in-transit" | "customs-hold" | "cleared" | "delivered" | "caged" | "customs-review";
  clearanceStatus: "clear" | "pga-hold" | "value-dispute" | "hs-review" | "docs-missing" | "pending";
  items: { productId: string; quantity: number }[];
  declaredValue: number;
  expectedValue?: number;
  dutyTax?: number;
  dutyTerms: "collected_at_checkout" | "collect_upon_delivery" | "collected_by_bpost";
  dutyCollected?: number;
  orderNumber: string;
  flags: string[];
  shipDate: string;
  estimatedDelivery: string;
  timeline: { date: string; status: string; detail: string; active?: boolean }[];
};

export type Order = {
  id: string;
  orderNumber: string;
  channel: "ebay" | "shopify" | "amazon" | "walmart" | "etsy";
  customerName: string;
  customerEmail: string;
  customerCity: string;
  customerCountry: string;
  items: { productId: string; quantity: number }[];
  totalValue: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "duty-hold";
  clearanceReady: "ready" | "warning" | "not-ready";
  orderDate: string;
  dutyTax?: number;
  dutyTerms: "collected_at_checkout" | "collect_upon_delivery" | "collected_by_bpost";
  dutyCollected?: number;
  collectNotice?: {
    sentAt: string;
    customerEmail: string;
    paidAt?: string;
  };
};

export type Alert = {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  type: "pga-hold" | "value-dispute" | "hs-suggestion" | "docs-missing" | "profile-update";
  title: string;
  description: string;
  shipmentId?: string;
  productId?: string;
  createdAt: string;
  status: "open" | "in-progress" | "resolved";
  actions: string[];
};

export type Email = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  category: "action" | "update" | "info";
  body: string;
  ctaLabel: string;
  ctaLink: string;
};

export type DocItem = {
  id: string;
  name: string;
  type: string;
  status: "verified" | "pending" | "rejected" | "expired" | "missing";
  uploadDate?: string;
  expiryDate?: string;
  shipmentId?: string;
  productId?: string;
  required: boolean;
  scope: "origin" | "country-specific";
  countryCode?: string;
  countryName?: string;
};

export type Integration = {
  id: string;
  name: string;
  channel: "shopify" | "ebay" | "amazon" | "walmart" | "etsy" | "sap" | "oracle";
  description: string;
  connected: boolean;
  lastSync?: string;
  productsImported?: number;
};

// ============================================================
// Demo Company
// ============================================================
export const demoCompany = {
  name: "Rosie & Jack Kidswear Ltd.",
  contact: "James Mitchell",
  email: "j.mitchell@rosieandjack.be",
  address: "Rue Neuve 85",
  city: "Brussels",
  postcode: "1000",
  country: "Belgium",
  countryCode: "BE",
  bpostAccount: "6045-2891-3",
  eori: "BE0987654321",
  ein: "BE-0987.654.321",
  phone: "+32 2 201 0958",
};

// ============================================================
// Products / Catalog
// ============================================================
export const products: Product[] = [
  {
    id: "prod-001",
    name: "Kids Cotton T-Shirt Pack (3pk)",
    sku: "KCT-3PK-AST",
    hsCode: "6109.10.00.40",
    coo: "BD",
    cooName: "Bangladesh",
    value: 18,
    currency: "EUR",
    unit: "pack",
    weight: 0.4,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 96,
    description: "Pack of 3 cotton t-shirts, assorted colours, ages 3-8, 100% organic cotton",
    materials: "100% organic cotton",
  },
  {
    id: "prod-002",
    name: "Children's Waterproof Jacket",
    sku: "CWJ-BLU-5Y",
    hsCode: "6202.93.00.00",
    coo: "CN",
    cooName: "China",
    value: 35,
    currency: "EUR",
    unit: "unit",
    weight: 0.6,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 95,
    description: "Kids waterproof jacket with hood, fleece-lined, ages 2-10, PFC-free coating",
    materials: "Polyester outer, fleece lining, PFC-free waterproof coating",
  },
  {
    id: "prod-003",
    name: "Toddler Denim Dungarees",
    sku: "TDD-IND-2T",
    hsCode: "6204.62.40.00",
    coo: "TR",
    cooName: "Turkey",
    value: 24,
    currency: "EUR",
    unit: "unit",
    weight: 0.35,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 93,
    description: "Toddler denim dungarees, indigo wash, adjustable straps, ages 1-4",
    materials: "Cotton denim, metal buttons, elastic straps",
  },
  {
    id: "prod-004",
    name: "Girls Floral Summer Dress",
    sku: "GFD-PNK-6Y",
    hsCode: "6204.42.00.00",
    coo: "IN",
    cooName: "India",
    value: 22,
    currency: "EUR",
    unit: "unit",
    weight: 0.25,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 92,
    description: "Girls floral print dress, cotton voile, lined, ages 3-10",
    materials: "Cotton voile, cotton lining",
  },
  {
    id: "prod-005",
    name: "Boys School Uniform Set",
    sku: "BSU-GRY-8Y",
    hsCode: "6203.42.40.00",
    coo: "BD",
    cooName: "Bangladesh",
    value: 28,
    currency: "EUR",
    unit: "set",
    weight: 0.8,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 91,
    description: "Boys school uniform set: trousers, shirt, jumper, ages 4-12",
    materials: "Polyester/cotton blend, acrylic jumper",
  },
  {
    id: "prod-006",
    name: "Baby Organic Sleepsuit (Set of 3)",
    sku: "BOS-WHT-NB",
    hsCode: "6111.20.90.00",
    coo: "PT",
    cooName: "Portugal",
    value: 32,
    currency: "EUR",
    unit: "set",
    weight: 0.3,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 97,
    description: "Set of 3 organic cotton sleepsuits, envelope neck, 0-24 months",
    materials: "100% GOTS-certified organic cotton",
  },
  {
    id: "prod-007",
    name: "Children's Knitted Beanie Hat",
    sku: "CKB-MUL-OS",
    hsCode: "6505.00.80.00",
    coo: "NP",
    cooName: "Nepal",
    value: 12,
    currency: "EUR",
    unit: "unit",
    weight: 0.08,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 94,
    description: "Hand-knitted wool beanie, one size fits 2-8 years",
    materials: "100% merino wool",
  },
  {
    id: "prod-008",
    name: "Kids Rainboot Wellies",
    sku: "KRW-YLW-4Y",
    hsCode: "6401.92.90.00",
    coo: "CN",
    cooName: "China",
    value: 16,
    currency: "EUR",
    unit: "pair",
    weight: 0.5,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "needs-review",
    confidence: 78,
    description: "Children's rubber wellington boots, pull-on handles, sizes EU 20-34",
    materials: "Natural rubber, cotton lining",
  },
  {
    id: "prod-009",
    name: "Fleece-Lined Joggers",
    sku: "FLJ-NVY-7Y",
    hsCode: "6104.63.00.00",
    coo: "TR",
    cooName: "Turkey",
    value: 20,
    currency: "EUR",
    unit: "unit",
    weight: 0.4,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 95,
    description: "Kids fleece-lined joggers, elasticated waist, ages 3-12",
    materials: "Cotton/polyester outer, polyester fleece lining",
  },
  {
    id: "prod-010",
    name: "Organic Cotton Babygrow",
    sku: "OCB-STR-6M",
    hsCode: "6111.20.10.00",
    coo: "PT",
    cooName: "Portugal",
    value: 15,
    currency: "EUR",
    unit: "unit",
    weight: 0.15,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 93,
    description: "Organic cotton babygrow, striped, popper fastening, 0-18 months",
    materials: "100% organic cotton, nickel-free poppers",
  },
  {
    id: "prod-011",
    name: "Girls Party Dress",
    sku: "GPD-GLD-5Y",
    hsCode: "6204.44.00.00",
    coo: "IN",
    cooName: "India",
    value: 38,
    currency: "EUR",
    unit: "unit",
    weight: 0.35,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 91,
    description: "Girls occasion dress, tulle skirt, sequin bodice, ages 3-10",
    materials: "Polyester tulle, sequin embellishment, cotton lining",
  },
  {
    id: "prod-012",
    name: "Kids Puffer Gilet",
    sku: "KPG-RED-6Y",
    hsCode: "6202.91.00.00",
    coo: "CN",
    cooName: "China",
    value: 26,
    currency: "EUR",
    unit: "unit",
    weight: 0.45,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 96,
    description: "Children's padded gilet, water-resistant, reflective trim, ages 2-10",
    materials: "Polyester outer, recycled polyester fill, reflective tape",
  },
  {
    id: "prod-013",
    name: "Baby Muslin Swaddle Set",
    sku: "BMS-PST-OS",
    hsCode: "6302.31.00.00",
    coo: "IN",
    cooName: "India",
    value: 22,
    currency: "EUR",
    unit: "set",
    weight: 0.2,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 88,
    description: "Set of 3 muslin swaddle blankets, 120x120cm, pastel prints",
    materials: "100% cotton muslin",
  },
  {
    id: "prod-014",
    name: "Boys Cargo Shorts",
    sku: "BCS-KHK-9Y",
    hsCode: "6203.42.90.00",
    coo: "BD",
    cooName: "Bangladesh",
    value: 16,
    currency: "EUR",
    unit: "unit",
    weight: 0.25,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 94,
    description: "Boys cargo shorts, cotton twill, multiple pockets, ages 4-14",
    materials: "100% cotton twill",
  },
  {
    id: "prod-015",
    name: "Kids Sun Hat (UV Protection)",
    sku: "KSH-SAF-3Y",
    hsCode: "6505.00.30.00",
    coo: "AU",
    cooName: "Australia",
    value: 18,
    currency: "EUR",
    unit: "unit",
    weight: 0.1,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 97,
    description: "Children's UPF 50+ sun hat, chin strap, neck flap, ages 1-6",
    materials: "Polyester/cotton UPF 50+ fabric, adjustable chin strap",
  },
  {
    id: "prod-016",
    name: "Newborn Gift Set",
    sku: "NGS-CRM-NB",
    hsCode: "6111.20.90.00",
    coo: "PT",
    cooName: "Portugal",
    value: 45,
    currency: "EUR",
    unit: "set",
    weight: 0.5,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 90,
    description: "5-piece newborn gift set: bodysuit, hat, mittens, booties, muslin",
    materials: "100% organic cotton, gift box packaging",
  },
  {
    id: "prod-017",
    name: "School PE Kit Bag",
    sku: "SPK-BLK-OS",
    hsCode: "4202.92.98.00",
    coo: "CN",
    cooName: "China",
    value: 10,
    currency: "EUR",
    unit: "unit",
    weight: 0.2,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 94,
    description: "Drawstring PE kit bag, polyester, name label window",
    materials: "210D polyester, drawstring cord",
  },
  {
    id: "prod-018",
    name: "Girls Leggings (2-pack)",
    sku: "GL2-AST-7Y",
    hsCode: "6104.63.00.00",
    coo: "TR",
    cooName: "Turkey",
    value: 14,
    currency: "EUR",
    unit: "pack",
    weight: 0.3,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 92,
    description: "Girls cotton-rich leggings, 2-pack, assorted colours, ages 3-12",
    materials: "95% cotton, 5% elastane",
  },
  {
    id: "prod-019",
    name: "Kids Snowsuit",
    sku: "KSS-BLU-3Y",
    hsCode: "6201.93.00.00",
    coo: "CN",
    cooName: "China",
    value: 48,
    currency: "EUR",
    unit: "unit",
    weight: 0.9,
    weightUnit: "kg",
    pga: [],
    restrictions: ["Down/feather content declaration may be required"],
    classificationStatus: "needs-review",
    confidence: 86,
    description: "Children's insulated snowsuit, waterproof, detachable hood, ages 1-6",
    materials: "Polyester outer, synthetic insulation, waterproof membrane",
  },
  {
    id: "prod-020",
    name: "Baby Knitted Cardigan",
    sku: "BKC-CRM-12M",
    hsCode: "6111.30.90.00",
    coo: "IT",
    cooName: "Italy",
    value: 28,
    currency: "EUR",
    unit: "unit",
    weight: 0.15,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 93,
    description: "Baby merino wool cardigan, button-front, ages 0-24 months",
    materials: "100% merino wool, shell buttons",
  },
  {
    id: "prod-021",
    name: "Boys Polo Shirt (2-pack)",
    sku: "BP2-WHT-10Y",
    hsCode: "6105.10.00.00",
    coo: "BD",
    cooName: "Bangladesh",
    value: 16,
    currency: "EUR",
    unit: "pack",
    weight: 0.3,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "unclassified",
    confidence: 0,
    description: "School polo shirts, 2-pack, stain-resistant, ages 4-14",
    materials: "65% polyester, 35% cotton, stain-release finish",
  },
  {
    id: "prod-022",
    name: "Kids Swimming Costume",
    sku: "KSC-TRP-6Y",
    hsCode: "6112.41.10.00",
    coo: "CN",
    cooName: "China",
    value: 14,
    currency: "EUR",
    unit: "unit",
    weight: 0.15,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 87,
    description: "Children's one-piece swimsuit, chlorine-resistant, UPF 50+, ages 2-10",
    materials: "Polyamide/elastane, chlorine-resistant fabric",
  },
  {
    id: "prod-023",
    name: "Toddler Soft-Sole Shoes",
    sku: "TSS-TAN-18M",
    hsCode: "6404.19.90.00",
    coo: "ES",
    cooName: "Spain",
    value: 30,
    currency: "EUR",
    unit: "pair",
    weight: 0.2,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "classified",
    confidence: 91,
    description: "Toddler leather soft-sole shoes, non-slip, ages 6-24 months",
    materials: "Full-grain leather upper, suede sole",
  },
  {
    id: "prod-024",
    name: "Kids Thermal Base Layer Set",
    sku: "KTB-BLK-8Y",
    hsCode: "6108.22.00.00",
    coo: "TR",
    cooName: "Turkey",
    value: 20,
    currency: "EUR",
    unit: "set",
    weight: 0.3,
    weightUnit: "kg",
    pga: [],
    restrictions: [],
    classificationStatus: "unclassified",
    confidence: 0,
    description: "Children's thermal top and leggings set, moisture-wicking, ages 3-12",
    materials: "Polyester/merino wool blend, moisture-wicking finish",
  },
];

// ============================================================
// Shipments
// ============================================================
export const shipments: Shipment[] = [
  {
    id: "ship-001",
    trackingNumber: "FX8847291",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Dallas, TX",
    destinationCountry: "US",
    status: "caged",
    clearanceStatus: "value-dispute",
    items: [{ productId: "prod-001", quantity: 12 }],
    declaredValue: 540,
    expectedValue: 960,
    orderNumber: "EB-20260215-4421",
    dutyTerms: "collect_upon_delivery",
    flags: ["Value Dispute", "Under Review"],
    shipDate: "2026-02-20",
    estimatedDelivery: "2026-02-27",
    timeline: [
      { date: "2026-02-20", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-20", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-21", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-22", status: "In Transit", detail: "Arrived Memphis Hub" },
      { date: "2026-02-22", status: "Customs Review", detail: "Submitted to U.S. Customs" },
      { date: "2026-02-23", status: "Value Dispute", detail: "Declared value \u00a3540 vs expected range \u00a3840-\u00a31,080. Verification required.", active: true },
    ],
  },
  {
    id: "ship-002",
    trackingNumber: "FX8847295",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Napa Valley, CA",
    destinationCountry: "US",
    status: "customs-hold",
    clearanceStatus: "pga-hold",
    items: [
      { productId: "prod-001", quantity: 6 },
      { productId: "prod-002", quantity: 6 },
      { productId: "prod-003", quantity: 6 },
      { productId: "prod-005", quantity: 6 },
    ],
    declaredValue: 2700,
    orderNumber: "AZ-20260220-1192",
    dutyTerms: "collect_upon_delivery",
    flags: ["PGA Hold", "CPSIA Certificate Required"],
    shipDate: "2026-02-18",
    estimatedDelivery: "2026-02-25",
    timeline: [
      { date: "2026-02-18", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-18", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-19", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-20", status: "In Transit", detail: "Arrived Memphis Hub" },
      { date: "2026-02-20", status: "Customs Review", detail: "Submitted to U.S. Customs" },
      { date: "2026-02-21", status: "PGA Hold", detail: "CPSC review required. Missing CPSIA Children's Product Certificate (CPC) for textile imports.", active: true },
    ],
  },
  {
    id: "ship-003",
    trackingNumber: "FX8847298",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Miami, FL",
    destinationCountry: "US",
    status: "cleared",
    clearanceStatus: "clear",
    items: [{ productId: "prod-002", quantity: 6 }],
    declaredValue: 390,
    dutyTax: 127.45,
    orderNumber: "SH-20260210-3312",
    dutyTerms: "collected_at_checkout",
    dutyCollected: 127.45,
    flags: [],
    shipDate: "2026-02-15",
    estimatedDelivery: "2026-02-22",
    timeline: [
      { date: "2026-02-15", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-15", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-16", status: "In Transit", detail: "Departed Brussels South Charleroi" },
      { date: "2026-02-17", status: "In Transit", detail: "Arrived Miami International" },
      { date: "2026-02-17", status: "Customs Review", detail: "Submitted to U.S. Customs" },
      { date: "2026-02-18", status: "Cleared", detail: "All duties and taxes paid. Duty: \u00a358.50, Tax: \u00a338.95, Fees: \u00a330.00", active: true },
    ],
  },
  {
    id: "ship-004",
    trackingNumber: "FX8847301",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Tokyo, Japan",
    destinationCountry: "JP",
    status: "in-transit",
    clearanceStatus: "pending",
    items: [{ productId: "prod-003", quantity: 48 }],
    declaredValue: 1536,
    orderNumber: "AZ-20260220-1192",
    dutyTerms: "collect_upon_delivery",
    dutyTax: 312.80,
    flags: [],
    shipDate: "2026-02-24",
    estimatedDelivery: "2026-03-01",
    timeline: [
      { date: "2026-02-24", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-24", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-25", status: "In Transit", detail: "Departed Brussels Airport", active: true },
    ],
  },
  {
    id: "ship-005",
    trackingNumber: "FX8847304",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Mexico City, Mexico",
    destinationCountry: "MX",
    status: "customs-review",
    clearanceStatus: "pending",
    items: [
      { productId: "prod-005", quantity: 12 },
      { productId: "prod-004", quantity: 6 },
    ],
    declaredValue: 1128,
    orderNumber: "SH-20260218-7830",
    dutyTerms: "collected_at_checkout",
    dutyTax: 89.25,
    dutyCollected: 89.25,
    flags: ["Under Review"],
    shipDate: "2026-02-22",
    estimatedDelivery: "2026-02-28",
    timeline: [
      { date: "2026-02-22", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-22", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-23", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-24", status: "In Transit", detail: "Arrived Mexico City International" },
      { date: "2026-02-25", status: "Customs Review", detail: "Submitted to Mexican Customs (SAT)", active: true },
    ],
  },
  {
    id: "ship-006",
    trackingNumber: "FX8847307",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Toronto, Canada",
    destinationCountry: "CA",
    status: "in-transit",
    clearanceStatus: "pending",
    items: [
      { productId: "prod-002", quantity: 12 },
      { productId: "prod-014", quantity: 6 },
    ],
    declaredValue: 894,
    orderNumber: "WM-20260222-5567",
    dutyTerms: "collect_upon_delivery",
    dutyTax: 178.40,
    flags: [],
    shipDate: "2026-02-25",
    estimatedDelivery: "2026-03-02",
    timeline: [
      { date: "2026-02-25", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-25", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-26", status: "In Transit", detail: "Departed Brussels Airport", active: true },
    ],
  },
  {
    id: "ship-007",
    trackingNumber: "FX8847310",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Sydney, Australia",
    destinationCountry: "AU",
    status: "customs-hold",
    clearanceStatus: "docs-missing",
    items: [
      { productId: "prod-004", quantity: 36 },
    ],
    declaredValue: 648,
    orderNumber: "AZ-20260212-8844",
    dutyTerms: "collected_by_bpost",
    dutyTax: 54.00,
    dutyCollected: 54.00,
    flags: ["Docs Missing"],
    shipDate: "2026-02-21",
    estimatedDelivery: "2026-03-01",
    timeline: [
      { date: "2026-02-21", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-21", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-22", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-23", status: "In Transit", detail: "Arrived Sydney Kingsford Smith" },
      { date: "2026-02-24", status: "Docs Missing", detail: "Australian Customs requires product safety certificate for children's clothing imports", active: true },
    ],
  },
  {
    id: "ship-008",
    trackingNumber: "FX8847313",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Berlin, Germany",
    destinationCountry: "DE",
    status: "cleared",
    clearanceStatus: "clear",
    items: [
      { productId: "prod-006", quantity: 3 },
      { productId: "prod-008", quantity: 1 },
    ],
    declaredValue: 610,
    dutyTax: 145.20,
    orderNumber: "ET-20260224-8891",
    dutyTerms: "collected_at_checkout",
    dutyCollected: 145.20,
    flags: [],
    shipDate: "2026-02-19",
    estimatedDelivery: "2026-02-24",
    timeline: [
      { date: "2026-02-19", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-19", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-20", status: "In Transit", detail: "Departed Brussels-Midi" },
      { date: "2026-02-21", status: "Customs Review", detail: "Submitted to German Customs (Zoll)" },
      { date: "2026-02-22", status: "Cleared", detail: "EU customs cleared. VAT: €96.80, Import duty: €48.40", active: true },
    ],
  },
  {
    id: "ship-009",
    trackingNumber: "FX8847316",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Chicago, IL",
    destinationCountry: "US",
    status: "customs-hold",
    clearanceStatus: "pga-hold",
    items: [
      { productId: "prod-009", quantity: 6 },
      { productId: "prod-015", quantity: 6 },
    ],
    declaredValue: 678,
    orderNumber: "SH-20260223-2200",
    dutyTerms: "collected_at_checkout",
    dutyTax: 198.00,
    dutyCollected: 198.00,
    flags: ["PGA Hold"],
    shipDate: "2026-02-23",
    estimatedDelivery: "2026-02-28",
    timeline: [
      { date: "2026-02-23", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-23", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-24", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-25", status: "In Transit", detail: "Arrived Chicago O'Hare" },
      { date: "2026-02-26", status: "PGA Hold", detail: "CPSC product safety review required. CPSIA children's product certificate needed for textile imports.", active: true },
    ],
  },
  {
    id: "ship-010",
    trackingNumber: "FX8847319",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Paris, France",
    destinationCountry: "FR",
    status: "in-transit",
    clearanceStatus: "pending",
    items: [
      { productId: "prod-012", quantity: 2 },
      { productId: "prod-006", quantity: 1 },
    ],
    declaredValue: 310,
    orderNumber: "AZ-20260221-4455",
    dutyTerms: "collect_upon_delivery",
    dutyTax: 69.40,
    flags: [],
    shipDate: "2026-02-26",
    estimatedDelivery: "2026-02-28",
    timeline: [
      { date: "2026-02-26", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-26", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-27", status: "In Transit", detail: "Departed Brussels-Midi", active: true },
    ],
  },
  {
    id: "ship-011",
    trackingNumber: "FX8847322",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Osaka, Japan",
    destinationCountry: "JP",
    status: "customs-review",
    clearanceStatus: "hs-review",
    items: [
      { productId: "prod-005", quantity: 6 },
      { productId: "prod-022", quantity: 3 },
    ],
    declaredValue: 705,
    orderNumber: "SH-20260216-5501",
    dutyTerms: "collected_at_checkout",
    dutyTax: 52.40,
    dutyCollected: 52.40,
    flags: ["Under Review"],
    shipDate: "2026-02-22",
    estimatedDelivery: "2026-03-01",
    timeline: [
      { date: "2026-02-22", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-22", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-23", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-24", status: "In Transit", detail: "Arrived Osaka Kansai International" },
      { date: "2026-02-25", status: "HS Review", detail: "Japan Customs reviewing HS classification for children's swimming costume (6112.41 vs 6112.49)", active: true },
    ],
  },
  {
    id: "ship-012",
    trackingNumber: "FX8847325",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Vancouver, Canada",
    destinationCountry: "CA",
    status: "cleared",
    clearanceStatus: "clear",
    items: [
      { productId: "prod-010", quantity: 12 },
      { productId: "prod-019", quantity: 6 },
    ],
    declaredValue: 384,
    dutyTax: 76.80,
    orderNumber: "WM-20260217-9023",
    dutyTerms: "collected_by_bpost",
    dutyCollected: 76.80,
    flags: [],
    shipDate: "2026-02-17",
    estimatedDelivery: "2026-02-24",
    timeline: [
      { date: "2026-02-17", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-17", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-18", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-19", status: "In Transit", detail: "Arrived Vancouver International" },
      { date: "2026-02-20", status: "Customs Review", detail: "Submitted to CBSA" },
      { date: "2026-02-21", status: "Cleared", detail: "CBSA cleared. Duty: \u00a319.20, GST: \u00a357.60", active: true },
    ],
  },
  {
    id: "ship-013",
    trackingNumber: "FX8847328",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "São Paulo, Brazil",
    destinationCountry: "BR",
    status: "caged",
    clearanceStatus: "docs-missing",
    items: [
      { productId: "prod-001", quantity: 24 },
      { productId: "prod-003", quantity: 12 },
    ],
    declaredValue: 1464,
    orderNumber: "ET-20260225-5544",
    dutyTerms: "collect_upon_delivery",
    dutyTax: 93.00,
    flags: ["Docs Missing"],
    shipDate: "2026-02-19",
    estimatedDelivery: "2026-03-01",
    timeline: [
      { date: "2026-02-19", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-19", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-20", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-21", status: "In Transit", detail: "Arrived São Paulo Guarulhos" },
      { date: "2026-02-22", status: "Caged", detail: "Brazilian Customs (Receita Federal) requires INMETRO product safety certification for children's clothing", active: true },
    ],
  },
  {
    id: "ship-014",
    trackingNumber: "FX8847331",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Stockholm, Sweden",
    destinationCountry: "SE",
    status: "in-transit",
    clearanceStatus: "pending",
    items: [
      { productId: "prod-016", quantity: 3 },
      { productId: "prod-011", quantity: 6 },
    ],
    declaredValue: 333,
    orderNumber: "SH-20260220-6688",
    dutyTerms: "collected_at_checkout",
    dutyTax: 68.40,
    dutyCollected: 68.40,
    flags: [],
    shipDate: "2026-02-27",
    estimatedDelivery: "2026-03-02",
    timeline: [
      { date: "2026-02-27", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-27", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-28", status: "In Transit", detail: "Departed Brussels Airport", active: true },
    ],
  },
  {
    id: "ship-015",
    trackingNumber: "FX8847334",
    origin: "Brussels, BE",
    originCountry: "BE",
    destination: "Mumbai, India",
    destinationCountry: "IN",
    status: "customs-hold",
    clearanceStatus: "value-dispute",
    items: [
      { productId: "prod-002", quantity: 6 },
      { productId: "prod-009", quantity: 6 },
    ],
    declaredValue: 858,
    expectedValue: 1200,
    orderNumber: "AZ-20260227-1100",
    dutyTerms: "collect_upon_delivery",
    dutyTax: 147.60,
    flags: ["Value Dispute"],
    shipDate: "2026-02-20",
    estimatedDelivery: "2026-02-28",
    timeline: [
      { date: "2026-02-20", status: "Label Created", detail: "Shipping label created in Brussels" },
      { date: "2026-02-20", status: "Picked Up", detail: "Package picked up by bpost" },
      { date: "2026-02-21", status: "In Transit", detail: "Departed Brussels Airport" },
      { date: "2026-02-22", status: "In Transit", detail: "Arrived Mumbai Chhatrapati Shivaji" },
      { date: "2026-02-23", status: "Value Dispute", detail: "Indian Customs disputes declared value of \u00a3858 vs expected \u00a31,200 for premium children's clothing", active: true },
    ],
  },
];

// ============================================================
// Orders
// ============================================================
export const orders: Order[] = [
  {
    id: "order-001",
    orderNumber: "EB-20260215-4421",
    channel: "ebay",
    customerName: "Robert Chen",
    customerEmail: "robert.chen@gmail.com",
    customerCity: "Napa Valley, CA",
    customerCountry: "US",
    items: [
      { productId: "prod-001", quantity: 12 },
      { productId: "prod-006", quantity: 2 },
    ],
    totalValue: 780,
    currency: "EUR",
    status: "duty-hold",
    clearanceReady: "warning",
    orderDate: "2026-02-15",
    dutyTax: 234.50,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
    collectNotice: {
      sentAt: "2026-02-24",
      customerEmail: "robert.chen@gmail.com",
    },
  },
  {
    id: "order-002",
    orderNumber: "SH-20260218-7830",
    channel: "shopify",
    customerName: "Maria Santos",
    customerEmail: "maria.santos@outlook.com",
    customerCity: "Mexico City",
    customerCountry: "MX",
    items: [
      { productId: "prod-003", quantity: 6 },
      { productId: "prod-004", quantity: 6 },
    ],
    totalValue: 300,
    currency: "EUR",
    status: "processing",
    clearanceReady: "ready",
    orderDate: "2026-02-18",
    dutyTax: 89.25,
    dutyTerms: "collected_at_checkout",
    dutyCollected: 89.25,
  },
  {
    id: "order-003",
    orderNumber: "AZ-20260220-1192",
    channel: "amazon",
    customerName: "Yuki Tanaka",
    customerEmail: "yuki.tanaka@yahoo.co.jp",
    customerCity: "Tokyo",
    customerCountry: "JP",
    items: [
      { productId: "prod-001", quantity: 6 },
      { productId: "prod-003", quantity: 6 },
      { productId: "prod-004", quantity: 6 },
      { productId: "prod-005", quantity: 6 },
    ],
    totalValue: 1080,
    currency: "EUR",
    status: "shipped",
    clearanceReady: "ready",
    orderDate: "2026-02-20",
    dutyTax: 312.80,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-004",
    orderNumber: "WM-20260222-5567",
    channel: "walmart",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@rogers.ca",
    customerCity: "Toronto",
    customerCountry: "CA",
    items: [
      { productId: "prod-002", quantity: 12 },
      { productId: "prod-007", quantity: 4 },
    ],
    totalValue: 840,
    currency: "EUR",
    status: "pending",
    clearanceReady: "not-ready",
    orderDate: "2026-02-22",
    dutyTax: 178.40,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-005",
    orderNumber: "ET-20260224-8891",
    channel: "etsy",
    customerName: "Klaus Weber",
    customerEmail: "k.weber@gmx.de",
    customerCity: "Berlin",
    customerCountry: "DE",
    items: [
      { productId: "prod-006", quantity: 3 },
      { productId: "prod-008", quantity: 1 },
    ],
    totalValue: 610,
    currency: "EUR",
    status: "pending",
    clearanceReady: "warning",
    orderDate: "2026-02-24",
    dutyTax: 145.20,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-006",
    orderNumber: "SH-20260210-3312",
    channel: "shopify",
    customerName: "Emily Dubois",
    customerEmail: "emily.dubois@free.fr",
    customerCity: "Paris",
    customerCountry: "FR",
    items: [
      { productId: "prod-009", quantity: 6 },
      { productId: "prod-012", quantity: 1 },
    ],
    totalValue: 563,
    currency: "EUR",
    status: "delivered",
    clearanceReady: "ready",
    orderDate: "2026-02-10",
    dutyTax: 112.60,
    dutyTerms: "collected_at_checkout",
    dutyCollected: 112.60,
  },
  {
    id: "order-007",
    orderNumber: "AZ-20260212-8844",
    channel: "amazon",
    customerName: "James O'Brien",
    customerEmail: "james.obrien@bigpond.com.au",
    customerCity: "Sydney",
    customerCountry: "AU",
    items: [
      { productId: "prod-014", quantity: 12 },
      { productId: "prod-010", quantity: 6 },
    ],
    totalValue: 360,
    currency: "EUR",
    status: "processing",
    clearanceReady: "ready",
    orderDate: "2026-02-12",
    dutyTax: 54.00,
    dutyTerms: "collected_by_bpost",
    dutyCollected: 54.00,
    collectNotice: {
      sentAt: "2026-02-14",
      customerEmail: "james.obrien@bigpond.com.au",
      paidAt: "2026-02-16",
    },
  },
  {
    id: "order-008",
    orderNumber: "EB-20260214-2290",
    channel: "ebay",
    customerName: "Marco Rossi",
    customerEmail: "marco.rossi@libero.it",
    customerCity: "Milan",
    customerCountry: "IT",
    items: [
      { productId: "prod-005", quantity: 6 },
      { productId: "prod-017", quantity: 1 },
    ],
    totalValue: 595,
    currency: "EUR",
    status: "processing",
    clearanceReady: "ready",
    orderDate: "2026-02-14",
    dutyTax: 142.80,
    dutyTerms: "collected_by_bpost",
    dutyCollected: 142.80,
    collectNotice: {
      sentAt: "2026-02-16",
      customerEmail: "marco.rossi@libero.it",
      paidAt: "2026-02-19",
    },
  },
  {
    id: "order-009",
    orderNumber: "SH-20260216-5501",
    channel: "shopify",
    customerName: "Akiko Sato",
    customerEmail: "akiko.sato@nifty.com",
    customerCity: "Osaka",
    customerCountry: "JP",
    items: [
      { productId: "prod-024", quantity: 4 },
      { productId: "prod-021", quantity: 2 },
    ],
    totalValue: 262,
    currency: "EUR",
    status: "shipped",
    clearanceReady: "ready",
    orderDate: "2026-02-16",
    dutyTax: 52.40,
    dutyTerms: "collected_at_checkout",
    dutyCollected: 52.40,
  },
  {
    id: "order-010",
    orderNumber: "WM-20260217-9023",
    channel: "walmart",
    customerName: "David Nguyen",
    customerEmail: "d.nguyen@telus.net",
    customerCity: "Vancouver",
    customerCountry: "CA",
    items: [
      { productId: "prod-001", quantity: 6 },
      { productId: "prod-015", quantity: 6 },
    ],
    totalValue: 480,
    currency: "EUR",
    status: "processing",
    clearanceReady: "ready",
    orderDate: "2026-02-17",
    dutyTax: 96.00,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-011",
    orderNumber: "ET-20260219-1147",
    channel: "etsy",
    customerName: "Ana García",
    customerEmail: "ana.garcia@telefonica.es",
    customerCity: "Madrid",
    customerCountry: "ES",
    items: [
      { productId: "prod-006", quantity: 2 },
      { productId: "prod-023", quantity: 1 },
    ],
    totalValue: 285,
    currency: "EUR",
    status: "processing",
    clearanceReady: "ready",
    orderDate: "2026-02-19",
    dutyTax: 57.00,
    dutyTerms: "collected_by_bpost",
    dutyCollected: 57.00,
    collectNotice: {
      sentAt: "2026-02-21",
      customerEmail: "ana.garcia@telefonica.es",
      paidAt: "2026-02-23",
    },
  },
  {
    id: "order-012",
    orderNumber: "SH-20260220-6688",
    channel: "shopify",
    customerName: "Lars Eriksson",
    customerEmail: "lars.eriksson@telia.se",
    customerCity: "Stockholm",
    customerCountry: "SE",
    items: [
      { productId: "prod-016", quantity: 3 },
      { productId: "prod-019", quantity: 6 },
    ],
    totalValue: 285,
    currency: "EUR",
    status: "processing",
    clearanceReady: "ready",
    orderDate: "2026-02-20",
    dutyTax: 68.40,
    dutyTerms: "collected_at_checkout",
    dutyCollected: 68.40,
  },
  {
    id: "order-013",
    orderNumber: "AZ-20260221-4455",
    channel: "amazon",
    customerName: "Sophie Martin",
    customerEmail: "sophie.martin@orange.fr",
    customerCity: "Lyon",
    customerCountry: "FR",
    items: [
      { productId: "prod-013", quantity: 1 },
      { productId: "prod-018", quantity: 2 },
    ],
    totalValue: 347,
    currency: "EUR",
    status: "pending",
    clearanceReady: "warning",
    orderDate: "2026-02-21",
    dutyTax: 69.40,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-014",
    orderNumber: "EB-20260222-7712",
    channel: "ebay",
    customerName: "Hiroshi Yamamoto",
    customerEmail: "h.yamamoto@docomo.ne.jp",
    customerCity: "Kyoto",
    customerCountry: "JP",
    items: [
      { productId: "prod-022", quantity: 3 },
      { productId: "prod-009", quantity: 6 },
    ],
    totalValue: 663,
    currency: "EUR",
    status: "duty-hold",
    clearanceReady: "ready",
    orderDate: "2026-02-22",
    dutyTax: 198.90,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
    collectNotice: {
      sentAt: "2026-02-27",
      customerEmail: "h.yamamoto@docomo.ne.jp",
    },
  },
  {
    id: "order-015",
    orderNumber: "SH-20260223-2200",
    channel: "shopify",
    customerName: "Michael Brown",
    customerEmail: "michael.brown@outlook.com",
    customerCity: "Chicago, IL",
    customerCountry: "US",
    items: [
      { productId: "prod-002", quantity: 6 },
      { productId: "prod-001", quantity: 6 },
    ],
    totalValue: 660,
    currency: "EUR",
    status: "processing",
    clearanceReady: "ready",
    orderDate: "2026-02-23",
    dutyTax: 198.00,
    dutyTerms: "collected_at_checkout",
    dutyCollected: 198.00,
  },
  {
    id: "order-016",
    orderNumber: "WM-20260224-3389",
    channel: "walmart",
    customerName: "Chen Wei",
    customerEmail: "chen.wei@163.com",
    customerCity: "Shanghai",
    customerCountry: "CN",
    items: [
      { productId: "prod-008", quantity: 1 },
      { productId: "prod-007", quantity: 6 },
    ],
    totalValue: 340,
    currency: "EUR",
    status: "pending",
    clearanceReady: "not-ready",
    orderDate: "2026-02-24",
    dutyTax: 85.00,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-017",
    orderNumber: "ET-20260225-5544",
    channel: "etsy",
    customerName: "Isabella Costa",
    customerEmail: "isabella.costa@bol.com.br",
    customerCity: "São Paulo",
    customerCountry: "BR",
    items: [
      { productId: "prod-012", quantity: 2 },
      { productId: "prod-006", quantity: 1 },
    ],
    totalValue: 310,
    currency: "EUR",
    status: "pending",
    clearanceReady: "warning",
    orderDate: "2026-02-25",
    dutyTax: 93.00,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-018",
    orderNumber: "SH-20260226-8877",
    channel: "shopify",
    customerName: "Thomas Müller",
    customerEmail: "thomas.muller@web.de",
    customerCity: "Munich",
    customerCountry: "DE",
    items: [
      { productId: "prod-015", quantity: 12 },
      { productId: "prod-011", quantity: 6 },
    ],
    totalValue: 588,
    currency: "EUR",
    status: "pending",
    clearanceReady: "ready",
    orderDate: "2026-02-26",
    dutyTax: 141.12,
    dutyTerms: "collected_at_checkout",
    dutyCollected: 141.12,
  },
  {
    id: "order-019",
    orderNumber: "AZ-20260227-1100",
    channel: "amazon",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@rediffmail.com",
    customerCity: "Mumbai",
    customerCountry: "IN",
    items: [
      { productId: "prod-003", quantity: 12 },
      { productId: "prod-020", quantity: 6 },
    ],
    totalValue: 492,
    currency: "EUR",
    status: "pending",
    clearanceReady: "not-ready",
    orderDate: "2026-02-27",
    dutyTax: 147.60,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
  {
    id: "order-020",
    orderNumber: "EB-20260228-6633",
    channel: "ebay",
    customerName: "Liam O'Connor",
    customerEmail: "liam.oconnor@eircom.net",
    customerCity: "Dublin",
    customerCountry: "IE",
    items: [
      { productId: "prod-001", quantity: 6 },
      { productId: "prod-002", quantity: 6 },
      { productId: "prod-014", quantity: 6 },
    ],
    totalValue: 774,
    currency: "EUR",
    status: "pending",
    clearanceReady: "ready",
    orderDate: "2026-02-28",
    dutyTax: 185.76,
    dutyTerms: "collect_upon_delivery",
    dutyCollected: 0,
  },
];

// ============================================================
// Alerts
// ============================================================
export const alerts: Alert[] = [
  {
    id: "alert-001",
    priority: "critical",
    type: "pga-hold",
    title: "CPSC Hold - Children's clothing shipment requires documentation",
    description: "Shipment FX8847295 (mixed children's clothing) is held at customs. CPSIA Children's Product Certificate (CPC) is required for children's textile imports to the United States. Upload the certificate to release the shipment.",
    shipmentId: "ship-002",
    createdAt: "2026-02-21",
    status: "open",
    actions: ["Upload CPSIA Certificate", "Contact customs broker", "Request CPSC expedited review"],
  },
  {
    id: "alert-002",
    priority: "high",
    type: "value-dispute",
    title: "Value verification required - Declared value below expected range",
    description: "Shipment FX8847291 (48x Kids Cotton T-Shirt Pack) declared at \u00a3540 (\u00a311.25/pack). Expected range based on market data: \u00a3840-\u00a31,080. Please verify the customs value by uploading a purchase receipt or connecting your sales channel.",
    shipmentId: "ship-001",
    productId: "prod-001",
    createdAt: "2026-02-23",
    status: "open",
    actions: ["Upload purchase receipt", "Connect sales channel", "Confirm declared value"],
  },
  {
    id: "alert-003",
    priority: "medium",
    type: "hs-suggestion",
    title: "HS code reclassification suggested for Children's Waterproof Jacket",
    description: "Based on customs feedback, Children's Waterproof Jacket may be better classified under 6202.93.00.10 (women's/girls' anoraks, of man-made fibres) instead of 6202.93.00.00 (general). Updating the code could reduce duty rates.",
    productId: "prod-002",
    createdAt: "2026-02-22",
    status: "open",
    actions: ["Review suggested HS code", "Update classification", "Dismiss suggestion"],
  },
  {
    id: "alert-004",
    priority: "medium",
    type: "docs-missing",
    title: "Commercial invoice missing for Mexico shipment",
    description: "Shipment FX8847304 to Mexico City requires a commercial invoice for customs clearance. Mexican customs (SAT) will not release the shipment without this document.",
    shipmentId: "ship-005",
    createdAt: "2026-02-25",
    status: "open",
    actions: ["Upload commercial invoice", "Generate invoice from order data"],
  },
  {
    id: "alert-005",
    priority: "low",
    type: "profile-update",
    title: "Complete your business profile for faster clearance",
    description: "Adding your EU VAT registration number and completing broker authorization could reduce your average clearance time by up to 40%.",
    createdAt: "2026-02-20",
    status: "open",
    actions: ["Update business profile", "Add VAT number", "Authorize customs broker"],
  },
];

// ============================================================
// Emails
// ============================================================
export const emails: Email[] = [
  {
    id: "email-001",
    from: "bpost Trade Notifications",
    subject: "Action Required: Shipment #FX8847291 held - value verification needed",
    preview: "Your shipment to Dallas, TX has been flagged for customs value verification...",
    date: "2026-02-23",
    read: false,
    category: "action",
    body: `Dear James Mitchell,

Your shipment #FX8847291 containing 48x Kids Cotton T-Shirt Pack (3pk) has been flagged by U.S. Customs and Border Protection for value verification.

<strong>Issue:</strong> The declared customs value of \u00a3540.00 (\u00a311.25/pack) is below the expected market range of \u00a3840.00 - \u00a31,080.00 for this product category.

<strong>Required Action:</strong> Please verify the shipment value by providing one of the following:
• Purchase receipt or commercial invoice
• Sales channel order confirmation
• Supplier price list

Failure to respond within 5 business days may result in the shipment being returned to origin or assessed at the higher value.`,
    ctaLabel: "Verify Shipment Value",
    ctaLink: "/onboarding",
  },
  {
    id: "email-002",
    from: "bpost Trade Notifications",
    subject: "PGA Hold: CPSIA documentation required for shipment #FX8847295",
    preview: "Your children's clothing shipment to Napa Valley is being held pending PGA review...",
    date: "2026-02-21",
    read: false,
    category: "action",
    body: `Dear James Mitchell,

Your shipment #FX8847295 containing mixed children's clothing is currently held at U.S. Customs under a Partner Government Agency (PGA) review.

<strong>Agency:</strong> Consumer Product Safety Commission (CPSC)
<strong>Requirement:</strong> CPSIA Children's Product Certificate (CPC)

<strong>Details:</strong> All children's products imported into the United States require CPSIA compliance certification. Your shipment includes children's textiles from multiple origins (Bangladesh, China, Turkey) that require individual CPCs with third-party testing evidence.

<strong>Next Steps:</strong>
1. Upload your CPSIA Children's Product Certificate for each product
2. Or provide existing CPC certificate numbers and test reports
3. Contact your customs broker for assistance`,
    ctaLabel: "Resolve PGA Hold",
    ctaLink: "/dashboard/alerts/alert-001",
  },
  {
    id: "email-003",
    from: "bpost Trade Intelligence",
    subject: "Customs clearance update: HS code reclassification suggested",
    preview: "We've identified a potential HS code improvement for your Children's Waterproof Jacket...",
    date: "2026-02-22",
    read: true,
    category: "update",
    body: `Dear James Mitchell,

Based on recent customs feedback and our Data Feedback Loop analysis, we've identified a potential improvement to the HS classification of your Children's Waterproof Jacket.

<strong>Current Classification:</strong> 6202.93.00.00 (Women's/girls' anoraks, of man-made fibres)
<strong>Suggested Classification:</strong> 6202.93.00.10 (Women's/girls' anoraks, of man-made fibres, waterproof)

<strong>Impact:</strong> The more specific classification could:
• Reduce duty rates by up to 2.5%
• Decrease clearance review probability
• Improve data quality for future shipments

This suggestion is based on analysis of your shipment history and customs acceptance patterns.`,
    ctaLabel: "Review Classification",
    ctaLink: "/dashboard/catalog/prod-002",
  },
  {
    id: "email-004",
    from: "bpost Trade Notifications",
    subject: "Your duty & tax estimate is ready - Shipment to Tokyo",
    preview: "We've calculated the landed cost for your 48x Toddler Denim Dungarees shipment to Japan...",
    date: "2026-02-24",
    read: true,
    category: "info",
    body: `Dear James Mitchell,

Your estimated duties and taxes for shipment FX8847301 to Tokyo, Japan are ready.

<strong>Shipment Details:</strong>
• 48x Toddler Denim Dungarees
• Declared Value: \u00a31,536.00
• Origin: Spain → Japan

<strong>Estimated Landed Cost:</strong>
• Customs Duty (10%): \u00a3153.60
• Consumption Tax (10%): \u00a3176.64
• Processing Fee: \u00a325.00
• <strong>Total D&T: \u00a3355.24</strong>

<strong>Tip:</strong> Lock in this estimate with bpost Guaranteed Duties & Taxes to avoid surprises for your customer.`,
    ctaLabel: "View Landed Cost Details",
    ctaLink: "/dashboard/landed-cost",
  },
  {
    id: "email-005",
    from: "bpost Trade Notifications",
    subject: "Document missing: Commercial invoice required for Mexico shipment",
    preview: "Shipment #FX8847304 requires a commercial invoice before customs can process...",
    date: "2026-02-25",
    read: false,
    category: "action",
    body: `Dear James Mitchell,

Your shipment #FX8847304 to Mexico City requires a commercial invoice for customs clearance by Mexican customs authority (SAT).

<strong>Missing Document:</strong> Commercial Invoice
<strong>Shipment Contents:</strong> 12x Boys School Uniform Set, 6x Girls Floral Summer Dress
<strong>Declared Value:</strong> \u00a31,128.00

<strong>Required Information on Invoice:</strong>
• Seller and buyer details
• Detailed product descriptions
• HS codes for each item
• Country of origin
• Unit prices and quantities

You can upload an existing invoice or generate one automatically from your order data.`,
    ctaLabel: "Upload Document",
    ctaLink: "/dashboard/documents/upload",
  },
];

// ============================================================
// Documents
// ============================================================
export const documents: DocItem[] = [
  // ── Origin Documents (company-level, universal) ──
  {
    id: "doc-001",
    name: "Power of Attorney (Customs)",
    type: "Power of Attorney",
    status: "verified",
    uploadDate: "2025-03-10",
    required: true,
    scope: "origin",
  },
  {
    id: "doc-002",
    name: "CBP Form 5106 - Importer Identity",
    type: "CBP Form 5106",
    status: "verified",
    uploadDate: "2025-06-15",
    required: true,
    scope: "origin",
  },
  {
    id: "doc-003",
    name: "EU Export License - Textiles",
    type: "Export License",
    status: "verified",
    uploadDate: "2026-01-01",
    expiryDate: "2026-12-31",
    required: true,
    scope: "origin",
  },
  {
    id: "doc-004",
    name: "Continuous Entry Bond",
    type: "Customs Bond",
    status: "verified",
    uploadDate: "2026-01-15",
    expiryDate: "2027-01-15",
    required: true,
    scope: "origin",
  },
  {
    id: "doc-005",
    name: "Belgian Customs Export Declaration",
    type: "Export Declaration",
    status: "pending",
    uploadDate: "2026-02-25",
    required: true,
    scope: "origin",
  },

  // ── Country-Specific: United States ──
  {
    id: "doc-100",
    name: "CPSC Importer Registration",
    type: "CPSC Registration",
    status: "verified",
    uploadDate: "2025-08-01",
    required: true,
    scope: "country-specific",
    countryCode: "US",
    countryName: "United States",
  },
  {
    id: "doc-101",
    name: "CPSIA Certificate - Kids Cotton T-Shirt Pack",
    type: "CPSIA CPC",
    status: "verified",
    uploadDate: "2026-01-10",
    expiryDate: "2027-01-10",
    productId: "prod-001",
    required: true,
    scope: "country-specific",
    countryCode: "US",
    countryName: "United States",
  },
  {
    id: "doc-102",
    name: "CPSIA Certificate - Children's Waterproof Jacket",
    type: "CPSIA CPC",
    status: "missing",
    productId: "prod-002",
    required: true,
    scope: "country-specific",
    countryCode: "US",
    countryName: "United States",
  },
  {
    id: "doc-103",
    name: "CPSIA Certificate - Boys School Uniform Set",
    type: "CPSIA CPC",
    status: "pending",
    uploadDate: "2026-02-20",
    productId: "prod-005",
    required: true,
    scope: "country-specific",
    countryCode: "US",
    countryName: "United States",
  },
  {
    id: "doc-104",
    name: "CPSC Prior Notice - Textile Import 2026",
    type: "CPSC Prior Notice",
    status: "verified",
    uploadDate: "2026-02-01",
    required: true,
    scope: "country-specific",
    countryCode: "US",
    countryName: "United States",
  },
  {
    id: "doc-105",
    name: "CPSC Product Registration",
    type: "CPSC Registration",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "US",
    countryName: "United States",
  },

  // ── Country-Specific: Canada ──
  {
    id: "doc-200",
    name: "CFIA Import License (Textiles)",
    type: "Import License",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "CA",
    countryName: "Canada",
  },
  {
    id: "doc-201",
    name: "Canada Consumer Product Safety Act Declaration",
    type: "Safety Declaration",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "CA",
    countryName: "Canada",
  },
  {
    id: "doc-202",
    name: "Canada Border Services Declaration",
    type: "Customs Declaration",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "CA",
    countryName: "Canada",
  },

  // ── Country-Specific: Mexico ──
  {
    id: "doc-300",
    name: "COFEPRIS Product Safety Permit (Children's Clothing)",
    type: "Safety Permit",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "MX",
    countryName: "Mexico",
  },
  {
    id: "doc-301",
    name: "SAT Import License",
    type: "Import License",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "MX",
    countryName: "Mexico",
  },
  {
    id: "doc-302",
    name: "NOM Certification",
    type: "Standards Certification",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "MX",
    countryName: "Mexico",
  },

  // ── Country-Specific: EU ──
  {
    id: "doc-400",
    name: "EMCS Movement Document",
    type: "Excise Document",
    status: "verified",
    uploadDate: "2026-02-10",
    required: true,
    scope: "country-specific",
    countryCode: "EU",
    countryName: "European Union",
  },
  {
    id: "doc-401",
    name: "EU Textile Labelling Compliance",
    type: "Textile Certificate",
    status: "pending",
    uploadDate: "2026-02-22",
    required: true,
    scope: "country-specific",
    countryCode: "EU",
    countryName: "European Union",
  },
  {
    id: "doc-402",
    name: "EU CE Marking Declaration",
    type: "CE Declaration",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "EU",
    countryName: "European Union",
  },

  // ── Country-Specific: Japan ──
  {
    id: "doc-500",
    name: "MHLW Import Notification",
    type: "Import Notification",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "JP",
    countryName: "Japan",
  },
  {
    id: "doc-501",
    name: "Japan Textile Product Quality Labelling",
    type: "Quality Label Declaration",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "JP",
    countryName: "Japan",
  },
  {
    id: "doc-502",
    name: "JAS Organic Certification",
    type: "Organic Certification",
    status: "missing",
    required: true,
    scope: "country-specific",
    countryCode: "JP",
    countryName: "Japan",
  },
];

// ============================================================
// Integrations
// ============================================================
export const integrations: Integration[] = [
  {
    id: "int-001",
    name: "Shopify",
    channel: "shopify",
    description: "Connect your Shopify store to auto-import products, orders, and sync inventory.",
    connected: true,
    lastSync: "2026-02-27 09:15",
    productsImported: 247,
  },
  {
    id: "int-002",
    name: "eBay",
    channel: "ebay",
    description: "Connect your eBay seller account to import listings and manage cross-border orders.",
    connected: true,
    lastSync: "2026-02-27 08:30",
    productsImported: 183,
  },
  {
    id: "int-003",
    name: "Amazon",
    channel: "amazon",
    description: "Connect Amazon Seller Central to manage FBA and merchant-fulfilled international orders.",
    connected: false,
  },
  {
    id: "int-004",
    name: "Walmart",
    channel: "walmart",
    description: "Connect Walmart Marketplace for cross-border order management.",
    connected: false,
  },
  {
    id: "int-005",
    name: "Etsy",
    channel: "etsy",
    description: "Connect your Etsy shop to import handmade and vintage product listings.",
    connected: false,
  },
  {
    id: "int-006",
    name: "SAP",
    channel: "sap",
    description: "Enterprise ERP integration for automated trade compliance workflows.",
    connected: false,
  },
  {
    id: "int-007",
    name: "Oracle",
    channel: "oracle",
    description: "Oracle TMS integration for transportation and trade management.",
    connected: false,
  },
];

// ============================================================
// Landed Cost History
// ============================================================
export type LandedCostCalculation = {
  id: string;
  date: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  description: string;
  hsCode: string;
  quantity: number;
  declaredValue: number;
  shipping: number;
  weight: number;
  dutyRate: string;
  duty: number;
  tax: number;
  mpf: number;
  hmf: number;
  total: number;
  guaranteed: boolean;
};

export const landedCostHistory: LandedCostCalculation[] = [
  {
    id: "lc-001",
    date: "2026-02-27",
    origin: "Belgium",
    originCode: "BE",
    destination: "United States",
    destinationCode: "US",
    description: "Kids Cotton T-Shirt Pack (3pk)",
    hsCode: "6109.10.00.40",
    quantity: 12,
    declaredValue: 540,
    shipping: 85,
    weight: 14.4,
    dutyRate: "15%",
    duty: 360.0,
    tax: 48.6,
    mpf: 27.5,
    hmf: 8.1,
    total: 444.2,
    guaranteed: true,
  },
  {
    id: "lc-002",
    date: "2026-02-25",
    origin: "Belgium",
    originCode: "BE",
    destination: "Japan",
    destinationCode: "JP",
    description: "Toddler Denim Dungarees",
    hsCode: "6204.62.40.00",
    quantity: 48,
    declaredValue: 1536,
    shipping: 220,
    weight: 57.6,
    dutyRate: "15%",
    duty: 230.4,
    tax: 176.64,
    mpf: 0,
    hmf: 0,
    total: 816.04,
    guaranteed: false,
  },
  {
    id: "lc-003",
    date: "2026-02-22",
    origin: "Belgium",
    originCode: "BE",
    destination: "Canada",
    destinationCode: "CA",
    description: "Children's Waterproof Jacket",
    hsCode: "6202.93.00.00",
    quantity: 24,
    declaredValue: 1560,
    shipping: 145,
    weight: 36,
    dutyRate: "5%",
    duty: 78.0,
    tax: 213.72,
    mpf: 0,
    hmf: 0,
    total: 291.72,
    guaranteed: true,
  },
  {
    id: "lc-004",
    date: "2026-02-18",
    origin: "Belgium",
    originCode: "BE",
    destination: "Mexico",
    destinationCode: "MX",
    description: "Boys School Uniform Set",
    hsCode: "6203.42.40.00",
    quantity: 6,
    declaredValue: 510,
    shipping: 65,
    weight: 7.8,
    dutyRate: "20%",
    duty: 102.0,
    tax: 97.92,
    mpf: 0,
    hmf: 0,
    total: 199.92,
    guaranteed: false,
  },
  {
    id: "lc-005",
    date: "2026-02-15",
    origin: "Belgium",
    originCode: "BE",
    destination: "United States",
    destinationCode: "US",
    description: "Baby Organic Sleepsuit (Set of 3)",
    hsCode: "6111.20.90.00",
    quantity: 4,
    declaredValue: 480,
    shipping: 55,
    weight: 9.6,
    dutyRate: "6.5%",
    duty: 31.2,
    tax: 40.48,
    mpf: 27.5,
    hmf: 4.28,
    total: 103.46,
    guaranteed: false,
  },
  {
    id: "lc-006",
    date: "2026-02-10",
    origin: "Belgium",
    originCode: "BE",
    destination: "Australia",
    destinationCode: "AU",
    description: "Girls Floral Summer Dress",
    hsCode: "6204.42.00.00",
    quantity: 36,
    declaredValue: 648,
    shipping: 180,
    weight: 39.6,
    dutyRate: "5%",
    duty: 32.4,
    tax: 86.04,
    mpf: 0,
    hmf: 0,
    total: 118.44,
    guaranteed: true,
  },
];

// ============================================================
// Dashboard KPIs
// ============================================================
export const dashboardKPIs = {
  activeShipments: { value: 47, trend: "+5" },
  clearanceRate: { value: 94.2, trend: "+3.1%" },
  avgClearanceTime: { value: 1.2, unit: "days", trend: "-0.5 days" },
  itemsInCage: { value: 3, details: "2 PGA, 1 value dispute" },
  pendingDocuments: { value: 5, trend: "-2" },
};

// ============================================================
// Helper: get product by ID
// ============================================================
export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getShipment(id: string): Shipment | undefined {
  return shipments.find((s) => s.id === id);
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getAlert(id: string): Alert | undefined {
  return alerts.find((a) => a.id === id);
}
