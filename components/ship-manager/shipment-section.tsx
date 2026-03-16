"use client"

import { useState } from "react"
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShipmentSectionProps {
  title: string
  complete?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function ShipmentSection({
  title,
  complete = true,
  defaultOpen = true,
  children,
  className,
}: ShipmentSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-sm shadow-sm border-l-3 border-l-bp-green",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <CheckCircle2
            className={cn(
              "h-5 w-5",
              complete ? "text-bp-green fill-bp-green stroke-card" : "text-border"
            )}
          />
          <h3 className="text-base font-bold text-foreground">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-bp-gray" />
        ) : (
          <ChevronDown className="h-5 w-5 text-bp-gray" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-4 border-t border-border/50">{children}</div>
      )}
    </div>
  )
}
