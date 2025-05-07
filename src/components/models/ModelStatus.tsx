
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getModelStatus } from "@/services/api";
import { Info } from "lucide-react";

export function ModelStatus() {
  const { data: modelStatus, isLoading, error } = useQuery({
    queryKey: ['modelStatus'],
    queryFn: getModelStatus,
    refetchInterval: 15000, // Refresh every 15 seconds
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Model Status</CardTitle>
          <CardDescription>
            Large Earthquake Prediction Model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default values if API fails
  const cpuUsage = modelStatus?.cpuUsage || 0;
  const memoryUsage = modelStatus?.memoryUsage || 0;
  const lastUpdate = modelStatus?.lastUpdate ? new Date(modelStatus.lastUpdate) : new Date();
  const status = modelStatus?.modelStatus || "idle";
  const modelVersion = modelStatus?.modelVersion || "LEPAM v1.0.4";
  const accuracy = modelStatus?.accuracy || 76;
  const precision = modelStatus?.precision || 71;
  const recall = modelStatus?.recall || 68;

  const getStatusColor = () => {
    switch (status) {
      case "training": return "bg-blue-600 text-white";
      case "analyzing": return "bg-amber-600 text-white";
      case "predicting": return "bg-purple-600 text-white";
      case "idle": return "bg-gray-600 text-white";
      case "error": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Model Status</CardTitle>
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <CardDescription>
          Large Earthquake Prediction Model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">CPU Usage</span>
              <span className="text-sm font-medium">{cpuUsage}%</span>
            </div>
            <Progress value={cpuUsage} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Memory Usage</span>
              <span className="text-sm font-medium">{memoryUsage}%</span>
            </div>
            <Progress value={memoryUsage} className="h-2" />
          </div>
          
          {/* Model accuracy metrics */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Model Performance</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <div className="text-xs">Accuracy</div>
                <Progress value={accuracy} className="h-1.5" 
                  indicatorClassName={accuracy >= 80 ? "bg-green-500" : accuracy >= 70 ? "bg-amber-500" : "bg-red-500"} />
                <div className="text-[10px] text-right font-medium">{accuracy}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs">Precision</div>
                <Progress value={precision} className="h-1.5" 
                  indicatorClassName={precision >= 80 ? "bg-green-500" : precision >= 70 ? "bg-amber-500" : "bg-red-500"} />
                <div className="text-[10px] text-right font-medium">{precision}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs">Recall</div>
                <Progress value={recall} className="h-1.5" 
                  indicatorClassName={recall >= 80 ? "bg-green-500" : recall >= 70 ? "bg-amber-500" : "bg-red-500"} />
                <div className="text-[10px] text-right font-medium">{recall}%</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p><span className="font-medium">Last Update:</span> {formatTime(lastUpdate)}</p>
              <p className="mt-1"><span className="font-medium">Model Version:</span> {modelVersion}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
