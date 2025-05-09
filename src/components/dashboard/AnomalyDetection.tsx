import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, RefreshCcw, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getRiskAssessment, fetchNOAAMagneticData } from "@/services/api";
import { useState, useEffect } from "react";

interface AnomalyDetectionProps {
  className?: string;
}

interface Anomaly {
  id: number;
  timestamp: string;
  type: string;
  magnitude: string;
  region: string;
  status: string;
}

export function AnomalyDetection({ className }: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  
  // Fetch NOAA data and risk assessment
  const { data: noaaData, refetch: refetchNoaa } = useQuery({
    queryKey: ['noaaMagneticData'],
    queryFn: fetchNOAAMagneticData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
  
  const { data: riskData, refetch: refetchRisk } = useQuery({
    queryKey: ['riskAssessment'],
    queryFn: getRiskAssessment,
    refetchInterval: 300000,
  });
  
  // Calculate anomalies based on magnetic data
  useEffect(() => {
    if (noaaData?.data && noaaData.data.length > 0) {
      const newAnomalies: Anomaly[] = [];
      
      // Get the last 30 entries
      const recentData = noaaData.data.slice(-30);
      
      // Calculate mean and standard deviation
      const values = recentData.map(d => parseFloat(d.value) || 0).filter(v => !isNaN(v));
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
      
      // Threshold for anomaly (2 standard deviations)
      const threshold = stdDev * 2;
      
      // Check for anomalies in the last 10 readings
      recentData.slice(-10).forEach((reading, idx) => {
        const value = parseFloat(reading.value) || 0;
        if (Math.abs(value - mean) > threshold) {
          // Determine magnitude based on deviation
          const deviation = Math.abs(value - mean) / stdDev;
          let magnitude = "minor";
          if (deviation > 4) magnitude = "critical";
          else if (deviation > 3) magnitude = "significant";
          
          // Add the anomaly
          newAnomalies.push({
            id: Date.now() + idx,
            timestamp: formatTimestamp(reading.timestamp || new Date().toISOString()),
            type: value > mean ? "magnetic spike" : "magnetic dip",
            magnitude,
            region: determineRegion(riskData),
            status: "monitoring"
          });
        }
      });
      
      // Add any existing "resolved" anomalies to maintain history
      const resolvedAnomalies = anomalies.filter(a => a.status === "resolved").slice(0, 2);
      
      // Combine new and resolved anomalies, limit to 5 most recent
      setAnomalies([...newAnomalies, ...resolvedAnomalies].slice(0, 5));
    }
  }, [noaaData, riskData]);
  
  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const anomalyTime = new Date(timestamp);
    
    // If it's today
    if (anomalyTime.toDateString() === now.toDateString()) {
      return anomalyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (anomalyTime.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${anomalyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show date and time
    return anomalyTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           ` ${anomalyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const determineRegion = (riskData: any): string => {
    if (!riskData) return "Pacific Northwest";
    
    const regions = ["Pacific Northwest", "Southern California", "Alaska", "Japan-Kuril Islands", "South America"];
    const riskLevel = riskData.riskLevel || 0;
    
    // Higher risk level increases chances of returning higher-risk regions
    if (riskLevel > 60) return regions[0]; // Pacific Northwest
    if (riskLevel > 40) return regions[1]; // Southern California
    
    // Otherwise return a random region
    return regions[Math.floor(Math.random() * regions.length)];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "monitoring":
        return <Badge className="bg-amber-500">Monitoring</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "alert":
        return <Badge className="bg-red-500">Alert</Badge>;
      default:
        return <Badge className="bg-slate-500">Unknown</Badge>;
    }
  };

  const getMagnitudeBadge = (magnitude: string) => {
    switch (magnitude) {
      case "critical":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Critical</Badge>;
      case "significant":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Significant</Badge>;
      case "minor":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Minor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleRefresh = async () => {
    await Promise.all([refetchNoaa(), refetchRisk()]);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md">Anomaly Detection</CardTitle>
          <CardDescription>Magnetic field irregularities</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="h-8"
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="py-8 text-center">
            <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No anomalies detected</p>
            <p className="text-xs text-muted-foreground mt-1">All magnetic readings within normal parameters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      anomaly.magnitude === "critical" ? "text-red-500" : 
                      anomaly.magnitude === "significant" ? "text-amber-500" : 
                      "text-blue-500"
                    }`} />
                    <span className="font-medium">{anomaly.type}</span>
                  </div>
                  {getStatusBadge(anomaly.status)}
                </div>
                <div className="text-sm">
                  <p className="flex items-center justify-between">
                    <span className="text-muted-foreground">Region:</span>
                    <span>{anomaly.region}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-muted-foreground">Magnitude:</span>
                    {getMagnitudeBadge(anomaly.magnitude)}
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-muted-foreground">Detected:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {anomaly.timestamp}
                    </span>
                  </p>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
