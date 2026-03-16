"use client"

import { cn } from "@/lib/utils"

interface ActionButton {
  label: string
  onClick?: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
}

interface ActionFooterProps {
  actions: ActionButton[]
  className?: string
}

export function ActionFooter({ actions, className }: ActionFooterProps) {
  return (
    <div className={cn("sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-4", className)}>
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            "px-8 py-2.5 text-sm font-bold tracking-wide transition-colors cursor-pointer uppercase",
            action.variant === "secondary"
              ? "text-bp-red border-2 border-bp-red hover:bg-bp-red/5"
              : "text-accent-foreground bg-bp-red hover:bg-bp-red/90",
            action.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
