"use client";

import { useState } from "react";
import {
  Calculator,
  Share2,
  Save,
  ShieldCheck,
  History,
  ArrowRight,
  ChevronRight,
  Globe,
  Zap,
  RefreshCw,
  BadgeCheck,
  Loader2,
  ExternalLink,
  CreditCard,
  Send,
  Package,
  Lock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Truck,
} from "lucide-react";
import { products, landedCostHistory, type LandedCostCalculation } from "@/lib/fake-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FedExSection } from "@/components/fedex/section";
import { PageHeader } from "@/components/fedex/page-header";
import { DataRow } from "@/components/fedex/data-row";
import { ApiCallButton, ApiCallDetailSheet, type ApiCallInfo } from "@/components/ui/api-call-detail";

const countries = [
  { code: "BE", name: "Belgium" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "AU", name: "Australia" },
  { code: "CN", name: "China" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
];

const currencies = [
  { code: "EUR", symbol: "\u00a3", name: "British Pound" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20ac", name: "Euro" },
];

const shippingServices = [
  { code: "bpost.tracked", name: "bpost Tracked" },
  { code: "bpost.signed", name: "bpost Signed For" },
  { code: "bpost.express", name: "bpost Express International" },
];

type ChargeLineItem = {
  amount: number;
  currency: string;
  description: string;
  note?: string;
  type: string;
  formula?: string;
  item?: { productId: string };
};

type LandedCostResult = {
  duties: number;
  taxes: number;
  fees: number;
  total: number;
  shipping: number;
  items: number;
  dutyItems: ChargeLineItem[];
  taxItems: ChargeLineItem[];
  feeItems: ChargeLineItem[];
  guaranteeCode: string | null;
  checkoutUrl: string | null;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getCurrencySymbol(code: string) {
  return currencies.find((c) => c.code === code)?.symbol ?? code;
}

export default function LandedCostPage() {
  const [origin, setOrigin] = useState("BE");
  const [destination, setDestination] = useState("US");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [quantity, setQuantity] = useState("1");
  const [weight, setWeight] = useState("");
  const [shipping, setShipping] = useState("");
  const [shippingService, setShippingService] = useState("bpost.tracked");
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guaranteed, setGuaranteed] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<LandedCostCalculation[]>(landedCostHistory);
  const [selectedCalc, setSelectedCalc] = useState<LandedCostCalculation | null>(null);
  const [result, setResult] = useState<LandedCostResult | null>(null);
  const [showPaymentDemo, setShowPaymentDemo] = useState(false);
  const [apiCallInfo, setApiCallInfo] = useState<ApiCallInfo | null>(null);
  const [apiDetailOpen, setApiDetailOpen] = useState(false);

  function handleProductSelect(productId: string) {
    setSelectedProduct(productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      setHsCode(product.hsCode);
      setDescription(product.name);
      setValue(product.value.toString());
      setWeight(product.weight.toString());
    }
  }

  async function handleCalculate() {
    setLoading(true);
    setError(null);
    setCalculated(false);
    setResult(null);
    setApiCallInfo(null);

    const payload = {
      parties: [
        { location: { countryCode: origin }, type: "ORIGIN" },
        {
          person: { firstName: "Test", lastName: "Recipient" },
          location: { countryCode: destination },
          type: "DESTINATION",
        },
      ],
      items: [
        {
          amount: parseFloat(value) || 0,
          currencyCode: currency,
          quantity: parseInt(quantity) || 1,
          hsCode: hsCode,
          description: description || "General merchandise",
          countryOfOrigin: origin,
        },
      ],
      shipmentRating: {
        serviceLevelCode: shippingService,
        amount: parseFloat(shipping) || 0,
        currencyCode: currency,
      },
      landedCost: {
        endUse: "NOT_FOR_RESALE",
        method: "DDP",
        tariffRate: "ZONOS_PREFERRED",
      },
    };

    try {
      const t0 = performance.now();
      const res = await fetch("/api/zonos/landed-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - t0);

      setApiCallInfo({
        endpoint: "/api/zonos/landed-cost",
        mutation: "partyCreateWorkflow → itemCreateWorkflow → cartonizeWorkflow → landedCostCalculateWorkflow",
        variables: payload,
        response: data,
        responseTimeMs: elapsed,
        httpStatus: res.status,
        timestamp: new Date().toISOString(),
      });

      if (!res.ok || data.error) {
        const detail = data.details ? JSON.stringify(data.details, null, 2) : "";
        throw new Error(data.error || `API returned ${res.status}${detail ? `\n${detail}` : ""}`);
      }

      const lcRaw = data.data?.landedCostCalculateWorkflow;
      const lcData = Array.isArray(lcRaw) ? lcRaw[0] : lcRaw;
      if (!lcData) {
        throw new Error("No landed cost data returned");
      }

      const checkoutLink = lcData.links?.find(
        (l: { key: string; url: string }) => l.key === "CHECKOUT"
      );

      setResult({
        duties: lcData.amountSubtotals?.duties ?? 0,
        taxes: lcData.amountSubtotals?.taxes ?? 0,
        fees: lcData.amountSubtotals?.fees ?? 0,
        total: lcData.amountSubtotals?.landedCostTotal ?? 0,
        shipping: lcData.amountSubtotals?.shipping ?? 0,
        items: lcData.amountSubtotals?.items ?? 0,
        dutyItems: lcData.duties ?? [],
        taxItems: lcData.taxes ?? [],
        feeItems: lcData.fees ?? [],
        guaranteeCode: lcData.landedCostGuaranteeCode ?? null,
        checkoutUrl: checkoutLink?.url ?? null,
      });

      setCalculated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  }

  function handleSaveQuote() {
    if (!result) return;
    const originCountry = countries.find((c) => c.code === origin);
    const destCountry = countries.find((c) => c.code === destination);
    const newCalc: LandedCostCalculation = {
      id: `lc-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      origin: originCountry?.name ?? origin,
      originCode: origin,
      destination: destCountry?.name ?? destination,
      destinationCode: destination,
      description: description || "Custom item",
      hsCode: hsCode,
      quantity: parseInt(quantity) || 1,
      declaredValue: (parseFloat(value) || 0) * (parseInt(quantity) || 1),
      shipping: parseFloat(shipping) || 0,
      weight: (parseFloat(weight) || 0) * (parseInt(quantity) || 1),
      dutyRate: result.duties > 0 ? `${((result.duties / ((parseFloat(value) || 1) * (parseInt(quantity) || 1))) * 100).toFixed(1)}%` : "0%",
      duty: result.duties,
      tax: result.taxes,
      mpf: 0,
      hmf: 0,
      total: result.total,
      guaranteed,
    };
    setSavedCalculations([newCalc, ...savedCalculations]);
  }

  function handleLoadCalculation(calc: LandedCostCalculation) {
    setSelectedCalc(calc);
  }

  function handleBackToList() {
    setSelectedCalc(null);
  }

  const sym = getCurrencySymbol(currency);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Landed Cost Calculator"
        description="POWERED BY ZONOS RATE ENGINE - REAL-TIME DUTY, TAX & FEE CALCULATION"
        action={
          <button
            onClick={() => { setHistoryOpen(true); setSelectedCalc(null); }}
            className="px-4 py-2 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase inline-flex items-center gap-1.5"
          >
            <History className="size-4" />
            History
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {savedCalculations.length}
            </Badge>
          </button>
        }
      />

      {/* Zonos Intelligence Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-sm px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Zonos Landed Cost API
          </span>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-semibold hover:bg-emerald-500/20">
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Globe className="size-3.5" />
            <span className="text-xs font-medium">200+ countries covered</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <RefreshCw className="size-3.5" />
            <span className="text-xs font-medium">847 tariff updates this month</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="size-3.5" />
            <span className="text-xs font-medium">Sub-second response times</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <BadgeCheck className="size-3.5" />
            <span className="text-xs font-medium">Guaranteed quotes available</span>
          </div>
        </div>
      </div>

      {/* History Sheet */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full">
          <SheetHeader>
            {selectedCalc ? (
              <>
                <button
                  onClick={handleBackToList}
                  className="text-xs font-bold tracking-wide text-bp-red uppercase inline-flex items-center gap-1 cursor-pointer hover:underline self-start -mb-1"
                >
                  <ChevronRight className="size-3 rotate-180" />
                  Back to History
                </button>
                <SheetTitle>Calculation Details</SheetTitle>
                <SheetDescription>{formatDate(selectedCalc.date)}</SheetDescription>
              </>
            ) : (
              <>
                <SheetTitle>Calculation History</SheetTitle>
                <SheetDescription>
                  {savedCalculations.length} saved calculation{savedCalculations.length !== 1 ? "s" : ""}
                </SheetDescription>
              </>
            )}
          </SheetHeader>

          {selectedCalc ? (
            <div className="px-4 pb-4 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>{selectedCalc.origin}</span>
                <ArrowRight className="size-3.5 text-bp-gray" />
                <span>{selectedCalc.destination}</span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold">{selectedCalc.description}</p>
                <p className="text-xs text-muted-foreground font-mono">{selectedCalc.hsCode}</p>
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                <DataRow label="Quantity" value={selectedCalc.quantity} />
                <DataRow label="Declared Value" value={`\u00a3${selectedCalc.declaredValue.toFixed(2)}`} />
                <DataRow label="Shipping" value={`\u00a3${selectedCalc.shipping.toFixed(2)}`} />
                <DataRow label="Weight" value={`${selectedCalc.weight.toFixed(1)} kg`} />
              </div>

              <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
                <div className="h-3 bg-bp-light" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 L10 0 L20 12' fill='%23ffffff' stroke='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "20px 12px",
                }} />
                <div className="px-4 py-3 space-y-1">
                  <DataRow label="Duty Rate" value={selectedCalc.dutyRate} />
                  <DataRow label="Customs Duty" value={`\u00a3${selectedCalc.duty.toFixed(2)}`} />
                  <DataRow label="Sales Tax / VAT" value={`\u00a3${selectedCalc.tax.toFixed(2)}`} />
                  {selectedCalc.mpf > 0 && (
                    <DataRow label="MPF" value={`\u00a3${selectedCalc.mpf.toFixed(2)}`} />
                  )}
                  {selectedCalc.hmf > 0 && (
                    <DataRow label="HMF" value={`\u00a3${selectedCalc.hmf.toFixed(2)}`} />
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-lg font-bold">\u00a3{selectedCalc.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCalc.guaranteed && (
                <div className="bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                  <ShieldCheck className="size-4 text-bp-green mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-green-800">Guaranteed quote</p>
                    <p className="text-xs text-green-700">Duties & taxes locked in</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 pb-4 space-y-2 overflow-y-auto flex-1">
              {savedCalculations.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => handleLoadCalculation(calc)}
                  className="w-full text-left border border-border rounded-sm p-3 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{formatDate(calc.date)}</span>
                    <div className="flex items-center gap-1.5">
                      {calc.guaranteed && (
                        <ShieldCheck className="size-3.5 text-bp-green" />
                      )}
                      <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                  <p className="text-sm font-medium truncate">{calc.description}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <span>{calc.originCode}</span>
                    <ArrowRight className="size-3" />
                    <span>{calc.destinationCode}</span>
                    <span className="mx-1">\u00b7</span>
                    <span className="font-mono">{calc.hsCode}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {calc.quantity} item{calc.quantity !== 1 ? "s" : ""} \u00b7 \u00a3{calc.declaredValue.toFixed(0)}
                    </span>
                    <span className="text-sm font-bold">\u00a3{calc.total.toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <div className="space-y-0 border border-border rounded-sm bg-card shadow-sm overflow-hidden">
          <FedExSection title="Shipment Details" variant="static" icon={<Package className="size-5 text-bp-red" />}>
            <div className="pt-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Origin Country</Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Destination Country</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Quick Select from Catalog</Label>
                <Select value={selectedProduct} onValueChange={handleProductSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a product or enter details below" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - {p.hsCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Item Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Kids cotton t-shirts, pack of 3"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">HS Code</Label>
                  <span className="text-[10px] text-bp-red font-medium cursor-pointer hover:underline">
                    Don&apos;t know? Use the Classification Engine
                  </span>
                </div>
                <Input
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  placeholder="e.g. 2204.21.50.60"
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="col-span-1 space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Declared Value</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-1 space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.symbol} {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Quantity</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Weight (kg)</Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Shipping Cost ({currency})</Label>
                  <Input
                    type="number"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-bp-gray">Shipping Service</Label>
                <Select value={shippingService} onValueChange={setShippingService}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingServices.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2 rounded-sm">
                  <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Calculation Error</p>
                    <p className="text-xs text-red-700 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <button
                className="w-full px-8 py-3 text-sm font-bold tracking-wide text-white bg-bp-red hover:bg-bp-red/90 transition-all cursor-pointer uppercase inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-bp-red/20"
                onClick={handleCalculate}
                disabled={loading || !value || !destination}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Calculating via Zonos...
                  </>
                ) : (
                  <>
                    <Calculator className="size-4" />
                    Calculate Landed Cost
                  </>
                )}
              </button>
            </div>
          </FedExSection>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {!calculated && !loading && (
            <div className="border border-dashed border-border rounded-sm bg-muted/30 flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="size-16 rounded-full bg-bp-light flex items-center justify-center mb-4">
                <Calculator className="size-8 text-bp-red/40" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Enter shipment details and click Calculate
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Duties, taxes, and fees will appear here in real time
              </p>
            </div>
          )}

          {loading && (
            <div className="border border-border rounded-sm bg-card flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="relative">
                <div className="size-16 rounded-full bg-bp-light flex items-center justify-center mb-4 animate-pulse">
                  <Loader2 className="size-8 text-bp-red animate-spin" />
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">
                Querying Zonos Rate Engine...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Calculating duties, taxes & fees for {countries.find((c) => c.code === destination)?.name}
              </p>
            </div>
          )}

          {calculated && result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Cost Breakdown */}
              <div className="border border-border rounded-sm bg-card shadow-sm overflow-hidden">
                <FedExSection title="Cost Breakdown" complete variant="static" icon={<Receipt className="size-5 text-bp-green" />}>
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {origin}
                      </Badge>
                      <ArrowRight className="size-3 text-bp-gray" />
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {destination}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {shippingServices.find((s) => s.code === shippingService)?.name}
                      </span>
                    </div>

                    {/* Zigzag summary box */}
                    <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
                      <div className="h-3 bg-bp-light" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 L10 0 L20 12' fill='%23ffffff' stroke='none'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat-x",
                        backgroundSize: "20px 12px",
                      }} />
                      <div className="px-5 py-4 space-y-2">
                        <div className="flex justify-between text-sm py-1">
                          <span className="text-bp-gray flex items-center gap-2">
                            <span className="size-2 rounded-full bg-amber-500" />
                            Customs Duties
                          </span>
                          <span className="font-semibold text-amber-700">{sym}{result.duties.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                          <span className="text-bp-gray flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-500" />
                            Taxes (VAT / GST)
                          </span>
                          <span className="font-semibold text-blue-700">{sym}{result.taxes.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                          <span className="text-bp-gray flex items-center gap-2">
                            <span className="size-2 rounded-full bg-purple-500" />
                            Regulatory Fees
                          </span>
                          <span className="font-semibold text-purple-700">{sym}{result.fees.toFixed(2)}</span>
                        </div>

                        <div className="border-t-2 border-dashed border-border pt-3 mt-3">
                          <div className="flex justify-between items-baseline">
                            <span className="text-lg font-bold text-foreground">Total Landed Cost</span>
                            <span className="text-3xl font-black text-bp-red tracking-tight">{sym}{result.total.toFixed(2)}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Goods value {sym}{((parseFloat(value) || 0) * (parseInt(quantity) || 1)).toFixed(2)} + Shipping {sym}{(parseFloat(shipping) || 0).toFixed(2)} + Import charges {sym}{result.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed charge breakdown */}
                    <div className="space-y-4">
                      {result.dutyItems.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Duty Breakdown</p>
                          {result.dutyItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0">
                              <div className="space-y-0.5">
                                <span className="text-foreground font-medium">{item.description}</span>
                                {item.formula && <p className="text-[10px] text-muted-foreground font-mono">{item.formula}</p>}
                                {item.note && <p className="text-[10px] text-muted-foreground">{item.note}</p>}
                              </div>
                              <span className="font-mono font-semibold text-amber-700 shrink-0 ml-4">{getCurrencySymbol(item.currency)}{item.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {result.taxItems.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">Tax Breakdown</p>
                          {result.taxItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0">
                              <div className="space-y-0.5">
                                <span className="text-foreground font-medium">{item.description}</span>
                                {item.formula && <p className="text-[10px] text-muted-foreground font-mono">{item.formula}</p>}
                                {item.note && <p className="text-[10px] text-muted-foreground">{item.note}</p>}
                              </div>
                              <span className="font-mono font-semibold text-blue-700 shrink-0 ml-4">{getCurrencySymbol(item.currency)}{item.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {result.feeItems.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-600">Fee Breakdown</p>
                          {result.feeItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0">
                              <div className="space-y-0.5">
                                <span className="text-foreground font-medium">{item.description}</span>
                                {item.formula && <p className="text-[10px] text-muted-foreground font-mono">{item.formula}</p>}
                                {item.note && <p className="text-[10px] text-muted-foreground">{item.note}</p>}
                              </div>
                              <span className="font-mono font-semibold text-purple-700 shrink-0 ml-4">{getCurrencySymbol(item.currency)}{item.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Guarantee Toggle */}
                    <div className="border-t border-border/50 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Guarantee this quote</p>
                          <p className="text-xs text-muted-foreground">Lock in duties and taxes at checkout</p>
                        </div>
                        <Switch checked={guaranteed} onCheckedChange={setGuaranteed} />
                      </div>
                      {guaranteed && (
                        <div className="bg-green-50 border border-green-200 p-3 flex items-start gap-2 rounded-sm">
                          <ShieldCheck className="size-5 text-bp-green mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              No additional import costs, guaranteed
                            </p>
                            <p className="text-xs text-green-700 mt-0.5">
                              Powered by bpost Landed Cost Guarantee via Zonos
                            </p>
                            {result.guaranteeCode && (
                              <p className="text-[10px] font-mono text-green-600 mt-1">
                                Guarantee ref: {result.guaranteeCode}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-border/50 pt-4 flex flex-wrap gap-2">
                      <button
                        onClick={handleSaveQuote}
                        className="px-5 py-2 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase inline-flex items-center gap-1.5"
                      >
                        <Save className="size-4" /> Save Quote
                      </button>
                      <button className="px-5 py-2 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase inline-flex items-center gap-1.5">
                        <Share2 className="size-4" /> Share
                      </button>
                      {apiCallInfo && (
                        <ApiCallButton onClick={() => setApiDetailOpen(true)} />
                      )}
                    </div>
                  </div>
                </FedExSection>
              </div>

              {/* Payment Link Section */}
              {result.checkoutUrl && (
                <div className="border border-border rounded-sm bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  <FedExSection
                    title="Generate Payment Link"
                    variant="static"
                    icon={<CreditCard className="size-5 text-bp-yellow" />}
                    action={
                      <Badge className="bg-bp-yellow/10 text-bp-yellow border-bp-yellow/30 text-[10px] font-bold hover:bg-bp-yellow/10">
                        ZONOS COLLECT
                      </Badge>
                    }
                  >
                    <div className="pt-2 space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Generate a bpost-branded payment link for DAP parcels. The consumer pays duties & taxes through a secure bpost checkout experience.
                      </p>

                      <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-bp-gray">Payment URL Preview</p>
                        <div className="flex items-center gap-2">
                          <Lock className="size-3.5 text-emerald-600 shrink-0" />
                          <code className="text-xs font-mono text-slate-600 break-all flex-1">
                            {result.checkoutUrl}
                          </code>
                          <ExternalLink className="size-3.5 text-slate-400 shrink-0" />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-5 py-2.5 text-xs font-bold tracking-wide text-white bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase inline-flex items-center justify-center gap-1.5 shadow-lg shadow-bp-red/20">
                          <Send className="size-3.5" /> Send to Consumer
                        </button>
                        <button
                          onClick={() => setShowPaymentDemo(true)}
                          className="px-4 py-2.5 text-xs font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase inline-flex items-center gap-1.5"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </FedExSection>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collect Payment Demo Section */}
      {(showPaymentDemo || (calculated && result)) && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-bold tracking-widest text-bp-gray uppercase">Consumer Payment Experience</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Payment Page Mockup */}
            <div className="border-2 border-slate-200 rounded-lg shadow-2xl overflow-hidden bg-white max-w-md mx-auto w-full">
              {/* Browser chrome */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-slate-300" />
                  <div className="size-2.5 rounded-full bg-slate-300" />
                  <div className="size-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="flex-1 bg-white rounded-sm px-3 py-1 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                  <Lock className="size-2.5 text-emerald-600" />
                  pay.bpost.be/customs/checkout
                </div>
              </div>

              {/* bpost branded header */}
              <div className="bg-bp-red px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-white rounded flex items-center justify-center">
                    <span className="text-bp-red font-black text-xs">BP</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">bpost</p>
                    <p className="text-white/70 text-[10px] font-medium">Customs Payment Portal</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Parcel awaiting customs clearance</p>
                  <p className="text-sm font-semibold mt-1">
                    {description || "Your international parcel"}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-sm divide-y divide-slate-100">
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-xs text-slate-500">Item Value</span>
                    <span className="text-xs font-semibold">{sym}{((parseFloat(value) || 0) * (parseInt(quantity) || 1)).toFixed(2)}</span>
                  </div>
                  {result && (
                    <>
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-xs text-slate-500">Import Duty</span>
                        <span className="text-xs font-semibold text-amber-700">{sym}{result.duties.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-xs text-slate-500">VAT / Tax</span>
                        <span className="text-xs font-semibold text-blue-700">{sym}{result.taxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-xs text-slate-500">Fees</span>
                        <span className="text-xs font-semibold text-purple-700">{sym}{result.fees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3 bg-slate-50">
                        <span className="text-sm font-bold">Amount Due</span>
                        <span className="text-sm font-black text-bp-red">{sym}{result.total.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <button className="w-full py-3 bg-bp-red text-white font-bold text-sm rounded-sm hover:bg-bp-red/90 transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="size-4" />
                  Pay Now
                </button>

                <div className="flex items-center justify-center gap-4 pt-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Lock className="size-2.5" /> Secure payment
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <ShieldCheck className="size-2.5" /> Powered by Zonos
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-bold text-foreground">
                DAP Consumer Payment Flow
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When a DAP parcel arrives in Belgium, bpost sends the consumer this payment link (powered by Zonos Collect). Once paid, the parcel is released for delivery.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-bp-red/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="size-4 text-bp-red" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">1. Parcel arrives at Belgian customs</p>
                    <p className="text-xs text-muted-foreground">DAP shipment held pending duty & tax payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-bp-yellow/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Send className="size-4 text-bp-yellow" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">2. Payment link sent to consumer</p>
                    <p className="text-xs text-muted-foreground">Email/SMS with bpost-branded checkout page</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CreditCard className="size-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">3. Consumer pays duties & taxes</p>
                    <p className="text-xs text-muted-foreground">Secure payment via card, Apple Pay, or Google Pay</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-bp-green/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-4 text-bp-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">4. Parcel released for delivery</p>
                    <p className="text-xs text-muted-foreground">Automatic clearance trigger, next-day delivery</p>
                  </div>
                </div>
              </div>

              <div className="bg-bp-light border border-bp-red/10 rounded-sm p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Zap className="size-4 text-bp-red mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-bp-red">Revenue Opportunity</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Zonos Collect eliminates the manual surcharge collection process. bpost retains full brand control over the consumer experience while Zonos handles payment processing, reconciliation, and remittance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Call Detail Sheet */}
      <ApiCallDetailSheet open={apiDetailOpen} onOpenChange={setApiDetailOpen} call={apiCallInfo} />
    </div>
  );
}
