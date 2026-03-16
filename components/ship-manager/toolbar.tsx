"use client"

import { useState } from "react"
import { LayoutGrid, LayoutList, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "compact" | "comfortable"

interface ToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function Toolbar({ viewMode, onViewModeChange }: ToolbarProps) {
  const [showViewMenu, setShowViewMenu] = useState(false)

  return (
    <div className="flex items-center justify-end gap-4 px-6 py-2 border-b border-border bg-card">
      <button className="text-xs font-semibold tracking-wide text-bp-red hover:underline cursor-pointer">
        SAVE
      </button>
      <button className="text-xs font-semibold tracking-wide text-bp-red hover:underline cursor-pointer">
        REPEAT
      </button>
      <button className="text-xs font-semibold tracking-wide text-bp-red hover:underline cursor-pointer">
        CLEAR ALL
      </button>
      <button className="p-1 text-bp-gray hover:text-foreground cursor-pointer">
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* Views toggle */}
      <div className="relative">
        <button
          onClick={() => setShowViewMenu(!showViewMenu)}
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-bp-red hover:underline cursor-pointer"
        >
          {viewMode === "compact" ? (
            <LayoutGrid className="h-4 w-4" />
          ) : (
            <LayoutList className="h-4 w-4" />
          )}
          VIEWS
        </button>

        {showViewMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowViewMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-card border border-border rounded shadow-lg">
              <button
                onClick={() => {
                  onViewModeChange("comfortable")
                  setShowViewMenu(false)
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 text-left hover:bg-bp-light transition-colors cursor-pointer",
                  viewMode === "comfortable" && "border-2 border-bp-red"
                )}
              >
                <LayoutList className="h-8 w-8 text-bp-gray shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">Comfortable view</p>
                  <p className="text-xs text-bp-gray mt-0.5">
                    An experience that guides you through the shipping process
                  </p>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 shrink-0",
                    viewMode === "comfortable"
                      ? "border-bp-red bg-bp-red"
                      : "border-border"
                  )}
                >
                  {viewMode === "comfortable" && (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-card" />
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => {
                  onViewModeChange("compact")
                  setShowViewMenu(false)
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 text-left hover:bg-bp-light transition-colors cursor-pointer",
                  viewMode === "compact" && "border-2 border-bp-red"
                )}
              >
                <LayoutGrid className="h-8 w-8 text-bp-gray shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">Compact view</p>
                  <p className="text-xs text-bp-gray mt-0.5">
                    An experience that gives a view into the entire shipping process
                  </p>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 shrink-0",
                    viewMode === "compact"
                      ? "border-bp-red bg-bp-red"
                      : "border-border"
                  )}
                >
                  {viewMode === "compact" && (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-card" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
