"use client";

import { useState } from "react";
import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  Receipt,
  ArrowRight,
  ArrowRightLeft,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Download,
  Link2,
  Clock,
  BarChart3,
  Scale,
  Layers,
  PoundSterling,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const reconciliationRecords = [
  { id: "REC-001", customer: "Rosie & Jack Kidswear", accountId: "BP-ACCT-4521", quoteId: "QT-2024-4521", orderId: "ORD-2024-3891", shipmentId: "BP-2024-00847", customsEntry: "CE-BE-2024-12847", bpCharged: "€162.00", collected: "€162.00", variance: "€0.00", variancePct: "0%", status: "matched", stage: "settled" },
  { id: "REC-002", customer: "Northfield Electronics Ltd", accountId: "BP-ACCT-4522", quoteId: "QT-2024-4522", orderId: "ORD-2024-3892", shipmentId: "BP-2024-00848", customsEntry: "CE-BE-2024-12848", bpCharged: "€100.80", collected: "€126.00", variance: "+€25.20", variancePct: "+25%", status: "variance", stage: "under-review" },
  { id: "REC-003", customer: "Celtic Crafts Distribution", accountId: "BP-ACCT-4523", quoteId: "QT-2024-4523", orderId: "ORD-2024-3893", shipmentId: "BP-2024-00849", customsEntry: "CE-BE-2024-12849", bpCharged: "€106.40", collected: "€106.40", variance: "€0.00", variancePct: "0%", status: "matched", stage: "settled" },
  { id: "REC-004", customer: "Rosie & Jack Kidswear", accountId: "BP-ACCT-4521", quoteId: "QT-2024-4524", orderId: "ORD-2024-3894", shipmentId: "BP-2024-00850", customsEntry: "-", bpCharged: "€34.20", collected: "-", variance: "-", variancePct: "-", status: "in-transit", stage: "customs-submitted" },
  { id: "REC-005", customer: "Brighton Botanicals Ltd", accountId: "BP-ACCT-4525", quoteId: "QT-2024-4525", orderId: "ORD-2024-3895", shipmentId: "BP-2024-00851", customsEntry: "CE-BE-2024-12851", bpCharged: "€180.00", collected: "€187.50", variance: "+€7.50", variancePct: "+4.2%", status: "variance", stage: "under-review" },
  { id: "REC-006", customer: "Northfield Electronics Ltd", accountId: "BP-ACCT-4522", quoteId: "QT-2024-4526", orderId: "ORD-2024-3896", shipmentId: "BP-2024-00852", customsEntry: "CE-BE-2024-12852", bpCharged: "€84.00", collected: "€84.00", variance: "€0.00", variancePct: "0%", status: "matched", stage: "settled" },
  { id: "REC-007", customer: "Highland Spirits Co", accountId: "BP-ACCT-4527", quoteId: "QT-2024-4527", orderId: "ORD-2024-3897", shipmentId: "BP-2024-00853", customsEntry: "CE-BE-2024-12853", bpCharged: "€245.00", collected: "€245.00", variance: "€0.00", variancePct: "0%", status: "matched", stage: "settled" },
  { id: "REC-008", customer: "Celtic Crafts Distribution", accountId: "BP-ACCT-4523", quoteId: "QT-2024-4528", orderId: "ORD-2024-3898", shipmentId: "BP-2024-00854", customsEntry: "CE-BE-2024-12854", bpCharged: "€56.80", collected: "€62.10", variance: "+€5.30", variancePct: "+9.3%", status: "variance", stage: "under-review" },
];

const customerSummary = [
  { customer: "Northfield Electronics Ltd", accountId: "BP-ACCT-4522", totalRecords: 312, matchRate: "88.5%", openVariances: 36, varianceValue: "€4,280.00", status: "attention" },
  { customer: "Rosie & Jack Kidswear", accountId: "BP-ACCT-4521", totalRecords: 284, matchRate: "94.7%", openVariances: 15, varianceValue: "€1,120.00", status: "good" },
  { customer: "Celtic Crafts Distribution", accountId: "BP-ACCT-4523", totalRecords: 198, matchRate: "91.2%", openVariances: 17, varianceValue: "€2,340.00", status: "attention" },
  { customer: "Brighton Botanicals Ltd", accountId: "BP-ACCT-4525", totalRecords: 156, matchRate: "96.8%", openVariances: 5, varianceValue: "€410.00", status: "good" },
  { customer: "Highland Spirits Co", accountId: "BP-ACCT-4527", totalRecords: 142, matchRate: "97.2%", openVariances: 4, varianceValue: "€285.00", status: "good" },
];

const chargeBreakdown = {
  shipmentId: "BP-2024-00848",
  customer: "Northfield Electronics Ltd",
  items: [
    { description: "Artisan Cheese Selection (3kg)", hsCode: "0406.90", coo: "FR", declaredValue: "€120.00", bpChargedDuty: "€14.40", hmrcActualDuty: "€18.00", bpChargedVAT: "€26.88", hmrcActualVAT: "€33.60" },
    { description: "Charcuterie Board Set", hsCode: "4419.12", coo: "IT", declaredValue: "€85.00", bpChargedDuty: "€0.00", hmrcActualDuty: "€0.00", bpChargedVAT: "€17.00", hmrcActualVAT: "€17.00" },
    { description: "Truffle Oil (250ml x2)", hsCode: "1515.90", coo: "FR", declaredValue: "€45.00", bpChargedDuty: "€3.74", hmrcActualDuty: "€6.00", bpChargedVAT: "€9.75", hmrcActualVAT: "€11.40" },
  ],
  parcelLevel: { rmTotalCharged: "€71.77", hmrcTotalActual: "€86.00", brokerageFee: "€12.00", rmMargin: "€12.00", shortfall: "-€14.23", netPosition: "-€2.23" },
};

const varianceData = [
  { category: "HS Code Change", count: 8 },
  { category: "COO Change", count: 3 },
  { category: "Value Adjustment", count: 12 },
  { category: "Incoterm Change", count: 2 },
  { category: "Rate Update", count: 5 },
];

const auditTrail = [
  { timestamp: "2024-03-13 10:42:00", event: "Bulk Reconciliation", reference: "BATCH-2024-0312", detail: "312 records reconciled for Northfield Electronics - 36 variances flagged", user: "Sarah Chen (Ops Manager)" },
  { timestamp: "2024-03-13 09:15:01", event: "Variance Detected", reference: "REC-002", detail: "Duty variance +€25.20 on BP-2024-00848 - customer Northfield Electronics under-charged", user: "System (Recon Engine)" },
  { timestamp: "2024-03-13 09:15:00", event: "EU Customs Settlement", reference: "CE-BE-2024-12848", detail: "HS reclassified to 0406.40 by Belgian Customs - duty rate changed from 12% to 15%", user: "Belgian Customs" },
  { timestamp: "2024-03-12 16:30:00", event: "Invoice Generated", reference: "INV-BP-2024-0848", detail: "Customer invoice raised for Northfield Electronics - €126.00 duties & taxes", user: "System (Auto)" },
  { timestamp: "2024-03-12 15:01:00", event: "Customs Submitted", reference: "BP-2024-00848", detail: "Electronic customs declaration submitted to Belgian Customs", user: "System (Auto)" },
  { timestamp: "2024-03-12 14:24:12", event: "Shipment Created", reference: "ORD-2024-3892", detail: "Shipment BP-2024-00848 manifested with DDP terms for Northfield Electronics", user: "James Mitchell (Ops)" },
  { timestamp: "2024-03-12 11:00:00", event: "Settlement Approved", reference: "SETTLE-2024-0311", detail: "€42,850 PDDP settlement released to La Poste for March batch", user: "Sarah Chen (Ops Manager)" },
];

const invoiceDocuments = [
  { name: "bpostInvoice to Northfield Electronics - March 2024", type: "Customer Invoice", format: "PDF", direction: "Outbound" },
  { name: "Belgian Customs Duty Assessment - CE-BE-2024-12848", type: "Belgian Customs Assessment", format: "PDF", direction: "Inbound" },
  { name: "Monthly VAT Summary - All Accounts March 2024", type: "Tax Summary", format: "XLSX", direction: "Internal" },
  { name: "PDDP Settlement Statement - La Poste Feb 2024", type: "Settlement Statement", format: "PDF", direction: "Inbound" },
  { name: "Variance Report - Northfield Electronics Q1 2024", type: "Variance Report", format: "PDF", direction: "Internal" },
];

export default function ReconciliationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reconciliation & Finance"
        description="END-TO-END CHARGE RECONCILIATION ACROSS ALL CUSTOMER ACCOUNTS"
      />

      {/* Zonos Intelligence Bar */}
      <div className="flex items-center gap-6 px-4 py-2 bg-bp-red/5 border border-bp-red/10 rounded-lg">
        <div className="flex items-center gap-1.5">
          <ArrowRightLeft className="h-3.5 w-3.5 text-bp-red" />
          <span className="text-xs font-bold text-bp-red tracking-wide">ZONOS RECONCILIATION</span>
        </div>
        <div className="h-4 w-px bg-bp-red/20" />
        <div className="flex items-center gap-6 text-xs text-bp-gray">
          <span>Quote → Order → Shipment → Customs → Settlement linked</span>
          <span>Automated variance detection</span>
          <span>Full audit trail</span>
        </div>
      </div>

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total Records Reconciled", value: "4,847", icon: CheckCircle2, sub: "All accounts - this month" },
          { label: "Overall Match Rate", value: "93.1%", icon: CheckCircle2, sub: "Across 47 customer accounts" },
          { label: "Open Variances", value: "334", icon: AlertTriangle, sub: "€28,640 total value" },
          { label: "Revenue This Month", value: "€1.24M", icon: PoundSterling, sub: "Duties, taxes & fees collected" },
          { label: "bpost Net Position", value: "+€12,480", icon: Scale, sub: "Collected vs paid to Belgian Customs" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">{kpi.label}</span>
                <Icon className="h-4 w-4 text-bp-gray" />
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Reconciliation by Customer */}
      <FedExSection title="Reconciliation by Customer Account" icon={<Building2 className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">Summary of reconciliation status per customer account - sorted by open variance value.</p>
        <FedExTable
          headers={[
            { label: "Customer Account" },
            { label: "Account ID" },
            { label: "Records" },
            { label: "Match Rate" },
            { label: "Open Variances" },
            { label: "Variance Value" },
            { label: "Status" },
          ]}
        >
          {customerSummary.map((c, idx) => (
            <FedExTableRow key={c.accountId} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">{c.customer}</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">{c.accountId}</FedExTableCell>
              <FedExTableCell>{c.totalRecords}</FedExTableCell>
              <FedExTableCell>
                <span className={`font-bold ${parseFloat(c.matchRate) >= 95 ? "text-bp-green" : parseFloat(c.matchRate) >= 90 ? "text-yellow-600" : "text-red-500"}`}>
                  {c.matchRate}
                </span>
              </FedExTableCell>
              <FedExTableCell>{c.openVariances}</FedExTableCell>
              <FedExTableCell className="font-bold text-red-500">{c.varianceValue}</FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={c.status === "good" ? "green" : "yellow"}
                  label={c.status === "good" ? "On Track" : "Needs Attention"}
                />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Main Reconciliation Table */}
      <FedExSection title="Reconciliation Records" icon={<ArrowRightLeft className="h-5 w-5 text-bp-red" />}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by customer, shipment, order, or quote ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
        </div>
        <FedExTable
          headers={[
            { label: "Customer Account" },
            { label: "Quote / Order / Shipment / Customs" },
            { label: "bpostCharged" },
            { label: "Collected" },
            { label: "Variance" },
            { label: "Stage" },
            { label: "Status" },
            { label: "" },
          ]}
        >
          {reconciliationRecords.map((r, idx) => (
            <FedExTableRow key={r.id} even={idx % 2 === 1}>
              <FedExTableCell>
                <div>
                  <p className="text-sm font-medium">{r.customer}</p>
                  <p className="text-xs text-muted-foreground font-mono">{r.accountId}</p>
                </div>
              </FedExTableCell>
              <FedExTableCell>
                <div className="flex items-center gap-1 text-xs flex-wrap">
                  <Badge variant="outline" className="font-mono">{r.quoteId}</Badge>
                  <ArrowRight className="h-3 w-3 text-bp-gray" />
                  <Badge variant="outline" className="font-mono">{r.orderId}</Badge>
                  <ArrowRight className="h-3 w-3 text-bp-gray" />
                  <Badge variant="outline" className="font-mono text-bp-red">{r.shipmentId}</Badge>
                  {r.customsEntry !== "-" && (
                    <>
                      <ArrowRight className="h-3 w-3 text-bp-gray" />
                      <Badge variant="outline" className="font-mono">{r.customsEntry}</Badge>
                    </>
                  )}
                </div>
              </FedExTableCell>
              <FedExTableCell className="text-sm font-medium">{r.bpCharged}</FedExTableCell>
              <FedExTableCell className="text-sm">
                {r.collected !== "-" ? r.collected : <span className="text-muted-foreground">-</span>}
              </FedExTableCell>
              <FedExTableCell>
                {r.variance !== "-" ? (
                  <span className={`font-bold text-sm ${r.variance === "€0.00" ? "text-bp-green" : "text-red-500"}`}>
                    {r.variance} {r.variancePct !== "0%" && `(${r.variancePct})`}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </FedExTableCell>
              <FedExTableCell>
                <Badge variant="outline" className="text-xs">{r.stage}</Badge>
              </FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={r.status === "matched" ? "green" : r.status === "variance" ? "red" : "blue"}
                  label={r.status === "matched" ? "Matched" : r.status === "variance" ? "Variance" : "In Transit"}
                />
              </FedExTableCell>
              <FedExTableCell>
                <Button size="sm" variant="ghost" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Charge Breakdown - bpostPerspective */}
      <FedExSection title="Charge Breakdown - bpostCharged vs Belgian Customs Actual" icon={<Layers className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">
          Shipment: <span className="font-bold text-bp-red">{chargeBreakdown.shipmentId}</span> - Customer: <span className="font-bold">{chargeBreakdown.customer}</span>
        </p>
        <FedExTable
          headers={[
            { label: "Item Description" },
            { label: "HS Code" },
            { label: "Origin" },
            { label: "Declared Value" },
            { label: "bpostCharged Duty" },
            { label: "Belgian Customs Actual Duty" },
            { label: "bpostCharged VAT" },
            { label: "Belgian Customs Actual VAT" },
          ]}
        >
          {chargeBreakdown.items.map((item, idx) => (
            <FedExTableRow key={idx} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">{item.description}</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">{item.hsCode}</FedExTableCell>
              <FedExTableCell>{item.coo}</FedExTableCell>
              <FedExTableCell>{item.declaredValue}</FedExTableCell>
              <FedExTableCell>{item.bpChargedDuty}</FedExTableCell>
              <FedExTableCell className="font-bold">{item.hmrcActualDuty}</FedExTableCell>
              <FedExTableCell>{item.bpChargedVAT}</FedExTableCell>
              <FedExTableCell className="font-bold">{item.hmrcActualVAT}</FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
        <div className="mt-4 bg-bp-light rounded-lg p-4">
          <h4 className="text-xs font-semibold text-bp-gray uppercase tracking-wider mb-2">bpost Financial Summary</h4>
          <div className="grid grid-cols-6 gap-4 text-center">
            <div><p className="text-xs text-bp-gray">bpostTotal Charged</p><p className="font-bold">{chargeBreakdown.parcelLevel.rmTotalCharged}</p></div>
            <div><p className="text-xs text-bp-gray">Belgian Customs Actual</p><p className="font-bold">{chargeBreakdown.parcelLevel.hmrcTotalActual}</p></div>
            <div><p className="text-xs text-bp-gray">Brokerage Fee</p><p className="font-bold">{chargeBreakdown.parcelLevel.brokerageFee}</p></div>
            <div><p className="text-xs text-bp-gray">bpostMargin</p><p className="font-bold text-bp-green">{chargeBreakdown.parcelLevel.rmMargin}</p></div>
            <div><p className="text-xs text-bp-gray">D&T Shortfall</p><p className="font-bold text-red-500">{chargeBreakdown.parcelLevel.shortfall}</p></div>
            <div><p className="text-xs text-bp-gray font-bold">Net Position</p><p className="font-bold text-bp-red">{chargeBreakdown.parcelLevel.netPosition}</p></div>
          </div>
        </div>
      </FedExSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Variance Report */}
        <FedExSection title="Variance Analysis - All Accounts" icon={<BarChart3 className="h-5 w-5 text-bp-red" />}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={varianceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#da202a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Aggregate variance categories across all customer accounts - showing root causes of charge discrepancies.</p>
        </FedExSection>

        {/* Documents & Invoices - bpostperspective */}
        <FedExSection title="Invoices & Financial Documents" icon={<FileText className="h-5 w-5 text-bp-red" />}>
          <div className="space-y-2">
            {invoiceDocuments.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-bp-red" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} &bull; {doc.format} &bull;{" "}
                      <span className={doc.direction === "Outbound" ? "text-bp-green" : doc.direction === "Inbound" ? "text-blue-500" : "text-bp-gray"}>
                        {doc.direction}
                      </span>
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </div>
        </FedExSection>
      </div>

      {/* Operations Audit Trail */}
      <FedExSection title="Operations Audit Trail" icon={<Clock className="h-5 w-5 text-bp-red" />}>
        <div className="space-y-0">
          {auditTrail.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 border-l-2 border-bp-red/20 ml-4">
              <div className="h-3 w-3 rounded-full bg-bp-red shrink-0 mt-1 -ml-[22px]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">{entry.timestamp}</span>
                  <Badge variant="outline" className="text-xs">{entry.event}</Badge>
                  <span className="text-xs font-mono text-bp-red">{entry.reference}</span>
                </div>
                <p className="text-sm text-foreground mt-0.5">{entry.detail}</p>
                <p className="text-xs text-muted-foreground">{entry.user}</p>
              </div>
            </div>
          ))}
        </div>
      </FedExSection>

      {/* Reference Linkage */}
      <div className="bg-bp-red/5 border border-bp-red/20 rounded-lg p-5">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-bp-red" />
          Cross-Reference Linkage - Operations View
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Every shipment maintains linked references across the entire customs lifecycle - from customer quote through Belgian Customs settlement, enabling full traceability across all accounts.</p>
        <div className="flex items-center justify-center gap-2">
          {["Customer Account", "Quote ID", "Order ID", "Shipment ID", "Customs Entry", "Belgian Customs Settlement", "bpostInvoice"].map((ref, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-white border border-border rounded-lg px-3 py-2 text-xs font-medium text-center">{ref}</div>
              {i < 6 && <ArrowRight className="h-3 w-3 text-bp-gray" />}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">Operations staff can drill down from any reference to view the full chain across customer accounts without manual reconciliation.</p>
      </div>
    </div>
  );
}
