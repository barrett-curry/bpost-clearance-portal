"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Upload, CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { products, documents } from "@/lib/fake-data";
import { FedExSection } from "@/components/fedex/section";
import { DataRow } from "@/components/fedex/data-row";
import { StatusDot } from "@/components/fedex/status-dot";

const countryFlags: Record<string, string> = {
  FR: "\u{1F1EB}\u{1F1F7}",
  ES: "\u{1F1EA}\u{1F1F8}",
  IT: "\u{1F1EE}\u{1F1F9}",
  PT: "\u{1F1F5}\u{1F1F9}",
  CZ: "\u{1F1E8}\u{1F1FF}",
  CN: "\u{1F1E8}\u{1F1F3}",
};

const alternativeCodes = [
  { code: "6109.10.00.12", confidence: 82, description: "T-shirts, of cotton, men's or boys'" },
  { code: "6109.90.10.00", confidence: 68, description: "T-shirts, of man-made fibres" },
];

const classificationHistory = [
  { event: "Ship Create", code: "6109.10.00.40", date: "2026-02-15", accepted: false },
  { event: "Customs Accept", code: "6109.10.00.40", date: "2026-02-18", accepted: true },
];

type PGARequirement = {
  agency: string;
  document: string;
  status: "uploaded" | "missing" | "pending";
  docId?: string;
};

function getPGARequirements(productId: string, pga: string[]): PGARequirement[] {
  const reqs: PGARequirement[] = [];
  if (pga.includes("CPSC")) {
    const cpscDoc = documents.find(
      (d) => d.type === "CPSC Prior Notice" && d.status === "verified"
    );
    reqs.push({
      agency: "CPSC",
      document: "CPSC Prior Notice",
      status: cpscDoc ? "uploaded" : "missing",
      docId: cpscDoc?.id,
    });
  }
  if (pga.includes("CPSIA")) {
    const cpcDoc = documents.find(
      (d) => d.type === "CPSIA CPC" && d.productId === productId
    );
    reqs.push({
      agency: "CPSIA",
      document: "CPSIA Children's Product Certificate",
      status: cpcDoc ? (cpcDoc.status === "verified" ? "uploaded" : "pending") : "missing",
      docId: cpcDoc?.id,
    });
  }
  return reqs;
}

export default function CatalogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const [showImproved, setShowImproved] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Link href="/dashboard/catalog">
          <button className="mt-4 px-5 py-2 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase inline-flex items-center gap-1.5">
            <ArrowLeft className="size-4" /> Back to Catalog
          </button>
        </Link>
      </div>
    );
  }

  const pgaReqs = getPGARequirements(product.id, product.pga);
  const descStrength = product.description.length > 60 ? 90 : product.description.length > 30 ? 60 : 30;
  const strengthLabel = descStrength >= 80 ? "Strong" : descStrength >= 50 ? "Moderate" : "Weak";
  const strengthColor = descStrength >= 80 ? "bg-bp-green" : descStrength >= 50 ? "bg-yellow-500" : "bg-red-500";

  const allDocsReady = pgaReqs.every((r) => r.status === "uploaded");
  const hasNoRestrictions = product.restrictions.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/catalog">
          <button className="p-1.5 hover:bg-bp-light rounded-sm transition-colors cursor-pointer">
            <ArrowLeft className="size-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase mt-0.5">{product.sku}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <FedExSection title="Product Description" complete={descStrength >= 80}>
            <div className="pt-4 space-y-4">
              <p className="text-sm">
                {showImproved
                  ? `${product.name} - ${product.description}. Sourced from certified manufacturers, this product meets all international trade compliance standards for cross-border shipment. Materials: ${product.materials}. Compliant with CPSIA, EU Textile Regulation, and Oeko-Tex Standard 100 requirements.`
                  : product.description}
              </p>
              <button
                onClick={() => setShowImproved(!showImproved)}
                className="px-4 py-1.5 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase inline-flex items-center gap-1.5"
              >
                <Sparkles className="size-3.5" />
                {showImproved ? "Show Original" : "Improve with AI"}
              </button>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-bp-gray">Description Strength</span>
                  <span className="font-medium">{strengthLabel}</span>
                </div>
                <div className="h-2 w-full rounded-sm bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-sm transition-all ${strengthColor}`}
                    style={{ width: `${descStrength}%` }}
                  />
                </div>
              </div>
            </div>
          </FedExSection>

          {/* HS Code */}
          <FedExSection title="HS Classification" complete={product.classificationStatus === "classified"}>
            <div className="pt-4 space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-mono font-bold">{product.hsCode}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-sm bg-muted overflow-hidden">
                    <div className="h-full rounded-sm bg-bp-green" style={{ width: `${product.confidence}%` }} />
                  </div>
                  <span className="text-sm font-medium text-bp-green">{product.confidence}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                T-shirts, singlets and other vests, of cotton, knitted or crocheted
              </p>

              <div className="border-t border-border/50 pt-4">
                <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase mb-3">Alternative Classifications</p>
                <div className="space-y-3">
                  {alternativeCodes.map((alt) => (
                    <div key={alt.code} className="flex items-center justify-between border border-border p-3">
                      <div>
                        <span className="font-mono text-sm font-medium">{alt.code}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{alt.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-sm bg-muted overflow-hidden">
                          <div className="h-full rounded-sm bg-bp-gray" style={{ width: `${alt.confidence}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{alt.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FedExSection>

          {/* Product Details */}
          <FedExSection title="Product Details" complete variant="static">
            <div className="pt-4 space-y-1">
              <DataRow label="Country of Origin" value={<>{countryFlags[product.coo]} {product.cooName}</>} />
              <DataRow label="Unit Value" value={`€${product.value.toFixed(2)} ${product.currency}/${product.unit}`} />
              <DataRow label="Weight" value={`${product.weight} ${product.weightUnit}`} />
              <DataRow label="Materials" value={product.materials} />
            </div>
          </FedExSection>
        </div>

        {/* Right column - compliance */}
        <div className="space-y-6">
          {/* PGA Requirements */}
          {pgaReqs.length > 0 && (
            <FedExSection title="PGA Requirements" complete={allDocsReady}>
              <div className="pt-4 space-y-3">
                {pgaReqs.map((req) => (
                  <div key={req.agency} className="flex items-center justify-between border border-border p-3">
                    <div className="flex items-center gap-2">
                      {req.status === "uploaded" ? (
                        <CheckCircle2 className="size-4 text-bp-green" />
                      ) : req.status === "pending" ? (
                        <Clock className="size-4 text-yellow-600" />
                      ) : (
                        <XCircle className="size-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{req.agency}</p>
                        <p className="text-xs text-muted-foreground">{req.document}</p>
                      </div>
                    </div>
                    {req.status === "missing" && (
                      <button className="px-3 py-1 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase inline-flex items-center gap-1">
                        <Upload className="size-3" /> Upload
                      </button>
                    )}
                    {req.status === "uploaded" && (
                      <StatusDot color="green" label="Uploaded" />
                    )}
                    {req.status === "pending" && (
                      <StatusDot color="yellow" label="Pending" />
                    )}
                  </div>
                ))}
              </div>
            </FedExSection>
          )}

          {/* Restrictions */}
          <FedExSection title="Restrictions" complete={hasNoRestrictions}>
            <div className="pt-4">
              {product.restrictions.length > 0 ? (
                <div className="space-y-2">
                  {product.restrictions.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="size-4 text-yellow-600 mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-bp-green">
                  <ShieldCheck className="size-4" />
                  No restrictions
                </div>
              )}
            </div>
          </FedExSection>

          {/* Required Documents */}
          <FedExSection title="Required Documents" complete={product.coo !== "CN" && pgaReqs.every(r => r.status === "uploaded")}>
            <div className="pt-4 space-y-2">
              {[
                { name: "Commercial Invoice", done: true },
                { name: "Certificate of Origin", done: product.coo !== "CN" },
                ...(product.pga.includes("CPSC") ? [{ name: "CPSC Prior Notice", done: true }] : []),
                ...(product.pga.includes("CPSIA") ? [{ name: "CPSIA Children's Product Certificate", done: product.id === "prod-001" }] : []),
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {doc.done ? (
                    <CheckCircle2 className="size-4 text-bp-green" />
                  ) : (
                    <XCircle className="size-4 text-red-500" />
                  )}
                  <span className={doc.done ? "" : "text-red-600 font-medium"}>{doc.name}</span>
                </div>
              ))}
            </div>
          </FedExSection>

          {/* Classification History */}
          <FedExSection title="Classification History" complete>
            <div className="pt-4 space-y-3">
              {classificationHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 size-2 rounded-full shrink-0 ${entry.accepted ? "bg-bp-green" : "bg-blue-500"}`} />
                  <div>
                    <p className="text-sm font-medium">
                      {entry.event}: <span className="font-mono">{entry.code}</span>
                      {entry.accepted && " \u2713"}
                    </p>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </FedExSection>
        </div>
      </div>
    </div>
  );
}
