import { cn } from "@/lib/utils"

interface DataRowProps {
  label: string
  value: React.ReactNode
  className?: string
}

export function DataRow({ label, value, className }: DataRowProps) {
  return (
    <div className={cn("flex justify-between text-sm py-1", className)}>
      <span className="text-bp-gray">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
