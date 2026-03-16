"use client";

import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  Scale,
  Globe2,
  CheckCircle2,
  Calculator,
  FileText,
  ArrowRight,
  Building2,
  Shield,
  Clock,
  AlertTriangle,
  Receipt,
  Users,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const iossRegistrations = [
  { account: "ACC-10421", merchant: "Rosie & Jack Kidswear", iossNumber: "IM3720000123", status: "active", validFrom: "2024-01-01", validTo: "2024-12-31", monthlyVolume: "3,240", monthlyVAT: "€12,450", topDestination: "France" },
  { account: "ACC-10087", merchant: "Thames Valley Electronics", iossNumber: "IM3720000456", status: "active", validFrom: "2024-02-15", validTo: "2025-02-14", monthlyVolume: "2,890", monthlyVAT: "€9,870", topDestination: "Germany" },
  { account: "ACC-10193", merchant: "British Heritage Gifts Ltd", iossNumber: "IM3720000789", status: "active", validFrom: "2024-03-01", validTo: "2025-02-28", monthlyVolume: "1,650", monthlyVAT: "€5,230", topDestination: "Netherlands" },
  { account: "ACC-10305", merchant: "London Fashion Direct", iossNumber: "IM3720001012", status: "active", validFrom: "2024-01-15", validTo: "2025-01-14", monthlyVolume: "1,420", monthlyVAT: "€4,680", topDestination: "Spain" },
  { account: "ACC-10512", merchant: "UK Supplements Co", iossNumber: "IM3720001345", status: "pending", validFrom: "2024-04-01", validTo: "-", monthlyVolume: "-", monthlyVAT: "-", topDestination: "-" },
  { account: "ACC-10098", merchant: "Cotswold Artisan Foods", iossNumber: "IM3720001678", status: "active", validFrom: "2024-01-01", validTo: "2024-12-31", monthlyVolume: "890", monthlyVAT: "€2,410", topDestination: "Belgium" },
];

const iossKPIs = [
  { label: "Merchants Registered", value: "5 Active", icon: Users, sub: "1 pending onboarding" },
  { label: "Monthly IOSS Shipments", value: "10,090", icon: Globe2, sub: "Across all merchant accounts" },
  { label: "Total VAT Declared", value: "€34,640", icon: Banknote, sub: "This month across all merchants" },
  { label: "Compliance Rate", value: "96.8%", icon: Shield, sub: "Invoice match & declaration accuracy" },
];

const iossShipments = [
  { id: "IOSS-001", shipmentId: "BP-2024-01001", merchant: "Rosie & Jack Kidswear", account: "ACC-10421", destination: "France", totalValue: "€120.00", vatRate: "20%", vatAmount: "€24.00", iossRef: "IM3720000123", status: "declared", invoiceMatch: true },
  { id: "IOSS-002", shipmentId: "BP-2024-01002", merchant: "Thames Valley Electronics", account: "ACC-10087", destination: "Germany", totalValue: "€89.99", vatRate: "19%", vatAmount: "€17.10", iossRef: "IM3720000456", status: "declared", invoiceMatch: true },
  { id: "IOSS-003", shipmentId: "BP-2024-01003", merchant: "London Fashion Direct", account: "ACC-10305", destination: "Spain", totalValue: "€145.00", vatRate: "21%", vatAmount: "€30.45", iossRef: "IM3720001012", status: "pending", invoiceMatch: false },
  { id: "IOSS-004", shipmentId: "BP-2024-01004", merchant: "British Heritage Gifts Ltd", account: "ACC-10193", destination: "Italy", totalValue: "€67.50", vatRate: "22%", vatAmount: "€14.85", iossRef: "IM3720000789", status: "declared", invoiceMatch: true },
  { id: "IOSS-005", shipmentId: "BP-2024-01005", merchant: "Rosie & Jack Kidswear", account: "ACC-10421", destination: "Netherlands", totalValue: "€149.00", vatRate: "21%", vatAmount: "€31.29", iossRef: "IM3720000123", status: "flagged", invoiceMatch: false },
  { id: "IOSS-006", shipmentId: "BP-2024-01006", merchant: "Cotswold Artisan Foods", account: "ACC-10098", destination: "Belgium", totalValue: "€95.00", vatRate: "21%", vatAmount: "€19.95", iossRef: "IM3720001678", status: "declared", invoiceMatch: true },
  { id: "IOSS-007", shipmentId: "BP-2024-01007", merchant: "Thames Valley Electronics", account: "ACC-10087", destination: "France", totalValue: "€78.50", vatRate: "20%", vatAmount: "€15.70", iossRef: "IM3720000456", status: "declared", invoiceMatch: true },
  { id: "IOSS-008", shipmentId: "BP-2024-01008", merchant: "British Heritage Gifts Ltd", account: "ACC-10193", destination: "Ireland", totalValue: "€42.00", vatRate: "23%", vatAmount: "€9.66", iossRef: "IM3720000789", status: "declared", invoiceMatch: true },
];

const vatRates = [
  { country: "France", code: "FR", standardRate: "20%", reducedRate: "5.5%", superReduced: "2.1%" },
  { country: "Germany", code: "DE", standardRate: "19%", reducedRate: "7%", superReduced: "-" },
  { country: "Spain", code: "ES", standardRate: "21%", reducedRate: "10%", superReduced: "4%" },
  { country: "Italy", code: "IT", standardRate: "22%", reducedRate: "10%", superReduced: "4%" },
  { country: "Netherlands", code: "NL", standardRate: "21%", reducedRate: "9%", superReduced: "-" },
  { country: "Belgium", code: "BE", standardRate: "21%", reducedRate: "12%", superReduced: "6%" },
  { country: "Ireland", code: "IE", standardRate: "23%", reducedRate: "13.5%", superReduced: "4.8%" },
  { country: "Poland", code: "PL", standardRate: "23%", reducedRate: "8%", superReduced: "5%" },
];

const monthlyReturns = [
  { month: "January 2024", merchants: 5, totalShipments: 9240, totalVAT: "€25,430", returnFiled: true, filedDate: "2024-02-28", status: "accepted" },
  { month: "February 2024", merchants: 5, totalShipments: 10090, totalVAT: "€34,640", returnFiled: true, filedDate: "2024-03-10", status: "accepted" },
  { month: "March 2024", merchants: 5, totalShipments: 7820, totalVAT: "€21,850", returnFiled: false, filedDate: "-", status: "due" },
];

export default function IOSSPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="IOSS Intermediary Services"
        description="MANAGING VAT COLLECTION FOR UK MERCHANTS SELLING TO EU CONSUMERS"
      />

      {/* Zonos Intelligence Bar */}
      <div className="flex items-center gap-6 px-4 py-2 bg-bp-red/5 border border-bp-red/10 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Scale className="h-3.5 w-3.5 text-bp-red" />
          <span className="text-xs font-bold text-bp-red tracking-wide">ZONOS VAT ENGINE</span>
        </div>
        <div className="h-4 w-px bg-bp-red/20" />
        <div className="flex items-center gap-6 text-xs text-bp-gray">
          <span>27 EU member state VAT rates</span>
          <span>Automatic invoice validation</span>
          <span>Consolidated IOSS filing</span>
          <span>UK scheme ready</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {iossKPIs.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-lg p-4 space-y-2">
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

      {/* Merchant IOSS Registrations */}
      <FedExSection title="Merchant IOSS Registrations" icon={<Shield className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">bpost acts as IOSS intermediary for these UK merchant accounts, managing their EU VAT registration, collection, and filing obligations.</p>
        <FedExTable
          headers={[
            { label: "Account" },
            { label: "Merchant" },
            { label: "IOSS Number" },
            { label: "Status" },
            { label: "Valid Period" },
            { label: "Monthly Shipments" },
            { label: "Monthly VAT" },
            { label: "Top Destination" },
          ]}
        >
          {iossRegistrations.map((reg, idx) => (
            <FedExTableRow key={reg.iossNumber} even={idx % 2 === 1}>
              <FedExTableCell className="font-mono text-xs text-bp-red">{reg.account}</FedExTableCell>
              <FedExTableCell className="font-medium">{reg.merchant}</FedExTableCell>
              <FedExTableCell className="font-mono text-sm">{reg.iossNumber}</FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={reg.status === "active" ? "green" : "orange"}
                  label={reg.status === "active" ? "Active" : "Pending"}
                />
              </FedExTableCell>
              <FedExTableCell className="text-xs">{reg.validFrom} - {reg.validTo}</FedExTableCell>
              <FedExTableCell>{reg.monthlyVolume}</FedExTableCell>
              <FedExTableCell className="font-bold">{reg.monthlyVAT}</FedExTableCell>
              <FedExTableCell>{reg.topDestination}</FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* IOSS Shipments with Merchant Attribution */}
      <FedExSection title="IOSS Shipments & Invoice Validation" icon={<Receipt className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">Individual IOSS shipments across all registered merchant accounts. RM validates invoice data and files VAT on behalf of each merchant.</p>
        <FedExTable
          headers={[
            { label: "Shipment" },
            { label: "Merchant Account" },
            { label: "Destination" },
            { label: "Value" },
            { label: "VAT Rate" },
            { label: "VAT Amount" },
            { label: "IOSS Ref" },
            { label: "Invoice Match" },
            { label: "Status" },
          ]}
        >
          {iossShipments.map((s, idx) => (
            <FedExTableRow key={s.id} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium text-bp-red">{s.shipmentId}</FedExTableCell>
              <FedExTableCell>
                <div>
                  <span className="text-sm font-medium">{s.merchant}</span>
                  <span className="text-xs text-muted-foreground block font-mono">{s.account}</span>
                </div>
              </FedExTableCell>
              <FedExTableCell>{s.destination}</FedExTableCell>
              <FedExTableCell>{s.totalValue}</FedExTableCell>
              <FedExTableCell>{s.vatRate}</FedExTableCell>
              <FedExTableCell className="font-bold">{s.vatAmount}</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">{s.iossRef}</FedExTableCell>
              <FedExTableCell>
                {s.invoiceMatch ? (
                  <CheckCircle2 className="h-4 w-4 text-bp-green" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={s.status === "declared" ? "green" : s.status === "pending" ? "orange" : "red"}
                  label={s.status === "declared" ? "Declared" : s.status === "pending" ? "Pending" : "Flagged"}
                />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
        <p className="text-xs text-muted-foreground mt-2">Invoice matching validates that shipped items correspond to IOSS invoice entries. Flagged items require RM operations review before VAT filing.</p>
      </FedExSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* EU VAT Rates */}
        <FedExSection title="EU VAT Rates Reference" icon={<Calculator className="h-5 w-5 text-bp-red" />}>
          <FedExTable
            headers={[
              { label: "Country" },
              { label: "Standard" },
              { label: "Reduced" },
              { label: "Super Reduced" },
            ]}
          >
            {vatRates.map((rate, idx) => (
              <FedExTableRow key={rate.code} even={idx % 2 === 1}>
                <FedExTableCell>
                  <span className="font-medium">{rate.code}</span>
                  <span className="text-muted-foreground ml-2">{rate.country}</span>
                </FedExTableCell>
                <FedExTableCell className="font-bold">{rate.standardRate}</FedExTableCell>
                <FedExTableCell>{rate.reducedRate}</FedExTableCell>
                <FedExTableCell>{rate.superReduced}</FedExTableCell>
              </FedExTableRow>
            ))}
          </FedExTable>
        </FedExSection>

        {/* Aggregate Monthly Returns */}
        <FedExSection title="Aggregate IOSS VAT Returns" icon={<FileText className="h-5 w-5 text-bp-red" />}>
          <p className="text-xs text-muted-foreground mb-2">RM files a single consolidated IOSS return covering all registered merchant accounts each month.</p>
          <div className="space-y-3">
            {monthlyReturns.map((r) => (
              <div key={r.month} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <p className="font-medium text-sm">{r.month}</p>
                  <p className="text-xs text-muted-foreground">{r.merchants} merchants • {r.totalShipments.toLocaleString()} shipments • {r.totalVAT}</p>
                </div>
                <div className="flex items-center gap-3">
                  {r.returnFiled ? (
                    <div className="text-right">
                      <StatusDot color={r.status === "accepted" ? "green" : "orange"} label={r.status === "accepted" ? "Accepted" : "Pending"} />
                      <p className="text-xs text-muted-foreground">Filed: {r.filedDate}</p>
                    </div>
                  ) : (
                    <Badge className="bg-amber-500 text-white">Return Due</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FedExSection>
      </div>

      {/* UK Scheme Readiness */}
      <div className="bg-bp-yellow/10 border border-bp-yellow/30 rounded-lg p-5">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-bp-red" />
          UK Low-Value Import VAT Scheme - Future Readiness
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium">Architecture Ready</p>
            <p className="text-muted-foreground">RM systems designed to support UK equivalent of IOSS when introduced</p>
            <StatusDot color="green" label="Prepared" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">VAT Calculation Engine</p>
            <p className="text-muted-foreground">UK VAT rates and rules pre-configured, awaiting scheme details from HMRC</p>
            <StatusDot color="green" label="Prepared" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Reporting Templates</p>
            <p className="text-muted-foreground">RM return templates ready to be adapted for UK scheme requirements</p>
            <StatusDot color="orange" label="Awaiting Spec" />
          </div>
        </div>
      </div>
    </div>
  );
}
