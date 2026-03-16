"use client";

import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import {
  pageConfigs,
  sources,
  type IPageComponent,
  type IPageConfig,
  type SourceKey,
} from "@/lib/behind-the-scenes";

/** Small colored dot to indicate source */
function SourceDot({ sourceKey }: { sourceKey: SourceKey }) {
  const src = sources[sourceKey];
  return (
    <span
      className="inline-block h-2 w-2 rounded-full shrink-0"
      style={{ backgroundColor: src.color }}
      title={src.label}
    />
  );
}

/** Compact clickable row in the component list */
function ComponentRow({
  component,
  isSelected,
  isDimmed,
  onSelect,
}: {
  component: IPageComponent;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-150 cursor-pointer flex items-center gap-2.5 ${
        isSelected
          ? "bg-white/10 text-[#f0f3f6]"
          : "text-[#b0b8c1] hover:bg-white/[0.04] hover:text-[#d0d7de]"
      } ${isDimmed ? "opacity-25" : ""}`}
    >
      <div className="flex items-center gap-1">
        {component.sources.map((s) => (
          <SourceDot key={s} sourceKey={s} />
        ))}
      </div>
      <span className="text-[13px] truncate">{component.title}</span>
      <span className="ml-auto text-[11px] text-[#636e7b] font-mono shrink-0">
        {component.value}
      </span>
    </button>
  );
}

/** Source filter pills - compact row at top */
function SourceFilters({
  activeSource,
  onToggle,
}: {
  activeSource: SourceKey | null;
  onToggle: (key: SourceKey) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-[11px] text-[#636e7b] uppercase tracking-wider mr-1">
        Filter:
      </span>
      {(Object.keys(sources) as SourceKey[]).map((key) => {
        const src = sources[key];
        const isActive = activeSource === key;
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-all cursor-pointer border ${
              isActive
                ? "bg-white/10 border-white/20 text-[#e4e4e7]"
                : "bg-transparent border-white/[0.08] text-[#8b949e] hover:border-white/15 hover:text-[#b0b8c1]"
            }`}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: src.color }}
            />
            {src.label}
          </button>
        );
      })}
    </div>
  );
}

/** The main detail view - takes full width of the right area */
function DetailPanel({
  component,
}: {
  component: IPageComponent | null;
}) {
  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#52525b]">
        <p className="text-sm">Select a component from the list</p>
        <p className="text-xs mt-1">to view its data source and API contract</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold text-[#f0f3f6] mb-1">
          {component.title}
        </h2>
        <p className="text-sm text-[#8b949e]">
          {component.section} &middot;{" "}
          <span className="font-mono">{component.value}</span>
        </p>
      </div>

      {/* How It Works */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] mb-2">
          How It Works
        </h3>
        <p className="text-sm leading-relaxed text-[#d0d7de]">
          {component.notes}
        </p>
      </div>

      {/* API Call */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] mb-2">
          API Call
        </h3>
        <pre className="rounded-lg bg-[#0d1117] border border-[#30363d] px-4 py-3 text-sm text-[#e4e4e7] leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
          {component.apiCall}
        </pre>
      </div>

      {/* Data Sources */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] mb-3">
          Data Sources
        </h3>
        <div className="flex flex-wrap gap-3">
          {component.sources.map((s) => {
            const srcInfo = sources[s];
            const SrcIcon = srcInfo.icon;
            return (
              <div
                key={s}
                className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 flex-1 min-w-[220px]"
              >
                <SrcIcon
                  className="h-4 w-4 mt-0.5 shrink-0"
                  style={{ color: srcInfo.color }}
                />
                <div>
                  <div className="text-sm font-medium text-[#d0d7de]">
                    {srcInfo.label}
                  </div>
                  <div className="text-xs text-[#636e7b] mt-0.5 leading-relaxed">
                    {srcInfo.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BehindTheScenesView() {
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<SourceKey | null>(null);

  // Match route to config
  let config: IPageConfig | null = null;
  let matchPath = pathname;
  while (matchPath && !config) {
    config = pageConfigs[matchPath] ?? null;
    if (!config) {
      const lastSlash = matchPath.lastIndexOf("/");
      if (lastSlash <= 0) break;
      matchPath = matchPath.substring(0, lastSlash);
    }
  }
  if (!config) {
    config = pageConfigs["/dashboard"]!;
  }

  const sections = useMemo(() => {
    const sectionOrder: string[] = [];
    const sectionMap = new Map<string, IPageComponent[]>();
    for (const comp of config!.components) {
      if (!sectionMap.has(comp.section)) {
        sectionOrder.push(comp.section);
        sectionMap.set(comp.section, []);
      }
      sectionMap.get(comp.section)!.push(comp);
    }
    return sectionOrder.map((name) => ({
      name,
      items: sectionMap.get(name)!,
    }));
  }, [config]);

  const selectedComponent =
    config.components.find((c) => c.id === selectedId) ?? null;

  function handleSourceToggle(key: SourceKey) {
    setActiveSource((prev) => (prev === key ? null : key));
  }

  function handleComponentSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function isDimmed(component: IPageComponent): boolean {
    if (!activeSource) return false;
    return !component.sources.includes(activeSource);
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header row */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-semibold text-[#e6edf3]">
            {config.title}
          </h1>
          <span className="rounded border border-[#30363d] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#8b949e]">
            Behind the Scenes
          </span>
        </div>
        <p className="text-sm text-[#8b949e]">{config.subtitle}</p>
      </div>

      {/* Source filter pills */}
      <div className="shrink-0">
        <SourceFilters
          activeSource={activeSource}
          onToggle={handleSourceToggle}
        />
      </div>

      {/* Two-column layout: narrow component list | wide detail */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left: Component list */}
        <div className="w-72 shrink-0 overflow-y-auto pr-2 border-r border-[#21262d]">
          {sections.map((section) => (
            <div key={section.name} className="mb-4">
              <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#484f58]">
                {section.name}
              </div>
              <div className="space-y-0.5">
                {section.items.map((comp) => (
                  <ComponentRow
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    isDimmed={isDimmed(comp)}
                    onSelect={() => handleComponentSelect(comp.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detail panel */}
        <div className="flex-1 overflow-y-auto pl-2">
          <DetailPanel component={selectedComponent} />
        </div>
      </div>
    </div>
  );
}
