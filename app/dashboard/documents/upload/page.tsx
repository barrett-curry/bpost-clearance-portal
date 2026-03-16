"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, FileText, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { FedExSection } from "@/components/fedex/section";
import { DataRow } from "@/components/fedex/data-row";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";

type UploadState = "idle" | "processing" | "complete";

const ocrResult = {
  documentType: "Commercial Invoice",
  invoiceNumber: "INV-2026-0842",
  seller: {
    name: "Rosie & Jack Kidswear Ltd.",
    address: "85 Kensington High Street, London W8 5SE, UK",
  },
  buyer: {
    name: "Robert Chen",
    address: "1242 Elm Street, Dallas, TX 75201, USA",
  },
  items: [
    { description: "Kids Cotton T-Shirt Pack (3pk), assorted colours", quantity: 48, unitPrice: 11.25, total: 540.0, hsCode: "6109.10.00.40" },
  ],
  totalValue: 540.0,
  currency: "EUR",
  date: "2026-02-20",
};

const validationChecks = [
  { field: "Document Type", present: true },
  { field: "Invoice Number", present: true },
  { field: "Seller Name & Address", present: true },
  { field: "Buyer Name & Address", present: true },
  { field: "Item Descriptions", present: true },
  { field: "HS Codes", present: true },
  { field: "Quantities & Unit Prices", present: true },
  { field: "Total Value & Currency", present: true },
  { field: "Country of Origin", present: false },
  { field: "Incoterms", present: false },
];

export default function DocumentUploadPage() {
  const [state, setState] = useState<UploadState>("idle");

  function handleUpload() {
    setState("processing");
    setTimeout(() => setState("complete"), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/documents" className="p-2 hover:bg-bp-light rounded-sm transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Document</h1>
          <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase mt-1">
            Upload trade documents for AI-powered processing and validation
          </p>
        </div>
      </div>

      {state === "idle" && (
        <div>
          <div className="p-8">
            <button
              onClick={handleUpload}
              className="w-full border-2 border-dashed border-bp-red/30 rounded-sm p-16 flex flex-col items-center gap-4 hover:border-bp-red/60 hover:bg-bp-light/50 transition-colors cursor-pointer"
            >
              <div className="h-16 w-16 rounded-full bg-bp-red/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-bp-red" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">Drag and drop files here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse your computer</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs font-semibold tracking-wider uppercase border border-border rounded-sm text-bp-gray">PDF</span>
                <span className="px-2 py-0.5 text-xs font-semibold tracking-wider uppercase border border-border rounded-sm text-bp-gray">JPG</span>
                <span className="px-2 py-0.5 text-xs font-semibold tracking-wider uppercase border border-border rounded-sm text-bp-gray">PNG</span>
              </div>
              <p className="text-xs text-muted-foreground">Maximum file size: 25 MB</p>
            </button>
          </div>
        </div>
      )}

      {state === "processing" && (
        <div>
          <div className="py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-bp-red animate-spin" />
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">Processing document with AI...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Extracting fields, validating data, and classifying document type
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "complete" && (
        <div className="space-y-6">
          {/* OCR Result */}
          <FedExSection
            title="Extracted Document Data"
            variant="static"
            icon={<FileText className="h-5 w-5 text-bp-red" />}
            action={<StatusDot color="green" label="AI Processed" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <DataRow label="Document Type" value={ocrResult.documentType} />
                <DataRow label="Invoice Number" value={ocrResult.invoiceNumber} />
                <DataRow label="Date" value={ocrResult.date} />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">Seller</p>
                  <p className="text-sm font-medium mt-1">{ocrResult.seller.name}</p>
                  <p className="text-xs text-muted-foreground">{ocrResult.seller.address}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">Buyer</p>
                  <p className="text-sm font-medium mt-1">{ocrResult.buyer.name}</p>
                  <p className="text-xs text-muted-foreground">{ocrResult.buyer.address}</p>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="mt-4">
              <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase mb-2">Line Items</p>
              <FedExTable
                headers={[
                  { label: "Description" },
                  { label: "HS Code" },
                  { label: "Qty", className: "text-right" },
                  { label: "Unit Price", className: "text-right" },
                  { label: "Total", className: "text-right" },
                ]}
              >
                {ocrResult.items.map((item, i) => (
                  <FedExTableRow key={i} even={i % 2 === 1}>
                    <FedExTableCell>{item.description}</FedExTableCell>
                    <FedExTableCell className="font-mono text-xs">{item.hsCode}</FedExTableCell>
                    <FedExTableCell className="text-right">{item.quantity}</FedExTableCell>
                    <FedExTableCell className="text-right">€{item.unitPrice.toFixed(2)}</FedExTableCell>
                    <FedExTableCell className="text-right font-medium">€{item.total.toFixed(2)}</FedExTableCell>
                  </FedExTableRow>
                ))}
                <tr className="border-t bg-bp-light/50">
                  <td colSpan={4} className="py-3 px-3 text-right font-medium text-foreground">Total ({ocrResult.currency})</td>
                  <td className="py-3 px-3 text-right font-bold text-foreground">€{ocrResult.totalValue.toFixed(2)}</td>
                </tr>
              </FedExTable>
            </div>
          </FedExSection>

          {/* Validation Checklist */}
          <FedExSection title="Validation Checklist" variant="static">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
              {validationChecks.map((check) => (
                <div key={check.field} className="flex items-center gap-2 py-1">
                  {check.present ? (
                    <CheckCircle className="h-4 w-4 text-bp-green shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  <span className={`text-sm ${check.present ? "text-foreground" : "text-red-600"}`}>
                    {check.field}
                  </span>
                </div>
              ))}
            </div>
          </FedExSection>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/documents"
              className="inline-block px-8 py-2.5 text-sm font-bold tracking-wide uppercase bg-bp-red text-accent-foreground hover:bg-bp-red/90 transition-colors"
            >
              Save Document
            </Link>
            <button
              onClick={() => setState("idle")}
              className="px-8 py-2.5 text-sm font-bold tracking-wide uppercase border-2 border-bp-red text-bp-red hover:bg-bp-red/5 transition-colors cursor-pointer"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
