"use client"

import { ChevronDown, Search, User } from "lucide-react"

const navItems = ["Shipping", "Tracking", "Design & print", "Locations", "Support"]

export function Header() {
  return (
    <header className="bg-bp-red text-primary-foreground">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-baseline text-2xl font-bold tracking-tight">
            <span className="text-primary-foreground">Fed</span>
            <span className="text-bp-red">Ex</span>
            <span className="text-primary-foreground text-xs align-top ml-0.5">{'®'}</span>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item}
                className="flex items-center gap-1 text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {item}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-foreground/90 hidden sm:inline">Precious GEM</span>
          <button className="p-1.5 rounded-full border border-primary-foreground/30 hover:border-primary-foreground/60 transition-colors cursor-pointer">
            <User className="h-5 w-5" />
          </button>
          <button className="p-1.5 hover:bg-primary-foreground/10 rounded transition-colors cursor-pointer">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
