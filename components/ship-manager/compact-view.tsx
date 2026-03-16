"use client"

import { ShipmentSection } from "./shipment-section"

export function CompactView() {
  return (
    <div className="flex gap-4 p-6">
      {/* Left column: From, To, Package details */}
      <div className="flex-1 flex flex-col gap-4">
        {/* From */}
        <ShipmentSection title="From" complete>
          <div className="pt-3 flex gap-8">
            <div className="text-sm text-foreground min-w-16 font-medium" />
            <div className="text-sm text-foreground leading-relaxed">
              <p className="font-medium">Priya Patel, Precious GEM</p>
              <p className="text-bp-gray">Dallas, United States</p>
            </div>
          </div>
        </ShipmentSection>

        {/* To */}
        <ShipmentSection title="To" complete>
          <div className="pt-3 flex gap-8">
            <div className="text-sm text-foreground min-w-16 font-medium" />
            <div className="text-sm text-foreground leading-relaxed">
              <p className="font-medium">John Green</p>
              <p className="text-bp-gray">Memphis</p>
              <p className="text-bp-gray">Tennessee, 38103, United States</p>
            </div>
          </div>
        </ShipmentSection>

        {/* Package Details */}
        <ShipmentSection title="Package details" complete>
          <div className="pt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-semibold tracking-wider text-bp-gray uppercase">
                    Packages
                  </th>
                  <th className="text-center py-2 text-xs font-semibold tracking-wider text-bp-gray uppercase">
                    Weight per package
                  </th>
                  <th className="text-right py-2 text-xs font-semibold tracking-wider text-bp-gray uppercase">
                    <span>Dimensions</span>
                    <br />
                    <span className="text-[10px] font-normal normal-case">L x W x H</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-bp-light/50">
                  <td className="py-3 px-2 text-foreground">1</td>
                  <td className="py-3 px-2 text-center text-foreground">1 lb</td>
                  <td className="py-3 px-2 text-right text-foreground">4 x 4 x 1 in</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ShipmentSection>
      </div>

      {/* Right column: Service, Pickup, Billing, Summary */}
      <div className="w-96 flex flex-col gap-4">
        {/* Service */}
        <ShipmentSection title="Service" complete>
          <div className="pt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-bp-gray">Ship date</span>
              <span className="font-medium text-foreground">Tuesday, May 9</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bp-gray">Selected service</span>
              <span className="font-medium text-foreground">{'bpost Tracked 24\u00AE'}</span>
            </div>
          </div>
        </ShipmentSection>

        {/* Pickup/drop-off */}
        <ShipmentSection title="Pickup/drop-off" complete>
          <div className="pt-3 text-sm text-bp-gray">
            Use an already scheduled pickup
          </div>
        </ShipmentSection>

        {/* Billing and Tax IDs */}
        <ShipmentSection title="Billing and Tax IDs" complete>
          <div className="pt-3 flex justify-between text-sm">
            <span className="text-bp-gray">Transportation costs</span>
            <span className="font-medium text-foreground">My account</span>
          </div>
        </ShipmentSection>

        {/* Expected Delivery / Cost Summary */}
        <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
          {/* Zigzag top border */}
          <div className="h-3 bg-bp-light" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 L10 0 L20 12' fill='%23ffffff' stroke='none'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '20px 12px',
          }} />
          <div className="px-5 py-3">
            <p className="text-[10px] font-semibold tracking-widest text-bp-gray uppercase">
              Expected Delivery
            </p>
            <p className="text-sm text-foreground mt-1">
              Thursday, 11 May 2023, before end of day
            </p>
          </div>
          <div className="border-t border-border px-5 py-3 flex justify-between">
            <span className="text-sm text-foreground">Shipping costs</span>
            <span className="text-sm font-bold text-foreground">€12.26</span>
          </div>
        </div>
      </div>
    </div>
  )
}
