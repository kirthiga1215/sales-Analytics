"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Sparkles, Table2, Package } from "lucide-react";

export function AppNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: Table2,
    },
    {
      href: "/products",
      label: "Products Report",
      icon: Package,
    },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Logo and title */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
                Sales Analytics
                <Sparkles className="h-4 w-4 text-violet-300" />
              </h1>
              <p className="text-xs text-white/50">
                Real-time insights · 10,000+ records
              </p>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex gap-1 border-t border-white/5 pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "border-violet-500 text-violet-300"
                    : "border-transparent text-white/60 hover:text-white/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
