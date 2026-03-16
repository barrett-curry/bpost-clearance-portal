"use client";

import { useState } from "react";
import { PortalHeader } from "@/components/portal/header";
import { emails } from "@/lib/fake-data";
import { StatusDot } from "@/components/fedex/status-dot";
import { Button } from "@/components/ui/button";
import { Mail, Clock, AlertTriangle, Info, ChevronRight } from "lucide-react";
import Link from "next/link";

const categoryIcon = {
  action: <AlertTriangle className="h-4 w-4 text-bp-red" />,
  update: <Clock className="h-4 w-4 text-bp-red" />,
  info: <Info className="h-4 w-4 text-bp-gray" />,
};

const categoryStatus: Record<string, { color: "orange" | "blue" | "gray"; label: string }> = {
  action: { color: "orange", label: "Action Required" },
  update: { color: "blue", label: "Update" },
  info: { color: "gray", label: "Info" },
};

export default function EmailsPage() {
  const [selectedId, setSelectedId] = useState(emails[0].id);
  const selected = emails.find((e) => e.id === selectedId) ?? emails[0];

  return (
    <div className="h-screen flex flex-col bg-background">
      <PortalHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - email list */}
        <div className="w-[400px] border-r border-border bg-card flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-bp-red" />
              <h2 className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                Inbox
              </h2>
              <span className="ml-auto text-xs font-semibold tracking-wider text-bp-red uppercase">
                {emails.filter((e) => !e.read).length} unread
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {emails.map((email, index) => (
              <button
                key={email.id}
                onClick={() => setSelectedId(email.id)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors cursor-pointer ${
                  email.id === selectedId
                    ? "bg-bp-red/5 border-l-2 border-l-bp-red"
                    : index % 2 === 1
                      ? "bg-bp-light/50 hover:bg-bp-light"
                      : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Unread dot */}
                  <div className="mt-2 shrink-0">
                    {!email.read ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-bp-red" />
                    ) : (
                      <div className="h-2.5 w-2.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm truncate ${
                          !email.read ? "font-semibold" : "font-medium text-bp-gray"
                        }`}
                      >
                        {email.from}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {email.date}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-0.5 truncate ${
                        !email.read ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {email.preview}
                    </p>
                    <div className="mt-1.5">
                      <StatusDot
                        color={categoryStatus[email.category].color}
                        label={categoryStatus[email.category].label}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right panel - email content */}
        <div className="flex-1 overflow-auto bg-bp-light">
          <div className="max-w-3xl mx-auto py-8 px-6">
            {/* Email header */}
            <div className="bg-white border border-border overflow-hidden">
              {/* bpost brand bar */}
              <div className="bg-bp-red px-6 py-4">
                <div className="flex items-baseline text-2xl font-bold tracking-tight">
                  <span className="text-white">bpost</span>
                  <span className="text-white text-xs align-top ml-0.5">{"®"}</span>
                </div>
                <p className="text-white/70 text-sm mt-1">Export & Customs Notifications</p>
              </div>

              {/* Email metadata */}
              <div className="px-6 py-4 border-b border-border">
                <h1 className="text-lg font-semibold text-foreground">
                  {selected.subject}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>From: {selected.from}</span>
                  <span>Date: {selected.date}</span>
                </div>
              </div>

              {/* Email body */}
              <div className="px-6 py-6">
                <div
                  className="text-sm text-foreground leading-relaxed whitespace-pre-line [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: selected.body }}
                />
              </div>

              <div className="border-t border-border" />

              {/* CTA */}
              <div className="px-6 py-5 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Take action on this notification
                </p>
                <Button
                  asChild
                  className="bg-bp-red hover:bg-bp-red/90 text-accent-foreground font-bold tracking-wide uppercase"
                >
                  <Link href={selected.ctaLink}>
                    {selected.ctaLabel}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
