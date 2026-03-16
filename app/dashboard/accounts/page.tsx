"use client";

import {
  Building2,
  Users,
  ShieldCheck,
  AlertTriangle,
  PoundSterling,
  ArrowUp,
} from "lucide-react";
import { PageHeader } from "@/components/fedex/page-header";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  FedExTable,
  FedExTableRow,
  FedExTableCell,
} from "@/components/fedex/fedex-table";
import { FedExSection } from "@/components/fedex/section";

const kpiCards = [
  {
    title: "Total Active Accounts",
    value: "847",
    trend: "+14 this month",
    trendUp: true,
    icon: Users,
  },
  {
    title: "Avg Compliance Score",
    value: "91.3%",
    trend: "+1.2% vs last month",
    trendUp: true,
    icon: ShieldCheck,
  },
  {
    title: "Accounts At Risk",
    value: "12",
    trend: "3 critical, 9 watch",
    trendUp: null,
    icon: AlertTriangle,
  },
  {
    title: "Revenue This Month",
    value: "€2.4M",
    trend: "+6.8% vs last month",
    trendUp: true,
    icon: PoundSterling,
  },
];

const customerAccounts = [
  {
    name: "Sterling Medical Supplies",
    id: "BP-ACC-0012",
    tier: "Gold",
    shipments: 2780,
    passRate: 98.2,
    compliance: 99,
    volume: "14,200",
    revenue: "€423,100",
    status: "active" as const,
  },
  {
    name: "Thames Valley Electronics",
    id: "BP-ACC-0034",
    tier: "Gold",
    shipments: 4120,
    passRate: 89.7,
    compliance: 82,
    volume: "18,900",
    revenue: "€312,400",
    status: "review" as const,
  },
  {
    name: "Britannia Fashion Group",
    id: "BP-ACC-0051",
    tier: "Gold",
    shipments: 3890,
    passRate: 93.1,
    compliance: 90,
    volume: "16,400",
    revenue: "€267,800",
    status: "active" as const,
  },
  {
    name: "Rosie & Jack Kidswear",
    id: "BP-ACC-0078",
    tier: "Silver",
    shipments: 2340,
    passRate: 95.4,
    compliance: 93,
    volume: "9,800",
    revenue: "€184,200",
    status: "active" as const,
  },
  {
    name: "Highland Spirits Co.",
    id: "BP-ACC-0092",
    tier: "Silver",
    shipments: 1560,
    passRate: 94.8,
    compliance: 95,
    volume: "7,200",
    revenue: "€142,600",
    status: "active" as const,
  },
  {
    name: "Cotswold Artisan Foods",
    id: "BP-ACC-0105",
    tier: "Silver",
    shipments: 980,
    passRate: 96.8,
    compliance: 97,
    volume: "4,600",
    revenue: "€89,300",
    status: "active" as const,
  },
  {
    name: "Camden Cycle Works",
    id: "BP-ACC-0118",
    tier: "Bronze",
    shipments: 670,
    passRate: 91.2,
    compliance: 86,
    volume: "3,100",
    revenue: "€54,200",
    status: "review" as const,
  },
  {
    name: "Pembroke Heritage Crafts",
    id: "BP-ACC-0127",
    tier: "Bronze",
    shipments: 420,
    passRate: 97.1,
    compliance: 96,
    volume: "1,800",
    revenue: "€31,800",
    status: "active" as const,
  },
  {
    name: "Northfield Industrial Parts",
    id: "BP-ACC-0143",
    tier: "Silver",
    shipments: 1890,
    passRate: 88.4,
    compliance: 79,
    volume: "8,400",
    revenue: "€198,600",
    status: "review" as const,
  },
  {
    name: "York Botanical Extracts",
    id: "BP-ACC-0156",
    tier: "Bronze",
    shipments: 340,
    passRate: 92.6,
    compliance: 91,
    volume: "1,500",
    revenue: "€28,400",
    status: "active" as const,
  },
  {
    name: "Blackwater Security Tech",
    id: "BP-ACC-0171",
    tier: "Gold",
    shipments: 3210,
    passRate: 86.3,
    compliance: 74,
    volume: "12,800",
    revenue: "€387,200",
    status: "suspended" as const,
  },
  {
    name: "Wessex Gourmet Provisions",
    id: "BP-ACC-0189",
    tier: "Bronze",
    shipments: 510,
    passRate: 95.9,
    compliance: 94,
    volume: "2,300",
    revenue: "€42,100",
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

const tierColors: Record<string, string> = {
  Gold: "bg-yellow-100 text-yellow-800",
  Silver: "bg-gray-100 text-gray-700",
  Bronze: "bg-orange-100 text-orange-800",
};

const complianceDistribution = [
  { range: "95-100%", count: 412, pct: 48.6, color: "#00a651" },
  { range: "90-94%", count: 247, pct: 29.2, color: "#4ade80" },
  { range: "85-89%", count: 118, pct: 13.9, color: "#facc15" },
  { range: "80-84%", count: 48, pct: 5.7, color: "#f97316" },
  { range: "Below 80%", count: 22, pct: 2.6, color: "#da202a" },
];

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Customer Accounts"
        description="MANAGE SHIPPING CUSTOMER ACCOUNTS AND COMPLIANCE"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;

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
                {kpi.trendUp === true && (
                  <>
                    <ArrowUp className="h-3 w-3 text-bp-green" />
                    <span className="text-bp-green">{kpi.trend}</span>
                  </>
                )}
                {kpi.trendUp === null && (
                  <span className="text-bp-gray">{kpi.trend}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Accounts Table */}
      <FedExSection title="All Customer Accounts">
        <FedExTable
          headers={[
            { label: "Account Name" },
            { label: "Account ID" },
            { label: "Tier" },
            { label: "Active Shipments", className: "text-right" },
            { label: "Pass Rate", className: "text-right" },
            { label: "Compliance Score", className: "text-right" },
            { label: "Monthly Volume", className: "text-right" },
            { label: "Revenue (MTD)", className: "text-right" },
            { label: "Status" },
          ]}
        >
          {customerAccounts.map((account, idx) => (
            <FedExTableRow key={account.id} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-bp-gray shrink-0" />
                  {account.name}
                </div>
              </FedExTableCell>
              <FedExTableCell className="text-bp-gray text-xs font-mono">
                {account.id}
              </FedExTableCell>
              <FedExTableCell>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${tierColors[account.tier]}`}
                >
                  {account.tier}
                </span>
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
                {account.volume}
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
      </FedExSection>

      {/* Compliance Distribution */}
      <FedExSection title="Compliance Distribution">
        <div className="space-y-3">
          {complianceDistribution.map((band) => (
            <div key={band.range} className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground w-24">
                {band.range}
              </span>
              <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${band.pct}%`,
                    backgroundColor: band.color,
                  }}
                />
              </div>
              <span className="text-sm text-bp-gray w-20 text-right">
                {band.count} accounts
              </span>
              <span className="text-sm font-semibold text-foreground w-14 text-right">
                {band.pct}%
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-bp-gray">
            Accounts scoring below 85% are automatically flagged for review.
            Accounts below 80% may be subject to enhanced screening requirements
            and volume restrictions.
          </p>
        </div>
      </FedExSection>
    </div>
  );
}
