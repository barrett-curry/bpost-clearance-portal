"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Zap,
  Activity,
  Clock,
  ShieldCheck,
  RefreshCw,
  Eye,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Globe,
  DollarSign,
  Layers,
  Search,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FedExSection } from "@/components/fedex/section";
import { PageHeader } from "@/components/fedex/page-header";
import { ApiCallButton, ApiCallDetailSheet, type ApiCallInfo } from "@/components/ui/api-call-detail";

// ---------------------------------------------------------------------------
// Types — Classify (classificationsCalculate)
// ---------------------------------------------------------------------------

interface HsFragment {
  code: string;
  description: string;
}

interface ClassifyAlternate {
  subheadingAlternate: {
    code: string;
    fragments: HsFragment[];
  };
  probabilityMass: number;
  tariffAlternates: { code: string }[];
}

interface ClassifyResult {
  id: string;
  confidenceScore: number;
  customsDescription: string;
  hsCode: {
    code: string;
    description?: { friendly?: string };
    fragments: HsFragment[];
  };
  configuration: { shipToCountry: string };
  alternates: ClassifyAlternate[];
}

interface ClassifyResponse {
  data?: {
    classificationsCalculate?: ClassifyResult[];
  };
  error?: string;
}

// ---------------------------------------------------------------------------
// Types — Vision (itemsExtract)
// ---------------------------------------------------------------------------

interface VisionClassification {
  confidenceScore: number;
  hsCode: {
    code: string;
    description?: { friendly?: string; full?: string };
  };
  customsDescription?: string;
  categories?: string[];
  countryOfOrigin?: string;
  auditTrail?: string;
}

interface CountryOfOriginInference {
  confidenceScore: number;
  countryOfOrigin: string;
  description: string;
}

interface ValueEstimation {
  currency: string;
  name: string;
  value: number;
  description?: string;
  valueEstimateRange?: { low: number; high: number; width: number };
}

interface VisionExtractItem {
  classification: VisionClassification;
  countryOfOriginInference?: CountryOfOriginInference;
  valueEstimation?: ValueEstimation;
}

interface VisionResponse {
  data?: {
    itemsExtract?: VisionExtractItem[] | VisionExtractItem;
  };
  error?: string;
}

// ---------------------------------------------------------------------------
// Static recent classifications table data
// ---------------------------------------------------------------------------

const RECENT_CLASSIFICATIONS = [
  { product: "Organic Cotton T-Shirt (Black, L)", hs: "6109.10.00", confidence: 96.1, source: "API", account: "ASOS UK Ltd", time: "2 min ago" },
  { product: "Lithium-Ion Battery Pack 5000mAh", hs: "8507.60.00", confidence: 91.3, source: "API", account: "TechDirect PLC", time: "5 min ago" },
  { product: "Children's Waterproof Jacket (Blue)", hs: "6202.93.00", confidence: 88.7, source: "Vision", account: "Rosie & Jack Kidswear", time: "8 min ago" },
  { product: "Children's Wooden Building Blocks", hs: "9503.00.60", confidence: 94.8, source: "API", account: "Hamleys Ltd", time: "12 min ago" },
  { product: "Stainless Steel Kitchen Knife Set", hs: "8211.91.00", confidence: 72.4, source: "API", account: "ProCook Ltd", time: "15 min ago" },
  { product: "Handmade Ceramic Vase (Decorative)", hs: "6913.90.00", confidence: 58.2, source: "Manual", account: "Not on the High Street", time: "22 min ago" },
  { product: "Bluetooth Wireless Earbuds", hs: "8518.30.20", confidence: 93.6, source: "Vision", account: "Currys PLC", time: "28 min ago" },
  { product: "Cashmere-Blend Scarf", hs: "6214.20.00", confidence: 81.9, source: "API", account: "Burberry Group", time: "34 min ago" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function confidenceColor(score: number): string {
  if (score >= 85) return "text-bp-green";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
}

function confidenceBg(score: number): string {
  if (score >= 85) return "bg-bp-green";
  if (score >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

function confidenceLabel(score: number): string {
  if (score >= 85) return "High";
  if (score >= 70) return "Medium";
  return "Low";
}

function sourceBadgeVariant(source: string) {
  switch (source) {
    case "API":
      return "bg-bp-green/10 text-bp-green border-bp-green/20";
    case "Vision":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "Manual":
      return "bg-bp-yellow/20 text-yellow-700 border-bp-yellow/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function countryName(code: string): string {
  const map: Record<string, string> = {
    CN: "China", US: "United States", FR: "France", DE: "Germany",
    GB: "United Kingdom", IT: "Italy", JP: "Japan", KR: "South Korea",
    IN: "India", VN: "Vietnam", BD: "Bangladesh",
  };
  return map[code] || code;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClassifyPage() {
  // Active mode
  const [activeTab, setActiveTab] = useState<"classify" | "vision">("classify");

  // Classify tab state
  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState("");
  const [shipToCountry, setShipToCountry] = useState("US");

  // Vision tab state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shared result state
  const [loading, setLoading] = useState(false);
  const [classifyResult, setClassifyResult] = useState<ClassifyResponse | null>(null);
  const [visionResult, setVisionResult] = useState<VisionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [auditExpanded, setAuditExpanded] = useState(false);
  const [apiCallInfo, setApiCallInfo] = useState<ApiCallInfo | null>(null);
  const [apiDetailOpen, setApiDetailOpen] = useState(false);

  // Bulk
  const [bulkProgress, setBulkProgress] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  async function handleClassify() {
    setLoading(true);
    setError(null);
    setClassifyResult(null);
    setVisionResult(null);
    setShowResult(false);
    setAuditExpanded(false);
    setApiCallInfo(null);

    try {
      if (activeTab === "classify") {
        const payload: Record<string, unknown> = { name: productName };
        if (categories.trim()) {
          payload.categories = categories.split(",").map((c) => c.trim()).filter(Boolean);
        }
        if (shipToCountry.trim()) {
          payload.shipToCountry = shipToCountry.trim();
        }

        const t0 = performance.now();
        const res = await fetch("/api/zonos/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - t0);

        setApiCallInfo({
          endpoint: "/api/zonos/classify",
          mutation: "classificationsCalculate",
          variables: payload,
          response: data,
          responseTimeMs: elapsed,
          httpStatus: res.status,
          timestamp: new Date().toISOString(),
        });

        if (!res.ok) {
          setError(data.error || `API returned ${res.status}`);
        } else if (!data?.data?.classificationsCalculate?.length) {
          setError(data.error || "Classification API returned no results");
        } else {
          setClassifyResult(data as ClassifyResponse);
          setTimeout(() => setShowResult(true), 50);
        }
      } else {
        // Vision tab
        const visionPayload = { imageBase64 };
        const t0 = performance.now();
        const res = await fetch("/api/zonos/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visionPayload),
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - t0);

        setApiCallInfo({
          endpoint: "/api/zonos/vision",
          mutation: "itemsExtract",
          variables: { imageBase64: `[base64 image, ${((imageBase64?.length || 0) / 1024).toFixed(0)}KB]` },
          response: data,
          responseTimeMs: elapsed,
          httpStatus: res.status,
          timestamp: new Date().toISOString(),
        });

        if (!res.ok) {
          setError(data.error || `API returned ${res.status}`);
        } else {
          const extract = Array.isArray(data?.data?.itemsExtract) ? data.data.itemsExtract[0] : data?.data?.itemsExtract;
          if (!extract?.classification) {
            setError(data.error || "Vision API returned no classification data");
          } else {
            setVisionResult(data as VisionResponse);
            setTimeout(() => setShowResult(true), 50);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  }, []);

  function processImage(file: File) {
    if (!file.type.startsWith("image/")) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImagePreview(null);
    setImageBase64(null);
    setImageName("");
    setVisionResult(null);
    setShowResult(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleBulk() {
    setBulkProgress(0);
    const interval = setInterval(() => {
      setBulkProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  }

  // ---------------------------------------------------------------------------
  // Extract result data
  // ---------------------------------------------------------------------------

  const rawClassifyData = classifyResult?.data?.classificationsCalculate?.[0];
  // Zonos returns confidenceScore as decimal (0.83), normalize to percentage
  const classifyData = rawClassifyData
    ? {
        ...rawClassifyData,
        confidenceScore: rawClassifyData.confidenceScore <= 1
          ? rawClassifyData.confidenceScore * 100
          : rawClassifyData.confidenceScore,
      }
    : undefined;
  // Zonos returns itemsExtract as an array; handle both array and object
  const rawVisionData = visionResult?.data?.itemsExtract;
  const visionData = Array.isArray(rawVisionData) ? rawVisionData[0] : rawVisionData;
  const rawVisionClassification = visionData?.classification;
  // Normalize confidence from decimal to percentage
  const visionClassification = rawVisionClassification
    ? {
        ...rawVisionClassification,
        confidenceScore: rawVisionClassification.confidenceScore <= 1
          ? rawVisionClassification.confidenceScore * 100
          : rawVisionClassification.confidenceScore,
      }
    : undefined;
  const rawOriginInference = visionData?.countryOfOriginInference;
  const originInference = rawOriginInference
    ? {
        ...rawOriginInference,
        confidenceScore: rawOriginInference.confidenceScore <= 1
          ? rawOriginInference.confidenceScore * 100
          : rawOriginInference.confidenceScore,
      }
    : undefined;
  const valueEstimation = visionData?.valueEstimation;

  // ---------------------------------------------------------------------------
  // Render: Classify Results Panel
  // ---------------------------------------------------------------------------

  function renderClassifyResults() {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (!classifyData || !showResult) return null;

    const score = classifyData.confidenceScore;

    return (
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Primary HS Code Result */}
        <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
          <div
            className="h-3 bg-bp-light"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 L10 0 L20 12' fill='%23ffffff' stroke='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "20px 12px",
            }}
          />
          <div className="px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase mb-1">HS Code</p>
                <span className="text-4xl font-mono font-black tracking-tight">{classifyData.hsCode.code}</span>
              </div>
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${score >= 85 ? "border-bp-green/30 bg-bp-green/5 text-bp-green" : score >= 70 ? "border-yellow-500/30 bg-yellow-50 text-yellow-700" : "border-red-500/30 bg-red-50 text-red-700"}`}>
                {confidenceLabel(score)} Confidence
              </Badge>
            </div>

            {/* Confidence bar */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase w-24 shrink-0">Confidence</span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${confidenceBg(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={`text-sm font-bold tabular-nums ${confidenceColor(score)}`}>{score.toFixed(1)}%</span>
            </div>

            {/* Description */}
            {(classifyData.hsCode.description?.friendly || classifyData.customsDescription) && (
              <div className="mt-4 p-3 bg-muted/50 rounded-sm">
                <p className="text-sm text-foreground leading-relaxed">
                  {classifyData.hsCode.description?.friendly || classifyData.customsDescription}
                </p>
              </div>
            )}

            {/* Customs Description (if different from HS friendly) */}
            {classifyData.customsDescription && classifyData.hsCode.description?.friendly && classifyData.customsDescription !== classifyData.hsCode.description.friendly && (
              <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-sm">
                <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase mb-1">Customs Description</p>
                <p className="text-sm text-foreground leading-relaxed">{classifyData.customsDescription}</p>
              </div>
            )}

            {/* Ship-to Country */}
            {classifyData.configuration?.shipToCountry && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="size-3.5" />
                <span>Ship to: <strong>{countryName(classifyData.configuration.shipToCountry)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* HS Code Fragments (Tariff Hierarchy) */}
        {classifyData.hsCode.fragments && classifyData.hsCode.fragments.length > 0 && (
          <div className="border border-border rounded-sm p-4 space-y-3">
            <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase">Tariff Hierarchy</p>
            <div className="space-y-2">
              {classifyData.hsCode.fragments.map((frag, i) => (
                <div key={frag.code} className="flex items-start gap-3">
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {Array.from({ length: i + 1 }).map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full bg-bp-red/60" />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{frag.code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{frag.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Classifications */}
        {classifyData.alternates && classifyData.alternates.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase">Alternative Classifications</p>
            <div className="space-y-2">
              {classifyData.alternates.map((alt) => (
                <div key={alt.subheadingAlternate.code} className="flex items-center justify-between border border-border rounded-sm p-3 hover:bg-muted/30 transition-colors">
                  <div>
                    <span className="font-mono text-sm font-semibold">{alt.subheadingAlternate.code}</span>
                    {alt.subheadingAlternate.fragments?.[0]?.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{alt.subheadingAlternate.fragments[0].description}</p>
                    )}
                    {alt.tariffAlternates?.length > 0 && (
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">
                        Tariff: {alt.tariffAlternates.map((t) => t.code).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${confidenceBg((alt.probabilityMass || 0) * 100)}`}
                        style={{ width: `${(alt.probabilityMass || 0) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold tabular-nums ${confidenceColor((alt.probabilityMass || 0) * 100)}`}>
                      {((alt.probabilityMass || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button className="bg-bp-red hover:bg-bp-red/90 text-white font-bold tracking-wide uppercase text-xs px-6">
            <CheckCircle2 className="size-3.5" />
            Accept &amp; Save to Catalogue
          </Button>
          <Button variant="outline" className="font-bold tracking-wide uppercase text-xs px-6">
            <RefreshCw className="size-3.5" />
            Reclassify
          </Button>
          {apiCallInfo && (
            <ApiCallButton onClick={() => setApiDetailOpen(true)} />
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Vision Results Panel
  // ---------------------------------------------------------------------------

  function renderVisionResults() {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (!visionClassification || !showResult) return null;

    const score = visionClassification.confidenceScore;

    return (
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Primary HS Code Result */}
        <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
          <div
            className="h-3 bg-bp-light"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 L10 0 L20 12' fill='%23ffffff' stroke='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "20px 12px",
            }}
          />
          <div className="px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase mb-1">HS Code</p>
                <span className="text-4xl font-mono font-black tracking-tight">{visionClassification.hsCode.code}</span>
              </div>
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${score >= 85 ? "border-bp-green/30 bg-bp-green/5 text-bp-green" : score >= 70 ? "border-yellow-500/30 bg-yellow-50 text-yellow-700" : "border-red-500/30 bg-red-50 text-red-700"}`}>
                {confidenceLabel(score)} Confidence
              </Badge>
            </div>

            {/* Confidence bar */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase w-24 shrink-0">Confidence</span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${confidenceBg(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={`text-sm font-bold tabular-nums ${confidenceColor(score)}`}>{score.toFixed(1)}%</span>
            </div>

            {/* Description */}
            {(visionClassification.hsCode.description?.friendly || visionClassification.customsDescription) && (
              <div className="mt-4 p-3 bg-muted/50 rounded-sm">
                <p className="text-sm text-foreground leading-relaxed">
                  {visionClassification.hsCode.description?.friendly || visionClassification.customsDescription}
                </p>
              </div>
            )}

            {/* Categories */}
            {visionClassification.categories && visionClassification.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {visionClassification.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-[10px] font-semibold uppercase tracking-wide">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Two-column info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country of Origin */}
          {originInference && (
            <div className="border border-border rounded-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-bp-gray" />
                <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase">Country of Origin</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  {countryName(originInference.countryOfOrigin)}{" "}
                  <span className="text-sm font-mono text-muted-foreground">({originInference.countryOfOrigin})</span>
                </span>
                <span className={`text-sm font-bold tabular-nums ${confidenceColor(originInference.confidenceScore)}`}>
                  {originInference.confidenceScore.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${confidenceBg(originInference.confidenceScore)}`}
                  style={{ width: `${originInference.confidenceScore}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{originInference.description}</p>
            </div>
          )}

          {/* Value Estimation */}
          {valueEstimation && (
            <div className="border border-border rounded-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-bp-gray" />
                <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase">Estimated Value</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">
                  {valueEstimation.currency === "USD" ? "$" : valueEstimation.currency}{valueEstimation.value.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">{valueEstimation.currency}</span>
              </div>
              {valueEstimation.valueEstimateRange && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Range:</span>
                  <span className="font-mono font-medium">
                    ${valueEstimation.valueEstimateRange.low.toFixed(2)} &ndash; ${valueEstimation.valueEstimateRange.high.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Audit Trail */}
        {visionClassification.auditTrail && (
          <div className="border border-bp-red/20 rounded-sm overflow-hidden bg-gradient-to-br from-bp-red/[0.02] to-transparent">
            <button
              onClick={() => setAuditExpanded(!auditExpanded)}
              className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-bp-red/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bp-red/10">
                  <ShieldCheck className="size-4 text-bp-red" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Classification Audit Trail</p>
                  <p className="text-[10px] font-bold tracking-widest text-bp-red uppercase mt-0.5">Zonos Vision</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] border-bp-red/20 text-bp-red bg-bp-red/5 font-bold tracking-wide uppercase">
                  Compliance Ready
                </Badge>
                <ChevronDown className={`size-4 text-bp-gray transition-transform duration-200 ${auditExpanded ? "rotate-180" : ""}`} />
              </div>
            </button>
            {auditExpanded && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-white border border-border rounded-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-full min-h-4 bg-bp-red rounded-full" />
                    <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase">Full Classification Reasoning</p>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono bg-muted/30 rounded-sm p-3 border border-border/50">
                    {visionClassification.auditTrail}
                  </p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground">
                    <span className="font-semibold uppercase tracking-widest">Audit ID: ZV-{Date.now().toString(36).toUpperCase()}</span>
                    <span>|</span>
                    <span>Timestamp: {new Date().toISOString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button className="bg-bp-red hover:bg-bp-red/90 text-white font-bold tracking-wide uppercase text-xs px-6">
            <CheckCircle2 className="size-3.5" />
            Accept &amp; Save to Catalogue
          </Button>
          <Button variant="outline" className="font-bold tracking-wide uppercase text-xs px-6">
            <RefreshCw className="size-3.5" />
            Reclassify
          </Button>
          {apiCallInfo && (
            <ApiCallButton onClick={() => setApiDetailOpen(true)} />
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Shared loading / error states
  // ---------------------------------------------------------------------------

  function renderLoadingState() {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-bp-red/20 animate-ping" />
          <Loader2 className="size-8 text-bp-red animate-spin relative" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">Classifying with Zonos...</p>
          <p className="text-xs text-muted-foreground mt-1">Analysing product data against 98 country tariff schedules</p>
        </div>
      </div>
    );
  }

  function renderErrorState() {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-sm">
        <AlertTriangle className="size-5 text-red-500 shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-800">Classification Failed</p>
          <p className="text-xs text-red-600 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="AI Classification Engine"
        description="POWERED BY ZONOS CLASSIFY - REAL-TIME HS CODE DETERMINATION WITH AUDIT TRAIL"
      />

      {/* Zonos Intelligence Bar */}
      <div className="bg-bp-red/5 border border-bp-red/10 rounded-sm px-5 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-bp-red/10 px-2.5 py-1 rounded-full">
              <Zap className="size-3 text-bp-red" />
              <span className="text-[10px] font-black tracking-widest text-bp-red uppercase">Zonos Classify API</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-bp-gray">
            <Activity className="size-3" />
            <span className="font-semibold">14,200</span>
            <span>classifications today</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-bp-gray">
            <Clock className="size-3" />
            <span>Avg response:</span>
            <span className="font-semibold text-bp-green">87ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-bp-gray">
            <ShieldCheck className="size-3" />
            <span className="font-semibold text-bp-green">94.2%</span>
            <span>auto-approved (&gt;85% confidence)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
            <RefreshCw className="size-3" />
            <span>Updated: 2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-0 border-b border-border">
        <button
          onClick={() => { setActiveTab("classify"); setClassifyResult(null); setVisionResult(null); setShowResult(false); setError(null); }}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors cursor-pointer border-b-2 ${
            activeTab === "classify"
              ? "border-bp-red text-bp-red"
              : "border-transparent text-bp-gray hover:text-foreground"
          }`}
        >
          <FileText className="size-4" />
          Classify
        </button>
        <button
          onClick={() => { setActiveTab("vision"); setClassifyResult(null); setVisionResult(null); setShowResult(false); setError(null); }}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors cursor-pointer border-b-2 ${
            activeTab === "vision"
              ? "border-bp-red text-bp-red"
              : "border-transparent text-bp-gray hover:text-foreground"
          }`}
        >
          <Camera className="size-4" />
          Vision
          <Badge variant="outline" className="text-[9px] border-blue-400/30 text-blue-600 bg-blue-50 font-bold tracking-wider ml-1">
            ZONOS VISION
          </Badge>
        </button>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: Classify (classificationsCalculate) */}
      {/* ============================================================== */}

      {activeTab === "classify" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            <FedExSection title="Product Details" complete={productName.length >= 3}>
              <div className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold tracking-wider text-bp-gray uppercase">Product Name</Label>
                  <Input
                    placeholder="e.g. Children's cotton t-shirt"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold tracking-wider text-bp-gray uppercase">Categories</Label>
                  <Input
                    placeholder="e.g. Apparel, Kids, Cotton (comma-separated)"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">Optional — helps improve accuracy</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold tracking-wider text-bp-gray uppercase">Ship-to Country</Label>
                  <Input
                    placeholder="e.g. US, GB, DE"
                    value={shipToCountry}
                    onChange={(e) => setShipToCountry(e.target.value)}
                    className="text-sm"
                    maxLength={2}
                  />
                  <p className="text-[10px] text-muted-foreground">2-letter country code for destination tariff schedule</p>
                </div>

                <button
                  className="w-full px-8 py-3 text-sm font-black tracking-widest text-white bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-sm flex items-center justify-center gap-2"
                  disabled={productName.length < 3 || loading}
                  onClick={handleClassify}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    <>
                      <Search className="size-4" />
                      Classify Product
                    </>
                  )}
                </button>
              </div>
            </FedExSection>
          </div>

          {/* Right: Results */}
          <div>
            {!classifyResult && !loading && !error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Layers className="size-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Classification results will appear here</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Enter product details and click Classify</p>
              </div>
            ) : (
              renderClassifyResults()
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: Vision (itemsExtract with imageBase64) */}
      {/* ============================================================== */}

      {activeTab === "vision" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload */}
          <div className="space-y-6">
            <FedExSection
              title="Image Upload"
              variant="static"
              icon={<Camera className="size-5 text-blue-500" />}
            >
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[9px] font-bold tracking-widest border-blue-400/30 text-blue-600 bg-blue-50 uppercase">
                    Zonos Vision
                  </Badge>
                  <span className="text-xs text-muted-foreground">AI-powered visual product classification</span>
                </div>

                {!imagePreview ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-sm p-10 text-center cursor-pointer hover:border-bp-red hover:bg-bp-red/[0.03] transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-bp-red/10 transition-colors">
                      <Camera className="size-7 text-blue-400 group-hover:text-bp-red transition-colors" />
                    </div>
                    <p className="text-sm font-semibold">Drag &amp; drop a product image</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-3">PNG, JPG, or WEBP up to 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative border border-border rounded-sm overflow-hidden bg-muted/30">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-52 object-contain"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <X className="size-3.5 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ImageIcon className="size-3.5" />
                      <span className="truncate">{imageName}</span>
                    </div>
                  </div>
                )}

                <button
                  className="w-full px-8 py-3 text-sm font-black tracking-widest text-white bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-sm flex items-center justify-center gap-2"
                  disabled={!imageBase64 || loading}
                  onClick={handleClassify}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Analysing Image...
                    </>
                  ) : (
                    <>
                      <Eye className="size-4" />
                      Classify from Image
                    </>
                  )}
                </button>
              </div>
            </FedExSection>
          </div>

          {/* Right: Results */}
          <div>
            {!visionResult && !loading && !error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Camera className="size-7 text-blue-300" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Upload an image to classify</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Zonos Vision will identify the product and determine HS codes</p>
              </div>
            ) : (
              renderVisionResults()
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Bulk Classification */}
      {/* ============================================================== */}

      <FedExSection title="Bulk Classification" variant="static">
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
              Upload a CSV of products to classify multiple items at once
            </p>
            <Badge variant="outline" className="text-[9px] font-bold tracking-widest border-bp-red/20 text-bp-red bg-bp-red/5 uppercase">
              Powered by Zonos
            </Badge>
          </div>
          <div
            className="border-2 border-dashed rounded-sm p-8 text-center cursor-pointer hover:border-bp-red hover:bg-bp-red/[0.03] transition-all"
            onClick={handleBulk}
          >
            <Upload className="size-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Upload CSV for bulk classification</p>
            <p className="text-xs text-muted-foreground mt-1">Click to simulate bulk processing</p>
          </div>
          {bulkProgress !== null && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Classifying products...</span>
                <span className="font-bold tabular-nums">{bulkProgress}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-bp-red transition-all"
                  style={{ width: `${bulkProgress}%` }}
                />
              </div>
              {bulkProgress === 100 && (
                <div className="flex items-center gap-2 text-sm text-bp-green font-medium">
                  <CheckCircle2 className="size-4" />
                  <span>24 products classified successfully - 22 auto-approved, 2 flagged for review</span>
                </div>
              )}
            </div>
          )}
        </div>
      </FedExSection>

      {/* ============================================================== */}
      {/* Classification Statistics */}
      {/* ============================================================== */}

      <FedExSection title="Recent Classifications" variant="static">
        <div className="pt-4 space-y-4">
          <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
            Live classification feed across all bpost accounts
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 text-[10px] font-bold tracking-widest text-bp-gray uppercase">Product</th>
                  <th className="pb-3 pr-4 text-[10px] font-bold tracking-widest text-bp-gray uppercase">HS Code</th>
                  <th className="pb-3 pr-4 text-[10px] font-bold tracking-widest text-bp-gray uppercase">Confidence</th>
                  <th className="pb-3 pr-4 text-[10px] font-bold tracking-widest text-bp-gray uppercase">Source</th>
                  <th className="pb-3 pr-4 text-[10px] font-bold tracking-widest text-bp-gray uppercase">Account</th>
                  <th className="pb-3 text-[10px] font-bold tracking-widest text-bp-gray uppercase text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_CLASSIFICATIONS.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{row.product}</td>
                    <td className="py-3 pr-4">
                      <span className="font-mono font-semibold text-xs bg-muted px-2 py-0.5 rounded-sm">{row.hs}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${confidenceBg(row.confidence)}`} style={{ width: `${row.confidence}%` }} />
                        </div>
                        <span className={`text-xs font-semibold tabular-nums ${confidenceColor(row.confidence)}`}>
                          {row.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${sourceBadgeVariant(row.source)}`}>
                        {row.source}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">{row.account}</td>
                    <td className="py-3 text-xs text-muted-foreground text-right">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FedExSection>

      {/* API Call Detail Sheet */}
      <ApiCallDetailSheet open={apiDetailOpen} onOpenChange={setApiDetailOpen} call={apiCallInfo} />
    </div>
  );
}
