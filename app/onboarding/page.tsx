"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoCompany } from "@/lib/fake-data";
import { Check, ChevronRight, ChevronLeft, Shield, Building, Rocket, CheckCircle } from "lucide-react";
import { DataRow } from "@/components/fedex/data-row";

const STEPS = [
  { label: "Account", icon: Shield },
  { label: "bpost Account", icon: Check },
  { label: "Business Profile", icon: Building },
  { label: "Ready!", icon: Rocket },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bpAccount, setBpAccount] = useState("");
  const [validated, setValidated] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bp-light">
      <PortalHeader />
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors ${
                  i < step
                    ? "bg-bp-green border-bp-green text-white"
                    : i === step
                      ? "bg-bp-red border-bp-red text-white"
                      : "bg-white border-gray-300 text-bp-gray"
                }`}
              >
                {i < step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  i < step
                    ? "font-semibold text-bp-green"
                    : i === step
                      ? "font-semibold text-bp-red"
                      : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    i < step ? "bg-bp-green" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="w-full max-w-lg border border-border bg-white">
          {/* Step 1: Account */}
          {step === 0 && (
            <>
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-xl font-bold text-foreground">Create your account</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Get started with your bpost Export & Customs Platform account
                </p>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ob-email">Email address</Label>
                  <Input
                    id="ob-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-password">Password</Label>
                  <Input
                    id="ob-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-confirm">Confirm password</Label>
                  <Input
                    id="ob-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    className="rounded-sm"
                  />
                </div>
                <button
                  className="w-full px-4 py-2.5 bg-bp-red hover:bg-bp-red/90 text-accent-foreground font-bold tracking-wide uppercase transition-colors cursor-pointer rounded-sm flex items-center justify-center gap-2 text-sm"
                  onClick={() => setStep(1)}
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* Step 2: bpost Account */}
          {step === 1 && (
            <>
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-xl font-bold text-foreground">Link your bpost account</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your bpost account number to connect your shipping history
                </p>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bp-acct">bpost Account Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bp-acct"
                      placeholder="e.g. BP-2024-ACCT-001"
                      value={bpAccount}
                      onChange={(e) => {
                        setBpAccount(e.target.value);
                        setValidated(false);
                      }}
                      className="rounded-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleValidate}
                      disabled={validating || validated}
                      className={`rounded-sm ${
                        validated
                          ? "border-bp-green text-bp-green"
                          : ""
                      }`}
                    >
                      {validating ? (
                        <span className="flex items-center gap-1">
                          <span className="h-4 w-4 border-2 border-bp-red border-t-transparent rounded-full animate-spin" />
                          Checking...
                        </span>
                      ) : validated ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-bp-green" />
                          Verified
                        </span>
                      ) : (
                        "Validate"
                      )}
                    </Button>
                  </div>
                </div>
                {validated && (
                  <div className="rounded-sm bg-bp-green/10 border border-bp-green/30 p-3 text-sm text-bp-green flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Account verified!</p>
                      <p className="text-bp-green/80">
                        Rosie & Jack Kidswear Ltd. - Active since 2019
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    className="px-4 py-2.5 border-2 border-bp-red text-bp-red font-bold tracking-wide uppercase hover:bg-bp-red/5 transition-colors cursor-pointer rounded-sm flex items-center gap-2 text-sm"
                    onClick={() => setStep(0)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 bg-bp-red hover:bg-bp-red/90 text-accent-foreground font-bold tracking-wide uppercase transition-colors cursor-pointer rounded-sm flex items-center justify-center gap-2 text-sm"
                    onClick={() => setStep(2)}
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Business Profile */}
          {step === 2 && (
            <>
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-xl font-bold text-foreground">Business profile</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Confirm your business details for customs declarations
                </p>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bp-company">Company name</Label>
                    <Input id="bp-company" defaultValue={demoCompany.name} className="rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-contact">Contact name</Label>
                    <Input id="bp-contact" defaultValue={demoCompany.contact} className="rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-phone">Phone</Label>
                    <Input id="bp-phone" defaultValue={demoCompany.phone} className="rounded-sm" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bp-address">Address</Label>
                    <Input id="bp-address" defaultValue={demoCompany.address} className="rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-city">City</Label>
                    <Input id="bp-city" defaultValue={demoCompany.city} className="rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-postcode">Postcode</Label>
                    <Input id="bp-postcode" defaultValue={demoCompany.postcode} className="rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-country">Country</Label>
                    <Input id="bp-country" defaultValue={demoCompany.country} className="rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-eori">EORI Number</Label>
                    <Input id="bp-eori" defaultValue={demoCompany.eori} className="rounded-sm" />
                  </div>
                </div>
                <div className="border-t border-border" />
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2.5 border-2 border-bp-red text-bp-red font-bold tracking-wide uppercase hover:bg-bp-red/5 transition-colors cursor-pointer rounded-sm flex items-center gap-2 text-sm"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 bg-bp-red hover:bg-bp-red/90 text-accent-foreground font-bold tracking-wide uppercase transition-colors cursor-pointer rounded-sm flex items-center justify-center gap-2 text-sm"
                    onClick={() => setStep(3)}
                  >
                    Complete Setup
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Success */}
          {step === 3 && (
            <>
              <div className="text-center px-6 pt-8 pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-bp-green/10 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-bp-green" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground">You&apos;re all set!</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Your bpost Export & Customs Platform account is ready. Start managing
                  your customs clearance, track shipments, and stay compliant.
                </p>
              </div>
              <div className="px-6 pb-8 space-y-4">
                <div className="rounded-sm bg-bp-light p-4 space-y-1">
                  <DataRow label="Company" value={demoCompany.name} />
                  <DataRow label="bpost Account" value={demoCompany.bpostAccount} />
                  <DataRow
                    label="Location"
                    value={`${demoCompany.city}, ${demoCompany.country}`}
                  />
                </div>
                <button
                  className="w-full px-4 py-3 bg-bp-red hover:bg-bp-red/90 text-accent-foreground font-bold tracking-wide uppercase transition-colors cursor-pointer rounded-sm flex items-center justify-center gap-2 text-sm"
                  onClick={() => router.push("/dashboard")}
                >
                  <Rocket className="h-4 w-4" />
                  Explore the Portal
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
