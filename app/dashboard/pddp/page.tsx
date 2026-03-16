"use client";

import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  Globe2,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Banknote,
  ArrowRight,
  RefreshCw,
  Building2,
  Handshake,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const partnerPosts = [
  { country: "France", post: "La Poste", code: "FR", status: "active", volumeMonth: 4521, dutiesCollected: "€32,450", settlementStatus: "settled", lastSettlement: "2024-03-10", vatScheme: "IOSS" },
  { country: "Germany", post: "Deutsche Post", code: "DE", status: "active", volumeMonth: 3890, dutiesCollected: "€28,120", settlementStatus: "settled", lastSettlement: "2024-03-10", vatScheme: "IOSS" },
  { country: "Netherlands", post: "PostNL", code: "NL", status: "active", volumeMonth: 2156, dutiesCollected: "€15,780", settlementStatus: "pending", lastSettlement: "2024-03-05", vatScheme: "IOSS" },
  { country: "Spain", post: "Correos", code: "ES", status: "active", volumeMonth: 1847, dutiesCollected: "€13,290", settlementStatus: "settled", lastSettlement: "2024-03-10", vatScheme: "IOSS" },
  { country: "Italy", post: "Poste Italiane", code: "IT", status: "onboarding", volumeMonth: 0, dutiesCollected: "-", settlementStatus: "n/a", lastSettlement: "-", vatScheme: "IOSS" },
  { country: "Belgium", post: "bpost", code: "BE", status: "active", volumeMonth: 1203, dutiesCollected: "€8,940", settlementStatus: "settled", lastSettlement: "2024-03-10", vatScheme: "IOSS" },
  { country: "Ireland", post: "An Post", code: "IE", status: "active", volumeMonth: 987, dutiesCollected: "€7,120", settlementStatus: "pending", lastSettlement: "2024-03-05", vatScheme: "IOSS" },
  { country: "Poland", post: "Poczta Polska", code: "PL", status: "planned", volumeMonth: 0, dutiesCollected: "-", settlementStatus: "n/a", lastSettlement: "-", vatScheme: "IOSS" },
];

const volumeByPartner = [
  { country: "FR", volume: 4521 },
  { country: "DE", volume: 3890 },
  { country: "NL", volume: 2156 },
  { country: "ES", volume: 1847 },
  { country: "BE", volume: 1203 },
  { country: "IE", volume: 987 },
];

const settlementSummary = {
  totalDutiesThisMonth: "€89,340",
  totalSettledWithPartners: "€72,480",
  pendingPartnerSettlement: "€16,860",
  avgSettlementDays: "3.2 days",
  nextSettlementDate: "2024-03-15",
};

const recentSettlements = [
  { id: "SET-001", partner: "La Poste (FR)", amount: "€32,450", gbpEquiv: "€27,890", status: "settled", date: "2024-03-10", reference: "BP-SET-FR-20240310" },
  { id: "SET-002", partner: "Deutsche Post (DE)", amount: "€28,120", gbpEquiv: "€24,170", status: "settled", date: "2024-03-10", reference: "BP-SET-DE-20240310" },
  { id: "SET-003", partner: "PostNL (NL)", amount: "€15,780", gbpEquiv: "€13,560", status: "pending", date: "2024-03-15", reference: "BP-SET-NL-20240315" },
  { id: "SET-004", partner: "Correos (ES)", amount: "€13,290", gbpEquiv: "€11,420", status: "settled", date: "2024-03-10", reference: "BP-SET-ES-20240310" },
  { id: "SET-005", partner: "An Post (IE)", amount: "€7,120", gbpEquiv: "€6,120", status: "pending", date: "2024-03-15", reference: "BP-SET-IE-20240315" },
];

const topPDDPCustomers = [
  { account: "ACC-10421", name: "Rosie & Jack Kidswear", monthlyVolume: 3240, pddpValue: "€42,180", topDestination: "France", trend: "+12%" },
  { account: "ACC-10087", name: "Thames Valley Electronics", monthlyVolume: 2890, pddpValue: "€38,650", topDestination: "Germany", trend: "+8%" },
  { account: "ACC-10193", name: "British Heritage Gifts Ltd", monthlyVolume: 1975, pddpValue: "€21,340", topDestination: "Netherlands", trend: "+15%" },
  { account: "ACC-10305", name: "London Fashion Direct", monthlyVolume: 1640, pddpValue: "€19,870", topDestination: "Spain", trend: "+3%" },
  { account: "ACC-10512", name: "UK Supplements Co", monthlyVolume: 1120, pddpValue: "€12,450", topDestination: "Belgium", trend: "-2%" },
  { account: "ACC-10098", name: "Cotswold Artisan Foods", monthlyVolume: 890, pddpValue: "€8,210", topDestination: "Ireland", trend: "+22%" },
];

export default function PDDPPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="PDDP Services"
        description="MANAGING PRE-PAID DUTY & VAT ACROSS EU POSTAL PARTNER NETWORK"
      />

      {/* Zonos Intelligence Bar */}
      <div className="flex items-center gap-6 px-4 py-2 bg-bp-red/5 border border-bp-red/10 rounded-lg">
        <div className="flex items-center gap-1.5">
          <ArrowRightLeft className="h-3.5 w-3.5 text-bp-red" />
          <span className="text-xs font-bold text-bp-red tracking-wide">ZONOS SETTLEMENT ENGINE</span>
        </div>
        <div className="h-4 w-px bg-bp-red/20" />
        <div className="flex items-center gap-6 text-xs text-bp-gray">
          <span>8 EU postal partners</span>
          <span>Real-time duty/VAT calculation at checkout</span>
          <span>Automated settlement reconciliation</span>
        </div>
      </div>

      {/* RM-to-Partner Settlement Summary KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total Duties Collected", value: settlementSummary.totalDutiesThisMonth, icon: Banknote, sub: "From merchant accounts this month" },
          { label: "Settled with Partners", value: settlementSummary.totalSettledWithPartners, icon: CheckCircle2, sub: "RM → EU postal partner payments" },
          { label: "Pending Partner Settlement", value: settlementSummary.pendingPartnerSettlement, icon: Clock, sub: "Awaiting transfer to partners" },
          { label: "Avg Settlement Cycle", value: settlementSummary.avgSettlementDays, icon: ArrowRightLeft, sub: "RM to partner post" },
          { label: "Next Settlement Run", value: settlementSummary.nextSettlementDate, icon: RefreshCw, sub: "Scheduled batch transfer" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">{kpi.label}</span>
                <Icon className="h-4 w-4 text-bp-gray" />
              </div>
              <div className="text-xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Partner Posts Table */}
      <FedExSection title="EU Postal Partner Network" icon={<Handshake className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">bpost partner post agreements for PDDP duty/VAT settlement. RM collects from UK merchants at checkout and settles with each destination postal operator.</p>
        <FedExTable
          headers={[
            { label: "Country" },
            { label: "Postal Partner" },
            { label: "Status" },
            { label: "Volume (Month)" },
            { label: "Duties Collected" },
            { label: "RM Settlement" },
            { label: "Last Settlement" },
            { label: "VAT Scheme" },
          ]}
        >
          {partnerPosts.map((partner, idx) => (
            <FedExTableRow key={partner.code} even={idx % 2 === 1}>
              <FedExTableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{partner.code}</span>
                  <span className="text-muted-foreground">{partner.country}</span>
                </div>
              </FedExTableCell>
              <FedExTableCell className="font-medium">{partner.post}</FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={partner.status === "active" ? "green" : partner.status === "onboarding" ? "orange" : "gray"}
                  label={partner.status === "active" ? "Active" : partner.status === "onboarding" ? "Onboarding" : "Planned"}
                />
              </FedExTableCell>
              <FedExTableCell>{partner.volumeMonth > 0 ? partner.volumeMonth.toLocaleString() : "-"}</FedExTableCell>
              <FedExTableCell>{partner.dutiesCollected}</FedExTableCell>
              <FedExTableCell>
                {partner.settlementStatus !== "n/a" ? (
                  <StatusDot
                    color={partner.settlementStatus === "settled" ? "green" : "orange"}
                    label={partner.settlementStatus === "settled" ? "RM Settled" : "RM Pending"}
                  />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </FedExTableCell>
              <FedExTableCell>{partner.lastSettlement}</FedExTableCell>
              <FedExTableCell><Badge variant="outline">{partner.vatScheme}</Badge></FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Top Customers Using PDDP */}
      <FedExSection title="Top Customers Using PDDP" icon={<Users className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">Merchant accounts with highest PDDP shipment volumes this month. RM collects duty/VAT from these accounts at checkout and settles with EU partner posts.</p>
        <FedExTable
          headers={[
            { label: "Account" },
            { label: "Merchant Name" },
            { label: "Monthly PDDP Shipments" },
            { label: "Total PDDP Value" },
            { label: "Top Destination" },
            { label: "Trend (MoM)" },
          ]}
        >
          {topPDDPCustomers.map((cust, idx) => (
            <FedExTableRow key={cust.account} even={idx % 2 === 1}>
              <FedExTableCell className="font-mono text-xs text-bp-red">{cust.account}</FedExTableCell>
              <FedExTableCell className="font-medium">{cust.name}</FedExTableCell>
              <FedExTableCell>{cust.monthlyVolume.toLocaleString()}</FedExTableCell>
              <FedExTableCell className="font-bold">{cust.pddpValue}</FedExTableCell>
              <FedExTableCell>{cust.topDestination}</FedExTableCell>
              <FedExTableCell>
                <span className={cust.trend.startsWith("+") ? "text-bp-green font-medium" : "text-bp-red font-medium"}>
                  <TrendingUp className="h-3.5 w-3.5 inline mr-1" />
                  {cust.trend}
                </span>
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume by Partner */}
        <FedExSection title="Monthly Volume by Partner Post">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volumeByPartner}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="country" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [v.toLocaleString(), "Shipments"]} />
              <Bar dataKey="volume" fill="#da202a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FedExSection>

        {/* Recent RM-to-Partner Settlements */}
        <FedExSection title="Recent RM → Partner Settlements" icon={<ArrowRightLeft className="h-5 w-5 text-bp-red" />}>
          <p className="text-xs text-muted-foreground mb-2">bpost settlement transfers to EU postal partners for pre-paid duty/VAT on behalf of merchant accounts.</p>
          <div className="space-y-2">
            {recentSettlements.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{s.partner}</span>
                    <StatusDot
                      color={s.status === "settled" ? "green" : "orange"}
                      label={s.status === "settled" ? "RM Settled" : "RM Pending"}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Ref: {s.reference}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{s.gbpEquiv}</p>
                  <p className="text-xs text-muted-foreground">{s.amount} • {s.date}</p>
                </div>
              </div>
            ))}
          </div>
        </FedExSection>
      </div>

      {/* PDDP Flow Diagram */}
      <div className="bg-bp-red/5 border border-bp-red/20 rounded-lg p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-bp-red" />
          PDDP Operational Flow - bpost as Settlement Intermediary
        </h3>
        <div className="flex items-center justify-between">
          {[
            { step: "1", label: "Merchant Checkout", desc: "RM collects duty/VAT from merchant's customer" },
            { step: "2", label: "Pre-advice Sent", desc: "RM transmits PDDP flag to partner post" },
            { step: "3", label: "Export Dispatch", desc: "CN23 with DDP terms generated by RM" },
            { step: "4", label: "Partner Receipt", desc: "EU post clears parcel using RM pre-paid data" },
            { step: "5", label: "RM Settlement", desc: "RM transfers collected D&T to partner post" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-center space-y-1 max-w-[140px]">
                <div className="h-8 w-8 rounded-full bg-bp-red text-white flex items-center justify-center text-sm font-bold mx-auto">{s.step}</div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              {i < 4 && <ArrowRight className="h-4 w-4 text-bp-gray shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
