"use client"

import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepSectionProps {
  title: string
  complete?: boolean
  children: React.ReactNode
  showEdit?: boolean
}

function StepSection({ title, complete = true, children, showEdit = true }: StepSectionProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <div className="border-l-3 border-bp-green px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className={cn(
                "h-5 w-5",
                complete ? "text-bp-green fill-bp-green stroke-card" : "text-border"
              )}
            />
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>
          {showEdit && (
            <button className="text-xs font-bold tracking-wide text-bp-red hover:underline cursor-pointer">
              EDIT
            </button>
          )}
        </div>
        <div className="ml-8">{children}</div>
      </div>
    </div>
  )
}

export function ComfortableView() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
        {/* From */}
        <StepSection title="From" complete>
          <div className="text-sm text-foreground leading-relaxed">
            <p className="font-medium">Priya Patel</p>
            <p className="text-bp-gray">Precious GEM</p>
            <p className="text-bp-gray">Dallas, United States</p>
          </div>
        </StepSection>

        {/* To */}
        <StepSection title="To" complete>
          <div className="text-sm text-foreground leading-relaxed">
            <p className="font-medium">John Green</p>
            <p className="text-bp-gray">123 Second Street,</p>
            <p className="text-bp-gray">Memphis, United States</p>
          </div>
        </StepSection>

        {/* Package Details */}
        <StepSection title="Package details" complete>
          <div className="text-sm flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-bp-gray">Total packages</span>
              <span className="font-medium text-foreground">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bp-gray">Total weight</span>
              <span className="font-medium text-foreground">1 lb</span>
            </div>
          </div>
        </StepSection>

        {/* Service */}
        <StepSection title="Service" complete>
          <div className="text-sm flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-bp-gray">Ship date</span>
              <span className="font-medium text-foreground">Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bp-gray">Service</span>
              <span className="font-medium text-foreground">{'bpost Tracked 24\u00AE'}</span>
            </div>
          </div>
        </StepSection>

        {/* Pickup/drop-off */}
        <StepSection title="Pickup/drop-off" complete={false} showEdit={false}>
          <span className="sr-only">Pickup section pending</span>
        </StepSection>

        {/* Billing */}
        <StepSection title="Billing" complete={false} showEdit={false}>
          <span className="sr-only">Billing section pending</span>
        </StepSection>
      </div>
    </div>
  )
}
