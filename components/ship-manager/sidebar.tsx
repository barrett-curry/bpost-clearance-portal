"use client"

import { useState } from "react"
import {
  PackagePlus,
  Package,
  ShoppingCart,
  BookOpen,
  FileText,
  Settings,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: PackagePlus, label: "CREATE SHIPMENT", active: true },
  { icon: Package, label: "SHIPMENTS", active: false },
  { icon: ShoppingCart, label: "E-COMMERCE", active: false },
  { icon: BookOpen, label: "ADDRESS BOOK", active: false },
  { icon: FileText, label: "SHIPMENT PROFILES", active: false },
  { icon: Settings, label: "SETTINGS", active: false },
  { icon: HelpCircle, label: "HELP", active: false },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("CREATE SHIPMENT")

  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col justify-between transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Sub-header */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-border">
          <span className="text-sm font-medium text-foreground">bpost Ship Manager</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 py-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer",
                isActive
                  ? "text-bp-red font-semibold border-l-3 border-bp-red bg-bp-light"
                  : "text-foreground hover:bg-bp-light border-l-3 border-transparent"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-bp-red" : "text-bp-gray")} />
              {!collapsed && (
                <span className="text-xs tracking-wide">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
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
    </aside>
  )
}
