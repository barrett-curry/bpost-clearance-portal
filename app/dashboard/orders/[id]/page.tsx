"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Package, CheckCircle, AlertTriangle, ShieldAlert, Clock, Mail } from "lucide-react";
import { getOrder, getProduct, demoCompany } from "@/lib/fake-data";
import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { DataRow } from "@/components/fedex/data-row";
import {
  FedExTable,
  FedExTableRow,
  FedExTableCell,
} from "@/components/fedex/fedex-table";

const channelLabel: Record<string, string> = {
  ebay: "eBay",
  shopify: "Shopify",
  amazon: "Amazon",
  walmart: "Walmart",
  etsy: "Etsy",
};

const dutyTermsLabel: Record<string, string> = {
  collected_at_checkout: "Collected at Checkout (DDP)",
  collect_upon_delivery: "Collect Upon Delivery (DAP)",
  collected_by_bpost: "Collected by bpost (DDP)",
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = getOrder(id);

  if (!order) return notFound();

  // Calculate item subtotals
  const itemRows = order.items.map((item) => {
    const product = getProduct(item.productId);
    return { ...item, product };
  });

  const subtotal = itemRows.reduce(
    (sum, row) => sum + (row.product ? row.product.value * row.quantity : 0),
    0
  );

  // Break dutyTax into components for display
  const dutyTax = order.dutyTax || 0;
  const duty = Math.round(dutyTax * 0.45 * 100) / 100;
  const tax = Math.round(dutyTax * 0.35 * 100) / 100;
  const fees = Math.round((dutyTax - duty - tax) * 100) / 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={order.orderNumber}
        description={`Order placed ${order.orderDate}`}
      />

      {/* Collected by bpost - Ready to Ship Banner */}
      {order.dutyTerms === "collected_by_bpost" && order.collectNotice && (
        <div className="flex items-start gap-3 rounded-lg border-2 border-bp-green/40 bg-green-50 px-5 py-4 dark:bg-green-950/20">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-bp-green" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-green-800 dark:text-green-400">
              Duties Collected - Ready to Ship
            </p>
            <p className="text-sm text-green-700 dark:text-green-500">
              {order.customerName} paid €{dutyTax.toFixed(2)} in duties and taxes
              on {order.collectNotice.paidAt}. This order is now a DDP shipment and ready to ship.
            </p>
          </div>
        </div>
      )}

      {/* Duty Hold Banner */}
      {order.status === "duty-hold" && order.collectNotice && (
        <div className="flex items-start gap-3 rounded-lg border-2 border-yellow-400/40 bg-yellow-50 px-5 py-4 dark:bg-yellow-950/20">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
              Order Held - Awaiting Duty Payment from {order.customerName.split(" ")[0]}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-500">
              A collection notice for €{dutyTax.toFixed(2)} was sent from{" "}
              <span className="font-medium">{demoCompany.name}</span> to{" "}
              <span className="font-medium">{order.collectNotice.customerEmail}</span>{" "}
              on {order.collectNotice.sentAt}. This order is held until {order.customerName.split(" ")[0]} pays
              the duties and taxes. Once paid, you&apos;ll be notified and the order will be
              released for shipping as a DDP shipment.
            </p>
          </div>
        </div>
      )}

      {/* Order Info */}
      <FedExSection title="Order Information" variant="static">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div>
            <DataRow label="Order Number" value={order.orderNumber} />
          </div>
          <div>
            <DataRow label="Channel" value={channelLabel[order.channel]} />
          </div>
          <div>
            <DataRow label="Customer" value={order.customerName} />
          </div>
          <div>
            <DataRow
              label="Destination"
              value={`${order.customerCity}, ${order.customerCountry}`}
            />
          </div>
        </div>

        {/* Duty Terms row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-border mt-4">
          <div>
            <DataRow
              label="Duty Terms"
              value={dutyTermsLabel[order.dutyTerms]}
            />
          </div>
          <div>
            {order.dutyTerms === "collected_by_bpost" ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-bp-green" />
                <span className="text-sm font-medium text-bp-green">
                  €{(order.dutyCollected ?? 0).toFixed(2)} collected - Ready to Ship
                </span>
              </div>
            ) : order.dutyTerms === "collected_at_checkout" ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-bp-green" />
                <span className="text-sm font-medium text-bp-green">
                  €{(order.dutyCollected ?? 0).toFixed(2)} collected
                </span>
              </div>
            ) : (order.dutyTax ?? 0) > 0 ? (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-bp-red" />
                <span className="text-sm font-medium text-bp-red">
                  €{order.dutyTax?.toFixed(2)} owed
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </FedExSection>

      {/* Collection Notice Status */}
      {(order.status === "duty-hold" || order.dutyTerms === "collected_by_bpost") && order.collectNotice && (
        <FedExSection title="Collection Notice Status" variant="static">
          <div className="pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bp-green/10">
                <Mail className="h-4 w-4 text-bp-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Notice Sent</p>
                <p className="text-xs text-bp-gray">
                  Sent to {order.collectNotice.customerEmail} on {order.collectNotice.sentAt}
                </p>
              </div>
            </div>
            {order.dutyTerms === "collected_by_bpost" ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bp-green/10">
                    <CheckCircle className="h-4 w-4 text-bp-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Payment Received</p>
                    <p className="text-xs text-bp-gray">
                      €{dutyTax.toFixed(2)} collected from {order.customerName} on {order.collectNotice.paidAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bp-green/10">
                    <Package className="h-4 w-4 text-bp-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bp-green">Ready to Ship</p>
                    <p className="text-xs text-bp-gray">
                      Order released for shipping as DDP
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Awaiting Payment</p>
                    <p className="text-xs text-bp-gray">
                      €{dutyTax.toFixed(2)} in duties and taxes owed by {order.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <CheckCircle className="h-4 w-4 text-bp-gray" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Payment Received & Released</p>
                    <p className="text-xs text-bp-gray">
                      Order released for shipping as DDP
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </FedExSection>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Items Table */}
        <div className="col-span-2">
          <FedExSection title="Items" variant="static">
            <div className="pt-2">
              <FedExTable
                headers={[
                  { label: "Product" },
                  { label: "HS Code" },
                  { label: "Qty", className: "text-center" },
                  { label: "Unit Price", className: "text-right" },
                  { label: "Subtotal", className: "text-right" },
                ]}
              >
                {itemRows.map((row, idx) => {
                  if (!row.product) return null;
                  return (
                    <FedExTableRow key={row.productId} even={idx % 2 === 1}>
                      <FedExTableCell className="font-medium">
                        {row.product.name}
                      </FedExTableCell>
                      <FedExTableCell className="font-mono text-xs">
                        {row.product.hsCode}
                      </FedExTableCell>
                      <FedExTableCell className="text-center">
                        {row.quantity}
                      </FedExTableCell>
                      <FedExTableCell className="text-right">
                        €{row.product.value.toFixed(2)}
                      </FedExTableCell>
                      <FedExTableCell className="text-right font-medium">
                        €{(row.product.value * row.quantity).toLocaleString()}
                      </FedExTableCell>
                    </FedExTableRow>
                  );
                })}
                <FedExTableRow className="border-t-2">
                  <FedExTableCell className="text-right font-semibold">{""}</FedExTableCell>
                  <FedExTableCell>{""}</FedExTableCell>
                  <FedExTableCell>{""}</FedExTableCell>
                  <FedExTableCell className="text-right font-semibold">
                    Merchandise Total
                  </FedExTableCell>
                  <FedExTableCell className="text-right font-bold">
                    €{subtotal.toLocaleString()}
                  </FedExTableCell>
                </FedExTableRow>
              </FedExTable>
            </div>
          </FedExSection>
        </div>

        {/* Landed Cost Breakdown */}
        <div className="space-y-4">
          <FedExSection title="Landed Cost Breakdown" variant="static">
            <div className="space-y-1 pt-4">
              {dutyTax > 0 ? (
                <>
                  <DataRow label="Customs Duty" value={`€${duty.toFixed(2)}`} />
                  <DataRow label="Tax" value={`€${tax.toFixed(2)}`} />
                  <DataRow label="Fees" value={`€${fees.toFixed(2)}`} />
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground">Total D&T</span>
                      <span className="font-bold text-bp-red">
                        €{dutyTax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-bp-gray">
                  Duty & tax estimate not yet calculated
                </p>
              )}
            </div>
          </FedExSection>

          {/* Ship with bpost CTA */}
          <button className="w-full px-8 py-4 bg-bp-red hover:bg-bp-red/90 text-accent-foreground text-base font-bold tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Package className="h-5 w-5" />
            Ship with bpost
          </button>
        </div>
      </div>
    </div>
  );
}
