import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "success" | "warning" | "danger" | "muted";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-violet-500/20 text-violet-200 border-violet-400/30",
    success: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    warning: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    danger: "bg-rose-500/20 text-rose-200 border-rose-400/30",
    muted: "bg-white/10 text-white/70 border-white/20",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
