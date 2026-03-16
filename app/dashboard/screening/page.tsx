"use client";

import { useState } from "react";
import { PageHeader } from "@/components/fedex/page-header";
import { FedExSection } from "@/components/fedex/section";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  ScanSearch,
  Ban,
  Eye,
  RefreshCw,
  ArrowRight,
  Filter,
  Globe2,
  Users,
  Loader2,
  Zap,
  Database,
  Clock,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiCallButton, ApiCallDetailSheet, type ApiCallInfo } from "@/components/ui/api-call-detail";

const screeningResults = [
  { id: "SCR-001", shipmentId: "BP-2024-00847", customer: "Rosie & Jack", description: "Children's Clothing Collection", hsCode: "6109.10", destination: "FR", screenResult: "pass", riskScore: 12, sanctionsCheck: "clear", restrictedGoods: "clear", valueCheck: "pass", timestamp: "2024-03-12 14:23" },
  { id: "SCR-002", shipmentId: "BP-2024-00848", customer: "Highland Spirits", description: "Single Malt Whisky Case", hsCode: "2208.30", destination: "US", screenResult: "flag", riskScore: 68, sanctionsCheck: "clear", restrictedGoods: "flag", valueCheck: "pass", timestamp: "2024-03-12 14:18" },
  { id: "SCR-003", shipmentId: "BP-2024-00849", customer: "Thames Valley Electronics", description: "Dual-Use Circuit Boards", hsCode: "8542.31", destination: "IR", screenResult: "block", riskScore: 95, sanctionsCheck: "fail", restrictedGoods: "clear", valueCheck: "pass", timestamp: "2024-03-12 14:10" },
  { id: "SCR-004", shipmentId: "BP-2024-00850", customer: "Cotswold Tea Co.", description: "Organic Tea Sampler", hsCode: "0902.10", destination: "JP", screenResult: "pass", riskScore: 5, sanctionsCheck: "clear", restrictedGoods: "clear", valueCheck: "pass", timestamp: "2024-03-12 13:55" },
  { id: "SCR-005", shipmentId: "BP-2024-00851", customer: "Thames Valley Electronics", description: "Electronic Components Kit", hsCode: "8542.31", destination: "RU", screenResult: "block", riskScore: 92, sanctionsCheck: "fail", restrictedGoods: "flag", valueCheck: "flag", timestamp: "2024-03-12 13:48" },
  { id: "SCR-006", shipmentId: "BP-2024-00852", customer: "Rosie & Jack", description: "Baby Organic Sleepsuit Set", hsCode: "6111.20", destination: "DE", screenResult: "pass", riskScore: 8, sanctionsCheck: "clear", restrictedGoods: "clear", valueCheck: "pass", timestamp: "2024-03-12 13:42" },
  { id: "SCR-007", shipmentId: "BP-2024-00853", customer: "Highland Spirits", description: "Perfume Gift Set (150ml)", hsCode: "3303.00", destination: "AU", screenResult: "flag", riskScore: 45, sanctionsCheck: "clear", restrictedGoods: "flag", valueCheck: "pass", timestamp: "2024-03-12 13:30" },
  { id: "SCR-008", shipmentId: "BP-2024-00854", customer: "Brighton Luxury Goods", description: "Declared as Gift - High Value Watch", hsCode: "9101.11", destination: "AE", screenResult: "flag", riskScore: 78, sanctionsCheck: "clear", restrictedGoods: "clear", valueCheck: "flag", timestamp: "2024-03-12 13:22" },
  { id: "SCR-009", shipmentId: "BP-2024-00857", customer: "Yorkshire Provisions", description: "Artisan Cheese Selection", hsCode: "0406.90", destination: "US", screenResult: "flag", riskScore: 52, sanctionsCheck: "clear", restrictedGoods: "flag", valueCheck: "pass", timestamp: "2024-03-12 13:15" },
  { id: "SCR-010", shipmentId: "BP-2024-00858", customer: "Cotswold Tea Co.", description: "Herbal Supplement Blend", hsCode: "2106.90", destination: "SG", screenResult: "pass", riskScore: 15, sanctionsCheck: "clear", restrictedGoods: "clear", valueCheck: "pass", timestamp: "2024-03-12 13:05" },
];

const restrictedGoodsAlerts = [
  { category: "Children's products (safety)", routes: "US, EU, AU, CA", action: "CPSIA/CE certification required" },
  { category: "Perfumes (flammable)", routes: "All air routes", action: "DG declaration required" },
  { category: "Dual-use electronics", routes: "Russia, Iran, N. Korea", action: "Export licence required / Block" },
  { category: "Food products (animal origin)", routes: "EU, US, AU, NZ", action: "Phytosanitary cert required" },
  { category: "Medicines / Pharma", routes: "All destinations", action: "MHRA licence check" },
];

const sanctionedDestinations = [
  { country: "Russia", code: "RU", level: "Comprehensive sanctions", status: "blocked" },
  { country: "Iran", code: "IR", level: "Comprehensive sanctions", status: "blocked" },
  { country: "North Korea", code: "KP", level: "Comprehensive sanctions", status: "blocked" },
  { country: "Syria", code: "SY", level: "Comprehensive sanctions", status: "blocked" },
  { country: "Belarus", code: "BY", level: "Targeted sanctions", status: "review" },
  { country: "Myanmar", code: "MM", level: "Targeted sanctions", status: "review" },
];

const fraudAlerts = [
  { id: "FRD-001", type: "Gift misdeclaration", customer: "Brighton Luxury Goods", description: "High-value watch declared as 'gift' with value €12. Pattern: 3rd gift declaration this month from this account.", risk: "high", shipmentId: "BP-2024-00854" },
  { id: "FRD-002", type: "Value understatement", customer: "Brighton Luxury Goods", description: "Designer handbag declared at €25. Market value estimate: €850+. Repeated pattern from this account.", risk: "high", shipmentId: "BP-2024-00855" },
  { id: "FRD-003", type: "HS code manipulation", customer: "Thames Valley Electronics", description: "Electronics classified as 'household goods' (HS 9403) instead of correct code (8471). Duty rate difference: 12%.", risk: "medium", shipmentId: "BP-2024-00856" },
  { id: "FRD-004", type: "Repeat sanctions routing", customer: "Thames Valley Electronics", description: "2nd shipment this week routed to sanctioned destination via intermediary country. Possible evasion pattern.", risk: "high", shipmentId: "BP-2024-00851" },
];

const qualityMetrics = {
  timeliness: { score: 96.2, trend: "+1.2%", label: "Pre-advice data received before dispatch (network-wide)" },
  completeness: { score: 91.8, trend: "+3.4%", label: "All required customs fields populated (all customers)" },
  accuracy: { score: 94.5, trend: "+0.8%", label: "HS code and value accuracy rate (aggregate)" },
  consistency: { score: 89.3, trend: "+2.1%", label: "Data consistent across declaration fields (all accounts)" },
};

const screeningByCustomer = [
  { customer: "Thames Valley Electronics", total: 342, flags: 48, blocks: 12, flagRate: "17.5%" },
  { customer: "Brighton Luxury Goods", total: 189, flags: 31, blocks: 4, flagRate: "18.5%" },
  { customer: "Highland Spirits", total: 567, flags: 22, blocks: 1, flagRate: "4.1%" },
  { customer: "Rosie & Jack", total: 423, flags: 14, blocks: 0, flagRate: "3.3%" },
  { customer: "Yorkshire Provisions", total: 298, flags: 11, blocks: 0, flagRate: "3.7%" },
  { customer: "Cotswold Tea Co.", total: 215, flags: 5, blocks: 0, flagRate: "2.3%" },
];

const countryOptions = [
  { value: "BE", label: "Belgium (BE)" },
  { value: "US", label: "United States (US)" },
  { value: "FR", label: "France (FR)" },
  { value: "DE", label: "Germany (DE)" },
  { value: "JP", label: "Japan (JP)" },
  { value: "AU", label: "Australia (AU)" },
  { value: "RU", label: "Russia (RU)" },
  { value: "IR", label: "Iran (IR)" },
  { value: "CN", label: "China (CN)" },
  { value: "GB", label: "United Kingdom (GB)" },
  { value: "CA", label: "Canada (CA)" },
  { value: "AE", label: "UAE (AE)" },
  { value: "SG", label: "Singapore (SG)" },
  { value: "KR", label: "South Korea (KR)" },
  { value: "IN", label: "India (IN)" },
  { value: "BR", label: "Brazil (BR)" },
  { value: "SA", label: "Saudi Arabia (SA)" },
  { value: "KP", label: "North Korea (KP)" },
  { value: "SY", label: "Syria (SY)" },
];

interface RestrictionResult {
  confidence: number | string;
  imposingCountryCode: string;
  id: string;
  hsCode: string;
  summary: string;
  measureDirection: string;
}

export default function ScreeningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Live Restriction Check state
  const [liveDescription, setLiveDescription] = useState("");
  const [liveHsCode, setLiveHsCode] = useState("");
  const [liveName, setLiveName] = useState("");
  const [liveFromCountry, setLiveFromCountry] = useState("BE");
  const [liveToCountry, setLiveToCountry] = useState("US");
  const [liveMeasureDirection, setLiveMeasureDirection] = useState("EXPORT");
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveResults, setLiveResults] = useState<RestrictionResult[] | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveHasSearched, setLiveHasSearched] = useState(false);
  const [apiCallInfo, setApiCallInfo] = useState<ApiCallInfo | null>(null);
  const [apiDetailOpen, setApiDetailOpen] = useState(false);

  const handleLiveCheck = async () => {
    if (!liveDescription && !liveName) return;
    setLiveLoading(true);
    setLiveError(null);
    setLiveResults(null);
    setLiveHasSearched(true);
    setApiCallInfo(null);

    try {
      const payload = {
        input: {
          items: [
            {
              description: liveDescription || liveName,
              hsCode: liveHsCode || "0000.00",
              name: liveName || liveDescription,
            },
          ],
          shipFromCountry: liveFromCountry,
          shipToCountry: liveToCountry,
        },
      };

      const t0 = performance.now();
      const res = await fetch("/api/zonos/restrict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      const elapsed = Math.round(performance.now() - t0);

      setApiCallInfo({
        endpoint: "/api/zonos/restrict",
        mutation: "restrictionApply",
        variables: payload,
        response: data,
        responseTimeMs: elapsed,
        httpStatus: res.status,
        timestamp: new Date().toISOString(),
      });

      // Extract restrictions from restrictionApply.items[].restrictions
      const restrictions: RestrictionResult[] = [];
      const items = data?.data?.restrictionApply?.items;
      if (Array.isArray(items)) {
        for (const item of items) {
          if (Array.isArray(item.restrictions)) {
            for (const r of item.restrictions) {
              restrictions.push({
                confidence: r.confidence ?? 0,
                imposingCountryCode: r.imposingCountryCode ?? "",
                hsCode: r.hsCode ?? "",
                summary: r.summary ?? "No description available",
                measureDirection: r.measureDirection ?? liveMeasureDirection,
                id: r.id ?? "",
              });
            }
          }
        }
      }

      // Deduplicate by hsCode, keeping the highest-confidence entry per code
      const bestByHsCode = new Map<string, RestrictionResult>();
      for (const r of restrictions) {
        const key = r.hsCode || `no-hs-${r.id}`;
        const existing = bestByHsCode.get(key);
        if (!existing || normalizeConfidence(r.confidence) > normalizeConfidence(existing.confidence)) {
          bestByHsCode.set(key, r);
        }
      }

      setLiveResults(Array.from(bestByHsCode.values()));
    } catch (err: unknown) {
      setLiveError(err instanceof Error ? err.message : "Failed to check restrictions");
    } finally {
      setLiveLoading(false);
    }
  };

  const normalizeConfidence = (confidence: number | string): number => {
    if (typeof confidence === "string") {
      const map: Record<string, number> = { HIGH: 0.9, MEDIUM: 0.6, LOW: 0.3 };
      return map[confidence.toUpperCase()] ?? 0.5;
    }
    return confidence;
  };

  const confidenceDisplay = (confidence: number | string): string => {
    if (typeof confidence === "string") return confidence;
    return `${(confidence * 100).toFixed(0)}%`;
  };

  const getConfidenceColor = (confidence: number | string) => {
    const n = normalizeConfidence(confidence);
    if (n >= 0.8) return "bg-red-500 text-white";
    if (n >= 0.5) return "bg-amber-500 text-white";
    return "bg-yellow-400 text-black";
  };

  const getConfidenceBorder = (confidence: number | string) => {
    const n = normalizeConfidence(confidence);
    if (n >= 0.8) return "border-red-300 bg-red-50";
    if (n >= 0.5) return "border-amber-300 bg-amber-50";
    return "border-yellow-300 bg-yellow-50";
  };

  const filtered = screeningResults.filter((r) => {
    if (filterStatus !== "all" && r.screenResult !== filterStatus) return false;
    if (searchQuery && !r.description.toLowerCase().includes(searchQuery.toLowerCase()) && !r.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) && !r.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalScreened = 2034;
  const totalFlags = 131;
  const totalBlocks = 17;
  const totalPass = totalScreened - totalFlags - totalBlocks;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Screening & Compliance Operations"
        description="RESTRICTED GOODS, SANCTIONS, FRAUD DETECTION & DATA QUALITY ACROSS ALL CUSTOMERS"
      />

      {/* Zonos Intelligence Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg px-5 py-3 text-white">
        <Badge className="bg-bp-red text-white font-bold text-xs tracking-wide px-3 py-1 hover:bg-bp-red">
          Zonos Screen API
        </Badge>
        <div className="flex items-center gap-2 text-slate-300 text-xs">
          <Database className="h-3.5 w-3.5" />
          <span className="font-medium">14 sanctions lists integrated</span>
        </div>
        <div className="h-3 w-px bg-slate-600" />
        <div className="flex items-center gap-2 text-slate-300 text-xs">
          <Users className="h-3.5 w-3.5" />
          <span className="font-medium">2.1M denied parties in database</span>
        </div>
        <div className="h-3 w-px bg-slate-600" />
        <div className="flex items-center gap-2 text-slate-300 text-xs">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-medium">Updated: 4 hours ago</span>
        </div>
        <div className="h-3 w-px bg-slate-600" />
        <div className="flex items-center gap-2 text-slate-300 text-xs">
          <Zap className="h-3.5 w-3.5 text-bp-yellow" />
          <span className="font-medium">Sub-second screening</span>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">Total Screened Today</span>
            <ScanSearch className="h-4 w-4 text-bp-gray" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalScreened.toLocaleString()}</div>
          <p className="text-xs text-bp-green font-medium">Across 6 active customer accounts</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">Passed</span>
            <CheckCircle2 className="h-4 w-4 text-bp-green" />
          </div>
          <div className="text-2xl font-bold text-bp-green">{totalPass.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{((totalPass / totalScreened) * 100).toFixed(1)}% clear rate</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">Flagged for Review</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{totalFlags}</div>
          <p className="text-xs text-muted-foreground">{((totalFlags / totalScreened) * 100).toFixed(1)}% of network volume</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider">Blocked</span>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{totalBlocks}</div>
          <p className="text-xs text-muted-foreground">{((totalBlocks / totalScreened) * 100).toFixed(1)}% - sanctions & prohibited goods</p>
        </div>
      </div>

      {/* Live Restriction Check - Interactive Demo Panel */}
      <FedExSection title="Live Restriction Check" icon={<Activity className="h-5 w-5 text-bp-red" />}>
        <p className="text-sm text-muted-foreground mb-4">
          Try the Zonos screening engine - enter a product and destination to check for restrictions in real-time
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-bp-gray">Product Description</label>
              <Input
                placeholder="e.g. Single malt scotch whisky, 700ml bottle"
                value={liveDescription}
                onChange={(e) => setLiveDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-bp-gray">Product Name</label>
                <Input
                  placeholder="e.g. Highland Whisky"
                  value={liveName}
                  onChange={(e) => setLiveName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-bp-gray">HS Code (optional)</label>
                <Input
                  placeholder="e.g. 2208.30"
                  value={liveHsCode}
                  onChange={(e) => setLiveHsCode(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-bp-gray">Ship From</label>
                <Select value={liveFromCountry} onValueChange={setLiveFromCountry}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-bp-gray">Ship To</label>
                <Select value={liveToCountry} onValueChange={setLiveToCountry}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-bp-gray">Direction</label>
                <Select value={liveMeasureDirection} onValueChange={setLiveMeasureDirection}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPORT">EXPORT</SelectItem>
                    <SelectItem value="IMPORT">IMPORT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleLiveCheck}
              disabled={liveLoading || (!liveDescription && !liveName)}
              className="bg-bp-red hover:bg-bp-red/90 text-white uppercase font-bold tracking-wider w-full"
            >
              {liveLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Screening...
                </>
              ) : (
                <>
                  <ScanSearch className="h-4 w-4 mr-2" />
                  Check Restrictions
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {liveLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-bp-red mb-3" />
                <p className="text-sm font-medium">Screening against 14 sanctions lists...</p>
                <p className="text-xs text-muted-foreground mt-1">Checking 2.1M denied parties</p>
              </div>
            )}

            {liveError && (
              <div className="border border-red-300 bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-700">Screening Error</span>
                </div>
                <p className="text-sm text-red-600">{liveError}</p>
              </div>
            )}

            {liveResults !== null && !liveLoading && liveResults.length === 0 && (
              <div className="space-y-3">
                <div className="border border-green-300 bg-green-50 rounded-lg p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-bp-green" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">No restrictions found for this product/route combination</p>
                      <p className="text-xs text-green-600 mt-1">
                        Screened {liveFromCountry} to {liveToCountry} ({liveMeasureDirection}) - all clear
                      </p>
                    </div>
                  </div>
                </div>
                {apiCallInfo && (
                  <ApiCallButton onClick={() => setApiDetailOpen(true)} />
                )}
              </div>
            )}

            {liveResults !== null && !liveLoading && liveResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold text-foreground">
                    {liveResults.length} restriction{liveResults.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                {liveResults.map((r, idx) => (
                  <div
                    key={idx}
                    className={`border-l-4 rounded-lg p-4 ${getConfidenceBorder(r.confidence)}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-xs font-bold ${getConfidenceColor(r.confidence)}`}>
                          {confidenceDisplay(r.confidence)} confidence
                        </Badge>
                        {r.imposingCountryCode && (
                          <Badge variant="outline" className="text-xs">
                            {r.imposingCountryCode}
                          </Badge>
                        )}
                        {r.hsCode && (
                          <Badge variant="outline" className="text-xs font-mono">
                            HS {r.hsCode}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs bg-slate-100">
                          {r.measureDirection}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{r.summary}</p>
                  </div>
                ))}
                {apiCallInfo && (
                  <ApiCallButton onClick={() => setApiDetailOpen(true)} />
                )}
              </div>
            )}

            {!liveHasSearched && !liveLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                <ScanSearch className="h-8 w-8 mb-3 text-muted-foreground/50" />
                <p className="text-sm font-medium">Enter a product and click &quot;Check Restrictions&quot;</p>
                <p className="text-xs mt-1">Results from Zonos API will appear here</p>
              </div>
            )}
          </div>
        </div>
      </FedExSection>

      {/* Network-wide Data Quality Metrics */}
      <FedExSection title="Network-wide Data Quality Metrics" icon={<Shield className="h-5 w-5 text-bp-red" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(qualityMetrics).map(([key, metric]) => (
            <div key={key} className="bg-background rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-bp-gray font-semibold uppercase tracking-wider capitalize">{key}</span>
                <span className="text-xs text-bp-green font-medium">{metric.trend}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{metric.score}%</div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </FedExSection>

      {/* Screening by Customer Summary */}
      <FedExSection title="Screening by Customer" icon={<Users className="h-5 w-5 text-bp-red" />}>
        <FedExTable
          headers={[
            { label: "Customer Account" },
            { label: "Total Screened" },
            { label: "Flagged" },
            { label: "Blocked" },
            { label: "Flag Rate" },
            { label: "Risk Level" },
          ]}
        >
          {screeningByCustomer.map((c, idx) => (
            <FedExTableRow key={c.customer} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium">{c.customer}</FedExTableCell>
              <FedExTableCell>{c.total.toLocaleString()}</FedExTableCell>
              <FedExTableCell>
                <span className="text-amber-600 font-medium">{c.flags}</span>
              </FedExTableCell>
              <FedExTableCell>
                <span className={c.blocks > 0 ? "text-red-600 font-medium" : "text-muted-foreground"}>{c.blocks}</span>
              </FedExTableCell>
              <FedExTableCell className="font-mono text-xs">{c.flagRate}</FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={parseFloat(c.flagRate) > 15 ? "red" : parseFloat(c.flagRate) > 5 ? "orange" : "green"}
                  label={parseFloat(c.flagRate) > 15 ? "High" : parseFloat(c.flagRate) > 5 ? "Medium" : "Low"}
                />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Real-time Screening Results */}
      <FedExSection title="Real-time Screening Results" icon={<ScanSearch className="h-5 w-5 text-bp-red" />}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shipments, descriptions, or customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            {["all", "pass", "flag", "block"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
                onClick={() => setFilterStatus(s)}
                className={filterStatus === s ? "bg-bp-red text-white" : ""}
              >
                {s === "all" ? "All" : s === "pass" ? "Pass" : s === "flag" ? "Flagged" : "Blocked"}
              </Button>
            ))}
          </div>
        </div>
        <FedExTable
          headers={[
            { label: "Shipment" },
            { label: "Customer" },
            { label: "Description" },
            { label: "HS Code" },
            { label: "Dest" },
            { label: "Risk" },
            { label: "Sanctions" },
            { label: "Restricted" },
            { label: "Value" },
            { label: "Result" },
          ]}
        >
          {filtered.map((r, idx) => (
            <FedExTableRow key={r.id} even={idx % 2 === 1}>
              <FedExTableCell className="font-medium text-bp-red">{r.shipmentId}</FedExTableCell>
              <FedExTableCell>
                <span className="text-sm font-medium">{r.customer}</span>
              </FedExTableCell>
              <FedExTableCell>{r.description}</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">{r.hsCode}</FedExTableCell>
              <FedExTableCell>
                <Badge variant="outline" className="text-xs">{r.destination}</Badge>
              </FedExTableCell>
              <FedExTableCell>
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-8 rounded-full ${r.riskScore > 70 ? "bg-red-500" : r.riskScore > 40 ? "bg-amber-500" : "bg-bp-green"}`}>
                    <div className={`h-full rounded-full bg-current`} style={{ width: `${r.riskScore}%` }} />
                  </div>
                  <span className="text-xs">{r.riskScore}</span>
                </div>
              </FedExTableCell>
              <FedExTableCell>
                {r.sanctionsCheck === "clear" ? (
                  <CheckCircle2 className="h-4 w-4 text-bp-green" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </FedExTableCell>
              <FedExTableCell>
                {r.restrictedGoods === "clear" ? (
                  <CheckCircle2 className="h-4 w-4 text-bp-green" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </FedExTableCell>
              <FedExTableCell>
                {r.valueCheck === "pass" ? (
                  <CheckCircle2 className="h-4 w-4 text-bp-green" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </FedExTableCell>
              <FedExTableCell>
                <StatusDot
                  color={r.screenResult === "pass" ? "green" : r.screenResult === "flag" ? "orange" : "red"}
                  label={r.screenResult === "pass" ? "Pass" : r.screenResult === "flag" ? "Review" : "Blocked"}
                />
              </FedExTableCell>
            </FedExTableRow>
          ))}
        </FedExTable>
      </FedExSection>

      {/* Fraud Detection */}
      <FedExSection title="Fraud Detection Alerts" icon={<Eye className="h-5 w-5 text-bp-red" />}>
        <div className="space-y-3">
          {fraudAlerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${alert.risk === "high" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={alert.risk === "high" ? "bg-red-500 text-white" : "bg-amber-500 text-white"}>{alert.risk}</Badge>
                    <span className="font-semibold text-sm">{alert.type}</span>
                    <Badge variant="outline" className="text-xs">{alert.customer}</Badge>
                    <span className="text-xs text-muted-foreground">• {alert.shipmentId}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  Investigate <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </FedExSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Restricted Goods */}
        <FedExSection title="Restricted & Prohibited Goods Rules" icon={<Ban className="h-5 w-5 text-bp-red" />}>
          <div className="space-y-2">
            {restrictedGoodsAlerts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.category}</p>
                  <p className="text-xs text-muted-foreground">Routes: {item.routes}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{item.action}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Rules updated daily from UPU/WCO databases
          </p>
        </FedExSection>

        {/* Sanctioned Destinations */}
        <FedExSection title="Sanctions & Embargoes" icon={<Globe2 className="h-5 w-5 text-bp-red" />}>
          <div className="space-y-2">
            {sanctionedDestinations.map((dest, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{dest.code}</span>
                  <div>
                    <p className="text-sm font-medium">{dest.country}</p>
                    <p className="text-xs text-muted-foreground">{dest.level}</p>
                  </div>
                </div>
                <StatusDot
                  color={dest.status === "blocked" ? "red" : "orange"}
                  label={dest.status === "blocked" ? "Blocked" : "Review Required"}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Shield className="h-3 w-3" /> OFSI, OFAC & EU sanctions lists integrated
          </p>
        </FedExSection>
      </div>

      {/* UPU/WCO Standards */}
      <div className="bg-bp-red/5 border border-bp-red/20 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-6 w-6 text-bp-red" />
          <h3 className="font-bold text-foreground">UPU/WCO Standards Alignment</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium">CN22/CN23 Mapping</p>
            <p className="text-muted-foreground">All declarations auto-mapped to UPU customs form standards across all customer accounts</p>
            <StatusDot color="green" label="Active" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">WCO HS Nomenclature</p>
            <p className="text-muted-foreground">2024 HS code database with 6-digit WCO alignment - network-wide enforcement</p>
            <StatusDot color="green" label="Active" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">IPC S10 Barcode Standard</p>
            <p className="text-muted-foreground">Mail ID tracking aligned to S10 format requirements for all bpost parcels</p>
            <StatusDot color="green" label="Active" />
          </div>
        </div>
      </div>

      {/* API Call Detail Sheet */}
      <ApiCallDetailSheet open={apiDetailOpen} onOpenChange={setApiDetailOpen} call={apiCallInfo} />
    </div>
  );
}
