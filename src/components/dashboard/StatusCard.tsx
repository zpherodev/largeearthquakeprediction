
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";

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
  showProgress?: boolean;
  progressValue?: number;
  progressColor?: string;
  maxValue?: number;
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
  pulseEffect = true,
  showProgress = false,
  progressValue = 0,
  progressColor,
  maxValue = 100
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
    if (title.includes("Confidence") || title.includes("Accuracy") || title.includes("Precision") || title.includes("Recall") || title.includes("F1")) {
      return trend === "up" ? "text-green-500 bg-green-50 dark:bg-green-950/30" :
             trend === "down" ? "text-red-500 bg-red-50 dark:bg-red-950/30" :
             "text-gray-500 bg-gray-50 dark:bg-gray-800/30";
    }
    
    // For risk factors, up is bad (higher risk) when dealing with magnitudes >= 6.0
    return trend === "up" ? "text-red-500 bg-red-50 dark:bg-red-950/30" :
           trend === "down" ? "text-green-500 bg-green-50 dark:bg-green-950/30" :
           "text-gray-500 bg-gray-50 dark:bg-gray-800/30";
  };
  
  // Determine value style based on content
  const getValueStyle = () => {
    if (typeof value === 'string') {
      if (value.includes("High") || value.includes("Active") || 
          (title.toLowerCase().includes("magnitude") && parseFloat(value.toString()) >= 6.0)) {
        return "text-red-500";
      }
      if (value.includes("Moderate")) return "text-amber-500";
      if (value.includes("Low") || value.includes("Normal")) return "text-green-500";
    } else if (typeof value === 'number' && title.toLowerCase().includes("magnitude")) {
      if (value >= 6.0) return "text-red-500";
      if (value >= 5.0) return "text-amber-500";
    }
    return "";
  };

  // Determine progress color
  const getProgressColor = () => {
    if (progressColor) return progressColor;
    
    const percent = (progressValue / maxValue) * 100;
    
    if (title.includes("Confidence") || title.includes("Accuracy") || title.includes("Precision") || title.includes("Recall") || title.includes("F1")) {
      // For metrics, higher is better
      if (percent >= 80) return "bg-green-500";
      if (percent >= 60) return "bg-amber-500";
      return "bg-red-500";
    } else if (title.toLowerCase().includes("magnitude")) {
      // For earthquake magnitude (assuming maxValue is 10)
      if ((progressValue / maxValue) * 10 >= 6.0) return "bg-red-500";
      if ((progressValue / maxValue) * 10 >= 5.0) return "bg-amber-500";
      return "bg-green-500";
    } else {
      // For risk metrics, lower is better
      if (percent <= 30) return "bg-green-500";
      if (percent <= 60) return "bg-amber-500";
      return "bg-red-500";
    }
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
        
        {showProgress && (
          <div className="mt-2">
            <Progress 
              value={progressValue} 
              max={maxValue}
              className="h-1.5 w-full bg-gray-200"
              indicatorClassName={getProgressColor()}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
