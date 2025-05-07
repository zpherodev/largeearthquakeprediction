
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AnomalyDetectionProps {
  className?: string;
}

export function AnomalyDetection({ className }: AnomalyDetectionProps) {
  const anomalies = [
    { 
      id: 1, 
      timestamp: "10:32 AM", 
      type: "magnetic spike", 
      magnitude: "significant",
      region: "Pacific Northwest",
      status: "monitoring"
    },
    { 
      id: 2, 
      timestamp: "Yesterday, 8:15 PM", 
      type: "irregular pattern", 
      magnitude: "minor",
      region: "Southern California",
      status: "resolved"
    }
  ];

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
        return <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>;
      case "significant":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Significant</Badge>;
      case "minor":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Minor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md">Anomaly Detection</CardTitle>
          <CardDescription>Magnetic field irregularities</CardDescription>
        </div>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No anomalies detected</p>
            <p className="text-xs text-muted-foreground mt-1">All magnetic readings within normal parameters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
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
                    <span>{anomaly.timestamp}</span>
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
