import { cn } from "@/lib/utils"

type StatusColor = "green" | "orange" | "red" | "blue" | "gray" | "yellow"

const dotColors: Record<StatusColor, string> = {
  green: "bg-bp-green",
  orange: "bg-bp-red",
  red: "bg-red-600",
  blue: "bg-blue-500",
  gray: "bg-gray-400",
  yellow: "bg-yellow-500",
}

const textColors: Record<StatusColor, string> = {
  green: "text-bp-green",
  orange: "text-bp-red",
  red: "text-red-600",
  blue: "text-blue-600",
  gray: "text-gray-500",
  yellow: "text-yellow-600",
}

interface StatusDotProps {
  color: StatusColor
  label: string
  className?: string
  pulse?: boolean
}

export function StatusDot({ color, label, className, pulse }: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span
        className={cn(
          "h-2 w-2 rounded-full shrink-0",
          dotColors[color],
          pulse && "animate-pulse"
        )}
      />
      <span className={textColors[color]}>{label}</span>
    </span>
  )
}
