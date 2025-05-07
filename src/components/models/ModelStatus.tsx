
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function ModelStatus() {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [modelStatus, setModelStatus] = useState<"training" | "analyzing" | "predicting" | "idle">("analyzing");
  
  useEffect(() => {
    // Simulate changing resource usage
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 50); // Between 50% and 80%
      setMemoryUsage(Math.floor(Math.random() * 20) + 60); // Between 60% and 80%
      setLastUpdate(new Date());
      
      // Occasionally change model status
      if (Math.random() > 0.8) {
        const statuses: ("training" | "analyzing" | "predicting" | "idle")[] = [
          "training", "analyzing", "predicting", "idle"
        ];
        setModelStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (modelStatus) {
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
            {modelStatus.charAt(0).toUpperCase() + modelStatus.slice(1)}
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
              <p className="mt-1"><span className="font-medium">Model Version:</span> LEPAM v1.0.4</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
