
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function StatusCard({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  className 
}: StatusCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {description}
          {trend && (
            <span 
              className={cn(
                "ml-1 inline-flex items-center rounded-full px-1 py-0.5 text-xs",
                trend === "up" ? "text-red-500 bg-red-50 dark:bg-red-950/30" :
                trend === "down" ? "text-green-500 bg-green-50 dark:bg-green-950/30" :
                "text-gray-500 bg-gray-50 dark:bg-gray-800/30"
              )}
            >
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "stable" && "→"}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
