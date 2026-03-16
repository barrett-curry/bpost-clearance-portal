"use client"

import { useState, useEffect } from "react"
import { Zap, CheckCircle2, XCircle, Loader2, Unplug, ShieldCheck, Clock, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/fedex/page-header"

type TokenStatus = {
  connected: boolean
  source?: "ui" | "env" | "placeholder" | "none" | "error"
  maskedToken?: string
  error?: string
}

export default function ConnectZonosPage() {
  const [token, setToken] = useState("")
  const [status, setStatus] = useState<TokenStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch("/api/zonos/token")
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus({ connected: false, source: "error" })
    }
    setLoading(false)
  }

  async function handleConnect() {
    if (!token.trim()) return
    setSaving(true)
    setResult(null)
    try {
      const res = await fetch("/api/zonos/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ ok: true, message: `Connected to ${data.organization || "Zonos"}` })
        setToken("")
        await checkStatus()
      } else {
        setResult({ ok: false, message: data.error || "Connection failed" })
      }
    } catch {
      setResult({ ok: false, message: "Network error - could not reach server" })
    }
    setSaving(false)
  }

  async function handleDisconnect() {
    setSaving(true)
    setResult(null)
    try {
      await fetch("/api/zonos/token", { method: "DELETE" })
      setResult({ ok: true, message: "Token removed. Falling back to server configuration." })
      await checkStatus()
    } catch {
      setResult({ ok: false, message: "Failed to disconnect" })
    }
    setSaving(false)
  }

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Connect Zonos"
        description="Link your Zonos credential token to enable live API-powered features"
      />

      <div className="p-6 max-w-2xl">
        {/* Status Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-bp-light flex items-center justify-center">
              <Zap className="h-5 w-5 text-bp-red" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Zonos API Connection</h2>
              <p className="text-xs text-muted-foreground">Powers classification, landed cost, screening, and more</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking connection...
            </div>
          ) : status?.connected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-bp-green" />
                <span className="font-medium text-bp-green">Connected</span>
                <span className="text-muted-foreground">
                  via {status.source === "ui" ? "portal token" : "server environment"}
                </span>
              </div>
              {status.maskedToken && (
                <div className="bg-muted rounded px-3 py-2 font-mono text-xs text-muted-foreground">
                  {status.maskedToken}
                </div>
              )}
              {status.source === "ui" && (
                <button
                  onClick={handleDisconnect}
                  disabled={saving}
                  className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 cursor-pointer transition-colors"
                >
                  <Unplug className="h-3.5 w-3.5" />
                  Disconnect token
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {status?.source === "placeholder"
                  ? "Placeholder token detected - using demo mode"
                  : "Not connected - features will use demo data"}
              </span>
            </div>
          )}
        </div>

        {/* Connect Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-sm font-bold mb-1">Enter Credential Token</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Paste the Zonos credential token provided to you. It will be validated against the Zonos API before saving.
          </p>

          <div className="space-y-3">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="credential_live_..."
              className="w-full border border-border rounded-md px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-bp-red/30 focus:border-bp-red"
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />

            <button
              onClick={handleConnect}
              disabled={saving || !token.trim()}
              className="flex items-center gap-2 bg-bp-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-bp-red/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {saving ? "Validating..." : "Connect"}
            </button>

            {result && (
              <div
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
                  result.ok
                    ? "bg-bp-green/10 text-bp-green"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {result.ok ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" />
                )}
                {result.message}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted/50 border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">How it works</h3>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-bp-gray mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your token is stored as an HTTP-only cookie - it never appears in client-side JavaScript
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Zap className="h-4 w-4 text-bp-gray mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Once connected, all Zonos-powered features (Classification, Landed Cost, Screening, Export Validation) use live API calls
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-bp-gray mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Tokens can be time-limited or revoked at any time from the Zonos dashboard. If a token expires, features gracefully fall back to demo data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
