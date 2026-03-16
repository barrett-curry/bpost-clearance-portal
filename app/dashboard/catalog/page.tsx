"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Upload, Sparkles, Download, Loader2, Save, ArrowRight, ChevronRight } from "lucide-react";
import { products, type Product } from "@/lib/fake-data";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/fedex/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FedExTable,
  FedExTableRow,
  FedExTableCell,
} from "@/components/fedex/fedex-table";

const countryFlags: Record<string, string> = {
  FR: "🇫🇷",
  ES: "🇪🇸",
  IT: "🇮🇹",
  PT: "🇵🇹",
  CZ: "🇨🇿",
  CN: "🇨🇳",
  GB: "🇬🇧",
  US: "🇺🇸",
  DE: "🇩🇪",
  TW: "🇹🇼",
  AT: "🇦🇹",
  HU: "🇭🇺",
  JP: "🇯🇵",
  AR: "🇦🇷",
  AU: "🇦🇺",
  CL: "🇨🇱",
  BD: "🇧🇩",
  TR: "🇹🇷",
  IN: "🇮🇳",
  NP: "🇳🇵",
};

const platformSources = [
  { id: "shopify", name: "Shopify", color: "bg-green-500" },
  { id: "ebay", name: "eBay", color: "bg-blue-500" },
  { id: "amazon", name: "Amazon", color: "bg-orange-500" },
  { id: "walmart", name: "Walmart", color: "bg-blue-700" },
  { id: "etsy", name: "Etsy", color: "bg-orange-600" },
];

// Simulate platform-specific HS codes - some are wrong, some are missing, some are only 6 digits
// This shows the value of bpost classification
const platformHsCodes: Record<string, Record<string, { hsCode: string; coo: string; cooName: string }>> = {
  shopify: {
    "prod-001": { hsCode: "6109.10.00.40", coo: "BD", cooName: "Bangladesh" },
    "prod-002": { hsCode: "6202.93", coo: "CN", cooName: "China" },
    "prod-003": { hsCode: "", coo: "TR", cooName: "Turkey" },
    "prod-004": { hsCode: "6203.42.00.00", coo: "IN", cooName: "India" },
    "prod-005": { hsCode: "6203.42.40.00", coo: "BD", cooName: "Bangladesh" },
    "prod-006": { hsCode: "", coo: "", cooName: "" },
    "prod-007": { hsCode: "6505.00", coo: "NP", cooName: "Nepal" },
    "prod-008": { hsCode: "6401.92.90.00", coo: "CN", cooName: "China" },
    "prod-009": { hsCode: "6104.63", coo: "BD", cooName: "Bangladesh" },
    "prod-010": { hsCode: "6111.20.10.00", coo: "PT", cooName: "Portugal" },
    "prod-011": { hsCode: "", coo: "CN", cooName: "China" },
    "prod-012": { hsCode: "6201.93.00.00", coo: "CN", cooName: "China" },
    "prod-013": { hsCode: "6302.31", coo: "", cooName: "" },
    "prod-014": { hsCode: "", coo: "BD", cooName: "Bangladesh" },
    "prod-015": { hsCode: "6505.00.30.00", coo: "AU", cooName: "Australia" },
    "prod-016": { hsCode: "6111.20.90.00", coo: "IT", cooName: "Italy" },
    "prod-017": { hsCode: "4202.92", coo: "", cooName: "" },
    "prod-018": { hsCode: "", coo: "TR", cooName: "Turkey" },
    "prod-019": { hsCode: "6201.93", coo: "", cooName: "" },
    "prod-020": { hsCode: "6111.30.90.00", coo: "IT", cooName: "Italy" },
    "prod-021": { hsCode: "", coo: "CN", cooName: "China" },
    "prod-022": { hsCode: "6112.41", coo: "CN", cooName: "China" },
    "prod-023": { hsCode: "", coo: "ES", cooName: "Spain" },
    "prod-024": { hsCode: "6108.22", coo: "", cooName: "" },
  },
  ebay: {
    "prod-001": { hsCode: "6109.10", coo: "BD", cooName: "Bangladesh" },
    "prod-002": { hsCode: "", coo: "CN", cooName: "China" },
    "prod-003": { hsCode: "6204.62.40.00", coo: "TR", cooName: "Turkey" },
    "prod-004": { hsCode: "6204.42.00.00", coo: "IN", cooName: "India" },
    "prod-005": { hsCode: "", coo: "", cooName: "" },
    "prod-006": { hsCode: "6111.20.90.00", coo: "PT", cooName: "Portugal" },
    "prod-007": { hsCode: "", coo: "", cooName: "" },
    "prod-008": { hsCode: "6401.92", coo: "IN", cooName: "India" },
    "prod-009": { hsCode: "6104.63.00.00", coo: "TR", cooName: "Turkey" },
    "prod-010": { hsCode: "", coo: "PT", cooName: "Portugal" },
    "prod-011": { hsCode: "6203.42.00.00", coo: "CN", cooName: "China" },
    "prod-012": { hsCode: "6202.91.00.00", coo: "CN", cooName: "China" },
    "prod-013": { hsCode: "", coo: "", cooName: "" },
    "prod-014": { hsCode: "6203.42", coo: "BD", cooName: "Bangladesh" },
    "prod-015": { hsCode: "6505.00", coo: "CN", cooName: "China" },
    "prod-016": { hsCode: "6111.20.90.00", coo: "PT", cooName: "Portugal" },
    "prod-017": { hsCode: "4202.92.98.00", coo: "CN", cooName: "China" },
    "prod-018": { hsCode: "6104.63", coo: "TR", cooName: "Turkey" },
    "prod-019": { hsCode: "", coo: "CN", cooName: "China" },
    "prod-020": { hsCode: "", coo: "IT", cooName: "Italy" },
    "prod-021": { hsCode: "6105.10", coo: "", cooName: "" },
    "prod-022": { hsCode: "", coo: "", cooName: "" },
    "prod-023": { hsCode: "6404.19", coo: "ES", cooName: "Spain" },
    "prod-024": { hsCode: "6108.22.00.00", coo: "TR", cooName: "Turkey" },
  },
  amazon: {
    "prod-001": { hsCode: "6109.10.00.40", coo: "CN", cooName: "China" },
    "prod-002": { hsCode: "6202.93.00.00", coo: "CN", cooName: "China" },
    "prod-003": { hsCode: "", coo: "", cooName: "" },
    "prod-004": { hsCode: "6204.42", coo: "", cooName: "" },
    "prod-005": { hsCode: "", coo: "BD", cooName: "Bangladesh" },
    "prod-006": { hsCode: "6111.20", coo: "PT", cooName: "Portugal" },
    "prod-007": { hsCode: "6505.00.80.00", coo: "NP", cooName: "Nepal" },
    "prod-008": { hsCode: "", coo: "CN", cooName: "China" },
    "prod-009": { hsCode: "6104.63", coo: "", cooName: "" },
    "prod-010": { hsCode: "6111.20", coo: "PT", cooName: "Portugal" },
    "prod-011": { hsCode: "6204.44.00.00", coo: "IN", cooName: "India" },
    "prod-012": { hsCode: "", coo: "", cooName: "" },
    "prod-013": { hsCode: "6302.31.00.00", coo: "IN", cooName: "India" },
    "prod-014": { hsCode: "", coo: "", cooName: "" },
    "prod-015": { hsCode: "6505.00", coo: "AU", cooName: "Australia" },
    "prod-016": { hsCode: "6111.20", coo: "", cooName: "" },
    "prod-017": { hsCode: "4202.92.98.00", coo: "CN", cooName: "China" },
    "prod-018": { hsCode: "6104.63.00.00", coo: "TR", cooName: "Turkey" },
    "prod-019": { hsCode: "", coo: "", cooName: "" },
    "prod-020": { hsCode: "6111.30", coo: "IT", cooName: "Italy" },
    "prod-021": { hsCode: "6105.10.00.00", coo: "BD", cooName: "Bangladesh" },
    "prod-022": { hsCode: "6112.41", coo: "CN", cooName: "China" },
    "prod-023": { hsCode: "6404.19.90.00", coo: "ES", cooName: "Spain" },
    "prod-024": { hsCode: "", coo: "", cooName: "" },
  },
  walmart: {
    "prod-001": { hsCode: "", coo: "BD", cooName: "Bangladesh" },
    "prod-002": { hsCode: "", coo: "CN", cooName: "China" },
    "prod-003": { hsCode: "6204.62", coo: "TR", cooName: "Turkey" },
    "prod-004": { hsCode: "", coo: "", cooName: "" },
    "prod-005": { hsCode: "6203.42.40.00", coo: "BD", cooName: "Bangladesh" },
    "prod-006": { hsCode: "", coo: "", cooName: "" },
    "prod-007": { hsCode: "", coo: "NP", cooName: "Nepal" },
    "prod-008": { hsCode: "", coo: "", cooName: "" },
    "prod-009": { hsCode: "6104.63", coo: "TR", cooName: "Turkey" },
    "prod-010": { hsCode: "", coo: "", cooName: "" },
    "prod-011": { hsCode: "", coo: "", cooName: "" },
    "prod-012": { hsCode: "6202.91", coo: "", cooName: "" },
    "prod-013": { hsCode: "", coo: "IN", cooName: "India" },
    "prod-014": { hsCode: "", coo: "BD", cooName: "Bangladesh" },
    "prod-015": { hsCode: "6505.00", coo: "CN", cooName: "China" },
    "prod-016": { hsCode: "", coo: "", cooName: "" },
    "prod-017": { hsCode: "", coo: "", cooName: "" },
    "prod-018": { hsCode: "6104.63", coo: "", cooName: "" },
    "prod-019": { hsCode: "", coo: "", cooName: "" },
    "prod-020": { hsCode: "", coo: "", cooName: "" },
    "prod-021": { hsCode: "", coo: "", cooName: "" },
    "prod-022": { hsCode: "", coo: "", cooName: "" },
    "prod-023": { hsCode: "", coo: "", cooName: "" },
    "prod-024": { hsCode: "6108.22", coo: "", cooName: "" },
  },
  etsy: {
    "prod-001": { hsCode: "", coo: "", cooName: "" },
    "prod-002": { hsCode: "", coo: "", cooName: "" },
    "prod-003": { hsCode: "", coo: "", cooName: "" },
    "prod-004": { hsCode: "", coo: "", cooName: "" },
    "prod-005": { hsCode: "", coo: "", cooName: "" },
    "prod-006": { hsCode: "6111.20", coo: "PT", cooName: "Portugal" },
    "prod-007": { hsCode: "", coo: "NP", cooName: "Nepal" },
    "prod-008": { hsCode: "6401.92", coo: "CN", cooName: "China" },
    "prod-009": { hsCode: "6104.63", coo: "", cooName: "" },
    "prod-010": { hsCode: "", coo: "", cooName: "" },
    "prod-011": { hsCode: "", coo: "", cooName: "" },
    "prod-012": { hsCode: "6202.91", coo: "CN", cooName: "China" },
    "prod-013": { hsCode: "", coo: "", cooName: "" },
    "prod-014": { hsCode: "", coo: "", cooName: "" },
    "prod-015": { hsCode: "", coo: "", cooName: "" },
    "prod-016": { hsCode: "", coo: "", cooName: "" },
    "prod-017": { hsCode: "4202.92", coo: "CN", cooName: "China" },
    "prod-018": { hsCode: "", coo: "", cooName: "" },
    "prod-019": { hsCode: "", coo: "", cooName: "" },
    "prod-020": { hsCode: "", coo: "", cooName: "" },
    "prod-021": { hsCode: "6105.10", coo: "", cooName: "" },
    "prod-022": { hsCode: "", coo: "", cooName: "" },
    "prod-023": { hsCode: "6404.19", coo: "ES", cooName: "Spain" },
    "prod-024": { hsCode: "", coo: "", cooName: "" },
  },
};

const destinations = [
  { id: "us", name: "United States", flag: "🇺🇸" },
  { id: "fr", name: "France", flag: "🇫🇷" },
  { id: "mx", name: "Mexico", flag: "🇲🇽" },
  { id: "universal", name: "Universal Code", flag: "🌐" },
];

// Country-specific HS codes - the first 6 digits are universal, but national-level digits differ
// US uses HTS (10-digit), France uses EU CN/TARIC (10-digit), Mexico uses their tariff schedule
const destinationHsCodes: Record<string, Record<string, string>> = {
  us: {
    "prod-001": "6109.10.00.40", "prod-002": "6202.93.00.00", "prod-003": "6204.62.40.00",
    "prod-004": "6204.42.00.00", "prod-005": "6203.42.40.00", "prod-006": "6111.20.90.00",
    "prod-007": "6505.00.80.00", "prod-008": "6401.92.90.00", "prod-009": "6104.63.00.00",
    "prod-010": "6111.20.10.00", "prod-011": "6204.44.00.00", "prod-012": "6202.91.00.00",
    "prod-013": "6302.31.00.00", "prod-014": "6203.42.90.00", "prod-015": "6505.00.30.00",
    "prod-016": "6111.20.90.00", "prod-017": "4202.92.98.00", "prod-018": "6104.63.00.00",
    "prod-019": "6201.93.00.00", "prod-020": "6111.30.90.00", "prod-021": "6105.10.00.00",
    "prod-022": "6112.41.10.00", "prod-023": "6404.19.90.00", "prod-024": "6108.22.00.00",
  },
  fr: {
    "prod-001": "6109.10.00.10", "prod-002": "6202.93.00.10", "prod-003": "6204.62.31.00",
    "prod-004": "6204.42.00.10", "prod-005": "6203.42.31.00", "prod-006": "6111.20.90.10",
    "prod-007": "6505.00.80.00", "prod-008": "6401.92.90.10", "prod-009": "6104.63.00.10",
    "prod-010": "6111.20.10.10", "prod-011": "6204.44.00.10", "prod-012": "6202.91.00.10",
    "prod-013": "6302.31.00.10", "prod-014": "6203.42.31.10", "prod-015": "6505.00.30.00",
    "prod-016": "6111.20.90.10", "prod-017": "4202.92.98.10", "prod-018": "6104.63.00.10",
    "prod-019": "6201.93.00.10", "prod-020": "6111.30.90.10", "prod-021": "6105.10.00.10",
    "prod-022": "6112.41.10.10", "prod-023": "6404.19.90.10", "prod-024": "6108.22.00.10",
  },
  mx: {
    "prod-001": "6109.10.00.01", "prod-002": "6202.93.00.01", "prod-003": "6204.62.01.00",
    "prod-004": "6204.42.00.01", "prod-005": "6203.42.01.01", "prod-006": "6111.20.99.01",
    "prod-007": "6505.00.99.00", "prod-008": "6401.92.99.01", "prod-009": "6104.63.00.01",
    "prod-010": "6111.20.01.01", "prod-011": "6204.44.00.01", "prod-012": "6202.91.00.01",
    "prod-013": "6302.31.00.01", "prod-014": "6203.42.99.01", "prod-015": "6505.00.01.00",
    "prod-016": "6111.20.99.01", "prod-017": "4202.92.01.00", "prod-018": "6104.63.00.01",
    "prod-019": "6201.93.00.01", "prod-020": "6111.30.99.01", "prod-021": "6105.10.00.01",
    "prod-022": "6112.41.01.01", "prod-023": "6404.19.99.01", "prod-024": "6108.22.00.01",
  },
};

// Extract the universal 6-digit code (first two dot-separated groups)
function getUniversalCode(hsCode: string): string {
  const parts = hsCode.split(".");
  if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
  return hsCode;
}

// Get the recommended HS code for a product given a destination
function getRecommendedHsCode(productId: string, destination: string, fallbackHsCode: string): string {
  if (destination === "universal") return getUniversalCode(fallbackHsCode);
  const destCodes = destinationHsCodes[destination];
  if (destCodes && destCodes[productId]) return destCodes[productId];
  return fallbackHsCode;
}

function getHsCodeComparison(platformCode: string, rmCode: string): "match" | "mismatch" | "missing" {
  if (!platformCode) return "missing";
  if (platformCode === rmCode) return "match";
  return "mismatch";
}

function getCooComparison(platformCoo: string, rmCoo: string): "match" | "mismatch" | "missing" {
  if (!platformCoo) return "missing";
  if (platformCoo === rmCoo) return "match";
  return "mismatch";
}

export default function CatalogPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("shopify");
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifiedIds, setClassifiedIds] = useState<Set<string>>(new Set());
  const [classifyDone, setClassifyDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("us");
  const [platformDataState, setPlatformDataState] = useState(platformHsCodes);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const platform = platformSources.find((p) => p.id === selectedPlatform)!;

  const handleClassifyAll = useCallback(() => {
    if (isClassifying) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setIsClassifying(true);
    setClassifyDone(false);
    setClassifiedIds(new Set());
    setSaved(false);

    const productIds = products.map((p) => p.id);
    productIds.forEach((id, index) => {
      const timer = setTimeout(() => {
        setClassifiedIds((prev) => new Set([...prev, id]));

        if (index === productIds.length - 1) {
          const doneTimer = setTimeout(() => {
            setIsClassifying(false);
            setClassifyDone(true);
          }, 400);
          timersRef.current.push(doneTimer);
        }
      }, 500 + index * 600);
      timersRef.current.push(timer);
    });
  }, [isClassifying]);

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
    // Reset classification state when switching platforms
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setIsClassifying(false);
    setClassifyDone(false);
    setClassifiedIds(new Set());
    setSaved(false);
  };

  const handleSave = () => {
    // Apply recommended values back to the platform data
    setPlatformDataState((prev) => {
      const updated = { ...prev };
      updated[selectedPlatform] = { ...updated[selectedPlatform] };
      for (const product of products) {
        const recHsCode = getRecommendedHsCode(product.id, selectedDestination, product.hsCode);
        updated[selectedPlatform][product.id] = {
          hsCode: recHsCode,
          coo: product.coo,
          cooName: product.cooName,
        };
      }
      return updated;
    });
    setSaved(true);
  };

  const classifiedCount = isClassifying
    ? classifiedIds.size
    : classifyDone
      ? products.length
      : 0;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.hsCode.includes(search)
  );

  const platformData = platformDataState[selectedPlatform] || {};

  // Count mismatches and missing for the summary
  const mismatches = classifyDone
    ? products.filter((p) => {
        const pd = platformData[p.id];
        if (!pd) return false;
        const recCode = getRecommendedHsCode(p.id, selectedDestination, p.hsCode);
        return getHsCodeComparison(pd.hsCode, recCode) === "mismatch" ||
               getCooComparison(pd.coo, p.coo) === "mismatch";
      }).length
    : 0;

  const missing = classifyDone
    ? products.filter((p) => {
        const pd = platformData[p.id];
        if (!pd) return false;
        const recCode = getRecommendedHsCode(p.id, selectedDestination, p.hsCode);
        return getHsCodeComparison(pd.hsCode, recCode) === "missing" ||
               getCooComparison(pd.coo, p.coo) === "missing";
      }).length
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Catalog"
        description={`${products.length} PRODUCTS · ${classifiedCount} CLASSIFIED`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/catalog/import">
              <button className="px-5 py-2 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase">
                <span className="inline-flex items-center gap-1.5">
                  <Upload className="size-4" />
                  Import Products
                </span>
              </button>
            </Link>
            <button
              onClick={handleClassifyAll}
              disabled={isClassifying}
              className="px-5 py-2 text-xs font-bold tracking-wide text-accent-foreground bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-1.5">
                {isClassifying ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {isClassifying ? "Classifying..." : "Classify All"}
              </span>
            </button>
            <button className="px-5 py-2 text-xs font-bold tracking-wide text-bp-red hover:underline cursor-pointer uppercase">
              <span className="inline-flex items-center gap-1.5">
                <Download className="size-4" />
                Export CSV
              </span>
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">Source</span>
          <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[180px] bg-white border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platformSources.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <span className="flex items-center gap-2">
                    <span className={`inline-block size-2.5 rounded-full ${p.color}`} />
                    {p.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search products, SKUs, HS codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-bp-light border-0"
          />
        </div>
      </div>

      {/* Summary bar when classification is done */}
      {classifyDone && (mismatches > 0 || missing > 0) && (
        <div className={`flex items-center gap-4 px-4 py-3 text-sm border-l-4 ${saved ? "border-l-bp-green bg-green-50" : "border-l-bp-red bg-orange-50"}`}>
          {saved ? (
            <>
              <span className="font-semibold text-bp-green">Updated!</span>
              <span className="text-muted-foreground">
                {products.length} products synced to {platform.name}
              </span>
            </>
          ) : (
            <>
              {mismatches > 0 && (
                <span>
                  <span className="font-semibold text-bp-red">{mismatches}</span>
                  <span className="text-muted-foreground ml-1">HS code or COO corrections</span>
                </span>
              )}
              {missing > 0 && (
                <span>
                  <span className="font-semibold text-bp-red">{missing}</span>
                  <span className="text-muted-foreground ml-1">missing values enriched</span>
                </span>
              )}
            </>
          )}
        </div>
      )}

      <div>
        <FedExTable
          headers={[
            { label: "Product Name" },
            { label: "SKU" },
            { label: `HS Code (${platform.name})` },
            { label: (
              <span className="flex items-center gap-2">
                <span>Recommended HS Code</span>
                <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                  <SelectTrigger className="h-6 w-[160px] bg-white border-border text-[10px] font-bold tracking-wide uppercase px-2 py-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        <span className="flex items-center gap-1.5">
                          <span>{d.flag}</span>
                          {d.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>
            ) },
            { label: `COO (${platform.name})` },
            { label: "Recommended COO" },
          ]}
        >
          {filtered.map((product, idx) => {
            const pd = platformData[product.id] || { hsCode: "", coo: "", cooName: "" };
            const recHsCode = getRecommendedHsCode(product.id, selectedDestination, product.hsCode);
            const isRecommended = classifiedIds.has(product.id);
            const justClassified = isClassifying && isRecommended;
            const showRecommended = isRecommended || classifyDone;

            const hsComparison = showRecommended ? getHsCodeComparison(pd.hsCode, recHsCode) : null;
            const cooComparison = showRecommended ? getCooComparison(pd.coo, product.coo) : null;

            return (
              <FedExTableRow
                key={product.id}
                even={idx % 2 === 1}
                onClick={() => router.push(`/dashboard/catalog/${product.id}`)}
              >
                <FedExTableCell className="font-medium">{product.name}</FedExTableCell>
                <FedExTableCell className="text-muted-foreground">{product.sku}</FedExTableCell>

                {/* Platform HS Code */}
                <FedExTableCell>
                  {pd.hsCode ? (
                    <span className={`font-mono text-sm ${showRecommended && hsComparison === "mismatch" ? "text-red-500 line-through" : ""}`}>
                      {pd.hsCode}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Not set</span>
                  )}
                </FedExTableCell>

                {/* Recommended HS Code */}
                <FedExTableCell>
                  {showRecommended ? (
                    <span className={justClassified ? "animate-fade-in" : ""}>
                      <span className={`font-mono text-sm ${hsComparison === "mismatch" ? "text-bp-green font-semibold" : hsComparison === "missing" ? "text-bp-green font-semibold" : "text-muted-foreground"}`}>
                        {recHsCode}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">{product.confidence}%</span>
                      {hsComparison === "mismatch" && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase">Recommended</span>
                      )}
                      {hsComparison === "missing" && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase">New</span>
                      )}
                      {hsComparison === "match" && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase">Validated</span>
                      )}
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-muted-foreground">---</span>
                  )}
                </FedExTableCell>

                {/* Platform COO */}
                <FedExTableCell>
                  {pd.cooName ? (
                    <span className={showRecommended && cooComparison === "mismatch" ? "text-red-500 line-through" : ""}>
                      <span className="mr-1.5">{countryFlags[pd.coo] || ""}</span>
                      {pd.cooName}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Not set</span>
                  )}
                </FedExTableCell>

                {/* Recommended COO */}
                <FedExTableCell>
                  {showRecommended ? (
                    <span className={justClassified ? "animate-fade-in" : ""}>
                      <span className={cooComparison === "mismatch" || cooComparison === "missing" ? "font-semibold" : "text-muted-foreground"}>
                        <span className="mr-1.5">{countryFlags[product.coo] || ""}</span>
                        {product.cooName}
                      </span>
                      {cooComparison === "mismatch" && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase">Recommended</span>
                      )}
                      {cooComparison === "missing" && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase">New</span>
                      )}
                      {cooComparison === "match" && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase">Validated</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">---</span>
                  )}
                </FedExTableCell>
              </FedExTableRow>
            );
          })}
        </FedExTable>
      </div>

      {/* Save to Platform button */}
      {classifyDone && !saved && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-bold tracking-wide text-accent-foreground bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase inline-flex items-center gap-2"
          >
            <Save className="size-4" />
            Save Corrections to {platform.name}
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      {saved && (
        <div className="flex justify-end">
          <div className="px-6 py-2.5 text-sm font-bold tracking-wide text-bp-green uppercase inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-bp-green" />
            Synced to {platform.name}
          </div>
        </div>
      )}
    </div>
  );
}
