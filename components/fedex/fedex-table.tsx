import { cn } from "@/lib/utils"

interface RoyalMailTableProps {
  headers: { label: React.ReactNode; className?: string }[]
  children: React.ReactNode
  className?: string
}

export function RoyalMailTable({ headers, children, className }: RoyalMailTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, i) => (
              <th
                key={i}
                className={cn(
                  "text-left py-2.5 px-3 text-xs font-semibold tracking-wider text-bp-gray uppercase",
                  header.className
                )}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

interface RoyalMailTableRowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  even?: boolean
}

export function RoyalMailTableRow({ children, className, onClick, even }: RoyalMailTableRowProps) {
  return (
    <tr
      className={cn(
        even && "bg-bp-light/50",
        onClick && "cursor-pointer hover:bg-bp-light/80",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface RoyalMailTableCellProps {
  children: React.ReactNode
  className?: string
}

export function RoyalMailTableCell({ children, className }: RoyalMailTableCellProps) {
  return (
    <td className={cn("py-3 px-3 text-foreground", className)}>
      {children}
    </td>
  )
}

// Backward-compatible aliases
export const FedExTable = RoyalMailTable;
export const FedExTableRow = RoyalMailTableRow;
export const FedExTableCell = RoyalMailTableCell;
