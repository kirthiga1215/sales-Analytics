"use client";

import { Sparkles } from "lucide-react";
import { DashboardCharts } from "@/components/charts";
import { DashboardFilters } from "@/components/filters";
import { SummaryCards } from "@/components/summary-cards";
import { DashboardFilterProvider } from "@/hooks/use-dashboard-filters";
import { AppNavigation } from "@/components/navigation/app-navigation";

export default function DashboardPage() {
  return (
    <DashboardFilterProvider>
      <div className="relative min-h-screen overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[120px]" />
          <div className="absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-600/25 blur-[100px]" />
        </div>

        <AppNavigation />

        <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
              Analytics Dashboard
              <Sparkles className="h-5 w-5 text-violet-300" />
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Real-time sales metrics and performance insights
            </p>
          </div>
          
          <DashboardFilters />
          <SummaryCards />
          <DashboardCharts />
        </main>
      </div>
    </DashboardFilterProvider>
  );
}
