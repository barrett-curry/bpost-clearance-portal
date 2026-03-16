"use client";

import { useCallback, useSyncExternalStore } from "react";

const LOCALE_KEY = "rm-portal-locale";
const DEFAULT_LOCALE = "en";
const SUPPORTED_LOCALES = ["en", "es", "fr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const listeners = new Set<() => void>();

function getSnapshot(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }
  return DEFAULT_LOCALE;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function useLocale(): [Locale, (l: Locale) => void] {
  const locale = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_LOCALE);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(LOCALE_KEY, newLocale);
    // Force a full page reload to pick up new translations
    window.location.reload();
  }, []);

  return [locale, setLocale];
}

export function getLocaleFlag(locale: Locale): string {
  switch (locale) {
    case "en": return "🇬🇧";
    case "es": return "🇪🇸";
    case "fr": return "🇫🇷";
  }
}

export function getLocaleName(locale: Locale): string {
  switch (locale) {
    case "en": return "English";
    case "es": return "Español";
    case "fr": return "Français";
  }
}

export { SUPPORTED_LOCALES };
