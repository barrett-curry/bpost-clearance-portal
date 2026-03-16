"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FedExSection } from "@/components/fedex/section";
import { PageHeader } from "@/components/fedex/page-header";
import { TrendingDown, DollarSign, Lightbulb } from "lucide-react";

const cageRateData = [
  { month: "Sep", rate: 12.0 },
  { month: "Oct", rate: 10.2 },
  { month: "Nov", rate: 8.8 },
  { month: "Dec", rate: 7.5 },
  { month: "Jan", rate: 6.9 },
  { month: "Feb", rate: 5.8 },
];

const clearanceTimeData = [
  { country: "US", days: 1.2 },
  { country: "JP", days: 2.1 },
  { country: "MX", days: 1.8 },
  { country: "CA", days: 0.9 },
  { country: "DE", days: 1.5 },
];

const holdReasonsData = [
  { reason: "PGA Review", pct: 35 },
  { reason: "Value Dispute", pct: 25 },
  { reason: "HS Code Issue", pct: 20 },
  { reason: "Missing Docs", pct: 15 },
  { reason: "Other", pct: 5 },
];

const dtCollectionData = [
  { name: "Collected", value: 94.2 },
  { name: "Pending", value: 5.8 },
];
const dtColors = ["#00a651", "#d9d9d6"];

const recommendations = [
  {
    title: "Pre-classify high-volume SKUs",
    description:
      "Your top 5 products account for 78% of shipments. Pre-classifying them could reduce cage rate by an additional 2%.",
  },
  {
    title: "Automate CPSIA certificate submission",
    description:
      "Connect your testing lab portal to auto-submit Children's Product Certificates. This could eliminate 60% of your PGA holds.",
  },
  {
    title: "Enable Guaranteed D&T for Japan",
    description:
      "Japan shipments have the highest D&T variance. Guaranteed D&T would protect margins and improve customer experience.",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Trade performance metrics and AI-powered insights"
      />

      {/* 2x2 Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cage Rate Trend */}
        <FedExSection
          title="Cage Rate Trend"
          action={
            <span className="flex items-center gap-1 text-bp-green text-xs font-medium">
              <TrendingDown className="h-3 w-3" />
              -6.2% in 6 months
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={cageRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 14]}
              />
              <Tooltip formatter={(v: number) => [`${v}%`, "Cage Rate"]} contentStyle={{ borderRadius: 4, border: "1px solid #e5e5e5" }} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#da202a"
                strokeWidth={2}
                dot={{ fill: "#da202a", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </FedExSection>

        {/* Clearance Time by Destination */}
        <FedExSection title="Clearance Time by Destination (days)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={clearanceTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="country" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 2.5]} />
              <Tooltip formatter={(v: number) => [`${v} days`, "Avg. Clearance"]} cursor={false} contentStyle={{ borderRadius: 4, border: "1px solid #e5e5e5" }} />
              <Bar dataKey="days" fill="#fdda24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FedExSection>

        {/* Top Reasons for Holds */}
        <FedExSection title="Top Reasons for Holds">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={holdReasonsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 40]}
              />
              <YAxis
                type="category"
                dataKey="reason"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} cursor={false} contentStyle={{ borderRadius: 4, border: "1px solid #e5e5e5" }} />
              <Bar dataKey="pct" fill="#da202a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FedExSection>

        {/* D&T Collection Rate */}
        <FedExSection title="D&T Collection Rate">
          <div className="flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={240} height={240}>
                <PieChart>
                  <Pie
                    data={dtCollectionData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dtCollectionData.map((_, i) => (
                      <Cell key={i} fill={dtColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: 4, border: "1px solid #e5e5e5" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">94.2%</p>
                  <p className="text-xs text-muted-foreground">Collected</p>
                </div>
              </div>
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-bp-green" />
                <span className="text-sm">Collected (94.2%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#d9d9d6]" />
                <span className="text-sm">Pending (5.8%)</span>
              </div>
            </div>
          </div>
        </FedExSection>
      </div>

      {/* Cost Savings */}
      <div className="bg-bp-red text-white p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold">€12,450 saved with Guaranteed D&T this quarter</p>
            <p className="text-sm text-white/70">
              Duties & taxes were pre-calculated and collected at checkout, eliminating post-delivery billing surprises.
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-bp-gray uppercase mb-4 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-bp-red" />
          AI Recommendations
        </h2>
        <div className="divide-y divide-border">
          {recommendations.map((rec, i) => (
            <div key={i} className="border-b border-border p-4 space-y-2">
              <p className="text-sm font-bold text-foreground">{rec.title}</p>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
