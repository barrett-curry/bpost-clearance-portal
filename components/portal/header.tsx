"use client";

import { ChevronDown, Search, User, Globe, Bell, LogOut } from "lucide-react";
import { useLocale, getLocaleFlag, getLocaleName, SUPPORTED_LOCALES, type Locale } from "@/lib/locale";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function PortalHeader() {
  const [locale, setLocale] = useLocale();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = pathname.startsWith("/dashboard");

  return (
    <header className="bg-white text-foreground border-b border-border relative z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 pl-14 md:pl-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <Image
              src="/bpost-logo.png"
              alt="bpost"
              width={56}
              height={38}
              priority
            />
          </Link>

          {isLoggedIn && (
            <span className="text-sm text-bp-gray hidden md:inline font-bold">
              Export & Customs Platform
            </span>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm text-bp-gray hover:text-foreground hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{getLocaleFlag(locale)} {getLocaleName(locale)}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border z-50 min-w-[160px]">
                  {SUPPORTED_LOCALES.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLocale(l);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left cursor-pointer transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        l === locale
                          ? "bg-bp-light text-bp-red font-medium"
                          : "text-foreground hover:bg-gray-50"
                      }`}
                    >
                      <span>{getLocaleFlag(l)}</span>
                      <span>{getLocaleName(l)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isLoggedIn && (
            <>
              {/* Notifications */}
              <button className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <Bell className="h-5 w-5 text-bp-gray" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-bp-red text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User */}
              <span className="text-sm text-bp-gray hidden sm:inline font-medium">Sarah Chen, Operations</span>
              <button className="p-1.5 rounded-full border border-border hover:border-bp-gray transition-colors cursor-pointer">
                <User className="h-5 w-5 text-bp-gray" />
              </button>
            </>
          )}

          {!isLoggedIn && (
            <Link
              href="/login"
              className="text-sm bg-bp-red text-white px-4 py-1.5 rounded-full font-bold hover:bg-bp-red/90 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
