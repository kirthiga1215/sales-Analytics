import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title = "No data available.",
  message = "Try adjusting your filters or search criteria.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <Card className="border-dashed border-white/15 bg-white/5">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Inbox className="h-7 w-7 text-white/50" />
        </div>
        <p className="text-lg font-medium text-white/80">{title}</p>
        <p className="mt-1 text-sm text-white/50">{message}</p>
      </CardContent>
    </Card>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-rose-400/20 bg-rose-500/10">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20">
          <AlertCircle className="h-7 w-7 text-rose-300" />
        </div>
        <p className="text-lg font-medium text-white">{message}</p>
        <p className="mt-1 text-sm text-white/60">Please try again.</p>
        {onRetry && (
          <Button variant="outline" className="mt-6" onClick={onRetry}>
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
