"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle, Loader2, Shield, Package, ShoppingCart, BarChart3, ArrowRight, Check } from "lucide-react";
import { StatusDot } from "@/components/fedex/status-dot";
import { PageHeader } from "@/components/fedex/page-header";
import { integrations as initialIntegrations, type Integration } from "@/lib/fake-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const channelColors: Record<string, string> = {
  shopify: "bg-green-600",
  ebay: "bg-blue-600",
  amazon: "bg-orange-500",
  walmart: "bg-blue-700",
  etsy: "bg-orange-600",
  sap: "bg-blue-500",
  oracle: "bg-red-600",
};

const categoryLabels: Record<string, string> = {
  shopify: "Sales Channels",
  ebay: "Sales Channels",
  amazon: "Sales Channels",
  walmart: "Sales Channels",
  etsy: "Sales Channels",
  sap: "ERP & TMS",
  oracle: "ERP & TMS",
};

// Simulated sync data per channel
const channelSyncData: Record<string, { products: string[]; orders: number; inventory: number }> = {
  shopify: {
    products: [
      "Kids Cotton T-Shirt Pack (3pk)", "Children's Waterproof Jacket", "Toddler Denim Dungarees",
      "Girls Floral Summer Dress", "Baby Organic Sleepsuit (Set of 3)", "Fleece-Lined Joggers",
      "Boys Cargo Shorts", "Kids Sun Hat (UV Protection)",
    ],
    orders: 34,
    inventory: 1247,
  },
  ebay: {
    products: [
      "Boys School Uniform Set", "Children's Knitted Beanie Hat", "Kids Rainboot Wellies",
      "Kids Puffer Gilet", "School PE Kit Bag", "Toddler Soft-Sole Shoes",
    ],
    orders: 18,
    inventory: 892,
  },
  amazon: {
    products: [
      "Organic Cotton Babygrow", "Girls Party Dress", "Baby Muslin Swaddle Set",
      "Kids Snowsuit", "Baby Knitted Cardigan", "Kids Swimming Costume",
      "Kids Thermal Base Layer Set", "Newborn Gift Set", "Girls Leggings (2-pack)",
      "Boys Polo Shirt (2-pack)",
    ],
    orders: 52,
    inventory: 2340,
  },
  walmart: {
    products: [
      "Kids Cotton T-Shirt Pack (3pk)", "Children's Waterproof Jacket", "Girls Floral Summer Dress",
      "Baby Organic Sleepsuit (Set of 3)", "Children's Knitted Beanie Hat",
    ],
    orders: 12,
    inventory: 560,
  },
  etsy: {
    products: [
      "Baby Knitted Cardigan", "Toddler Soft-Sole Shoes",
      "Newborn Gift Set", "Children's Knitted Beanie Hat",
    ],
    orders: 8,
    inventory: 145,
  },
  sap: {
    products: [
      "Loading ERP modules...", "Material Master Records", "Vendor Master Data",
      "Purchase Order History", "Goods Receipt Records", "Quality Inspection Data",
    ],
    orders: 156,
    inventory: 8420,
  },
  oracle: {
    products: [
      "Transportation Orders", "Route Optimization Data", "Carrier Rate Tables",
      "Shipment Tracking Records", "Compliance Documentation",
    ],
    orders: 89,
    inventory: 3200,
  },
};

type ConnectStep = "authorize" | "configure" | "syncing" | "complete";
type SyncOption = "products" | "orders" | "inventory";

const permissions = [
  { id: "read-products", label: "Read product catalog", description: "Access product names, SKUs, descriptions, and pricing" },
  { id: "read-orders", label: "Read order history", description: "Access order details, customer info, and shipping addresses" },
  { id: "read-inventory", label: "Read inventory levels", description: "Access stock quantities and warehouse locations" },
  { id: "write-classification", label: "Write HS classifications", description: "Push HS codes and compliance data back to your store" },
];

function ConnectModal({
  integration,
  open,
  onOpenChange,
  onComplete,
}: {
  integration: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<ConnectStep>("authorize");
  const [syncOptions, setSyncOptions] = useState<Record<SyncOption, boolean>>({
    products: true,
    orders: true,
    inventory: false,
  });
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState("");
  const [discoveredProducts, setDiscoveredProducts] = useState<string[]>([]);
  const [syncStats, setSyncStats] = useState({ products: 0, orders: 0, inventory: 0 });
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("authorize");
      setSyncOptions({ products: true, orders: true, inventory: false });
      setSyncProgress(0);
      setSyncStatus("");
      setDiscoveredProducts([]);
      setSyncStats({ products: 0, orders: 0, inventory: 0 });
    }
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [open]);

  const channelData = channelSyncData[integration.channel] ?? channelSyncData.shopify;

  const runSync = useCallback(() => {
    const totalSteps = 20;
    let currentStep = 0;
    const productList = channelData.products;
    let productIndex = 0;

    setSyncStatus("Establishing secure connection...");
    setSyncProgress(5);

    syncIntervalRef.current = setInterval(() => {
      currentStep++;
      const progress = Math.min(5 + (currentStep / totalSteps) * 90, 95);
      setSyncProgress(progress);

      if (currentStep <= 2) {
        setSyncStatus("Authenticating with " + integration.name + " API...");
      } else if (currentStep <= 4) {
        setSyncStatus("Fetching product catalog...");
        if (syncOptions.products && productIndex < productList.length) {
          setDiscoveredProducts((prev) => [...prev, productList[productIndex]!]);
          productIndex++;
        }
      } else if (currentStep <= 8) {
        setSyncStatus("Importing products...");
        if (syncOptions.products && productIndex < productList.length) {
          setDiscoveredProducts((prev) => [...prev, productList[productIndex]!]);
          productIndex++;
        }
      } else if (currentStep <= 12) {
        if (syncOptions.orders) {
          setSyncStatus("Syncing recent orders...");
        } else {
          setSyncStatus("Verifying data integrity...");
        }
        if (syncOptions.products && productIndex < productList.length) {
          setDiscoveredProducts((prev) => [...prev, productList[productIndex]!]);
          productIndex++;
        }
      } else if (currentStep <= 16) {
        if (syncOptions.inventory) {
          setSyncStatus("Pulling inventory levels...");
        } else {
          setSyncStatus("Mapping HS classifications...");
        }
      } else if (currentStep <= 18) {
        setSyncStatus("Running compliance checks...");
      } else {
        setSyncStatus("Finalizing...");
      }

      if (currentStep >= totalSteps) {
        if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
        setSyncProgress(100);
        setSyncStatus("Sync complete!");
        setSyncStats({
          products: syncOptions.products ? productList.length : 0,
          orders: syncOptions.orders ? channelData.orders : 0,
          inventory: syncOptions.inventory ? channelData.inventory : 0,
        });
        setTimeout(() => setStep("complete"), 600);
      }
    }, 350);
  }, [integration.name, channelData, syncOptions]);

  const color = channelColors[integration.channel] ?? "bg-gray-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={step !== "syncing"}>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          {(["authorize", "configure", "syncing", "complete"] as ConnectStep[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-colors ${
                  s === step
                    ? "bg-bp-red"
                    : (["authorize", "configure", "syncing", "complete"].indexOf(step) > i)
                      ? "bg-bp-green"
                      : "bg-muted"
                }`}
              />
              {i < 3 && <div className="w-8 h-px bg-muted" />}
            </div>
          ))}
        </div>

        {/* Step 1: Authorize */}
        {step === "authorize" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-sm ${color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                  {integration.name[0]}
                </div>
                <div>
                  <DialogTitle>Connect {integration.name}</DialogTitle>
                  <DialogDescription>
                    Grant bpost access to your {integration.name} account
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 my-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span>This app will have access to:</span>
              </div>
              {permissions.map((perm) => (
                <div key={perm.id} className="flex items-start gap-3 rounded-md border p-3">
                  <CheckCircle className="h-4 w-4 text-bp-green mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{perm.label}</p>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-xs font-bold tracking-wide uppercase border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("configure")}
                className="px-4 py-2 text-xs font-bold tracking-wide uppercase bg-bp-red text-accent-foreground hover:bg-bp-red/90 transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                Authorize
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Configure */}
        {step === "configure" && (
          <>
            <DialogHeader>
              <DialogTitle>Configure Sync</DialogTitle>
              <DialogDescription>
                Choose what to import from {integration.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              {([
                { key: "products" as SyncOption, icon: Package, label: "Products", desc: "Import product catalog with SKUs, descriptions, and pricing" },
                { key: "orders" as SyncOption, icon: ShoppingCart, label: "Orders", desc: "Sync recent orders for duty & tax calculation" },
                { key: "inventory" as SyncOption, icon: BarChart3, label: "Inventory", desc: "Pull stock levels for shipping optimization" },
              ]).map((opt) => (
                <label
                  key={opt.key}
                  className={`flex items-start gap-3 rounded-md border p-4 cursor-pointer transition-colors ${
                    syncOptions[opt.key] ? "border-bp-red/50 bg-bp-red/5" : "hover:bg-muted/30"
                  }`}
                >
                  <Checkbox
                    checked={syncOptions[opt.key]}
                    onCheckedChange={(checked) =>
                      setSyncOptions((prev) => ({ ...prev, [opt.key]: !!checked }))
                    }
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <opt.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setStep("authorize")}
                className="px-4 py-2 text-xs font-bold tracking-wide uppercase border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => { setStep("syncing"); runSync(); }}
                disabled={!syncOptions.products && !syncOptions.orders && !syncOptions.inventory}
                className="px-4 py-2 text-xs font-bold tracking-wide uppercase bg-bp-red text-accent-foreground hover:bg-bp-red/90 transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Sync
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Syncing */}
        {step === "syncing" && (
          <>
            <DialogHeader>
              <DialogTitle>Syncing {integration.name}</DialogTitle>
              <DialogDescription>{syncStatus}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <Progress value={syncProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(syncProgress)}% complete
              </p>

              {/* Live product feed */}
              {discoveredProducts.length > 0 && (
                <div className="border rounded-md p-3 space-y-1.5 max-h-[180px] overflow-y-auto">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Products Discovered
                  </p>
                  {discoveredProducts.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300"
                    >
                      <Check className="h-3.5 w-3.5 text-bp-green shrink-0" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 4: Complete */}
        {step === "complete" && (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 rounded-full bg-bp-green/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-bp-green" />
                </div>
                <div>
                  <DialogTitle>{integration.name} Connected</DialogTitle>
                  <DialogDescription>
                    Your account is synced and ready for trade compliance
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-3 my-4">
              {syncStats.products > 0 && (
                <div className="text-center border rounded-md p-3">
                  <p className="text-2xl font-bold text-foreground">{syncStats.products}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
              )}
              {syncStats.orders > 0 && (
                <div className="text-center border rounded-md p-3">
                  <p className="text-2xl font-bold text-foreground">{syncStats.orders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
              )}
              {syncStats.inventory > 0 && (
                <div className="text-center border rounded-md p-3">
                  <p className="text-2xl font-bold text-foreground">{syncStats.inventory}</p>
                  <p className="text-xs text-muted-foreground">SKUs Tracked</p>
                </div>
              )}
            </div>

            <div className="rounded-md border border-bp-red/30 bg-bp-red/5 p-3">
              <p className="text-sm font-medium">Next: Classify your products</p>
              <p className="text-xs text-muted-foreground mt-1">
                Run HS code classification on your imported products for accurate duty & tax calculations.
              </p>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={() => { onComplete(); onOpenChange(false); }}
                className="px-4 py-2 text-xs font-bold tracking-wide uppercase bg-bp-red text-accent-foreground hover:bg-bp-red/90 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function IntegrationsPage() {
  const [integrationState, setIntegrationState] = useState<
    Record<string, "idle" | "connected">
  >(() => {
    const state: Record<string, "idle" | "connected"> = {};
    initialIntegrations.forEach((int) => {
      state[int.id] = int.connected ? "connected" : "idle";
    });
    return state;
  });

  const [connectingIntegration, setConnectingIntegration] = useState<Integration | null>(null);

  function handleConnect(integration: Integration) {
    setConnectingIntegration(integration);
  }

  function handleConnectComplete() {
    if (connectingIntegration) {
      setIntegrationState((prev) => ({ ...prev, [connectingIntegration.id]: "connected" }));
    }
  }

  function handleDisconnect(id: string) {
    setIntegrationState((prev) => ({ ...prev, [id]: "idle" }));
  }

  const salesChannels = initialIntegrations.filter((i) => categoryLabels[i.channel] === "Sales Channels");
  const erpTms = initialIntegrations.filter((i) => categoryLabels[i.channel] === "ERP & TMS");

  function renderCard(integration: Integration) {
    const state = integrationState[integration.id];
    const isConnected = state === "connected";
    const color = channelColors[integration.channel];

    return (
      <div key={integration.id} className="border-b border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-sm ${color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
            {integration.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">{integration.name}</p>
            {isConnected && (
              <StatusDot color="green" label="Connected" className="mt-1" />
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{integration.description}</p>

        {isConnected && (
          <div className="text-xs text-muted-foreground space-y-1">
            {integration.lastSync && <p>Last sync: {integration.lastSync}</p>}
            {integration.productsImported && (
              <p>{integration.productsImported} products imported</p>
            )}
          </div>
        )}

        <div className="pt-1">
          {isConnected ? (
            <button
              onClick={() => handleDisconnect(integration.id)}
              className="px-4 py-1.5 text-xs font-bold tracking-wide uppercase border-2 border-bp-red text-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => handleConnect(integration)}
              className="px-4 py-1.5 text-xs font-bold tracking-wide uppercase bg-bp-red text-accent-foreground hover:bg-bp-red/90 transition-colors cursor-pointer"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Integrations"
        description="Connect your sales channels, ERP, and TMS systems for automated trade compliance"
      />

      {/* Sales Channels */}
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-bp-gray uppercase mb-4">Sales Channels</h2>
        <div className="divide-y divide-border">
          {salesChannels.map(renderCard)}
        </div>
      </div>

      {/* ERP & TMS */}
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-bp-gray uppercase mb-4">ERP & TMS</h2>
        <div className="divide-y divide-border">
          {erpTms.map(renderCard)}
        </div>
      </div>

      {/* Connect Modal */}
      {connectingIntegration && (
        <ConnectModal
          integration={connectingIntegration}
          open={!!connectingIntegration}
          onOpenChange={(open) => { if (!open) setConnectingIntegration(null); }}
          onComplete={handleConnectComplete}
        />
      )}
    </div>
  );
}
