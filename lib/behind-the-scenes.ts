import {
  type LucideIcon,
  Zap,
  Package,
  Calculator,
} from "lucide-react";

export type SourceKey = "rm-classify" | "rm-systems" | "derived";

export type ISource = {
  accent: string;
  border: string;
  color: string;
  description: string;
  icon: LucideIcon;
  label: string;
};

export const sources: Record<SourceKey, ISource> = {
  "rm-classify": {
    accent: "#ffa050",
    border: "border-[#da202a]",
    color: "#da202a",
    description:
      "Classification, landed cost, duty & compliance engine",
    icon: Zap,
    label: "bpost Classify",
  },
  "rm-systems": {
    accent: "#c9a0f0",
    border: "border-[#2a2a2d]",
    color: "#2a2a2d",
    description:
      "Shipment tracking, customs holds, cage status & documents",
    icon: Package,
    label: "bpost Systems",
  },
  derived: {
    accent: "#a78bfa",
    border: "border-[#7c3aed]",
    color: "#8b5cf6",
    description: "Calculated from combined bpost data sources",
    icon: Calculator,
    label: "Derived / Computed",
  },
};

export type IPageComponent = {
  apiCall: string;
  id: string;
  notes: string;
  section: string;
  sources: SourceKey[];
  title: string;
  value: string;
};

export type IPageConfig = {
  components: IPageComponent[];
  subtitle: string;
  title: string;
};

export const pageConfigs: Record<string, IPageConfig> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Aggregated view of all clearance operations",
    components: [
      {
        id: "active_shipments",
        title: "Active Shipments",
        value: "47",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes:
          "Count of in-flight shipments from bpost order/shipment data",
        apiCall: "query { shipments(status: ACTIVE) { totalCount } }",
      },
      {
        id: "clearance_rate",
        title: "Clearance Rate",
        value: "94.2%",
        section: "KPI Bar",
        sources: ["derived"],
        notes:
          "Ratio of cleared vs. total shipments over rolling window — combines bpost shipment counts with bpost clearance outcomes",
        apiCall: "Computed: (rm.cleared / rm.totalShipments) × 100",
      },
      {
        id: "avg_clearance",
        title: "Avg Clearance Time",
        value: "1.2 days",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes:
          "Average time from shipment creation to customs release, tracked via bpost lifecycle events",
        apiCall: "query { clearanceMetrics { avgDays delta } }",
      },
      {
        id: "items_cage",
        title: "Items in Cage",
        value: "3",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes:
          "Physical items held at bpost customs warehouse pending inspection or documentation — includes PGA and value dispute flags",
        apiCall: "GET /v1/customs/cage-items?status=held",
      },
      {
        id: "pending_docs",
        title: "Pending Documents",
        value: "5",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes:
          "Documents awaiting submission or approval in bpost brokerage system — certificates, invoices, compliance forms",
        apiCall: "GET /v1/customs/documents?status=pending",
      },
      {
        id: "action_items",
        title: "Action Items",
        value: "5 alerts",
        section: "Action Items",
        sources: ["rm-classify", "rm-systems"],
        notes:
          "Aggregated from both systems — HS reclassifications & value checks from bpost, FDA holds & missing docs from bpost",
        apiCall: "Combined: rm.alerts + rm.holds + rm.docRequests",
      },
      {
        id: "recent_shipments",
        title: "Recent Shipments",
        value: "5 shown",
        section: "Shipments Table",
        sources: ["rm-classify", "rm-systems"],
        notes:
          "Shipment list from bpost (tracking #, destination, items, value) enriched with real-time status from bpost (Caged, Customs Hold, Cleared, In Transit)",
        apiCall:
          'query { shipments(limit:5) { tracking destination items value } } → enriched with GET /v1/track/{id}',
      },
    ],
  },

  "/dashboard/shipments": {
    title: "Shipments",
    subtitle: "Track and manage customs clearance for every shipment",
    components: [
      {
        id: "shipment_count",
        title: "Total Shipments",
        value: "156",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Total shipments created via bpost shipment API",
        apiCall: "query { shipments { totalCount } }",
      },
      {
        id: "in_transit",
        title: "In Transit",
        value: "47",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes: "Shipments with bpost tracking status IN_TRANSIT",
        apiCall: "GET /v1/track/status-summary?status=IN_TRANSIT",
      },
      {
        id: "customs_held",
        title: "Customs Held",
        value: "3",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes: "Shipments held by customs authorities — real-time from bpost customs hold system",
        apiCall: "GET /v1/customs/holds?status=active",
      },
      {
        id: "clearance_avg",
        title: "Avg Clearance",
        value: "1.2 days",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Average clearance time combining bpost creation timestamp with bpost release event",
        apiCall: "Computed: avg(rm.releaseTime - rm.createdAt)",
      },
      {
        id: "shipment_list",
        title: "Shipment List",
        value: "Filterable table",
        section: "Main Table",
        sources: ["rm-classify", "rm-systems"],
        notes: "Filterable list with tracking, origin, destination, status, value. bpost provides shipment data; bpost provides tracking status",
        apiCall: "query { shipments(filter) { tracking origin destination status } }",
      },
      {
        id: "shipment_detail",
        title: "Shipment Detail",
        value: "Full timeline",
        section: "Detail View",
        sources: ["rm-classify", "rm-systems"],
        notes: "Full shipment timeline, items, documents, and costs. bpost landed cost data merged with bpost tracking milestones",
        apiCall: "query { shipment(id) { items timeline costs documents } }",
      },
    ],
  },

  "/dashboard/orders": {
    title: "Orders",
    subtitle: "Multi-platform order ingestion and fulfillment",
    components: [
      {
        id: "total_orders",
        title: "Total Orders",
        value: "1,247",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "All orders across all connected platforms, normalized by bpost Order API",
        apiCall: "query { orders { totalCount } }",
      },
      {
        id: "pending_fulfillment",
        title: "Pending Fulfillment",
        value: "23",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Orders awaiting shipment creation in bpost fulfillment queue",
        apiCall: "query { orders(status: PENDING_FULFILLMENT) { totalCount } }",
      },
      {
        id: "platform_breakdown",
        title: "Platform Breakdown",
        value: "4 platforms",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Order count per platform (Shopify, eBay, Amazon, Walmart) computed from bpost order metadata",
        apiCall: "Computed: GROUP BY order.platform",
      },
      {
        id: "order_table",
        title: "Order Table",
        value: "Unified view",
        section: "Main Table",
        sources: ["rm-classify"],
        notes: "All orders from all platforms in one filterable view — bpost normalizes order data from Shopify, eBay, Amazon, Walmart webhooks",
        apiCall: "query { orders(filter) { id platform items total status } }",
      },
      {
        id: "order_detail",
        title: "Order Detail",
        value: "Per-order view",
        section: "Detail View",
        sources: ["rm-classify", "rm-systems"],
        notes: "Full order with items, landed cost breakdown, and fulfillment status. bpost Ship API handles label creation",
        apiCall: "query { order(id) { items landedCost fulfillment } }",
      },
    ],
  },

  "/dashboard/catalog": {
    title: "Product Catalog",
    subtitle: "Synchronized product data with HS classification",
    components: [
      {
        id: "total_products",
        title: "Total Products",
        value: "2,847",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Products synced from connected platforms via bpost product sync",
        apiCall: "query { products { totalCount } }",
      },
      {
        id: "classified",
        title: "Classified",
        value: "2,614",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Products with validated HS codes from bpost Classify AI",
        apiCall: "query { products(hasHsCode: true) { totalCount } }",
      },
      {
        id: "pending_review",
        title: "Pending Review",
        value: "233",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Products needing classification review — computed from total minus classified",
        apiCall: "Computed: total - classified",
      },
      {
        id: "product_table",
        title: "Product List",
        value: "Full catalog",
        section: "Main Table",
        sources: ["rm-classify"],
        notes: "Complete product list with HS codes, duty rates, and compliance flags. Sourced from bpost product and classification databases",
        apiCall: "query { products(filter) { name sku hsCode dutyRate } }",
      },
      {
        id: "classification_db",
        title: "Classification History",
        value: "Persistent store",
        section: "Detail View",
        sources: ["rm-classify", "rm-systems"],
        notes: "HS code assignment history validated against bpost Trade Networks tariff schedules",
        apiCall: "query { classificationHistory(productId) { hsCode confidence validatedAt } }",
      },
    ],
  },

  "/dashboard/classify": {
    title: "AI Classification",
    subtitle: "ML-powered HS code classification with PGA screening",
    components: [
      {
        id: "classify_input",
        title: "Product Input",
        value: "Submission form",
        section: "Input",
        sources: ["rm-classify"],
        notes: "Product description, images, and attributes submitted for classification via bpost Classify API",
        apiCall: "mutation { classify(input: { description, images }) { hsCode confidence } }",
      },
      {
        id: "hs_result",
        title: "HS Code Result",
        value: "6-10 digit code",
        section: "Results",
        sources: ["rm-classify"],
        notes: "Predicted HS code with confidence score and alternative suggestions from bpost AI model trained on millions of mappings",
        apiCall: "query { classifyResult { hsCode confidence alternatives } }",
      },
      {
        id: "pga_flags",
        title: "PGA Flags",
        value: "Agency alerts",
        section: "Results",
        sources: ["rm-classify", "rm-systems"],
        notes: "Required permits and prior notices from FDA, TTB, USDA, EPA. bpost screens against PGA rules; bpost GHS database validates tariff schedules",
        apiCall: "query { pgaScreening(hsCode) { agency requirement status } }",
      },
      {
        id: "confidence_score",
        title: "Confidence Score",
        value: "97.3%",
        section: "Results",
        sources: ["rm-classify"],
        notes: "ML model confidence in the predicted HS code, based on training data similarity",
        apiCall: "Included in classify mutation response",
      },
    ],
  },

  "/dashboard/landed-cost": {
    title: "Landed Cost",
    subtitle: "Complete duty, tax, and fee calculation engine",
    components: [
      {
        id: "total_quotes",
        title: "Total Quotes",
        value: "3,412",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Landed cost quotes generated by bpost Landed Cost API",
        apiCall: "query { landedCostQuotes { totalCount } }",
      },
      {
        id: "accuracy_rate",
        title: "Accuracy Rate",
        value: "99.7%",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Percentage of quotes where actual duties matched quoted amounts — tracks LCG guarantee claims",
        apiCall: "Computed: (totalQuotes - claimsCount) / totalQuotes × 100",
      },
      {
        id: "avg_duty_rate",
        title: "Avg Duty Rate",
        value: "4.8%",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Average duty percentage across all quotes, sourced from bpost tariff database covering 180+ countries",
        apiCall: "query { landedCostMetrics { avgDutyRate } }",
      },
      {
        id: "cost_breakdown",
        title: "Cost Breakdown",
        value: "Itemized view",
        section: "Calculator",
        sources: ["rm-classify", "rm-systems"],
        notes: "Itemized breakdown of duties, taxes, fees, and total landed cost. bpost calculates; bpost provides proprietary duty/tax reference data for trade lanes",
        apiCall: "query { landedCost(items, destination) { duties taxes fees total } }",
      },
      {
        id: "lcg_status",
        title: "LCG Status",
        value: "Active",
        section: "Guarantee",
        sources: ["rm-classify"],
        notes: "Landed Cost Guarantee status — bpost covers any difference between quoted and actual costs",
        apiCall: "query { lcgStatus { active claimCount totalSaved } }",
      },
      {
        id: "quote_history",
        title: "Quote History",
        value: "Audit trail",
        section: "History",
        sources: ["rm-classify"],
        notes: "Historical landed cost quotes with accuracy tracking and guarantee claim records",
        apiCall: "query { quoteHistory(filter) { quote actual difference claimStatus } }",
      },
    ],
  },

  "/dashboard/documents": {
    title: "Documents",
    subtitle: "Electronic trade document management and PGA submissions",
    components: [
      {
        id: "total_docs",
        title: "Total Documents",
        value: "892",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes: "Trade documents stored in the system — commercial invoices, certificates, PGA forms via bpost ETD",
        apiCall: "GET /v1/documents/count",
      },
      {
        id: "pending_submission",
        title: "Pending Submission",
        value: "5",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes: "Documents awaiting submission to customs or PGA systems",
        apiCall: "GET /v1/documents?status=pending",
      },
      {
        id: "compliance_rate",
        title: "Compliance Rate",
        value: "98.5%",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Percentage of documents passing compliance validation on first submission — combines bpost validation with bpost acceptance rate",
        apiCall: "Computed: (accepted / totalSubmissions) × 100",
      },
      {
        id: "doc_library",
        title: "Document Library",
        value: "Organized by shipment",
        section: "Main Table",
        sources: ["rm-classify", "rm-systems"],
        notes: "All trade documents organized by shipment. bpost auto-generates commercial invoices; bpost ETD handles electronic submission",
        apiCall: "query { documents(filter) { type shipmentId status submittedAt } }",
      },
      {
        id: "submission_status",
        title: "Submission Status",
        value: "Real-time tracking",
        section: "Status Panel",
        sources: ["rm-systems"],
        notes: "Real-time status of document submissions to customs and PGA systems via bpost",
        apiCall: "GET /v1/documents/{id}/status",
      },
    ],
  },

  "/dashboard/alerts": {
    title: "Alerts",
    subtitle: "Real-time customs events and compliance notifications",
    components: [
      {
        id: "active_alerts",
        title: "Active Alerts",
        value: "8",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes: "Active customs events: holds, exams, rejections from bpost customs feed",
        apiCall: "GET /v1/customs/alerts?status=active",
      },
      {
        id: "critical_count",
        title: "Critical",
        value: "2",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "High-severity alerts requiring immediate attention — scored by bpost compliance engine from bpost event data",
        apiCall: "Computed: alerts.filter(severity >= CRITICAL).length",
      },
      {
        id: "pga_holds",
        title: "PGA Holds",
        value: "3",
        section: "KPI Bar",
        sources: ["rm-systems"],
        notes: "Government agency holds — FDA detentions, TTB holds, USDA quarantine from bpost PGA notifications",
        apiCall: "GET /v1/customs/pga-holds?status=active",
      },
      {
        id: "alert_feed",
        title: "Alert Feed",
        value: "Priority-ranked",
        section: "Alert List",
        sources: ["rm-classify", "rm-systems"],
        notes: "Priority-ranked alerts with status and recommended actions. bpost compliance engine analyzes and prioritizes bpost customs events",
        apiCall: "query { alerts(filter) { severity type shipment action } }",
      },
      {
        id: "alert_detail",
        title: "Alert Detail",
        value: "Resolution steps",
        section: "Detail View",
        sources: ["rm-classify", "rm-systems"],
        notes: "Full alert context with resolution steps, required documents, and timeline. bpost recommends actions based on bpost hold data",
        apiCall: "query { alert(id) { context resolution documents timeline } }",
      },
    ],
  },

  "/dashboard/integrations": {
    title: "Integrations",
    subtitle: "Connected platforms, ERPs, and carrier systems",
    components: [
      {
        id: "connected_platforms",
        title: "Connected Platforms",
        value: "4",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Active platform integrations managed by bpost middleware — Shopify, eBay, Amazon, Walmart",
        apiCall: "query { integrations(status: CONNECTED) { totalCount } }",
      },
      {
        id: "sync_status",
        title: "Sync Status",
        value: "All healthy",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Overall health of all integrations — computed from individual sync timestamps and error rates",
        apiCall: "Computed: integrations.every(i => i.lastSync < 5min && i.errorRate < 1%)",
      },
      {
        id: "events_today",
        title: "Events Today",
        value: "1,247",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Webhooks and API calls processed today across all integrations via bpost middleware",
        apiCall: "query { integrationMetrics(today: true) { totalEvents } }",
      },
      {
        id: "integration_list",
        title: "Integration Status",
        value: "Per-platform health",
        section: "Main Table",
        sources: ["rm-classify"],
        notes: "Connection health, sync status, and error rates per platform. Managed by bpost middleware with webhook management and retry logic",
        apiCall: "query { integrations { platform status lastSync errorRate } }",
      },
      {
        id: "data_flow",
        title: "Data Flow Monitor",
        value: "Real-time stream",
        section: "Monitor",
        sources: ["rm-classify"],
        notes: "Real-time view of orders, products, and events flowing through each integration via bpost event stream",
        apiCall: "subscription { integrationEvents { platform type payload timestamp } }",
      },
    ],
  },

  "/dashboard/profile": {
    title: "Profile",
    subtitle: "Account configuration and broker assignment",
    components: [
      {
        id: "company_info",
        title: "Company Profile",
        value: "Rosie & Jack",
        section: "Company",
        sources: ["rm-classify"],
        notes: "Company details, address, and trade preferences stored in bpost organization settings",
        apiCall: "query { organization { name address preferences } }",
      },
      {
        id: "broker_info",
        title: "Broker Assignment",
        value: "bpost Brokerage",
        section: "Compliance",
        sources: ["rm-systems"],
        notes: "Assigned customs broker details and power-of-attorney status from bpost broker system",
        apiCall: "GET /v1/account/broker",
      },
      {
        id: "compliance_certs",
        title: "Compliance Certs",
        value: "3 active",
        section: "Compliance",
        sources: ["rm-systems"],
        notes: "Active compliance certifications and trade registrations managed by bpost account system",
        apiCall: "GET /v1/account/certifications",
      },
      {
        id: "user_management",
        title: "User Management",
        value: "5 users",
        section: "Team",
        sources: ["rm-classify"],
        notes: "Organization users and permission settings via bpost Org API",
        apiCall: "query { users { name role permissions } }",
      },
    ],
  },

  "/dashboard/analytics": {
    title: "Analytics",
    subtitle: "Trade performance insights and AI recommendations",
    components: [
      {
        id: "clearance_trend",
        title: "Clearance Trend",
        value: "↑ 3.2%",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Clearance rate trend over past 30 days — combines bpost performance data with bpost analytics engine",
        apiCall: "Computed: trendLine(clearanceRates, 30d)",
      },
      {
        id: "cost_savings",
        title: "Cost Savings",
        value: "\u00a312,400",
        section: "KPI Bar",
        sources: ["derived"],
        notes: "Estimated savings from optimal HS classification and duty planning — ML-powered by bpost AI",
        apiCall: "Computed: sum(optimalDuty - actualDuty)",
      },
      {
        id: "volume_trend",
        title: "Volume Trend",
        value: "1,247 orders",
        section: "KPI Bar",
        sources: ["rm-classify"],
        notes: "Order volume trend from bpost analytics engine aggregating across all platforms",
        apiCall: "query { analytics { volumeTrend { period count } } }",
      },
      {
        id: "performance_charts",
        title: "Performance Charts",
        value: "Multi-metric",
        section: "Charts",
        sources: ["rm-classify", "rm-systems"],
        notes: "Clearance rates, duty costs, volume trends, and trade lane analysis. bpost analytics aggregates data from bpost carrier metrics and order history",
        apiCall: "query { analytics { charts { clearance duty volume tradeLanes } } }",
      },
      {
        id: "ai_recommendations",
        title: "AI Recommendations",
        value: "3 suggestions",
        section: "Insights",
        sources: ["rm-classify"],
        notes: "Actionable ML-powered insights on cost optimization, routing, and compliance from bpost AI engine",
        apiCall: "query { aiRecommendations { type impact action confidence } }",
      },
    ],
  },
};
