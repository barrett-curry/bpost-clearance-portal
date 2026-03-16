"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  FileX,
} from "lucide-react";
import { type Shipment, shipments } from "@/lib/fake-data";
import { PageHeader } from "@/components/fedex/page-header";

/** Statuses that represent a clearance problem */
const ATTENTION_STATUSES = new Set([
  "customs-hold",
  "caged",
  "customs-review",
]);

const ATTENTION_CLEARANCE = new Set([
  "pga-hold",
  "value-dispute",
  "hs-review",
  "docs-missing",
]);

function needsAttention(s: Shipment): boolean {
  return (
    ATTENTION_STATUSES.has(s.status) ||
    ATTENTION_CLEARANCE.has(s.clearanceStatus)
  );
}

const countryTaxLabel: Record<string, string> = {
  AU: "GST",
  NZ: "GST",
  SG: "GST",
  IN: "Duties & GST",
  US: "Duties & Taxes",
  CA: "Duties & Taxes",
  JP: "Duties & Taxes",
  CN: "Duties & Taxes",
  BR: "Duties & Taxes",
  MX: "Duties & IVA",
  IT: "Duties, VAT & Fees",
  DE: "Duties & VAT",
  FR: "Duties & VAT",
  ES: "VAT",
  SE: "Duties & VAT",
  IE: "Duties & VAT",
};

type IClearanceInfo = {
  color: string;
  detail: string;
  icon: React.ReactNode;
  label: string;
};

function getClearanceInfo(
  status: string,
  clearanceStatus: string
): IClearanceInfo {
  switch (clearanceStatus) {
    case "pga-hold":
      return {
        color: "text-red-600",
        detail: "CPSC/CPSIA review required",
        icon: <ShieldAlert className="h-3.5 w-3.5" />,
        label: "PGA Hold",
      };
    case "value-dispute":
      return {
        color: "text-orange-600",
        detail: "Declared value under review",
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        label: "Value Dispute",
      };
    case "hs-review":
      return {
        color: "text-amber-600",
        detail: "HS classification under review",
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        label: "HS Review",
      };
    case "docs-missing":
      return {
        color: "text-red-600",
        detail: "Required documents not uploaded",
        icon: <FileX className="h-3.5 w-3.5" />,
        label: "Docs Missing",
      };
    case "clear":
      return {
        color: "text-bp-green",
        detail: "All duties and taxes paid",
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        label: "Cleared",
      };
    case "pending":
    default:
      if (status === "customs-review") {
        return {
          color: "text-amber-600",
          detail: "Under customs review",
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
          label: "Customs Review",
        };
      }
      return {
        color: "text-blue-600",
        detail: "Clearance pending",
        icon: <Clock className="h-3.5 w-3.5" />,
        label: "In Transit",
      };
  }
}

function DutyTaxCell({ shipment }: { shipment: Shipment }) {
  const taxLabel =
    countryTaxLabel[shipment.destinationCountry] ?? "Duties & Taxes";
  const amount =
    shipment.dutyTerms === "collected_by_bpost" ||
    shipment.dutyTerms === "collected_at_checkout"
      ? shipment.dutyCollected ?? 0
      : shipment.dutyTax ?? 0;

  const termLabel =
    shipment.dutyTerms === "collected_by_bpost"
      ? "Collection Succeeded"
      : shipment.dutyTerms === "collected_at_checkout"
        ? "Collected at Checkout"
        : "Collect Upon Delivery";

  return (
    <div>
      <span className="text-sm text-foreground">{termLabel}</span>
      {amount > 0 && (
        <p className="text-xs text-gray-500">
          {taxLabel} €{amount.toFixed(2)}
        </p>
      )}
    </div>
  );
}

function ShipmentRow({
  shipment,
  even,
}: {
  shipment: Shipment;
  even: boolean;
}) {
  const router = useRouter();
  const info = getClearanceInfo(shipment.status, shipment.clearanceStatus);

  return (
    <tr
      className={`${even ? "bg-bp-light/50" : ""} cursor-pointer hover:bg-bp-light/80`}
      onClick={() => router.push(`/dashboard/shipments/${shipment.id}`)}
    >
      {/* Tracking # + ship date */}
      <td className="py-3 px-3">
        <div>
          <span className="text-sm font-medium text-foreground">
            {shipment.trackingNumber}
          </span>
          <p className="text-xs text-gray-500">{shipment.shipDate}</p>
        </div>
      </td>

      {/* Route */}
      <td className="py-3 px-3">
        <div>
          <span className="text-sm text-foreground">{shipment.origin}</span>
          <p className="text-xs text-gray-500">{shipment.destination}</p>
        </div>
      </td>

      {/* Order */}
      <td className="py-3 px-3">
        <div>
          <span className="text-sm text-foreground">
            {shipment.orderNumber}
          </span>
          <p className="text-xs text-gray-500">
            €{shipment.declaredValue.toLocaleString()} EUR
          </p>
        </div>
      </td>

      {/* Duty & Tax */}
      <td className="py-3 px-3">
        <DutyTaxCell shipment={shipment} />
      </td>

      {/* Clearance Status - far right, the only colored column */}
      <td className="py-3 px-3">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${info.color}`}
          >
            {info.icon}
            {info.label}
          </span>
          <p className="text-xs text-gray-500 ml-[22px]">{info.detail}</p>
        </div>
      </td>
    </tr>
  );
}

const COL_WIDTHS = "w-[15%] w-[18%] w-[22%] w-[20%] w-[25%]";

function TableHeader() {
  const headers = [
    { label: "Tracking #", className: "w-[15%]" },
    { label: "Route", className: "w-[18%]" },
    { label: "Order", className: "w-[15%]" },
    { label: "Duty & Tax", className: "w-[22%]" },
    { label: "Clearance Status", className: "w-[30%]" },
  ];

  return (
    <tr className="border-b border-border">
      {headers.map((h) => (
        <th
          key={h.label}
          className={`text-left py-2.5 px-3 text-xs font-semibold tracking-wider text-bp-gray uppercase ${h.className}`}
        >
          {h.label}
        </th>
      ))}
    </tr>
  );
}

export default function ShipmentsPage() {
  const [search, setSearch] = useState("");
  const [onTrackOpen, setOnTrackOpen] = useState(false);

  const filtered = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase()) ||
      s.origin.toLowerCase().includes(search.toLowerCase()) ||
      s.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  const attention = filtered.filter(needsAttention);
  const onTrack = filtered.filter((s) => !needsAttention(s));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Clearance"
        description={`${filtered.length} shipments${attention.length > 0 ? ` \u00b7 ${attention.length} need attention` : ""}`}
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bp-gray" />
        <Input
          placeholder="Filter by tracking #, order, destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-bp-light border-0"
        />
      </div>

      {/* Single table for consistent column alignment */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[18%]" />
            <col className="w-[15%]" />
            <col className="w-[22%]" />
            <col className="w-[30%]" />
          </colgroup>

          {/* Needs Attention */}
          {attention.length > 0 && (
            <>
              <thead>
                <tr>
                  <td colSpan={5} className="pt-1 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-bp-red" />
                      <span className="text-sm font-bold tracking-wide text-foreground uppercase">
                        Needs Attention
                      </span>
                      <span className="text-sm text-bp-gray">
                        {attention.length}
                      </span>
                    </div>
                  </td>
                </tr>
                <TableHeader />
              </thead>
              <tbody>
                {attention.map((s, idx) => (
                  <ShipmentRow key={s.id} shipment={s} even={idx % 2 === 1} />
                ))}
              </tbody>
            </>
          )}

          {/* On Track - collapsible */}
          {onTrack.length > 0 && (
            <>
              <thead>
                <tr>
                  <td colSpan={5} className="pt-6 pb-3">
                    <button
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setOnTrackOpen(!onTrackOpen)}
                      type="button"
                    >
                      {onTrackOpen ? (
                        <ChevronDown className="h-4 w-4 text-bp-gray" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-bp-gray" />
                      )}
                      <CheckCircle className="h-5 w-5 text-bp-green" />
                      <span className="text-sm font-bold tracking-wide text-foreground uppercase">
                        On Track
                      </span>
                      <span className="text-sm text-bp-gray">
                        {onTrack.length}
                      </span>
                    </button>
                  </td>
                </tr>
                {onTrackOpen && <TableHeader />}
              </thead>
              {onTrackOpen && (
                <tbody>
                  {onTrack.map((s, idx) => (
                    <ShipmentRow
                      key={s.id}
                      shipment={s}
                      even={idx % 2 === 1}
                    />
                  ))}
                </tbody>
              )}
            </>
          )}
        </table>
      </div>
    </div>
  );
}
