
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
  className?: string;
  valueClassName?: string;
  trendClassName?: string;
  loading?: boolean;
  pulseEffect?: boolean;
}

export function StatusCard({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  className,
  valueClassName,
  trendClassName,
  loading = false,
  pulseEffect = true
}: StatusCardProps) {
  // Add animation effect when value changes
  useEffect(() => {
    if (!pulseEffect) return;
    
    const valueElement = document.getElementById(`status-value-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (valueElement) {
      valueElement.classList.add('animate-pulse');
      const timeout = setTimeout(() => {
        valueElement.classList.remove('animate-pulse');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [value, title, pulseEffect]);
  
  // Choose trend icon
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  
  // Determine trend style
  const getTrendStyle = () => {
    // For prediction confidence and metrics, up is good
    if (title.includes("Confidence") || title.includes("Accuracy")) {
      return trend === "up" ? "text-green-500 bg-green-50 dark:bg-green-950/30" :
             trend === "down" ? "text-red-500 bg-red-50 dark:bg-red-950/30" :
             "text-gray-500 bg-gray-50 dark:bg-gray-800/30";
    }
    
    // For risk factors, up is bad (higher risk)
    return trend === "up" ? "text-red-500 bg-red-50 dark:bg-red-950/30" :
           trend === "down" ? "text-green-500 bg-green-50 dark:bg-green-950/30" :
           "text-gray-500 bg-gray-50 dark:bg-gray-800/30";
  };
  
  // Determine value style based on content
  const getValueStyle = () => {
    if (typeof value === 'string') {
      if (value.includes("High") || value.includes("Active")) return "text-red-500";
      if (value.includes("Moderate")) return "text-amber-500";
      if (value.includes("Low") || value.includes("Normal")) return "text-green-500";
    }
    return "";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div 
          id={`status-value-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className={cn(
            "text-2xl font-bold transition-opacity duration-300", 
            loading && "opacity-50",
            getValueStyle(),
            valueClassName
          )}
        >
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {description}
          {trend && (
            <span 
              className={cn(
                "ml-1 inline-flex items-center rounded-full px-1 py-0.5 text-xs",
                getTrendStyle(),
                trendClassName
              )}
            >
              {trendIcon}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
