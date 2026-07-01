import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  className,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/80",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl shadow-inner">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
