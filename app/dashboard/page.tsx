"use client";

import {
  Package,
  CheckCircle,
  Clock,
  Shield,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  PoundSterling,
  ScanSearch,
  Building2,
  TrendingUp,
  Zap,
  Brain,
  Eye,
  Scale,
  Globe2,
  FileCheck2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/fedex/page-header";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  FedExTable,
  FedExTableRow,
  FedExTableCell,
} from "@/components/fedex/fedex-table";
import { FedExSection } from "@/components/fedex/section";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const kpiCards = [
  {
    title: "Parcels Processed Today",
    value: "145,230",
    trend: "+8.3% vs yesterday",
    trendUp: true,
    icon: Package,
  },
  {
    title: "Export Pass Rate (Network)",
    value: "94.1%",
    trend: "+0.6% this week",
    trendUp: true,
    icon: CheckCircle,
  },
  {
    title: "Screening Alerts",
    value: "23",
    trend: "12 critical, 11 review",
    trendUp: null,
    icon: ScanSearch,
  },
  {
    title: "PDDP Settlement Pending",
    value: "€142,860",
    trend: "5 partners awaiting settlement",
    trendUp: null,
    icon: PoundSterling,
  },
  {
    title: "Avg Clearance Time",
    value: "1.4 days",
    trend: "-0.2 days",
    trendUp: false,
    icon: Clock,
  },
];

const dailyVolumeData = [
  { day: "Mon", parcels: 128450 },
  { day: "Tue", parcels: 134200 },
  { day: "Wed", parcels: 141800 },
  { day: "Thu", parcels: 138900 },
  { day: "Fri", parcels: 145230 },
  { day: "Sat", parcels: 112600 },
  { day: "Sun", parcels: 98400 },
];

const passRateByCustomer = [
  { customer: "Sterling Medical", rate: 98.2 },
  { customer: "Cotswold Artisan", rate: 96.8 },
  { customer: "Rosie & Jack", rate: 95.4 },
  { customer: "Britannia Fashion", rate: 93.1 },
  { customer: "Thames Valley Elec.", rate: 89.7 },
];

const screeningAlertsData = [
  { category: "Sanctions", count: 5 },
  { category: "Restricted Goods", count: 6 },
  { category: "Value Fraud", count: 4 },
  { category: "HS Mismatch", count: 5 },
  { category: "Address", count: 3 },
];

const pddpSettlementData = [
  { partner: "La Poste", amount: 42300 },
  { partner: "Deutsche Post", amount: 38600 },
  { partner: "PostNL", amount: 28400 },
  { partner: "Correos", amount: 19800 },
  { partner: "bpost", amount: 13760 },
];

const topAccounts = [
  {
    name: "Rosie & Jack Kidswear",
    shipments: 2340,
    passRate: 95.4,
    compliance: 93,
    revenue: "€184,200",
    status: "active" as const,
  },
  {
    name: "Thames Valley Electronics",
    shipments: 4120,
    passRate: 89.7,
    compliance: 82,
    revenue: "€312,400",
    status: "review" as const,
  },
  {
    name: "Britannia Fashion Group",
    shipments: 3890,
    passRate: 93.1,
    compliance: 90,
    revenue: "€267,800",
    status: "active" as const,
  },
  {
    name: "Highland Spirits Co.",
    shipments: 1560,
    passRate: 94.8,
    compliance: 95,
    revenue: "€142,600",
    status: "active" as const,
  },
  {
    name: "Cotswold Artisan Foods",
    shipments: 980,
    passRate: 96.8,
    compliance: 97,
    revenue: "€89,300",
    status: "active" as const,
  },
  {
    name: "Sterling Medical Supplies",
    shipments: 2780,
    passRate: 98.2,
    compliance: 99,
    revenue: "€423,100",
    status: "active" as const,
  },
  {
    name: "Camden Cycle Works",
    shipments: 670,
    passRate: 91.2,
    compliance: 86,
    revenue: "€54,200",
    status: "review" as const,
  },
  {
    name: "Pembroke Heritage Crafts",
    shipments: 420,
    passRate: 97.1,
    compliance: 96,
    revenue: "€31,800",
    status: "active" as const,
  },
];

const statusDotColor: Record<string, "green" | "orange" | "red"> = {
  active: "green",
  review: "orange",
  suspended: "red",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  review: "Under Review",
  suspended: "Suspended",
};

const operationalAlerts = [
  {
    severity: "critical",
    time: "14 min ago",
    message:
      "OFSI sanctions list updated - 3 shipments require re-screening across 2 customer accounts",
  },
  {
    severity: "warning",
    time: "42 min ago",
    message:
      "Deutsche Post settlement deadline approaching - €38,600 due by end of business tomorrow",
  },
  {
    severity: "critical",
    time: "1 hr ago",
    message:
      "High-value shipment flagged for Thames Valley Electronics - declared value €18,400, expected range €2,000-€5,000",
  },
  {
    severity: "info",
    time: "2 hr ago",
    message:
      "EU tariff schedule update effective 1 April - 142 HS codes affected across active customer base",
  },
  {
    severity: "warning",
    time: "3 hr ago",
    message:
      "Camden Cycle Works compliance score dropped below 88% threshold - auto-review triggered",
  },
];

const severityColor: Record<string, "red" | "orange" | "blue"> = {
  critical: "red",
  warning: "orange",
  info: "blue",
};

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <PageHeader
          title="Operations Dashboard"
          description="REAL-TIME OVERVIEW OF ROYAL MAIL CUSTOMS CLEARANCE OPERATIONS"
        />
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="h-1.5 bg-bp-red" />
          <div className="px-5 py-3 text-center">
            <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
              Network Pass Rate
            </p>
            <p className="text-2xl font-bold text-bp-green mt-1">94.1%</p>
            <p className="text-xs text-bp-green font-medium mt-0.5">
              +0.6% this week
            </p>
          </div>
        </div>
      </div>

      {/* Zonos Intelligence Bar */}
      <div className="flex items-center gap-6 px-4 py-2.5 bg-gradient-to-r from-bp-red/5 via-bp-red/3 to-transparent border border-bp-red/10 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-bp-red" />
          <span className="text-xs font-bold text-bp-red tracking-wide">POWERED BY ZONOS</span>
        </div>
        <div className="h-4 w-px bg-bp-red/20" />
        <div className="flex items-center gap-6 text-xs text-bp-gray">
          <span className="flex items-center gap-1"><Brain className="h-3 w-3" /> 14,200 classifications today</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 2,034 screenings processed</span>
          <span className="flex items-center gap-1"><Scale className="h-3 w-3" /> 8,450 landed cost quotes</span>
          <span className="flex items-center gap-1"><Globe2 className="h-3 w-3" /> 200+ countries</span>
          <span className="flex items-center gap-1"><FileCheck2 className="h-3 w-3" /> 87ms avg response</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const isGood = kpi.trendUp;

          return (
            <div
              key={kpi.title}
              className="px-4 py-4 space-y-2 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">
                  {kpi.title}
                </span>
                <Icon className="h-4 w-4 text-bp-gray" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {isGood === true && (
                  <>
                    <ArrowUp className="h-3 w-3 text-bp-green" />
                    <span className="text-bp-green">{kpi.trend}</span>
                  </>
                )}
                {isGood === false && (
                  <>
                    <ArrowDown className="h-3 w-3 text-bp-green" />
                    <span className="text-bp-green">{kpi.trend}</span>
                  </>
                )}
                {isGood === null && (
                  <span className="text-bp-gray">{kpi.trend}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2x2 Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Volume */}
        <FedExSection
          title="Daily Volume (7 days)"
          action={
            <span className="flex items-center gap-1 text-bp-green text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              145,230 today
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
              />
              <Tooltip
                formatter={(v: number) => [
                  v.toLocaleString(),
                  "Parcels",
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                }}
              />
              <Line
                type="monotone"
                dataKey="parcels"
                stroke="#da202a"
                strokeWidth={2}
                dot={{ fill: "#da202a", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </FedExSection>

        {/* Pass Rate by Customer */}
        <FedExSection title="Pass Rate by Customer (Top 5)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={passRateByCustomer} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                domain={[85, 100]}
              />
              <YAxis
                type="category"
                dataKey="customer"
                tick={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Pass Rate"]}
                cursor={false}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                }}
              />
              <Bar dataKey="rate" fill="#00a651" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FedExSection>

        {/* Screening Alerts by Category */}
        <FedExSection title="Screening Alerts by Category">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={screeningAlertsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: number) => [v, "Alerts"]}
                cursor={false}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                }}
              />
              <Bar dataKey="count" fill="#da202a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FedExSection>

        {/* PDDP Settlement by Partner */}
        <FedExSection title="PDDP Settlement by Partner">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pddpSettlementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="partner" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) =>
                  `€${(v / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(v: number) => [
                  `€${v.toLocaleString()}`,
                  "Pending",
                ]}
                cursor={false}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                }}
              />
              <Bar dataKey="amount" fill="#2a2a2d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FedExSection>
      </div>

      {/* Zonos Advantage - Before & After */}
      <div className="bg-gradient-to-br from-card via-card to-bp-red/3 border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-bp-red/5">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-bp-red" />
            <h2 className="text-lg font-bold text-foreground">The Zonos Advantage</h2>
          </div>
          <p className="text-xs text-bp-gray mt-1">How Zonos transforms bpost's customs clearance operations</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Before Zonos</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "HS Classification", desc: "Manual lookup, error-prone, 3-5 min per item" },
                { label: "Landed Cost", desc: "Spreadsheet estimates, frequently inaccurate" },
                { label: "Screening", desc: "Batch processing overnight, next-day results" },
                { label: "Reconciliation", desc: "Manual comparison across 4+ systems" },
                { label: "Fraud Detection", desc: "Reactive - discovered at customs, post-dispatch" },
                { label: "Data Quality", desc: "Inconsistent, no confidence scoring" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-medium text-gray-500">{item.label}:</span>
                    <span className="text-gray-400 ml-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-bp-red flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-bp-red uppercase tracking-wide">With Zonos</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "AI Classification", desc: "Instant HS codes via text or image (Zonos Vision), 94%+ accuracy, full audit trail", highlight: true },
                { label: "Real-time Landed Cost", desc: "Sub-second API, 200+ countries, guaranteed quotes with Zonos Collect payment links", highlight: true },
                { label: "Live Screening", desc: "Real-time restricted party, sanctions & goods screening - block before dispatch", highlight: true },
                { label: "Auto Reconciliation", desc: "Quote → shipment → clearance linked automatically with variance detection", highlight: false },
                { label: "Proactive Fraud Detection", desc: "Gift misdeclarations, value understatement caught at manifest time", highlight: false },
                { label: "Confidence Scoring", desc: "Every classification scored, every decision auditable, continuous improvement", highlight: false },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-sm">
                  <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${item.highlight ? "text-bp-green" : "text-bp-green/70"}`} />
                  <div>
                    <span className="font-medium text-foreground">{item.label}:</span>
                    <span className="text-muted-foreground ml-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Customer Accounts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            Top Customer Accounts
          </h2>
          <Link
            href="/dashboard/accounts"
            className="text-sm font-bold text-bp-red hover:underline flex items-center gap-1"
          >
            View all accounts <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <FedExTable
          headers={[
            { label: "Account" },
            { label: "Active Shipments", className: "text-right" },
            { label: "Pass Rate", className: "text-right" },
            { label: "Compliance Score", className: "text-right" },
            { label: "Revenue (MTD)", className: "text-right" },
            { label: "Status" },
          ]}
        >
          {topAccounts.map((account, idx) => (
            <FedExTableRow
              key={account.name}
              even={idx % 2 === 1}
              onClick={() => router.push("/dashboard/accounts")}
            >
              <FedExTableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-bp-gray" />
                  {account.name}
                </div>
              </FedExTableCell>
              <FedExTableCell className="text-right">
                {account.shipments.toLocaleString()}
              </FedExTableCell>
              <FedExTableCell className="text-right">
                <span
                  className={
                    account.passRate >= 93
                      ? "text-bp-green"
                      : account.passRate >= 90
                      ? "text-yellow-600"
                      : "text-bp-red"
                  }
                >
                  {account.passRate}%
                </span>
              </FedExTableCell>
              <FedExTableCell className="text-right">
                <span
                  className={
                    account.compliance >= 90
                      ? "text-bp-green"
                      : account.compliance >= 85
                      ? "text-yellow-600"
                      : "text-bp-red"
                  }
                >
                  {account.compliance}%
                </span>
              </FedExTableCell>
              <FedExTableCell className="text-right">
                {account.revenue}
              </FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={statusDotColor[account.status]}
                  label={statusLabels[account.status]}
                />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </div>

      {/* Recent Operational Alerts */}
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-bp-gray uppercase mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-bp-red" />
          Recent Operational Alerts
        </h2>
        <div className="space-y-2">
          {operationalAlerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border border-border rounded-lg px-4 py-3 bg-card"
            >
              <StatusDot
                color={severityColor[alert.severity]}
                label=""
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
              <span className="text-xs text-bp-gray whitespace-nowrap">
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
