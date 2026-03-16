"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Globe,
  PenLine,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Building2,
} from "lucide-react";
import { StatusDot } from "@/components/fedex/status-dot";
import { PageHeader } from "@/components/fedex/page-header";
import { documents as initialDocuments, demoCompany, getProduct, type DocItem } from "@/lib/fake-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// ── Status dot mapping ──

const statusToDot: Record<
  string,
  { color: "green" | "orange" | "red" | "gray"; label: string }
> = {
  verified: { color: "green", label: "On File" },
  pending: { color: "orange", label: "Pending" },
  rejected: { color: "red", label: "Rejected" },
  expired: { color: "gray", label: "Expired" },
  missing: { color: "red", label: "Needed" },
};

const countries = [
  { code: "US", name: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "CA", name: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "MX", name: "Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "EU", name: "European Union", flag: "\u{1F1EA}\u{1F1FA}" },
  { code: "JP", name: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
];

// ── Document-specific field templates ──

type DocFieldTemplate = {
  heading: string;
  description: string;
  issuingAuthority: string;
  fields: { name: string; label: string; defaultValue: string; type?: "text" | "date" }[];
};

function getDocTemplate(doc: DocItem): DocFieldTemplate {
  const base = {
    heading: doc.name,
    description: `Prepare and submit ${doc.name} electronically`,
    issuingAuthority: "Regulatory Authority",
  };

  // CPSIA forms (US children's products)
  if (doc.type.includes("CPSIA")) {
    const product = doc.productId ? getProduct(doc.productId) : undefined;
    return {
      ...base,
      issuingAuthority: "Consumer Product Safety Commission (CPSC)",
      fields: [
        { name: "importerNumber", label: "Importer Registration Number", defaultValue: "CPSC-IMP-24891" },
        { name: "productName", label: "Product Name", defaultValue: product?.name ?? "" },
        { name: "hsCode", label: "HS Tariff Code", defaultValue: product?.hsCode ?? "" },
        { name: "materials", label: "Materials / Composition", defaultValue: product?.materials ?? "" },
        { name: "ageRange", label: "Target Age Range", defaultValue: "0-14 years" },
        { name: "origin", label: "Country of Origin", defaultValue: product?.cooName ?? "" },
        { name: "testingLab", label: "Accredited Testing Laboratory", defaultValue: product ? `${product.name} - ${product.description?.split(",")[0]}` : "" },
      ],
    };
  }

  // CPSC forms
  if (doc.type.includes("CPSC")) {
    return {
      ...base,
      issuingAuthority: "U.S. Consumer Product Safety Commission (CPSC)",
      fields: [
        { name: "facilityName", label: "Facility Name", defaultValue: demoCompany.name },
        { name: "facilityAddress", label: "Facility Address", defaultValue: `${demoCompany.address}, ${demoCompany.city}, ${demoCompany.postcode}` },
        { name: "feiNumber", label: "FEI Number", defaultValue: "3012847650" },
        { name: "productCategory", label: "Product Category", defaultValue: "Children's Clothing & Textiles" },
        { name: "dunNumber", label: "D-U-N-S Number", defaultValue: "84-216-7391" },
        { name: "registrationType", label: "Registration Type", defaultValue: "Foreign Consumer Product Facility" },
      ],
    };
  }

  // Import Licenses (CFIA, SAT, general)
  if (doc.type.includes("Import License") || doc.type.includes("License")) {
    return {
      ...base,
      issuingAuthority: doc.countryCode === "CA" ? "Canadian Food Inspection Agency (CFIA)"
        : doc.countryCode === "MX" ? "Servicio de Administracion Tributaria (SAT)"
        : "Import Licensing Authority",
      fields: [
        { name: "importerName", label: "Importer / Applicant Name", defaultValue: demoCompany.name },
        { name: "importerAddress", label: "Business Address", defaultValue: `${demoCompany.address}, ${demoCompany.city}, ${demoCompany.postcode}, ${demoCompany.country}` },
        { name: "productTypes", label: "Products to Import", defaultValue: "Children's Clothing, Baby Clothing, Kids Footwear, Accessories" },
        { name: "estimatedVolume", label: "Estimated Annual Volume", defaultValue: "50,000 units" },
        { name: "importPurpose", label: "Purpose of Import", defaultValue: "Commercial Resale" },
        { name: "originCountries", label: "Countries of Origin", defaultValue: "Bangladesh, China, Turkey, India, Portugal" },
      ],
    };
  }

  // Health Permits (COFEPRIS, MHLW)
  if (doc.type.includes("Health Permit") || doc.type.includes("Import Notification")) {
    return {
      ...base,
      issuingAuthority: doc.countryCode === "MX" ? "COFEPRIS (Federal Commission for Protection Against Health Risks)"
        : doc.countryCode === "JP" ? "Ministry of Health, Labour and Welfare (MHLW)"
        : "Health Authority",
      fields: [
        { name: "applicantName", label: "Applicant / Company Name", defaultValue: demoCompany.name },
        { name: "applicantAddress", label: "Business Address", defaultValue: `${demoCompany.address}, ${demoCompany.city}` },
        { name: "productDescription", label: "Product Description", defaultValue: "Imported children's clothing and textiles for commercial distribution" },
        { name: "ingredients", label: "Primary Materials", defaultValue: "Cotton, polyester, wool, denim" },
        { name: "storageConditions", label: "Storage Conditions", defaultValue: "Cool, dry place. Away from direct sunlight." },
        { name: "shelfLife", label: "Shelf Life / Best Before", defaultValue: "N/A - Non-perishable textile goods" },
      ],
    };
  }

  // Customs Declarations
  if (doc.type.includes("Declaration") || doc.type.includes("Customs")) {
    return {
      ...base,
      issuingAuthority: doc.countryCode === "CA" ? "Canada Border Services Agency (CBSA)"
        : "Customs Authority",
      fields: [
        { name: "declarantName", label: "Declarant Name", defaultValue: demoCompany.contact },
        { name: "declarantCompany", label: "Company", defaultValue: demoCompany.name },
        { name: "eori", label: "EORI Number", defaultValue: demoCompany.eori },
        { name: "commodityCode", label: "Primary HS Code", defaultValue: "6109.10 (T-shirts, cotton)" },
        { name: "goodsDescription", label: "Description of Goods", defaultValue: "Assorted children's clothing from global manufacturers for commercial import" },
        { name: "estimatedValue", label: "Estimated Shipment Value (EUR)", defaultValue: "€2,500.00" },
      ],
    };
  }

  // Certifications (NOM, JAS, VI-1)
  if (doc.type.includes("Certification") || doc.type.includes("Certificate")) {
    return {
      ...base,
      issuingAuthority: doc.countryCode === "MX" ? "Direccion General de Normas (DGN)"
        : doc.countryCode === "JP" ? "Japanese Agricultural Standards (JAS)"
        : "Certification Body",
      fields: [
        { name: "applicantName", label: "Applicant", defaultValue: demoCompany.name },
        { name: "productCategory", label: "Product Category", defaultValue: "Children's Clothing & Textiles" },
        { name: "standardReference", label: "Standard / Regulation Reference", defaultValue: doc.countryCode === "MX" ? "NOM-004-SCFI-2006" : doc.countryCode === "JP" ? "JIS L 1930 (Textile Testing)" : "EU Reg. 1007/2011 (Textile Labelling)" },
        { name: "testingLab", label: "Accredited Testing Laboratory", defaultValue: "SGS Group - Brussels" },
        { name: "sampleCount", label: "Number of Samples Submitted", defaultValue: "6" },
        { name: "certificationScope", label: "Scope of Certification", defaultValue: "Product composition, labeling, and safety compliance" },
      ],
    };
  }

  // Duty/Financial guarantees
  if (doc.type.includes("Duty") || doc.type.includes("Guarantee") || doc.type.includes("Bond")) {
    return {
      ...base,
      issuingAuthority: doc.countryCode === "EU" ? "EU Excise Authority" : "Customs Authority",
      fields: [
        { name: "guarantorName", label: "Guarantor / Company Name", defaultValue: demoCompany.name },
        { name: "guarantorAddress", label: "Registered Address", defaultValue: `${demoCompany.address}, ${demoCompany.city}, ${demoCompany.postcode}` },
        { name: "guaranteeAmount", label: "Guarantee Amount", defaultValue: "\u20AC50,000.00" },
        { name: "bankName", label: "Issuing Bank / Surety", defaultValue: "Barclays Corporate Banking" },
        { name: "accountRef", label: "Account Reference", defaultValue: "BARC-BE-2024-08891" },
        { name: "validityPeriod", label: "Validity Period", defaultValue: "12 months from date of issue" },
      ],
    };
  }

  // Safety/Quality authorizations
  if (doc.type.includes("Safety Declaration") || doc.type.includes("Quality Label")) {
    return {
      ...base,
      issuingAuthority: doc.countryCode === "CA" ? "Health Canada - Consumer Product Safety"
        : doc.countryCode === "JP" ? "Ministry of Economy, Trade and Industry (METI)"
        : "Product Safety Authority",
      fields: [
        { name: "applicantName", label: "Applicant / Company Name", defaultValue: demoCompany.name },
        { name: "applicantAddress", label: "Registered Address", defaultValue: `${demoCompany.address}, ${demoCompany.city}, ${demoCompany.postcode}` },
        { name: "licenseType", label: "License Type Requested", defaultValue: "Importer - Children's Products" },
        { name: "productTypes", label: "Product Categories", defaultValue: "Children's Clothing, Baby Clothing, Kids Accessories" },
        { name: "estimatedVolume", label: "Estimated Annual Volume (Units)", defaultValue: "50,000 units" },
        { name: "distributionMethod", label: "Distribution Method", defaultValue: "Direct to retailers and direct-to-consumer" },
      ],
    };
  }

  // Excise documents (EMCS)
  if (doc.type.includes("Excise")) {
    return {
      ...base,
      issuingAuthority: "Belgian Customs / EU Excise Authority",
      fields: [
        { name: "consignorName", label: "Consignor", defaultValue: demoCompany.name },
        { name: "exciseId", label: "Excise ID / Warehouse Number", defaultValue: "GBWK000012345" },
        { name: "movementType", label: "Movement Type", defaultValue: "Duty-suspended movement (B2B)" },
        { name: "productCode", label: "Product Code", defaultValue: "T100 - Textile Products" },
        { name: "quantity", label: "Quantity (Liters)", defaultValue: "540 L" },
        { name: "destinationWarehouse", label: "Destination Warehouse ID", defaultValue: "" },
      ],
    };
  }

  // Export declarations
  if (doc.type.includes("Export")) {
    return {
      ...base,
      issuingAuthority: "Belgian Customs & Excise",
      fields: [
        { name: "exporterName", label: "Exporter Name", defaultValue: demoCompany.name },
        { name: "eori", label: "EORI Number", defaultValue: demoCompany.eori },
        { name: "exporterAddress", label: "Exporter Address", defaultValue: `${demoCompany.address}, ${demoCompany.city}, ${demoCompany.postcode}` },
        { name: "goodsDescription", label: "Description of Goods", defaultValue: "Children's clothing and textiles for export" },
        { name: "primaryHsCode", label: "Primary HS Code", defaultValue: "6109.10 (T-shirts, cotton)" },
        { name: "destinationCountry", label: "Destination Country", defaultValue: "" },
      ],
    };
  }

  // Fallback
  return {
    ...base,
    issuingAuthority: "Regulatory Authority",
    fields: [
      { name: "applicantName", label: "Applicant Name", defaultValue: demoCompany.name },
      { name: "applicantAddress", label: "Address", defaultValue: `${demoCompany.address}, ${demoCompany.city}` },
      { name: "purpose", label: "Purpose", defaultValue: "" },
      { name: "details", label: "Additional Details", defaultValue: "" },
    ],
  };
}

// ── Prepare & Sign Dialog ──

function PrepareDocDialog({
  doc,
  open,
  onOpenChange,
  onComplete,
}: {
  doc: DocItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (docId: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [signatureName, setSignatureName] = useState(demoCompany.contact);
  const [certify, setCertify] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const template = getDocTemplate(doc);
  const today = new Date().toISOString().split("T")[0];
  const refNumber = `BP-${doc.countryCode ?? "XX"}-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  // Initialize form data from template defaults
  const getFieldValue = (name: string) => {
    if (formData[name] !== undefined) return formData[name];
    const field = template.fields.find((f) => f.name === name);
    return field?.defaultValue ?? "";
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
      onComplete(doc.id);
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setFormData({});
      setSignatureName(demoCompany.contact);
      setCertify(false);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-bp-red" />
            {step === 3 ? "Document Submitted" : `Prepare & Sign \u2014 ${doc.name}`}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Review and complete the pre-filled application details."}
            {step === 2 && "Review the document and apply your digital signature."}
            {step === 3 && "Your document has been prepared and submitted for processing."}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  s === step
                    ? "bg-bp-red text-white"
                    : s < step
                      ? "bg-bp-green text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? "\u2713" : s}
              </div>
              <span className={`text-xs font-medium ${s === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Details" : s === 2 ? "Review & Sign" : "Complete"}
              </span>
              {s < 3 && <div className={`flex-1 h-px ${s < step ? "bg-bp-green" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Document Details */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Company info (always shown, read-only) */}
            <div className="border border-border p-4 bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-bp-red" />
                <span className="text-xs font-bold tracking-wider text-bp-gray uppercase">
                  Applicant Information
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Company</span>
                  <p className="font-medium">{demoCompany.name}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Contact</span>
                  <p className="font-medium">{demoCompany.contact}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Address</span>
                  <p className="font-medium">{demoCompany.address}, {demoCompany.city}, {demoCompany.postcode}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">EORI / EIN</span>
                  <p className="font-medium">{demoCompany.eori}</p>
                </div>
              </div>
            </div>

            {/* Issuing authority */}
            <div className="flex items-center gap-2 px-4 py-2 border border-bp-red/20 bg-bp-red/5">
              <Shield className="h-4 w-4 text-bp-red" />
              <span className="text-xs text-bp-red font-medium">
                Submitted to: {template.issuingAuthority}
              </span>
            </div>

            {/* Document-specific fields */}
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-wider text-bp-gray uppercase">
                Document Details
              </span>
              <div className="grid grid-cols-2 gap-4">
                {template.fields.map((field) => (
                  <div key={field.name} className={field.label.length > 30 ? "col-span-2" : ""}>
                    <Label htmlFor={field.name} className="text-xs mb-1.5">
                      {field.label}
                    </Label>
                    <Input
                      id={field.name}
                      value={getFieldValue(field.name)}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                      }
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Next button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold tracking-wide uppercase bg-bp-red text-white hover:bg-bp-red/90 transition-colors cursor-pointer"
              >
                Review & Sign
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Sign */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Document preview */}
            <div className="border-2 border-border p-6 space-y-4 bg-white">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <p className="text-lg font-bold text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{doc.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                    Reference
                  </p>
                  <p className="text-sm font-mono font-bold text-bp-red">{refNumber}</p>
                  <p className="text-xs text-muted-foreground mt-1">Date: {today}</p>
                </div>
              </div>

              {/* Authority */}
              <div className="bg-muted/50 px-4 py-2">
                <p className="text-xs text-muted-foreground">Submitted to</p>
                <p className="text-sm font-medium">{template.issuingAuthority}</p>
              </div>

              {/* Applicant */}
              <div>
                <p className="text-xs font-bold tracking-wider text-bp-gray uppercase mb-2">
                  Applicant
                </p>
                <div className="text-sm space-y-0.5">
                  <p className="font-medium">{demoCompany.name}</p>
                  <p className="text-muted-foreground">{demoCompany.address}, {demoCompany.city}, {demoCompany.postcode}</p>
                  <p className="text-muted-foreground">{demoCompany.country}</p>
                  <p className="text-muted-foreground">EORI: {demoCompany.eori}</p>
                </div>
              </div>

              {/* Document details */}
              <div>
                <p className="text-xs font-bold tracking-wider text-bp-gray uppercase mb-2">
                  Details
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {template.fields.map((field) => (
                    <div key={field.name}>
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <p className="font-medium">{getFieldValue(field.name) || "\u2014"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature area */}
              <div className="border-t-2 border-border pt-4 mt-4">
                <p className="text-xs font-bold tracking-wider text-bp-gray uppercase mb-3">
                  Digital Signature
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="signatureName" className="text-xs mb-1.5">
                      Full Legal Name
                    </Label>
                    <Input
                      id="signatureName"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Signature Preview</p>
                    <div className="border-b-2 border-foreground/30 pb-1 min-h-[36px] flex items-end">
                      {signatureName && (
                        <span
                          className="text-2xl text-bp-red"
                          style={{ fontFamily: "'Segoe Script', 'Brush Script MT', 'Dancing Script', cursive" }}
                        >
                          {signatureName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certification checkbox */}
            <div className="flex items-start gap-3 px-4 py-3 border border-border bg-muted/30">
              <Checkbox
                id="certify"
                checked={certify}
                onCheckedChange={(v) => setCertify(v === true)}
                className="mt-0.5"
              />
              <label htmlFor="certify" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I, <strong className="text-foreground">{signatureName}</strong>, certify that
                the information provided in this document is true, accurate, and complete
                to the best of my knowledge. I understand that any false statements may
                result in penalties under applicable trade and customs regulations. I authorize
                bpost to submit this document electronically on behalf of{" "}
                <strong className="text-foreground">{demoCompany.name}</strong>.
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide uppercase border-2 border-border text-bp-gray hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!certify || !signatureName.trim() || submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold tracking-wide uppercase bg-bp-red text-white hover:bg-bp-red/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PenLine className="h-4 w-4" />
                    Sign & Submit
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="py-6 text-center space-y-5">
            <div className="mx-auto h-16 w-16 rounded-full bg-bp-green/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-bp-green" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Document Submitted Successfully</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your {doc.name} has been prepared, signed, and submitted for review.
              </p>
            </div>

            <div className="border border-border p-4 mx-auto max-w-sm space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono font-bold text-bp-red">{refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium">{today}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Authority</span>
                <span className="font-medium text-right text-xs">{template.issuingAuthority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusDot color="orange" label="Pending Review" />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signed By</span>
                <span
                  className="text-bp-red"
                  style={{ fontFamily: "'Segoe Script', 'Brush Script MT', 'Dancing Script', cursive" }}
                >
                  {signatureName}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-bp-red" />
              Estimated processing time: 2–5 business days
            </div>

            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold tracking-wide uppercase bg-bp-red text-white hover:bg-bp-red/90 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<"origin" | "country">("origin");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [localDocs, setLocalDocs] = useState<DocItem[]>(initialDocuments);
  const [prepareDoc, setPrepareDoc] = useState<DocItem | null>(null);

  const handleDocComplete = (docId: string) => {
    setLocalDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: "pending" as const,
              uploadDate: new Date().toISOString().split("T")[0],
            }
          : d
      )
    );
  };

  const originDocs = localDocs.filter((d) => d.scope === "origin");
  const countryDocs = localDocs.filter(
    (d) => d.scope === "country-specific" && d.countryCode === selectedCountry
  );

  // Stats across all documents
  const totalOnFile = localDocs.filter((d) => d.status !== "missing").length;
  const verified = localDocs.filter((d) => d.status === "verified").length;
  const pending = localDocs.filter((d) => d.status === "pending").length;
  const expiringSoon = localDocs.filter((d) => {
    if (!d.expiryDate) return false;
    const expiry = new Date(d.expiryDate);
    const now = new Date();
    const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    return expiry <= ninetyDays && expiry >= now;
  }).length;

  const originOnFile = originDocs.filter((d) => d.status !== "missing");
  const originMissing = originDocs.filter((d) => d.status === "missing");

  const countryOnFile = countryDocs.filter((d) => d.status !== "missing").length;
  const countryTotal = countryDocs.length;

  const selectedCountryInfo = countries.find((c) => c.code === selectedCountry);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage trade compliance documents for your shipments and products"
        action={
          <Link
            href="/dashboard/documents/upload"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold tracking-wide uppercase border-2 border-bp-red text-bp-red hover:bg-bp-red/5 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Link>
        }
      />

      {/* Global Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-bp-red" />
            <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
              Total Documents
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalOnFile}</p>
        </div>
        <div className="border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-bp-green" />
            <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
              Verified
            </span>
          </div>
          <p className="text-2xl font-bold text-bp-green">{verified}</p>
        </div>
        <div className="border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-bp-red" />
            <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
              Pending Review
            </span>
          </div>
          <p className="text-2xl font-bold text-bp-red">{pending}</p>
        </div>
        <div className="border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
              Expiring Soon
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600">{expiringSoon}</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("origin")}
          className={`px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors cursor-pointer ${
            activeTab === "origin"
              ? "text-bp-red border-b-2 border-bp-red"
              : "text-bp-gray hover:text-foreground"
          }`}
        >
          Origin Documents
        </button>
        <button
          onClick={() => setActiveTab("country")}
          className={`px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "country"
              ? "text-bp-red border-b-2 border-bp-red"
              : "text-bp-gray hover:text-foreground"
          }`}
        >
          <Globe className="h-4 w-4" />
          Country-Specific
        </button>
      </div>

      {/* Origin Documents Tab */}
      {activeTab === "origin" && (
        <div className="space-y-6">
          {/* On-file origin docs */}
          <div className="divide-y divide-border border border-border">
            {originOnFile.map((doc) => {
              const sd = statusToDot[doc.status];
              return (
                <div key={doc.id} className="p-4 flex items-center gap-4">
                  <FileText className="h-5 w-5 text-bp-red shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                        {doc.type}
                      </span>
                      {doc.uploadDate && (
                        <span className="text-xs text-muted-foreground">
                          Uploaded {doc.uploadDate}
                        </span>
                      )}
                      {doc.expiryDate && (
                        <span className="text-xs text-muted-foreground">
                          Expires {doc.expiryDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusDot color={sd.color} label={sd.label} />
                </div>
              );
            })}
          </div>

          {/* Missing origin docs */}
          {originMissing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-bold text-foreground">
                  Needed
                </span>
              </div>
              <div className="space-y-2">
                {originMissing.map((doc) => (
                  <div
                    key={doc.id}
                    className="border-2 border-dashed border-red-400/40 p-4 flex items-center gap-4"
                  >
                    <FileText className="h-5 w-5 text-red-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {doc.name}
                      </p>
                      <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                        {doc.type}
                      </span>
                    </div>
                    <button
                      onClick={() => setPrepareDoc(doc)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-wide uppercase bg-bp-red text-white hover:bg-bp-red/90 transition-colors shrink-0 cursor-pointer"
                    >
                      <PenLine className="h-3 w-3" />
                      Prepare & Sign
                    </button>
                    <Link
                      href="/dashboard/documents/upload"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-wide uppercase border-2 border-bp-red text-bp-red hover:bg-bp-red/5 transition-colors shrink-0"
                    >
                      <Upload className="h-3 w-3" />
                      Upload
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Country-Specific Tab */}
      {activeTab === "country" && (
        <div className="space-y-5">
          {/* Country selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
              Destination Country
            </span>
            <Select
              value={selectedCountry}
              onValueChange={setSelectedCountry}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="mr-2">{c.flag}</span>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compliance summary */}
          <div className="flex items-center gap-2 px-4 py-3 border border-border bg-muted/30">
            <span className="text-lg">{selectedCountryInfo?.flag}</span>
            <span className="text-sm font-bold text-foreground">
              {selectedCountryInfo?.name}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {countryOnFile} of {countryTotal} documents on file
            </span>
            <div className="w-24 h-2 bg-border rounded-full overflow-hidden ml-2">
              <div
                className="h-full bg-bp-green rounded-full transition-all"
                style={{
                  width: `${countryTotal > 0 ? (countryOnFile / countryTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Document checklist */}
          <div className="border border-border divide-y divide-border">
            {countryDocs.map((doc) => {
              const sd = statusToDot[doc.status];
              const product = doc.productId
                ? getProduct(doc.productId)
                : undefined;
              return (
                <div key={doc.id} className="p-4 flex items-center gap-4">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      doc.status === "verified"
                        ? "border-bp-green bg-bp-green"
                        : doc.status === "pending"
                          ? "border-bp-red"
                          : "border-border"
                    }`}
                  >
                    {doc.status === "verified" && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs font-semibold tracking-wider text-bp-gray uppercase">
                        {doc.type}
                      </span>
                      {product && (
                        <span className="text-xs text-muted-foreground">
                          {product.name}
                        </span>
                      )}
                      {doc.uploadDate && (
                        <span className="text-xs text-muted-foreground">
                          Uploaded {doc.uploadDate}
                        </span>
                      )}
                      {doc.expiryDate && (
                        <span className="text-xs text-muted-foreground">
                          Expires {doc.expiryDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusDot color={sd.color} label={sd.label} />
                  {doc.status === "missing" && (
                    <>
                      <button
                        onClick={() => setPrepareDoc(doc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wide uppercase bg-bp-red text-white hover:bg-bp-red/90 transition-colors shrink-0 cursor-pointer"
                      >
                        <PenLine className="h-3 w-3" />
                        Prepare & Sign
                      </button>
                      <Link
                        href="/dashboard/documents/upload"
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wide uppercase border-2 border-bp-red text-bp-red hover:bg-bp-red/5 transition-colors shrink-0"
                      >
                        Upload
                      </Link>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prepare & Sign Dialog */}
      {prepareDoc && (
        <PrepareDocDialog
          doc={prepareDoc}
          open={!!prepareDoc}
          onOpenChange={(open) => !open && setPrepareDoc(null)}
          onComplete={handleDocComplete}
        />
      )}
    </div>
  );
}
