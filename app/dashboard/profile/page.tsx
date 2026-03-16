"use client";

import { useState } from "react";
import { FedExSection } from "@/components/fedex/section";
import { DataRow } from "@/components/fedex/data-row";
import { FedExTable, FedExTableRow, FedExTableCell } from "@/components/fedex/fedex-table";
import { StatusDot } from "@/components/fedex/status-dot";
import { ActionFooter } from "@/components/fedex/action-footer";
import { PageHeader } from "@/components/fedex/page-header";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
  const [screening, setScreening] = useState({
    autoScreening: true,
    sanctionsCheck: true,
    restrictedGoods: true,
    valueThreshold: true,
    dualUseCheck: false,
  });

  const [sanctionsSources, setSanctionsSources] = useState({
    ofsi: true,
    ofac: true,
    eu: true,
    un: true,
  });

  const [notifications, setNotifications] = useState({
    screeningAlerts: true,
    settlementAlerts: true,
    complianceWarnings: true,
    systemNotifications: true,
    dailyDigest: false,
    escalationAlerts: true,
  });

  const [pddp, setPddp] = useState({
    autoSettle: true,
    partnerNotify: true,
  });

  return (
    <div className="space-y-6 max-w-4xl pb-24">
      <PageHeader
        title="Operations Settings"
        description="SYSTEM CONFIGURATION AND OPERATIONAL PREFERENCES"
      />

      {/* Operator Information */}
      <FedExSection title="Operator Information" variant="static">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 pt-2">
          <DataRow label="Organisation" value="bpost Ltd" />
          <DataRow label="Division" value="Customs Operations Division" />
          <DataRow label="Operator" value="Sarah Chen" />
          <DataRow label="Role" value="Customs Operations Manager" />
          <DataRow label="Location" value="Centre Monnaie, 1000 Brussels" />
          <DataRow label="Postcode" value="1000" />
          <DataRow label="Phone" value="+32 (0)2 201 2345" />
          <DataRow label="Email" value="sarah.chen@bpost.be" />
          <DataRow label="EORI Number" value={<span className="font-mono">BE0582119503</span>} />
          <DataRow label="Deferment Account" value={<span className="font-mono">BP-DEF-7721940</span>} />
        </div>
      </FedExSection>

      {/* Screening Configuration */}
      <FedExSection title="Screening Configuration" variant="static">
        <div className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Auto-Screening Rules</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Automatic Screening on Manifest</p>
              <p className="text-xs text-muted-foreground">Screen all shipments automatically when manifested</p>
            </div>
            <Switch
              checked={screening.autoScreening}
              onCheckedChange={(v) => setScreening((s) => ({ ...s, autoScreening: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sanctions & Denied Party Screening</p>
              <p className="text-xs text-muted-foreground">Check all senders/recipients against sanctions lists</p>
            </div>
            <Switch
              checked={screening.sanctionsCheck}
              onCheckedChange={(v) => setScreening((s) => ({ ...s, sanctionsCheck: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Restricted Goods Detection</p>
              <p className="text-xs text-muted-foreground">Flag items matching prohibited/restricted goods categories</p>
            </div>
            <Switch
              checked={screening.restrictedGoods}
              onCheckedChange={(v) => setScreening((s) => ({ ...s, restrictedGoods: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Value Threshold Alerts</p>
              <p className="text-xs text-muted-foreground">Flag shipments exceeding declared value thresholds</p>
            </div>
            <Switch
              checked={screening.valueThreshold}
              onCheckedChange={(v) => setScreening((s) => ({ ...s, valueThreshold: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dual-Use Goods Screening</p>
              <p className="text-xs text-muted-foreground">Check for dual-use items requiring export licences</p>
            </div>
            <Switch
              checked={screening.dualUseCheck}
              onCheckedChange={(v) => setScreening((s) => ({ ...s, dualUseCheck: v }))}
            />
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-3">Sanctions List Sources</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">FOD Financiën (BE)</p>
                  <p className="text-xs text-muted-foreground">Belgian Federal Public Service Finance - Sanctions</p>
                </div>
                <Switch
                  checked={sanctionsSources.ofsi}
                  onCheckedChange={(v) => setSanctionsSources((s) => ({ ...s, ofsi: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">OFAC (US)</p>
                  <p className="text-xs text-muted-foreground">Office of Foreign Assets Control</p>
                </div>
                <Switch
                  checked={sanctionsSources.ofac}
                  onCheckedChange={(v) => setSanctionsSources((s) => ({ ...s, ofac: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">EU Sanctions List</p>
                  <p className="text-xs text-muted-foreground">European Union consolidated sanctions</p>
                </div>
                <Switch
                  checked={sanctionsSources.eu}
                  onCheckedChange={(v) => setSanctionsSources((s) => ({ ...s, eu: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">UN Sanctions List</p>
                  <p className="text-xs text-muted-foreground">United Nations Security Council sanctions</p>
                </div>
                <Switch
                  checked={sanctionsSources.un}
                  onCheckedChange={(v) => setSanctionsSources((s) => ({ ...s, un: v }))}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-3">Restricted Goods Categories</p>
            <div className="flex flex-wrap gap-2">
              {["Firearms & Weapons", "Controlled Substances", "Tobacco Products", "Alcohol (excise)", "Endangered Species (CITES)", "Hazardous Materials", "Counterfeit Goods", "Cultural Artefacts"].map((cat) => (
                <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-bp-red/10 text-bp-red border border-bp-red/20">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </FedExSection>

      {/* Notification Preferences */}
      <FedExSection title="Notification Preferences" variant="static">
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Screening Alerts</p>
              <p className="text-xs text-muted-foreground">Immediate notification when shipments fail screening checks</p>
            </div>
            <Switch
              checked={notifications.screeningAlerts}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, screeningAlerts: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Settlement Alerts</p>
              <p className="text-xs text-muted-foreground">Notifications for PDDP settlement completions and failures</p>
            </div>
            <Switch
              checked={notifications.settlementAlerts}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, settlementAlerts: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Compliance Warnings</p>
              <p className="text-xs text-muted-foreground">Alerts for regulatory changes, tariff updates, and compliance deadlines</p>
            </div>
            <Switch
              checked={notifications.complianceWarnings}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, complianceWarnings: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">System Notifications</p>
              <p className="text-xs text-muted-foreground">API downtime, integration errors, and system health alerts</p>
            </div>
            <Switch
              checked={notifications.systemNotifications}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, systemNotifications: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Operations Digest</p>
              <p className="text-xs text-muted-foreground">Morning summary of overnight activity across all accounts</p>
            </div>
            <Switch
              checked={notifications.dailyDigest}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, dailyDigest: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Escalation Alerts</p>
              <p className="text-xs text-muted-foreground">Notify when items require manager-level approval or intervention</p>
            </div>
            <Switch
              checked={notifications.escalationAlerts}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, escalationAlerts: v }))}
            />
          </div>
        </div>
      </FedExSection>

      {/* API & Integration Settings */}
      <FedExSection title="API & Integration Settings" variant="static">
        <div className="pt-2">
          <FedExTable
            headers={[
              { label: "Integration" },
              { label: "Endpoint" },
              { label: "Status" },
              { label: "Last Sync" },
            ]}
          >
            <FedExTableRow>
              <FedExTableCell className="font-medium">Belgian Customs PLDA</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">api.customs.hmrc.gov.uk/declarations/v2</FedExTableCell>
              <FedExTableCell><StatusDot color="green" label="Connected" /></FedExTableCell>
              <FedExTableCell className="text-xs text-muted-foreground">2 mins ago</FedExTableCell>
            </FedExTableRow>
            <FedExTableRow even>
              <FedExTableCell className="font-medium">CHIEF (Legacy)</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">chief.hmrc.gov.uk/entry-processing</FedExTableCell>
              <FedExTableCell><StatusDot color="yellow" label="Standby" /></FedExTableCell>
              <FedExTableCell className="text-xs text-muted-foreground">Fallback only</FedExTableCell>
            </FedExTableRow>
            <FedExTableRow>
              <FedExTableCell className="font-medium">UPU POST*Net</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">postnet.upu.int/api/v3/customs</FedExTableCell>
              <FedExTableCell><StatusDot color="green" label="Connected" /></FedExTableCell>
              <FedExTableCell className="text-xs text-muted-foreground">15 mins ago</FedExTableCell>
            </FedExTableRow>
            <FedExTableRow even>
              <FedExTableCell className="font-medium">WCO CEN</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">cen.wcoomd.org/api/data-exchange</FedExTableCell>
              <FedExTableCell><StatusDot color="green" label="Connected" /></FedExTableCell>
              <FedExTableCell className="text-xs text-muted-foreground">1 hr ago</FedExTableCell>
            </FedExTableRow>
            <FedExTableRow>
              <FedExTableCell className="font-medium">OFSI Sanctions API</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">api.ofsi.hmtreasury.gov.uk/search/v1</FedExTableCell>
              <FedExTableCell><StatusDot color="green" label="Connected" /></FedExTableCell>
              <FedExTableCell className="text-xs text-muted-foreground">30 mins ago</FedExTableCell>
            </FedExTableRow>
            <FedExTableRow even>
              <FedExTableCell className="font-medium">PAF Address Lookup</FedExTableCell>
              <FedExTableCell className="font-mono text-xs">api.bpost.be/address/v2/lookup</FedExTableCell>
              <FedExTableCell><StatusDot color="green" label="Connected" /></FedExTableCell>
              <FedExTableCell className="text-xs text-muted-foreground">5 mins ago</FedExTableCell>
            </FedExTableRow>
          </FedExTable>
        </div>
      </FedExSection>

      {/* PDDP Settlement Preferences */}
      <FedExSection title="PDDP Settlement Preferences" variant="static">
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-Settlement</p>
              <p className="text-xs text-muted-foreground">Automatically settle batches below the configured threshold</p>
            </div>
            <Switch
              checked={pddp.autoSettle}
              onCheckedChange={(v) => setPddp((s) => ({ ...s, autoSettle: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-Settlement Threshold</p>
              <p className="text-xs text-muted-foreground">Maximum batch value for automatic settlement</p>
            </div>
            <Select defaultValue="50000">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">Up to €10,000</SelectItem>
                <SelectItem value="25000">Up to €25,000</SelectItem>
                <SelectItem value="50000">Up to €50,000</SelectItem>
                <SelectItem value="100000">Up to €100,000</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Settlement Frequency</p>
              <p className="text-xs text-muted-foreground">How often to batch and settle with postal partners</p>
            </div>
            <Select defaultValue="daily">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Partner Notifications</p>
              <p className="text-xs text-muted-foreground">Notify postal partners when settlements are initiated</p>
            </div>
            <Switch
              checked={pddp.partnerNotify}
              onCheckedChange={(v) => setPddp((s) => ({ ...s, partnerNotify: v }))}
            />
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-3">Active Postal Partners</p>
            <FedExTable
              headers={[
                { label: "Partner" },
                { label: "Country" },
                { label: "Settlement Currency" },
                { label: "Status" },
              ]}
            >
              <FedExTableRow>
                <FedExTableCell className="font-medium">La Poste</FedExTableCell>
                <FedExTableCell>France</FedExTableCell>
                <FedExTableCell>EUR</FedExTableCell>
                <FedExTableCell><StatusDot color="green" label="Active" /></FedExTableCell>
              </FedExTableRow>
              <FedExTableRow even>
                <FedExTableCell className="font-medium">Deutsche Post</FedExTableCell>
                <FedExTableCell>Germany</FedExTableCell>
                <FedExTableCell>EUR</FedExTableCell>
                <FedExTableCell><StatusDot color="green" label="Active" /></FedExTableCell>
              </FedExTableRow>
              <FedExTableRow>
                <FedExTableCell className="font-medium">PostNL</FedExTableCell>
                <FedExTableCell>Netherlands</FedExTableCell>
                <FedExTableCell>EUR</FedExTableCell>
                <FedExTableCell><StatusDot color="green" label="Active" /></FedExTableCell>
              </FedExTableRow>
              <FedExTableRow even>
                <FedExTableCell className="font-medium">An Post</FedExTableCell>
                <FedExTableCell>Ireland</FedExTableCell>
                <FedExTableCell>EUR</FedExTableCell>
                <FedExTableCell><StatusDot color="yellow" label="Onboarding" /></FedExTableCell>
              </FedExTableRow>
            </FedExTable>
          </div>
        </div>
      </FedExSection>

      {/* Sticky Save Footer */}
      <ActionFooter
        actions={[
          { label: "Save Configuration", variant: "primary" },
        ]}
      />
    </div>
  );
}
