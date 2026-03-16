"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Crown } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border border-border bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="text-center px-6 pt-8 pb-4">
            <div className="flex flex-col items-center mb-3">
              <Crown className="h-8 w-8 text-bp-red mb-1" />
              <div className="bg-bp-red text-white px-3 py-1 text-sm font-bold tracking-tight rounded-sm">
                bpost
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground">Sign in to Export & Customs Platform</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your export customs clearance, shipments, and trade compliance
            </p>
          </div>

          {/* Form */}
          <div className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs font-bold tracking-wide text-bp-red hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-bp-red hover:bg-bp-red/90 text-primary-foreground font-bold tracking-wide rounded-full"
                size="lg"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>

              <div className="relative my-4">
                <div className="border-t border-border" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground tracking-wide">
                  or
                </span>
              </div>

              <button
                type="button"
                className="w-full px-4 py-2.5 border-2 border-bp-red text-bp-red font-bold tracking-wide hover:bg-bp-red/5 transition-colors cursor-pointer rounded-full flex items-center justify-center gap-2 text-sm"
                onClick={() => router.push("/dashboard")}
              >
                Sign in with bpost Account
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/onboarding"
                className="text-sm font-bold text-bp-red hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
