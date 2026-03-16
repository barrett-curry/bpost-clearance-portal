"use client";

import { useState } from "react";
import { Code2, ArrowDownUp, ChevronDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiCallInfo {
  endpoint: string;
  mutation: string;
  variables: unknown;
  response: unknown;
  responseTimeMs: number;
  httpStatus: number;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Trigger Button — shown after an API call completes
// ---------------------------------------------------------------------------

export function ApiCallButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-1.5 text-[10px] font-bold tracking-wider uppercase border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    >
      <Code2 className="size-3.5" />
      See the API Call
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Sheet Panel — shows full request/response details
// ---------------------------------------------------------------------------

export function ApiCallDetailSheet({
  open,
  onOpenChange,
  call,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  call: ApiCallInfo | null;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!call) return null;

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="absolute top-2 right-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer"
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <Check className="size-3 text-emerald-400" />
      ) : (
        <Copy className="size-3 text-slate-400" />
      )}
    </button>
  );

  const formattedVars = JSON.stringify(call.variables, null, 2);
  const formattedResponse = JSON.stringify(call.response, null, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Code2 className="size-4 text-bp-red" />
            API Call Details
          </SheetTitle>
          <SheetDescription>
            Inspect the Zonos GraphQL request and response
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-5">
          {/* Mutation */}
          <div className="space-y-1.5">
            <SectionLabel>GraphQL Mutation</SectionLabel>
            <code className="text-xs font-mono bg-slate-100 px-3 py-2 rounded block text-slate-700">
              {call.mutation}
            </code>
          </div>

          {/* Input Variables */}
          <CollapsibleCode
            label="Input Variables"
            icon={<ArrowDownUp className="size-3" />}
            code={formattedVars}
            field="variables"
            copyBtn={CopyBtn}
            defaultOpen
          />

          {/* Response */}
          <CollapsibleCode
            label="Response"
            icon={<ArrowDownUp className="size-3 rotate-180" />}
            code={formattedResponse}
            field="response"
            copyBtn={CopyBtn}
            defaultOpen
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest text-bp-gray uppercase">{children}</p>
  );
}

function CollapsibleCode({
  label,
  icon,
  code,
  field,
  copyBtn: CopyBtn,
  defaultOpen = false,
}: {
  label: string;
  icon: React.ReactNode;
  code: string;
  field: string;
  copyBtn: React.ComponentType<{ text: string; field: string }>;
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <div className="space-y-1.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <SectionLabel>{label}</SectionLabel>
        <ChevronDown
          className={`size-3 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
        <span className="text-[10px] text-muted-foreground ml-auto">
          {code.split("\n").length} lines
        </span>
      </button>
      {expanded && (
        <div className="relative animate-in fade-in slide-in-from-top-2 duration-200">
          <CopyBtn text={code} field={field} />
          <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 px-4 py-3 rounded overflow-x-auto max-h-80 leading-relaxed">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
}
