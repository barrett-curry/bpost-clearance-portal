"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { StatusDot } from "@/components/fedex/status-dot";
import { PageHeader } from "@/components/fedex/page-header";
import { alerts, getShipment, getProduct } from "@/lib/fake-data";

const priorityConfig: Record<string, { dotColor: "red" | "orange" | "yellow" | "blue"; barColor: string; label: string }> = {
  critical: { dotColor: "red", barColor: "bg-red-600", label: "Critical" },
  high: { dotColor: "orange", barColor: "bg-orange-500", label: "High" },
  medium: { dotColor: "yellow", barColor: "bg-yellow-500", label: "Medium" },
  low: { dotColor: "blue", barColor: "bg-blue-500", label: "Low" },
};

const typeLabels: Record<string, string> = {
  "pga-hold": "PGA Hold",
  "value-dispute": "Value Dispute",
  "hs-suggestion": "HS Classification",
  "docs-missing": "Missing Document",
  "profile-update": "Profile Update",
};

const statusToDot: Record<string, { color: "orange" | "blue" | "green"; label: string }> = {
  open: { color: "orange", label: "Open" },
  "in-progress": { color: "blue", label: "In Progress" },
  resolved: { color: "green", label: "Resolved" },
};

const filters = ["All", "Critical", "High", "Medium", "Low"] as const;

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredAlerts =
    activeFilter === "All"
      ? alerts
      : alerts.filter((a) => a.priority === activeFilter.toLowerCase());

  // Sort by priority
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...filteredAlerts].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="Action items requiring your attention across shipments and compliance"
      />

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors cursor-pointer ${
              activeFilter === f
                ? "bg-bp-red text-white"
                : "border border-border text-foreground hover:bg-bp-light"
            }`}
          >
            {f}
            {f !== "All" && (
              <span className="ml-1 opacity-70">
                ({alerts.filter((a) => a.priority === f.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert Rows */}
      <div className="space-y-3">
        {sorted.map((alert) => {
          const pc = priorityConfig[alert.priority];
          const sc = statusToDot[alert.status];
          const shipment = alert.shipmentId ? getShipment(alert.shipmentId) : undefined;
          const product = alert.productId ? getProduct(alert.productId) : undefined;

          return (
            <Link
              key={alert.id}
              href={`/dashboard/alerts/${alert.id}`}
              className="block"
            >
              <div className={`flex border-b border-border hover:bg-bp-light/30 transition-colors border-l-3 ${pc.barColor.replace('bg-', 'border-l-')}`}>

                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Status indicators row */}
                      <div className="flex items-center gap-3 mb-1.5">
                        <StatusDot color={pc.dotColor} label={pc.label} />
                        <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">{typeLabels[alert.type]}</span>
                        <StatusDot color={sc.color} label={sc.label} />
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.description}
                      </p>

                      {/* Linked shipment/product */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {shipment && (
                          <span>Shipment: {shipment.trackingNumber}</span>
                        )}
                        {product && (
                          <span>Product: {product.name}</span>
                        )}
                        <span>{alert.createdAt}</span>
                      </div>
                    </div>

                    <AlertTriangle className={`h-5 w-5 shrink-0 mt-1 ${
                      alert.priority === "critical" ? "text-red-600" :
                      alert.priority === "high" ? "text-orange-500" :
                      alert.priority === "medium" ? "text-yellow-500" : "text-blue-500"
                    }`} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
