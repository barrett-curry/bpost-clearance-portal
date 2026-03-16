"use client";

import { Layers, ArrowLeft } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { PortalSidebar } from "@/components/portal/sidebar";
import {
  BehindTheScenesProvider,
  useBehindTheScenes,
} from "@/components/portal/behind-the-scenes-provider";
import { BehindTheScenesView } from "@/components/portal/behind-the-scenes-view";

function BtsToggle() {
  const { isBehindTheScenes, toggle } = useBehindTheScenes();

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg transition-all cursor-pointer ${
        isBehindTheScenes
          ? "bg-bp-red text-white hover:bg-bp-red/90"
          : "bg-bp-red text-white hover:bg-bp-red/90"
      }`}
    >
      {isBehindTheScenes ? (
        <>
          <ArrowLeft className="h-4 w-4" />
          Back to Portal
        </>
      ) : (
        <>
          <Layers className="h-4 w-4" />
          Behind the Scenes
        </>
      )}
    </button>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isBehindTheScenes } = useBehindTheScenes();

  return (
    <main
      className={`flex-1 overflow-auto p-3 sm:p-6 transition-colors duration-300 ${
        isBehindTheScenes ? "bg-[#0d1117]" : "bg-white"
      }`}
    >
      {isBehindTheScenes ? <BehindTheScenesView /> : children}
    </main>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BehindTheScenesProvider>
      <div className="h-screen flex flex-col bg-background">
        <PortalHeader />
        <div className="flex flex-1 overflow-hidden">
          <PortalSidebar />
          <DashboardContent>{children}</DashboardContent>
        </div>
        <BtsToggle />
      </div>
    </BehindTheScenesProvider>
  );
}
