"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  UserPlus,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { getShipment, getProduct, documents } from "@/lib/fake-data";
import { useState } from "react";
import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { StatusDot } from "@/components/fedex/status-dot";
import { DataRow } from "@/components/fedex/data-row";
import {
  FedExTable,
  FedExTableRow,
  FedExTableCell,
} from "@/components/fedex/fedex-table";

const docStatusColor: Record<string, "green" | "red" | "yellow"> = {
  verified: "green",
  missing: "red",
  pending: "yellow",
  rejected: "red",
  expired: "orange" as "red",
};

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const shipment = getShipment(id);
  const [note, setNote] = useState("");

  if (!shipment) return notFound();

  const shipmentDocs = documents.filter((d) => d.shipmentId === shipment.id);

  // Determine risk level from flags/status
  const riskLevel =
    shipment.flags.length >= 2
      ? "High"
      : shipment.flags.length === 1
        ? "Medium"
        : "Low";
  const riskDotColor: "red" | "orange" | "green" =
    riskLevel === "High"
      ? "red"
      : riskLevel === "Medium"
        ? "orange"
        : "green";
  const RiskIcon =
    riskLevel === "High"
      ? ShieldAlert
      : riskLevel === "Medium"
        ? Shield
        : ShieldCheck;

  // Missing items checklist
  const missingItems: string[] = [];
  if (shipment.clearanceStatus === "pga-hold")
    missingItems.push("CPSIA Children's Product Certificate");
  if (shipment.clearanceStatus === "value-dispute")
    missingItems.push("Purchase receipt or commercial invoice");
  if (shipment.clearanceStatus === "docs-missing")
    missingItems.push("Commercial invoice");
  if (shipment.flags.includes("CPSIA Certificate Required"))
    missingItems.push("CPSIA product safety documentation");

  // Recommended actions
  const actions: string[] = [];
  if (shipment.clearanceStatus === "pga-hold") {
    actions.push("Upload CPSIA Children's Product Certificate for each product");
    actions.push("Contact customs broker for expedited review");
  }
  if (shipment.clearanceStatus === "value-dispute") {
    actions.push("Upload purchase receipt to verify declared value");
    actions.push("Connect sales channel for automatic verification");
  }
  if (shipment.clearanceStatus === "docs-missing") {
    actions.push("Upload commercial invoice");
    actions.push("Generate invoice from order data");
  }
  if (actions.length === 0) {
    actions.push("No actions required - shipment is on track");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={shipment.trackingNumber}
        description={`${shipment.origin} → ${shipment.destination}`}
        action={
          <StatusDot
            color={riskDotColor}
            label={`${riskLevel} Risk`}
          />
        }
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Timeline + Items + Docs + Collaboration */}
        <div className="col-span-2 space-y-6">
          {/* Clearance Timeline */}
          <FedExSection
            title="Clearance Timeline"
            complete={shipment.clearanceStatus === "clear"}
          >
            <div className="relative pt-4">
              {shipment.timeline.map((step, i) => {
                const isLast = i === shipment.timeline.length - 1;
                const isActive = step.active;
                const isCompleted = !isActive && !isLast;
                const isFuture = isLast && !isActive;

                return (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0">
                    {/* Dot and line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          isActive
                            ? "bg-bp-red animate-pulse ring-4 ring-orange-100"
                            : isCompleted || !isFuture
                              ? "bg-bp-green"
                              : "bg-gray-300"
                        }`}
                      />
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 mt-1 ${
                            isCompleted ? "bg-bp-green" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-bp-gray">
                          {step.date}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {step.status}
                        </span>
                      </div>
                      <p className="text-sm text-bp-gray mt-0.5">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FedExSection>

          {/* Items Table */}
          <FedExSection title="Items" variant="static">
            <div className="pt-2">
              <FedExTable
                headers={[
                  { label: "Product" },
                  { label: "HS Code" },
                  { label: "Qty", className: "text-center" },
                  { label: "Value", className: "text-right" },
                ]}
              >
                {shipment.items.map((item, idx) => {
                  const product = getProduct(item.productId);
                  if (!product) return null;
                  return (
                    <FedExTableRow key={item.productId} even={idx % 2 === 1}>
                      <FedExTableCell className="font-medium">
                        {product.name}
                      </FedExTableCell>
                      <FedExTableCell className="font-mono text-xs">
                        {product.hsCode}
                      </FedExTableCell>
                      <FedExTableCell className="text-center">
                        {item.quantity}
                      </FedExTableCell>
                      <FedExTableCell className="text-right">
                        €{(product.value * item.quantity).toLocaleString()}
                      </FedExTableCell>
                    </FedExTableRow>
                  );
                })}
              </FedExTable>
            </div>
          </FedExSection>

          {/* Documents */}
          {shipmentDocs.length > 0 && (
            <FedExSection title="Documents" variant="static">
              <div className="space-y-2 pt-4">
                {shipmentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-bp-light/50 rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-bp-gray" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <StatusDot
                      color={
                        doc.status === "verified"
                          ? "green"
                          : doc.status === "missing"
                            ? "red"
                            : "yellow"
                      }
                      label={doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    />
                  </div>
                ))}
              </div>
            </FedExSection>
          )}

          {/* Collaboration */}
          <FedExSection title="Collaboration" variant="static">
            <div className="space-y-4 pt-4">
              <button className="text-xs font-bold tracking-wide text-bp-red hover:underline uppercase flex items-center gap-2 cursor-pointer">
                <UserPlus className="h-4 w-4" />
                Assign to Broker
              </button>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Add a note
                </label>
                <textarea
                  className="w-full border border-border rounded-sm p-3 text-sm bg-background min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Type a note about this shipment..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button className="px-4 py-2 text-xs font-bold tracking-wide bg-bp-red text-accent-foreground uppercase flex items-center gap-2 cursor-pointer hover:bg-bp-red/90 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  Add Note
                </button>
              </div>
            </div>
          </FedExSection>
        </div>

        {/* Right: Clearance Assistant */}
        <div>
          <div className="sticky top-6 border border-border">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-base font-bold text-foreground">
                Clearance Assistant
              </h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Risk Level */}
              <div>
                <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                  Risk Level
                </span>
                <div className="mt-1.5">
                  <StatusDot
                    color={riskDotColor}
                    label={riskLevel}
                  />
                </div>
              </div>

              {/* Missing Items */}
              {missingItems.length > 0 && (
                <div>
                  <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                    Missing Items
                  </span>
                  <ul className="mt-2 space-y-2">
                    {missingItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Actions */}
              <div>
                <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                  Recommended Actions
                </span>
                <ul className="mt-2 space-y-2">
                  {actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-bp-green shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipment Info */}
              <div className="border-t border-border pt-4 space-y-1">
                <DataRow
                  label="Declared Value"
                  value={`€${shipment.declaredValue.toLocaleString()}`}
                />
                {shipment.expectedValue && (
                  <DataRow
                    label="Expected Value"
                    value={`€${shipment.expectedValue.toLocaleString()}`}
                  />
                )}
                {shipment.dutyTax && (
                  <DataRow
                    label="Duty & Tax"
                    value={`€${shipment.dutyTax.toFixed(2)}`}
                  />
                )}
                <DataRow label="Ship Date" value={shipment.shipDate} />
              </div>

              {/* Zigzag delivery estimate */}
              <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
                <div
                  className="h-3 bg-bp-light"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 L10 0 L20 12' fill='%23ffffff' stroke='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "20px 12px",
                  }}
                />
                <div className="px-5 py-3 text-center">
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                    Est. Delivery
                  </p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {shipment.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
