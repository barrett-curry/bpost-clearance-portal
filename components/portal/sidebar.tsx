"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BookOpen,
  Brain,
  Calculator,
  FileText,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
  Shield,
  BarChart3,
  CheckCircle2,
  Globe2,
  Receipt,
  Scale,
  ScanSearch,
  ArrowRightLeft,
  Banknote,
  Mail,
  Building2,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/components/ui/use-mobile";

type SidebarEntry =
  | { type: "link"; icon: typeof LayoutDashboard; label: string; href: string }
  | { type: "section"; label: string };

const sidebarItems: SidebarEntry[] = [
  { type: "link", icon: LayoutDashboard, label: "Operations Dashboard", href: "/dashboard" },

  { type: "section", label: "Zonos-Powered Tools" },
  { type: "link", icon: Brain, label: "AI Classification", href: "/dashboard/classify" },
  { type: "link", icon: Calculator, label: "Landed Cost", href: "/dashboard/landed-cost" },
  { type: "link", icon: ScanSearch, label: "Screening & Compliance", href: "/dashboard/screening" },
  { type: "link", icon: CheckCircle2, label: "Export Validation", href: "/dashboard/export-validation" },

  { type: "section", label: "Services" },
  { type: "link", icon: Globe2, label: "PDDP Services", href: "/dashboard/pddp" },
  { type: "link", icon: Banknote, label: "DAP Import", href: "/dashboard/dap" },
  { type: "link", icon: Scale, label: "IOSS", href: "/dashboard/ioss" },

  { type: "section", label: "Customer Accounts" },
  { type: "link", icon: Building2, label: "Account Overview", href: "/dashboard/accounts" },
  { type: "link", icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
  { type: "link", icon: BookOpen, label: "Product Catalog", href: "/dashboard/catalog" },
  { type: "link", icon: Package, label: "Shipments", href: "/dashboard/shipments" },

  { type: "section", label: "Finance & Reporting" },
  { type: "link", icon: Receipt, label: "Reconciliation", href: "/dashboard/reconciliation" },
  { type: "link", icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { type: "link", icon: FileText, label: "Documents", href: "/dashboard/documents" },

  { type: "section", label: "System" },
  { type: "link", icon: Zap, label: "Connect Zonos", href: "/dashboard/connect" },
  { type: "link", icon: UserCircle, label: "Settings", href: "/dashboard/profile" },
];

export function PortalSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {/* Sub-header */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-bp-red">Export & Customs Platform</span>
            <span className="text-[10px] text-bp-gray/60 flex items-center gap-1 mt-0.5">
              <Zap className="h-2.5 w-2.5" /> Powered by Zonos
            </span>
          </div>
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} className="p-1 cursor-pointer">
              <X className="h-5 w-5 text-bp-gray" />
            </button>
          )}
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {sidebarItems.map((item, idx) => {
          if (item.type === "section") {
            if (collapsed) return null;
            return (
              <div key={item.label} className={cn("px-4 pt-4 pb-1", idx === 0 && "pt-2")}>
                <span className="text-[10px] font-bold tracking-widest text-bp-gray/70 uppercase">
                  {item.label}
                </span>
              </div>
            );
          }
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors",
                isActive
                  ? "text-bp-red font-semibold border-l-3 border-bp-red bg-bp-light"
                  : "text-foreground hover:bg-bp-light border-l-3 border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-bp-red" : "text-bp-gray"
                )}
              />
              {!collapsed && (
                <span className="text-xs tracking-wide">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Email demo link + Collapse toggle */}
      <div className="border-t border-border">
        {!collapsed && (
          <Link
            href="/emails"
            onClick={() => isMobile && setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            See email demo
          </Link>
        )}
        {!isMobile && (
          <div className="p-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center p-2 text-bp-gray hover:text-foreground transition-colors cursor-pointer"
            >
              {collapsed ? (
                <ChevronsRight className="h-5 w-5" />
              ) : (
                <ChevronsLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );

  // Mobile: overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Hamburger button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-3 left-3 z-50 p-2 bg-card border border-border rounded-md shadow-md cursor-pointer md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-bp-gray" />
        </button>

        {/* Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative z-50 w-64 bg-card flex flex-col justify-between h-full shadow-xl animate-in slide-in-from-left duration-300">
              {sidebarContent}
            </aside>
          </div>
        )}
      </>
    );
  }

  // Desktop: standard sidebar
  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col justify-between transition-all duration-300 shrink-0 hidden md:flex",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {sidebarContent}
    </aside>
  );
}
