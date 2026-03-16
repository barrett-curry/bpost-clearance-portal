"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, User, MessageSquare } from "lucide-react";
import { FedExSection } from "@/components/fedex/section";
import { StatusDot } from "@/components/fedex/status-dot";
import { DataRow } from "@/components/fedex/data-row";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAlert, getShipment, getProduct } from "@/lib/fake-data";

const priorityToDot: Record<string, { color: "red" | "orange" | "yellow" | "blue"; label: string }> = {
  critical: { color: "red", label: "Critical" },
  high: { color: "orange", label: "High" },
  medium: { color: "yellow", label: "Medium" },
  low: { color: "blue", label: "Low" },
};

const typeLabels: Record<string, string> = {
  "pga-hold": "PGA Hold",
  "value-dispute": "Value Dispute",
  "hs-suggestion": "HS Classification",
  "docs-missing": "Missing Document",
  "profile-update": "Profile Update",
};

const timeline = [
  { date: "Feb 23, 2026", event: "Alert created", icon: AlertTriangle, status: "complete" },
  { date: "Feb 24, 2026", event: "Reviewed by system", icon: CheckCircle, status: "complete" },
  { date: "Pending", event: "Awaiting response", icon: Clock, status: "pending" },
];

const brokers = [
  "Williams & Associates",
  "Global Trade Solutions",
  "Atlantic Customs Brokers",
  "Pacific Trade Partners",
];

export default function AlertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const alert = getAlert(id);
  const [note, setNote] = useState("");
  const [resolved, setResolved] = useState(false);

  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-muted-foreground">Alert not found</p>
        <Link
          href="/dashboard/alerts"
          className="px-6 py-2 text-sm font-bold tracking-wide uppercase border-2 border-bp-red text-bp-red hover:bg-bp-red/5 transition-colors"
        >
          Back to Alerts
        </Link>
      </div>
    );
  }

  const pc = priorityToDot[alert.priority];
  const shipment = alert.shipmentId ? getShipment(alert.shipmentId) : undefined;
  const product = alert.productId ? getProduct(alert.productId) : undefined;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/alerts" className="p-2 hover:bg-bp-light rounded-sm transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <StatusDot color={pc.color} label={pc.label} />
            <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">{typeLabels[alert.type]}</span>
            {resolved && <StatusDot color="green" label="Resolved" />}
          </div>
          <h1 className="text-xl font-bold text-foreground">{alert.title}</h1>
        </div>
      </div>

      {/* Details */}
      <FedExSection title="Details" variant="static">
        <p className="text-sm text-foreground leading-relaxed pt-2">{alert.description}</p>
      </FedExSection>

      {/* Affected Shipment/Product */}
      {(shipment || product) && (
        <FedExSection title="Affected Items" variant="static">
          <div className="space-y-3 pt-2">
            {shipment && (
              <div className="flex items-center justify-between p-3 rounded-sm bg-bp-light">
                <div>
                  <p className="text-sm font-medium">Shipment {shipment.trackingNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.origin} → {shipment.destination} | €{shipment.declaredValue.toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/dashboard/shipments/${shipment.id}`}
                  className="text-xs font-bold tracking-wide text-bp-red hover:underline uppercase"
                >
                  View
                </Link>
              </div>
            )}
            {product && (
              <div className="flex items-center justify-between p-3 rounded-sm bg-bp-light">
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    HS: {product.hsCode} | {product.cooName} | €{product.value}/{product.unit}
                  </p>
                </div>
                <Link
                  href={`/dashboard/catalog/${product.id}`}
                  className="text-xs font-bold tracking-wide text-bp-red hover:underline uppercase"
                >
                  View
                </Link>
              </div>
            )}
          </div>
        </FedExSection>
      )}

      {/* Required Actions */}
      <FedExSection title="Required Actions" variant="static">
        <div className="space-y-2 pt-2">
          {alert.actions.map((action, i) => (
            <div key={i} className="flex items-center gap-2 p-3 border border-border hover:bg-bp-light/50 transition-colors">
              <CheckCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">{action}</span>
            </div>
          ))}
        </div>
      </FedExSection>

      {/* Resolution Timeline */}
      <FedExSection title="Resolution Timeline" variant="static">
        <div className="space-y-4 pt-2">
          {timeline.map((entry, i) => {
            const Icon = entry.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 ${entry.status === "complete" ? "text-bp-green" : "text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${entry.status === "complete" ? "text-foreground" : "text-muted-foreground"}`}>
                    {entry.event}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </FedExSection>

      {/* Assign To */}
      <FedExSection
        title="Assign To"
        variant="static"
        icon={<User className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="pt-2">
          <Select defaultValue={brokers[0]}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select a broker" />
            </SelectTrigger>
            <SelectContent>
              {brokers.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FedExSection>

      {/* Notes */}
      <FedExSection
        title="Notes"
        variant="static"
        icon={<MessageSquare className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="space-y-3 pt-2">
          <Textarea
            placeholder="Add a note about this alert..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-24"
          />
          <button
            disabled={!note}
            className="px-6 py-2 text-xs font-bold tracking-wide uppercase border-2 border-bp-red text-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Note
          </button>
        </div>
      </FedExSection>

      {/* Resolve */}
      {!resolved && (
        <button
          className="px-8 py-2.5 text-sm font-bold tracking-wide uppercase bg-bp-red text-accent-foreground hover:bg-bp-red/90 transition-colors cursor-pointer inline-flex items-center gap-2"
          onClick={() => setResolved(true)}
        >
          <CheckCircle className="h-4 w-4" />
          Mark as Resolved
        </button>
      )}
    </div>
  );
}
