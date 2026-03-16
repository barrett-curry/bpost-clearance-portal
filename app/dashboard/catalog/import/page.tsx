"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Download, CheckCircle2, XCircle, Loader2, Sparkles, Shield, Globe, DollarSign, Users, BadgeCheck } from "lucide-react";
import { integrations, type Integration } from "@/lib/fake-data";
import { FedExSection } from "@/components/fedex/section";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  FedExTable,
  FedExTableRow,
  FedExTableCell,
} from "@/components/fedex/fedex-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const channelColors: Record<string, string> = {
  shopify: "bg-green-500",
  ebay: "bg-blue-500",
  amazon: "bg-orange-500",
  walmart: "bg-blue-700",
  etsy: "bg-orange-600",
  sap: "bg-indigo-500",
  oracle: "bg-red-600",
};

const parsedCSVRows = [
  { name: "Chablis Premier Cru 2020", sku: "CPC-2020-750", hsCode: "2204.21.50.60", value: "€52.00", valid: true },
  { name: "Prosecco DOC NV", sku: "PDN-NV-750", hsCode: "2204.10.00.00", value: "€22.00", valid: true },
  { name: "Unknown Product", sku: "", hsCode: "", value: "€0.00", valid: false },
];

// Filter to sales channel integrations only (not ERP like SAP/Oracle)
const salesChannels = integrations.filter(
  (i) => !["sap", "oracle"].includes(i.channel)
);

const connectFeatures = [
  {
    icon: Sparkles,
    title: "AI-Powered Classification",
    description: "Patent-pending multimodal AI classifies products with 22% higher accuracy and 76% fewer errors.",
  },
  {
    icon: Globe,
    title: "Automated Data Enrichment",
    description: "Enrich HS codes, country of origin, customs value, and customs descriptions automatically.",
  },
  {
    icon: Shield,
    title: "Real-Time Restriction Screening",
    description: "Screen items against 222 import and 135 export countries for prohibited, restricted, or observed items.",
  },
  {
    icon: DollarSign,
    title: "Customs Value Validation",
    description: "Detect undervaluation automatically with probability scoring, avoiding customs holds.",
  },
  {
    icon: Users,
    title: "Denied Party Screening",
    description: "Smart matching against 100+ global denied party lists in 183 languages.",
  },
  {
    icon: BadgeCheck,
    title: "Landed Cost Guarantee",
    description: "Guaranteed duty, tax, and fee calculations upfront - zero discrepancies at delivery.",
  },
];

export default function CatalogImportPage() {
  const [uploaded, setUploaded] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Set<string>>(
    new Set(integrations.filter((i) => i.connected).map((i) => i.id))
  );
  const [modalChannel, setModalChannel] = useState<Integration | null>(null);

  function handleUpload() {
    setUploaded(true);
  }

  function handleConnect(integrationId: string) {
    setModalChannel(null);
    setConnecting(integrationId);
    setTimeout(() => {
      setConnected((prev) => new Set([...prev, integrationId]));
      setConnecting(null);
    }, 2000);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/catalog">
          <button className="p-1.5 hover:bg-bp-light rounded-sm transition-colors cursor-pointer">
            <ArrowLeft className="size-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Import Products</h1>
          <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase mt-0.5">
            Add products via CSV upload or channel integration
          </p>
        </div>
      </div>

      {/* CSV Upload Section */}
      <FedExSection title="CSV Upload" complete={uploaded} variant="static">
        <div className="pt-4 space-y-4">
          {!uploaded ? (
            <>
              <div
                onClick={handleUpload}
                className="border-2 border-dashed rounded-sm p-12 text-center cursor-pointer hover:border-bp-red hover:bg-bp-red/5 transition-colors"
              >
                <Upload className="size-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium">Drop your CSV file here, or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">Supports .csv and .xlsx files up to 10MB</p>
              </div>
              <div className="flex items-center gap-2">
                <Download className="size-4 text-muted-foreground" />
                <button className="text-xs font-bold tracking-wide text-bp-red hover:underline uppercase">
                  Download Template
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-bp-green" />
                <span className="font-medium">products_catalog.csv</span>
                <span className="text-muted-foreground">- 3 rows parsed</span>
              </div>
              <div className="border border-border">
                <FedExTable
                  headers={[
                    { label: "Product Name" },
                    { label: "SKU" },
                    { label: "HS Code" },
                    { label: "Value" },
                    { label: "Validation" },
                  ]}
                >
                  {parsedCSVRows.map((row, i) => (
                    <FedExTableRow key={i} even={i % 2 === 1}>
                      <FedExTableCell className="font-medium">
                        {row.name || <span className="text-muted-foreground italic">Missing</span>}
                      </FedExTableCell>
                      <FedExTableCell className="font-mono text-sm">
                        {row.sku || <span className="text-red-500">Missing</span>}
                      </FedExTableCell>
                      <FedExTableCell className="font-mono text-sm">
                        {row.hsCode || <span className="text-muted-foreground">-</span>}
                      </FedExTableCell>
                      <FedExTableCell>{row.value}</FedExTableCell>
                      <FedExTableCell>
                        {row.valid ? (
                          <StatusDot color="green" label="Valid" />
                        ) : (
                          <StatusDot color="red" label="Errors" />
                        )}
                      </FedExTableCell>
                    </FedExTableRow>
                  ))}
                </FedExTable>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2 text-xs font-bold tracking-wide text-accent-foreground bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase">
                  Import 2 Valid Products
                </button>
                <button
                  onClick={() => setUploaded(false)}
                  className="px-5 py-2 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase"
                >
                  Upload Different File
                </button>
              </div>
            </div>
          )}
        </div>
      </FedExSection>

      {/* Channel Integrations */}
      <FedExSection title="Channel Integrations" variant="static">
        <div className="pt-4">
          <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase mb-4">
            Connect your sales channels to automatically import products
          </p>
          <div className="flex flex-col">
            {salesChannels.map((integration) => {
              const isConnected = connected.has(integration.id);
              const isConnecting = connecting === integration.id;
              return (
                <div
                  key={integration.id}
                  className={`border-b border-border p-4 space-y-3 border-l-3 ${isConnected ? "border-l-bp-green" : "border-l-bp-gray"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-sm ${channelColors[integration.channel] || "bg-gray-500"} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {integration.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  {isConnected ? (
                    <div className="space-y-2">
                      <StatusDot color="green" label="Connected" />
                      {integration.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last sync: {integration.lastSync}
                        </p>
                      )}
                      {integration.productsImported && (
                        <p className="text-xs text-muted-foreground">
                          {integration.productsImported} products imported
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      className="w-full px-5 py-2 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isConnecting}
                      onClick={() => setModalChannel(integration)}
                    >
                      {isConnecting ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Loader2 className="size-4 animate-spin" /> Connecting...
                        </span>
                      ) : (
                        "Connect"
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </FedExSection>

      {/* Connect Sales Pitch Modal */}
      <Dialog open={modalChannel !== null} onOpenChange={(open) => { if (!open) setModalChannel(null); }}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Expedite Your Customs Clearance</DialogTitle>
            <DialogDescription className="text-base">
              Connect your {modalChannel?.name} catalog to the bpost Export & Customs Platform
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            By connecting your product catalog, bpost can pre-classify your items, validate customs values, and screen for restrictions - all before your shipments reach the border. This means faster clearance, fewer holds, and a smoother experience for your customers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            {connectFeatures.map((feature) => (
              <div key={feature.title} className="flex gap-3 p-3 rounded-sm border border-border">
                <div className="flex-shrink-0 mt-0.5">
                  <feature.icon className="size-5 text-bp-red" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-between">
            <button
              onClick={() => setModalChannel(null)}
              className="px-5 py-2 text-xs font-bold tracking-wide text-muted-foreground hover:text-foreground transition-colors cursor-pointer uppercase"
            >
              Cancel
            </button>
            <button
              onClick={() => modalChannel && handleConnect(modalChannel.id)}
              className="px-6 py-2.5 text-sm font-bold tracking-wide text-accent-foreground bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase"
            >
              Connect {modalChannel?.name}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
