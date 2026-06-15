"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterOptions } from "@/hooks/use-dashboard-data";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";

const filterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
});

type FilterForm = z.infer<typeof filterSchema>;

export function DashboardFilters() {
  const { filters, setFilters, resetFilters } = useDashboardFilters();
  const { data: options } = useFilterOptions();

  const { register, watch, setValue, reset } = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  const values = watch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        category: values.category || undefined,
        region: values.region || undefined,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [values.startDate, values.endDate, values.category, values.region, setFilters]);

  const handleReset = () => {
    reset({});
    resetFilters();
  };

  return (
    <Card className="border-white/15 bg-white/8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50">Start Date</label>
            <Input type="date" {...register("startDate")} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50">End Date</label>
            <Input type="date" {...register("endDate")} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50">Category</label>
            <Select
              value={values.category ?? "all"}
              onValueChange={(v) =>
                setValue("category", v === "all" ? undefined : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {options?.categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50">Region</label>
            <Select
              value={values.region ?? "all"}
              onValueChange={(v) =>
                setValue("region", v === "all" ? undefined : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {options?.regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
