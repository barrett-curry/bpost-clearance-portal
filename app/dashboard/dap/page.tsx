"use client";

import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  Banknote,
  ArrowRight,
  Bell,
  Package,
  RotateCcw,
  Globe2,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
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

const dapShipments = [
  { id: "DAP-001", shipmentId: "BP-2024-00860", originPost: "USPS", originCountry: "US", recipient: "J. Janssens, Brussels 1000", description: "Electronics Bundle", declaredValue: "$450", totalDAP: "€144.00", status: "payment-pending", notified: true, paymentDue: "2024-03-15" },
  { id: "DAP-002", shipmentId: "BP-2024-00861", originPost: "USPS", originCountry: "US", recipient: "A. Peeters, Antwerp 2000", description: "Designer Clothing", declaredValue: "$280", totalDAP: "€89.60", status: "paid", notified: true, paymentDue: "2024-03-14" },
  { id: "DAP-003", shipmentId: "BP-2024-00862", originPost: "Deutsche Post", originCountry: "DE", recipient: "C. Willems, Ghent 9000", description: "Auto Parts Set", declaredValue: "€620", totalDAP: "€106.40", status: "payment-pending", notified: true, paymentDue: "2024-03-16" },
  { id: "DAP-004", shipmentId: "BP-2024-00863", originPost: "USPS", originCountry: "US", recipient: "M. Maes, Leuven 3000", description: "Cosmetics Package", declaredValue: "$95", totalDAP: "€30.40", status: "paid", notified: true, paymentDue: "2024-03-13" },
  { id: "DAP-005", shipmentId: "BP-2024-00864", originPost: "La Poste", originCountry: "FR", recipient: "R. Dubois, Namur 5000", description: "Kids Clothing Bundle", declaredValue: "€380", totalDAP: "€65.20", status: "overdue", notified: true, paymentDue: "2024-03-10" },
  { id: "DAP-006", shipmentId: "BP-2024-00865", originPost: "USPS", originCountry: "US", recipient: "S. Wouters, Bruges 8000", description: "Sporting Equipment", declaredValue: "$750", totalDAP: "€165.00", status: "returned", notified: true, paymentDue: "2024-03-08" },
  { id: "DAP-007", shipmentId: "BP-2024-00866", originPost: "China Post", originCountry: "CN", recipient: "P. Claes, Liege 4000", description: "Electronics Accessories", declaredValue: "¥580", totalDAP: "€22.80", status: "paid", notified: true, paymentDue: "2024-03-12" },
  { id: "DAP-008", shipmentId: "BP-2024-00867", originPost: "Japan Post", originCountry: "JP", recipient: "K. Hermans, Charleroi 6000", description: "Collectible Figures", declaredValue: "¥12,500", totalDAP: "€48.60", status: "payment-pending", notified: false, paymentDue: "2024-03-17" },
];

const dapKPIs = [
  { label: "Inbound DAP Parcels Today", value: "1,842", icon: Package, sub: "Across all origin countries" },
  { label: "Total Duties Collected", value: "€128,450", icon: Banknote, sub: "From Belgian consumers today" },
  { label: "Payment Success Rate", value: "87.3%", icon: CheckCircle2, sub: "Of notified recipients" },
  { label: "Avg Time to Payment", value: "1.8 days", icon: Clock, sub: "From notification to payment" },
];

const collectionsByOrigin = [
  { origin: "United States (USPS)", parcelsToday: 624, paymentRate: "91.2%", avgDuty: "€125.40", totalCollected: "€48,320", status: "good" },
  { origin: "China (China Post / EMS)", parcelsToday: 487, paymentRate: "72.4%", avgDuty: "€34.50", totalCollected: "€12,150", status: "warning" },
  { origin: "Germany (Deutsche Post)", parcelsToday: 198, paymentRate: "94.1%", avgDuty: "€68.90", totalCollected: "€12,870", status: "good" },
  { origin: "France (La Poste)", parcelsToday: 156, paymentRate: "89.7%", avgDuty: "€52.10", totalCollected: "€7,230", status: "good" },
  { origin: "Japan (Japan Post)", parcelsToday: 89, paymentRate: "93.5%", avgDuty: "€89.20", totalCollected: "€7,420", status: "good" },
  { origin: "Australia (Australia Post)", parcelsToday: 64, paymentRate: "88.0%", avgDuty: "€52.10", totalCollected: "€2,930", status: "good" },
  { origin: "Canada (Canada Post)", parcelsToday: 52, paymentRate: "90.4%", avgDuty: "€61.30", totalCollected: "€2,870", status: "good" },
  { origin: "Other Origins", parcelsToday: 172, paymentRate: "76.8%", avgDuty: "€41.20", totalCollected: "€5,460", status: "warning" },
];

const dailyCollections = [
  { day: "Mon", collected: 112400, parcels: 1680 },
  { day: "Tue", collected: 124800, parcels: 1790 },
  { day: "Wed", collected: 118200, parcels: 1720 },
  { day: "Thu", collected: 131500, parcels: 1860 },
  { day: "Fri", collected: 128450, parcels: 1842 },
  { day: "Sat", collected: 42300, parcels: 620 },
  { day: "Sun", collected: 18900, parcels: 310 },
];

const notificationStatus = [
  { channel: "Email Notification", sent: 1842, delivered: 1798, opened: 1423, paymentClicked: 1108, rate: "97.6%" },
  { channel: "SMS Notification", sent: 1842, delivered: 1810, opened: 1650, paymentClicked: 1285, rate: "98.3%" },
  { channel: "bpostApp Push", sent: 892, delivered: 876, opened: 741, paymentClicked: 623, rate: "98.2%" },
];

const lanePerformance = [
  { origin: "United States", avgDutyRate: "6.5%", avgVATRate: "20%", avgTotalDAP: "€125.40", monthlyVolume: "12,340", paymentRate: "91.2%", avgPayDays: "1.4" },
  { origin: "China", avgDutyRate: "8-25%", avgVATRate: "20%", avgTotalDAP: "€34.50", monthlyVolume: "28,620", paymentRate: "72.4%", avgPayDays: "3.1" },
  { origin: "EU (Non-IOSS)", avgDutyRate: "0-12%", avgVATRate: "20%", avgTotalDAP: "€68.90", monthlyVolume: "8,870", paymentRate: "92.8%", avgPayDays: "1.6" },
  { origin: "Japan", avgDutyRate: "3.5%", avgVATRate: "20%", avgTotalDAP: "€89.20", monthlyVolume: "2,430", paymentRate: "93.5%", avgPayDays: "1.2" },
  { origin: "Australia", avgDutyRate: "0-5%", avgVATRate: "20%", avgTotalDAP: "€52.10", monthlyVolume: "1,810", paymentRate: "88.0%", avgPayDays: "1.9" },
  { origin: "Canada", avgDutyRate: "0-8%", avgVATRate: "20%", avgTotalDAP: "€61.30", monthlyVolume: "1,520", paymentRate: "90.4%", avgPayDays: "1.5" },
];

export default function DAPPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="DAP Import Operations"
        description="DUTY & TAX COLLECTION FOR INBOUND BELGIAN PARCELS"
      />

      {/* Zonos Intelligence Bar */}
      <div className="flex items-center gap-6 px-4 py-2 bg-bp-red/5 border border-bp-red/10 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Banknote className="h-3.5 w-3.5 text-bp-red" />
          <span className="text-xs font-bold text-bp-red tracking-wide">ZONOS COLLECT</span>
        </div>
        <div className="h-4 w-px bg-bp-red/20" />
        <div className="flex items-center gap-6 text-xs text-bp-gray">
          <span>bpost-branded payment links</span>
          <span>Real-time duty/VAT calculation</span>
          <span>87.3% payment success rate</span>
          <span>Multi-channel notifications</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {dapKPIs.map((kpi) => {
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

      {/* Daily Collections Summary Chart */}
      <FedExSection title="Daily Collections Summary" icon={<BarChart3 className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">bpost duty/VAT collections from Belgian consumers on inbound DAP parcels this week.</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dailyCollections}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "collected") return [`€${value.toLocaleString()}`, "Collected"];
                return [value.toLocaleString(), "Parcels"];
              }}
            />
            <Bar dataKey="collected" fill="#da202a" radius={[4, 4, 0, 0]} name="collected" />
          </BarChart>
        </ResponsiveContainer>
      </FedExSection>

      {/* Collection Performance by Origin */}
      <FedExSection title="Collection Performance by Origin" icon={<Globe2 className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">Payment collection rates from Belgian consumers by origin postal service. Low payment rates may indicate notification issues or consumer reluctance.</p>
        <FedExTable
          headers={[
            { label: "Origin Postal Service" },
            { label: "Parcels Today" },
            { label: "Payment Rate" },
            { label: "Avg Duty/VAT" },
            { label: "Total Collected" },
            { label: "Status" },
          ]}
        >
          {collectionsByOrigin.map((row, idx) => (
            <FedExTableRow key={row.origin} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">{row.origin}</FedExTableCell>
              <FedExTableCell>{row.parcelsToday.toLocaleString()}</FedExTableCell>
              <FedExTableCell className="font-bold">{row.paymentRate}</FedExTableCell>
              <FedExTableCell>{row.avgDuty}</FedExTableCell>
              <FedExTableCell className="font-bold">{row.totalCollected}</FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={row.status === "good" ? "green" : "orange"}
                  label={row.status === "good" ? "On Target" : "Below Target"}
                />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* DAP Inbound Parcels */}
      <FedExSection title="Inbound DAP Parcels" icon={<Package className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">Individual inbound parcels requiring duty/VAT collection from Belgian recipients before final delivery.</p>
        <FedExTable
          headers={[
            { label: "Shipment" },
            { label: "Origin Post" },
            { label: "Belgian Recipient" },
            { label: "Description" },
            { label: "Declared" },
            { label: "Total D&T" },
            { label: "Payment Status" },
            { label: "Notified" },
            { label: "Due Date" },
          ]}
        >
          {dapShipments.map((s, idx) => (
            <FedExTableRow key={s.id} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium text-bp-red">{s.shipmentId}</FedExTableCell>
              <FedExTableCell>
                <div>
                  <span className="font-medium">{s.originPost}</span>
                  <span className="text-muted-foreground ml-1 text-xs">({s.originCountry})</span>
                </div>
              </FedExTableCell>
              <FedExTableCell className="text-sm">{s.recipient}</FedExTableCell>
              <FedExTableCell>{s.description}</FedExTableCell>
              <FedExTableCell>{s.declaredValue}</FedExTableCell>
              <FedExTableCell className="font-bold">{s.totalDAP}</FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={s.status === "paid" ? "green" : s.status === "payment-pending" ? "orange" : s.status === "overdue" ? "red" : "gray"}
                  label={s.status === "paid" ? "Collected" : s.status === "payment-pending" ? "Awaiting" : s.status === "overdue" ? "Overdue" : "Returned"}
                />
              </FedExTableCell>
              <FedExTableCell>
                {s.notified ? (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-bp-green" />
                    <CreditCard className="h-3.5 w-3.5 text-bp-green" />
                  </div>
                ) : (
                  <XCircle className="h-4 w-4 text-bp-red" />
                )}
              </FedExTableCell>
              <FedExTableCell className="text-xs">{s.paymentDue}</FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Customer Notification Status */}
      <FedExSection title="Customer Notification Status" icon={<Bell className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">Notification delivery and engagement rates for today's inbound DAP parcels. bpostnotifies Belgian consumers to collect duty/VAT before release.</p>
        <FedExTable
          headers={[
            { label: "Channel" },
            { label: "Sent" },
            { label: "Delivered" },
            { label: "Opened" },
            { label: "Payment Clicked" },
            { label: "Delivery Rate" },
          ]}
        >
          {notificationStatus.map((n, idx) => (
            <FedExTableRow key={n.channel} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">{n.channel}</FedExTableCell>
              <FedExTableCell>{n.sent.toLocaleString()}</FedExTableCell>
              <FedExTableCell>{n.delivered.toLocaleString()}</FedExTableCell>
              <FedExTableCell>{n.opened.toLocaleString()}</FedExTableCell>
              <FedExTableCell className="font-bold">{n.paymentClicked.toLocaleString()}</FedExTableCell>
              <FedExTableCell>
                <StatusDot color="green" label={n.rate} />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Import Lane Performance */}
      <FedExSection title="Import Lane Performance" icon={<TrendingUp className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-3">Aggregate DAP collection performance by import lane. Used to identify lanes needing operational attention.</p>
        <FedExTable
          headers={[
            { label: "Origin" },
            { label: "Avg Duty Rate" },
            { label: "VAT Rate" },
            { label: "Avg Total D&T" },
            { label: "Monthly Volume" },
            { label: "Payment Rate" },
            { label: "Avg Days to Pay" },
          ]}
        >
          {lanePerformance.map((lane, idx) => (
            <FedExTableRow key={lane.origin} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">{lane.origin}</FedExTableCell>
              <FedExTableCell>{lane.avgDutyRate}</FedExTableCell>
              <FedExTableCell>{lane.avgVATRate}</FedExTableCell>
              <FedExTableCell className="font-bold">{lane.avgTotalDAP}</FedExTableCell>
              <FedExTableCell>{lane.monthlyVolume}</FedExTableCell>
              <FedExTableCell>
                <span className={parseFloat(lane.paymentRate) >= 85 ? "text-bp-green font-bold" : "text-bp-red font-bold"}>
                  {lane.paymentRate}
                </span>
              </FedExTableCell>
              <FedExTableCell>{lane.avgPayDays}</FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* DAP Collection Flow */}
      <div className="bg-bp-red/5 border border-bp-red/20 rounded-lg p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-bp-red" />
          bpostDAP Collection Flow
        </h3>
        <div className="flex items-center justify-between">
          {[
            { step: "1", label: "Parcel Arrives Belgium", desc: "Inbound item enters bpost customs processing" },
            { step: "2", label: "D&T Assessed", desc: "bpostcalculates duties, VAT & handling fees" },
            { step: "3", label: "Consumer Notified", desc: "Email/SMS/App with bpostpayment link sent" },
            { step: "4", label: "Payment Collected", desc: "Consumer pays via bpostonline portal" },
            { step: "5", label: "Released & Delivered", desc: "bpostclears parcel for final-mile delivery" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-center space-y-1 max-w-[130px]">
                <div className="h-8 w-8 rounded-full bg-bp-red text-white flex items-center justify-center text-sm font-bold mx-auto">{s.step}</div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              {i < 4 && <ArrowRight className="h-4 w-4 text-bp-gray shrink-0" />}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">If payment not received within 5 days, bpostsends fallback instructions. After 10 days, item is returned to origin postal service or held in bpostfacility.</p>
      </div>
    </div>
  );
}
