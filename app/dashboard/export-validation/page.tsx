"use client";

import { useState } from "react";
import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ArrowRight,
  BarChart3,
  RefreshCw,
  FileCheck2,
  Clock,
  Zap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const shipmentValidations = [
  { id: "VAL-001", shipmentId: "BP-2024-00847", customer: "Rosie & Jack", destination: "France", items: 6, hsValidated: true, valueValidated: true, addressValidated: true, screeningPassed: true, docsComplete: true, result: "PASS", timestamp: "2024-03-12 14:25" },
  { id: "VAL-002", shipmentId: "BP-2024-00848", customer: "Highland Spirits", destination: "United States", items: 3, hsValidated: true, valueValidated: true, addressValidated: true, screeningPassed: false, docsComplete: true, result: "FAIL", failReason: "Restricted goods flag - requires review", timestamp: "2024-03-12 14:20" },
  { id: "VAL-003", shipmentId: "BP-2024-00849", customer: "Cotswold Tea Co.", destination: "Japan", items: 12, hsValidated: true, valueValidated: true, addressValidated: true, screeningPassed: true, docsComplete: true, result: "PASS", timestamp: "2024-03-12 14:15" },
  { id: "VAL-004", shipmentId: "BP-2024-00850", customer: "Brighton Luxury Goods", destination: "Germany", items: 2, hsValidated: true, valueValidated: false, addressValidated: true, screeningPassed: true, docsComplete: true, result: "FAIL", failReason: "Declared value below minimum threshold for HS 7113", timestamp: "2024-03-12 14:10" },
  { id: "VAL-005", shipmentId: "BP-2024-00851", customer: "Thames Valley Electronics", destination: "Australia", items: 8, hsValidated: false, valueValidated: true, addressValidated: true, screeningPassed: true, docsComplete: false, result: "FAIL", failReason: "HS code unclassified for 2 items; Phytosanitary cert missing", timestamp: "2024-03-12 14:05" },
  { id: "VAL-006", shipmentId: "BP-2024-00852", customer: "Yorkshire Provisions", destination: "Canada", items: 4, hsValidated: true, valueValidated: true, addressValidated: false, screeningPassed: true, docsComplete: true, result: "FAIL", failReason: "Address validation failed - postcode format incorrect", timestamp: "2024-03-12 14:00" },
  { id: "VAL-007", shipmentId: "BP-2024-00853", customer: "Rosie & Jack", destination: "Netherlands", items: 5, hsValidated: true, valueValidated: true, addressValidated: true, screeningPassed: true, docsComplete: true, result: "PASS", timestamp: "2024-03-12 13:55" },
  { id: "VAL-008", shipmentId: "BP-2024-00854", customer: "Highland Spirits", destination: "Singapore", items: 1, hsValidated: true, valueValidated: true, addressValidated: true, screeningPassed: true, docsComplete: true, result: "PASS", timestamp: "2024-03-12 13:50" },
  { id: "VAL-009", shipmentId: "BP-2024-00859", customer: "Thames Valley Electronics", destination: "South Korea", items: 14, hsValidated: true, valueValidated: true, addressValidated: true, screeningPassed: true, docsComplete: true, result: "PASS", timestamp: "2024-03-12 13:45" },
  { id: "VAL-010", shipmentId: "BP-2024-00860", customer: "Brighton Luxury Goods", destination: "UAE", items: 2, hsValidated: true, valueValidated: false, addressValidated: true, screeningPassed: true, docsComplete: true, result: "FAIL", failReason: "Value mismatch - declared €45, estimated market value €1,200+", timestamp: "2024-03-12 13:40" },
];

const passFailData = [
  { name: "Pass", value: 68, color: "#00a651" },
  { name: "Fail", value: 32, color: "#da202a" },
];

const failReasonData = [
  { reason: "HS Code Issues", count: 28 },
  { reason: "Missing Docs", count: 22 },
  { reason: "Address Invalid", count: 18 },
  { reason: "Screening Flag", count: 15 },
  { reason: "Value Dispute", count: 12 },
  { reason: "Other", count: 5 },
];

const passRateByCustomer = [
  { customer: "Cotswold Tea Co.", passRate: 94, total: 215, color: "#00a651" },
  { customer: "Rosie & Jack", passRate: 88, total: 423, color: "#00a651" },
  { customer: "Yorkshire Provisions", passRate: 82, total: 298, color: "#00a651" },
  { customer: "Highland Spirits", passRate: 76, total: 567, color: "#da202a" },
  { customer: "Thames Valley Electronics", passRate: 61, total: 342, color: "#da202a" },
  { customer: "Brighton Luxury Goods", passRate: 54, total: 189, color: "#da202a" },
];

const validationKPIs = [
  { label: "Total Validated Today", value: "2,034", icon: FileCheck2, trend: "Across 6 customer accounts" },
  { label: "Network Pass Rate", value: "68%", icon: CheckCircle2, trend: "+3.2% vs last week" },
  { label: "Avg Validation Time", value: "1.2s", icon: Clock, trend: "-0.3s improvement" },
  { label: "Auto-resolved", value: "89%", icon: Zap, trend: "Failures auto-corrected network-wide" },
];

export default function ExportValidationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterResult, setFilterResult] = useState<string>("all");

  const filtered = shipmentValidations.filter((v) => {
    if (filterResult !== "all" && v.result !== filterResult) return false;
    if (searchQuery && !v.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) && !v.destination.toLowerCase().includes(searchQuery.toLowerCase()) && !v.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Validation Operations"
        description="PASS/FAIL READINESS CHECKS ACROSS ALL OUTBOUND ROYAL MAIL PARCELS"
      />

      {/* Zonos Intelligence Bar */}
      <div className="flex items-center gap-6 px-4 py-2 bg-bp-red/5 border border-bp-red/10 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-bp-red" />
          <span className="text-xs font-bold text-bp-red tracking-wide">ZONOS VALIDATION ENGINE</span>
        </div>
        <div className="h-4 w-px bg-bp-red/20" />
        <div className="flex items-center gap-6 text-xs text-bp-gray">
          <span>5-point validation: Classify + Value + Address + Screen + Docs</span>
          <span>1.2s avg validation time</span>
          <span>89% auto-resolved</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {validationKPIs.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">{kpi.label}</span>
                <Icon className="h-4 w-4 text-bp-gray" />
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-bp-green font-medium">{kpi.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FedExSection title="Network Pass/Fail Distribution">
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={passFailData} innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                  {passFailData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {passFailData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm font-medium">{d.name}</span>
                  <span className="text-sm text-muted-foreground">({d.value}%)</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">Aggregate across all customers</p>
            </div>
          </div>
        </FedExSection>

        <FedExSection title="Top Failure Reasons (All Customers)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={failReasonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="reason" tick={{ fontSize: 11 }} width={110} />
              <Tooltip />
              <Bar dataKey="count" fill="#da202a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FedExSection>
      </div>

      {/* Pass Rate by Customer */}
      <FedExSection title="Pass Rate by Customer" icon={<Users className="h-5 w-5 text-bp-red" />}>
        <FedExTable
          headers={[
            { label: "Customer Account" },
            { label: "Total Validated" },
            { label: "Pass Rate" },
            { label: "Pass Rate Bar" },
            { label: "Status" },
          ]}
        >
          {passRateByCustomer.map((c, idx) => (
            <FedExTableRow key={c.customer} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">{c.customer}</FedExTableCell>
              <FedExTableCell>{c.total.toLocaleString()}</FedExTableCell>
              <FedExTableCell className="font-mono font-bold">{c.passRate}%</FedExTableCell>
              <FedExTableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.passRate}%`,
                        backgroundColor: c.passRate >= 80 ? "#00a651" : c.passRate >= 70 ? "#f59e0b" : "#da202a",
                      }}
                    />
                  </div>
                </div>
              </FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={c.passRate >= 80 ? "green" : c.passRate >= 70 ? "orange" : "red"}
                  label={c.passRate >= 80 ? "Good" : c.passRate >= 70 ? "Needs Attention" : "Action Required"}
                />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Validation Results Table */}
      <FedExSection title="Shipment Validation Results" icon={<FileCheck2 className="h-5 w-5 text-bp-red" />}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search shipments, destinations, or customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-1">
            {["all", "PASS", "FAIL"].map((s) => (
              <Button key={s} size="sm" variant={filterResult === s ? "default" : "outline"} onClick={() => setFilterResult(s)} className={filterResult === s ? "bg-bp-red text-white" : ""}>
                {s === "all" ? "All" : s}
              </Button>
            ))}
          </div>
        </div>
        <FedExTable
          headers={[
            { label: "Shipment" },
            { label: "Customer" },
            { label: "Destination" },
            { label: "Items" },
            { label: "HS" },
            { label: "Value" },
            { label: "Address" },
            { label: "Screen" },
            { label: "Docs" },
            { label: "Result" },
          ]}
        >
          {filtered.map((v, idx) => (
            <FedExTableRow key={v.id} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium text-bp-red">{v.shipmentId}</FedExTableCell>
              <FedExTableCell>
                <span className="text-sm font-medium">{v.customer}</span>
              </FedExTableCell>
              <FedExTableCell>{v.destination}</FedExTableCell>
              <FedExTableCell>{v.items}</FedExTableCell>
              <FedExTableCell>{v.hsValidated ? <CheckCircle2 className="h-4 w-4 text-bp-green" /> : <XCircle className="h-4 w-4 text-red-500" />}</FedExTableCell>
              <FedExTableCell>{v.valueValidated ? <CheckCircle2 className="h-4 w-4 text-bp-green" /> : <XCircle className="h-4 w-4 text-red-500" />}</FedExTableCell>
              <FedExTableCell>{v.addressValidated ? <CheckCircle2 className="h-4 w-4 text-bp-green" /> : <XCircle className="h-4 w-4 text-red-500" />}</FedExTableCell>
              <FedExTableCell>{v.screeningPassed ? <CheckCircle2 className="h-4 w-4 text-bp-green" /> : <XCircle className="h-4 w-4 text-red-500" />}</FedExTableCell>
              <FedExTableCell>{v.docsComplete ? <CheckCircle2 className="h-4 w-4 text-bp-green" /> : <XCircle className="h-4 w-4 text-red-500" />}</FedExTableCell>
              <FedExTableCell>
                <Badge className={v.result === "PASS" ? "bg-bp-green text-white" : "bg-red-500 text-white"}>
                  {v.result}
                </Badge>
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
        {/* Failure detail rows */}
        {filtered.filter((v) => v.result === "FAIL").length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold text-bp-gray uppercase tracking-wider">Failure Details</h4>
            {filtered.filter((v) => v.result === "FAIL").map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm">
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span className="font-medium text-bp-red">{v.shipmentId}</span>
                <Badge variant="outline" className="text-xs shrink-0">{v.customer}</Badge>
                <span className="text-muted-foreground">{v.failReason}</span>
              </div>
            ))}
          </div>
        )}
      </FedExSection>

      {/* PASS Logic explanation */}
      <div className="bg-bp-green/5 border border-bp-green/20 rounded-lg p-5">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-bp-green" />
          PASS Logic - Export Readiness Criteria (Applied to All Customer Shipments)
        </h3>
        <div className="grid grid-cols-5 gap-4 text-sm">
          {[
            { check: "HS Classification", desc: "All items have validated HS codes" },
            { check: "Value Verification", desc: "Declared values within expected ranges" },
            { check: "Address Validation", desc: "Recipient address verified via PAF" },
            { check: "Screening Clearance", desc: "No sanctions, restrictions or fraud flags" },
            { check: "Documentation", desc: "All required customs docs present" },
          ].map((c, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-bp-green" />
                <span className="font-medium">{c.check}</span>
              </div>
              <p className="text-muted-foreground text-xs">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">A shipment is only marked PASS when ALL five checks are complete and validated. This applies uniformly across all bpost customer accounts.</p>
      </div>
    </div>
  );
}
