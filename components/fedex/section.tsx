"use client"

import { useState } from "react"
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoyalMailSectionProps {
  title: string
  complete?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  variant?: "collapsible" | "static"
}

export function RoyalMailSection({
  title,
  complete = false,
  defaultOpen = true,
  children,
  className,
  icon,
  action,
  variant = "collapsible",
}: RoyalMailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const statusIcon = icon ?? (
    <CheckCircle2
      className={cn(
        "h-5 w-5 shrink-0",
        complete ? "text-bp-green fill-bp-green stroke-white" : "text-border"
      )}
    />
  )

  if (variant === "static") {
    return (
      <div
        className={cn(
          "border-b border-border last:border-b-0",
          className
        )}
      >
        <div className="border-l-3 border-l-bp-green px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {statusIcon}
              <h3 className="text-base font-bold text-foreground">{title}</h3>
            </div>
            {action && <div>{action}</div>}
          </div>
          <div className="ml-8 mt-3">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "border-b border-border last:border-b-0",
        className
      )}
    >
      <div className="border-l-3 border-l-bp-green px-6 py-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            {statusIcon}
            <h3 className="text-base font-bold text-foreground">{title}</h3>
          </div>
          <div className="flex items-center gap-3">
            {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-bp-gray" />
            ) : (
              <ChevronDown className="h-5 w-5 text-bp-gray" />
            )}
          </div>
        </button>
        {isOpen && (
          <div className="ml-8 mt-3">{children}</div>
        )}
      </div>
    </div>
  )
}

// Backward-compatible aliases
export const FedExSection = RoyalMailSection;
