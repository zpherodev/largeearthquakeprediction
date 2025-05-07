
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getModelStatus } from "@/services/api";

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

  const getStatusColor = () => {
    switch (status) {
      case "training": return "bg-blue-600 text-white";
      case "analyzing": return "bg-amber-600 text-white";
      case "predicting": return "bg-purple-600 text-white";
      case "idle": return "bg-gray-600 text-white";
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
