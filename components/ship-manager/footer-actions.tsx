"use client"

export function FooterActions() {
  return (
    <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-4">
      <button className="px-8 py-2.5 text-sm font-bold tracking-wide text-bp-red border-2 border-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer uppercase">
        Save as Draft
      </button>
      <button className="px-8 py-2.5 text-sm font-bold tracking-wide text-accent-foreground bg-bp-red hover:bg-bp-red/90 transition-colors cursor-pointer uppercase">
        Finalize
      </button>
    </div>
  )
}
