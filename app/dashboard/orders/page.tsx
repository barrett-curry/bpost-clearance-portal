"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, Send, ShieldAlert, Clock } from "lucide-react";
import { type Order, orders as initialOrders, demoCompany } from "@/lib/fake-data";
import { PageHeader } from "@/components/fedex/page-header";
import {
  FedExTable,
  FedExTableRow,
  FedExTableCell,
} from "@/components/fedex/fedex-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const channelLabel: Record<string, string> = {
  ebay: "eBay",
  shopify: "Shopify",
  amazon: "Amazon",
  walmart: "Walmart",
  etsy: "Etsy",
};

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

function daysAgo(dateStr: string): number {
  const sent = new Date(dateStr + "T00:00:00");
  const now = new Date();
  return Math.floor((now.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [collectTarget, setCollectTarget] = useState<Order | null>(null);
  const [collectSuccess, setCollectSuccess] = useState<string | null>(null);

  const dutyHoldCount = orders.filter((o) => o.status === "duty-hold").length;

  // Sort: collected_by_royal_mail (ready to ship) first, then duty-hold, then collect_upon_delivery, then collected_at_checkout
  const dutyTermsOrder: Record<string, number> = {
    collected_by_royal_mail: 0,
    "duty-hold": 1,
    collect_upon_delivery: 2,
    collected_at_checkout: 3,
  };
  const sortedOrders = [...orders].sort((a, b) => {
    const aKey = a.status === "duty-hold" ? "duty-hold" : a.dutyTerms;
    const bKey = b.status === "duty-hold" ? "duty-hold" : b.dutyTerms;
    return (dutyTermsOrder[aKey] ?? 4) - (dutyTermsOrder[bKey] ?? 4);
  });

  const handleSendNotice = () => {
    if (!collectTarget) return;
    const now = new Date().toISOString().split("T")[0];
    setOrders((prev) =>
      prev.map((o) =>
        o.id === collectTarget.id
          ? {
              ...o,
              status: "duty-hold" as const,
              collectNotice: {
                sentAt: now,
                customerEmail: o.customerEmail,
              },
            }
          : o
      )
    );
    setCollectSuccess(collectTarget.customerName);
    setCollectTarget(null);
    setTimeout(() => setCollectSuccess(null), 3000);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Orders"
        description={`${orders.length} orders${dutyHoldCount > 0 ? ` \u00b7 ${dutyHoldCount} on duty hold` : ""}`}
      />

      {collectSuccess && (
        <div className="flex items-center gap-2 rounded-md border border-bp-green/30 bg-bp-green/10 px-4 py-2 text-sm font-medium text-bp-green">
          <CheckCircle className="h-4 w-4" />
          Collection notice sent to {collectSuccess} from {demoCompany.name}. Order held until duties are paid.
        </div>
      )}

      <FedExTable
        headers={[
          { label: "Order #" },
          { label: "Date" },
          { label: "Channel" },
          { label: "Customer" },
          { label: "Duty & Tax" },
          { label: "Next Step" },
        ]}
      >
        {sortedOrders.map((order, idx) => {
          const canSendNotice =
            order.dutyTerms === "collect_upon_delivery" &&
            order.status !== "duty-hold" &&
            (order.dutyTax ?? 0) > 0;

          return (
            <FedExTableRow
              key={order.id}
              even={idx % 2 === 1}
              onClick={() => router.push(`/dashboard/orders/${order.id}`)}
            >
              <FedExTableCell>
                <div>
                  <span className="font-medium text-bp-red">{order.orderNumber}</span>
                  <p className="text-xs text-gray-500">€{order.totalValue.toLocaleString()} {order.currency}</p>
                </div>
              </FedExTableCell>
              <FedExTableCell className="text-xs text-bp-gray">
                {order.orderDate}
              </FedExTableCell>
              <FedExTableCell>
                <span className={`text-sm font-medium ${
                  order.channel === "shopify" ? "text-bp-green" :
                  order.channel === "amazon" ? "text-bp-red" :
                  order.channel === "ebay" ? "text-blue-600" :
                  order.channel === "walmart" ? "text-blue-600" :
                  "text-bp-red"
                }`}>
                  {channelLabel[order.channel]}
                </span>
              </FedExTableCell>
              <FedExTableCell>
                <div>
                  <span className="text-sm">{order.customerName}</span>
                  <p className="text-xs text-gray-500">{order.customerCity}, {order.customerCountry}</p>
                </div>
              </FedExTableCell>

              {/* Duty & Tax column */}
              <FedExTableCell>
                {(() => {
                  const taxLabel = countryTaxLabel[order.customerCountry] ?? "Duties & Taxes";
                  const amount = order.dutyTerms === "collected_by_royal_mail" || order.dutyTerms === "collected_at_checkout"
                    ? order.dutyCollected ?? 0
                    : order.dutyTax ?? 0;

                  if (order.dutyTerms === "collected_by_royal_mail") {
                    return (
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-bp-green">
                          <CheckCircle className="h-4 w-4" />
                          Collection Succeeded
                        </span>
                        <p className="text-xs text-gray-500 ml-[22px]">{taxLabel} €{amount.toFixed(2)}</p>
                      </div>
                    );
                  }
                  if (order.dutyTerms === "collected_at_checkout") {
                    return (
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-bp-green">
                          <CheckCircle className="h-4 w-4" />
                          Collected at Checkout
                        </span>
                        <p className="text-xs text-gray-500 ml-[22px]">{taxLabel} €{amount.toFixed(2)}</p>
                      </div>
                    );
                  }
                  if (order.status === "duty-hold" && order.collectNotice) {
                    const days = daysAgo(order.collectNotice.sentAt);
                    const urgencyColor = days >= 2 ? "text-red-600" : "text-bp-red";
                    return (
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${urgencyColor}`}>
                          <Clock className="h-4 w-4" />
                          Awaiting Payment &middot; {days} {days === 1 ? "day" : "days"}
                        </span>
                        <p className="text-xs text-gray-500 ml-[22px]">{taxLabel} €{amount.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-bp-red">
                        <AlertTriangle className="h-4 w-4" />
                        Collect Upon Delivery
                      </span>
                      {amount > 0 && (
                        <p className="text-xs text-gray-500 ml-[22px]">{taxLabel} €{amount.toFixed(2)}</p>
                      )}
                    </div>
                  );
                })()}
              </FedExTableCell>

              {/* Next Step column */}
              <FedExTableCell>
                {order.dutyTerms === "collected_by_royal_mail" || order.dutyTerms === "collected_at_checkout" ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-bp-green">
                    <CheckCircle className="h-4 w-4" />
                    Ready to Ship
                  </span>
                ) : order.status === "duty-hold" && order.collectNotice ? (() => {
                  const days = daysAgo(order.collectNotice.sentAt);
                  const urgencyColor = days >= 2 ? "text-red-600" : "text-bp-red";
                  return (
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${urgencyColor}`}>
                      <ShieldAlert className="h-4 w-4" />
                      Notice sent {order.collectNotice.sentAt}
                    </span>
                  );
                })() : canSendNotice ? (
                  <button
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-bp-red hover:text-bp-red cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCollectTarget(order);
                    }}
                  >
                    <Send className="h-4 w-4" />
                    Send for Collection
                  </button>
                ) : null}
              </FedExTableCell>
            </FedExTableRow>
          );
        })}
      </FedExTable>

      {/* Collection Notice Dialog */}
      <Dialog
        open={!!collectTarget}
        onOpenChange={(open) => {
          if (!open) setCollectTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-bp-red" />
              Send Duty Collection Notice
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Send a duty collection notice from{" "}
                  <strong>{demoCompany.name}</strong> to{" "}
                  <strong>{collectTarget?.customerName}</strong> for{" "}
                  <strong>€{collectTarget?.dutyTax?.toFixed(2)}</strong> in duties and taxes.
                </p>
                <p>
                  Hold this order until {collectTarget?.customerName?.split(" ")[0]} has
                  paid. Once payment is received, you&apos;ll be notified and the order will be
                  released for shipping - converting it to a DDP (Delivered Duty Paid) shipment.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border border-border bg-muted/50 p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order</span>
              <span className="font-medium">{collectTarget?.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium">{demoCompany.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{collectTarget?.customerName} ({collectTarget?.customerEmail})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duty & Tax Owed</span>
              <span className="font-bold text-bp-red">
                €{collectTarget?.dutyTax?.toFixed(2)}
              </span>
            </div>
          </div>

          <DialogFooter>
            <button
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
              onClick={() => setCollectTarget(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-bp-red text-white font-medium rounded-md hover:bg-bp-red/90 transition-colors flex items-center gap-2 cursor-pointer"
              onClick={handleSendNotice}
            >
              <Send className="h-4 w-4" />
              Send Notice & Hold Order
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
