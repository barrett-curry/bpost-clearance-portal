"use client";

import { useState } from "react";
import { PortalHeader } from "@/components/portal/header";
import { FedExSection } from "@/components/fedex/section";
import { StatusDot } from "@/components/fedex/status-dot";
import { DataRow } from "@/components/fedex/data-row";
import {
  Upload,
  ShoppingBag,
  CheckCircle,
  FileText,
  AlertTriangle,
  Package,
  DollarSign,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function VerifyValuePage() {
  const [uploadState, setUploadState] = useState<"idle" | "processing" | "done">("idle");
  const [connectState, setConnectState] = useState<"idle" | "connecting" | "done">("idle");
  const [dragOver, setDragOver] = useState(false);

  const verified = uploadState === "done" || connectState === "done";

  const handleUpload = () => {
    setUploadState("processing");
    setTimeout(() => setUploadState("done"), 2500);
  };

  const handleConnect = (channel: string) => {
    setConnectState("connecting");
    setTimeout(() => setConnectState("done"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bp-light">
      <PortalHeader />
      <div className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Success banner */}
          {verified && (
            <div className="mb-6 bg-bp-green/10 border border-bp-green/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-bp-green" />
                <div>
                  <p className="font-semibold text-bp-green">Value confirmed!</p>
                  <p className="text-sm text-bp-green/80">
                    Shipment FX8847291 value has been verified. Customs clearance will proceed.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-bp-red hover:bg-bp-red/90 text-accent-foreground font-bold tracking-wide uppercase transition-colors text-sm rounded-sm"
              >
                Explore Portal
              </Link>
            </div>
          )}

          {/* Shipment details header */}
          <FedExSection
            title="Value Verification Required"
            variant="static"
            icon={<AlertTriangle className="h-5 w-5 text-bp-red" />}
            className="mb-6 border-l-bp-red"
          >
            <p className="text-sm text-muted-foreground mb-4 mt-3">
              Shipment FX8847291 has been flagged for customs value verification
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">Contents</p>
                  <p className="text-sm font-medium">48x Kids Cotton T-Shirt Pack (3pk)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">Tracking</p>
                  <p className="text-sm font-medium">FX8847291</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-bp-red mt-0.5" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">Declared Value</p>
                  <p className="text-sm font-medium">€540.00</p>
                  <StatusDot color="orange" label="Below expected" className="mt-1" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">Expected Range</p>
                  <p className="text-sm font-medium">€840 - €1,080</p>
                  <p className="text-xs text-muted-foreground mt-1">€17.50 - €22.50 / pack</p>
                </div>
              </div>
            </div>
          </FedExSection>

          {/* Two column verification options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload receipt */}
            <FedExSection
              title="Upload Receipt or Invoice"
              variant="static"
              complete={uploadState === "done"}
              icon={<Upload className="h-5 w-5 text-bp-red" />}
            >
              <p className="text-sm text-muted-foreground mt-3 mb-4">
                Upload a purchase receipt, commercial invoice, or supplier price list
              </p>

              {uploadState === "idle" && (
                <div
                  className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors cursor-pointer ${
                    dragOver
                      ? "border-bp-red bg-bp-red/5"
                      : "border-gray-300 hover:border-bp-red/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleUpload();
                  }}
                  onClick={handleUpload}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              )}

              {uploadState === "processing" && (
                <div className="border border-border rounded-sm p-8 text-center">
                  <div className="relative mx-auto w-16 h-16 mb-4">
                    <Loader2 className="h-16 w-16 text-bp-red animate-spin" />
                  </div>
                  <p className="text-sm font-medium">Processing document...</p>
                  <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-3 w-3 text-bp-green" />
                      Document uploaded
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-bp-red" />
                      Running OCR extraction...
                    </p>
                    <p className="text-muted-foreground/50">Verifying line items</p>
                  </div>
                </div>
              )}

              {uploadState === "done" && (
                <div className="border border-bp-green/30 bg-bp-green/5 rounded-sm p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-bp-green mx-auto mb-3" />
                  <p className="text-sm font-semibold text-bp-green">
                    Value verified via invoice
                  </p>
                  <div className="mt-3 rounded-sm bg-white p-3 text-left space-y-1">
                    <DataRow label="Extracted value" value="€960.00" />
                    <DataRow label="Per unit" value="€20.00 / pack" />
                    <DataRow
                      label="Status"
                      value={
                        <span className="text-xs font-semibold text-bp-green bg-bp-green/10 px-2 py-0.5 rounded-sm">
                          Confirmed
                        </span>
                      }
                    />
                  </div>
                </div>
              )}
            </FedExSection>

            {/* Connect store */}
            <FedExSection
              title="Connect Your Store"
              variant="static"
              complete={connectState === "done"}
              icon={<ShoppingBag className="h-5 w-5 text-bp-red" />}
            >
              <p className="text-sm text-muted-foreground mt-3 mb-4">
                Connect a sales channel to automatically verify product values
              </p>

              {connectState === "idle" && (
                <div className="space-y-3">
                  {[
                    { name: "Shopify", color: "bg-[#96bf48]" },
                    { name: "eBay", color: "bg-[#e53238]" },
                    { name: "Amazon", color: "bg-[#ff9900]" },
                  ].map((channel) => (
                    <button
                      key={channel.name}
                      onClick={() => handleConnect(channel.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`h-8 w-8 rounded-sm ${channel.color} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {channel.name[0]}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs font-bold tracking-wide text-bp-red hover:underline uppercase">
                          {channel.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Connect {channel.name} account
                        </p>
                      </div>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {connectState === "connecting" && (
                <div className="border border-border rounded-sm p-8 text-center">
                  <div className="relative mx-auto w-16 h-16 mb-4">
                    <Loader2 className="h-16 w-16 text-bp-red animate-spin" />
                  </div>
                  <p className="text-sm font-medium">Connecting to store...</p>
                  <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-3 w-3 text-bp-green" />
                      Authorization received
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-bp-red" />
                      Fetching product catalog...
                    </p>
                  </div>
                </div>
              )}

              {connectState === "done" && (
                <div className="border border-bp-green/30 bg-bp-green/5 rounded-sm p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-bp-green mx-auto mb-3" />
                  <p className="text-sm font-semibold text-bp-green">
                    Store connected & value verified
                  </p>
                  <div className="mt-3 rounded-sm bg-white p-3 text-left space-y-1">
                    <DataRow label="Store price" value="€20.00 / pack" />
                    <DataRow label="Total (48x)" value="€960.00" />
                    <DataRow label="Products synced" value="247 items" />
                  </div>
                </div>
              )}
            </FedExSection>
          </div>
        </div>
      </div>
    </div>
  );
}
