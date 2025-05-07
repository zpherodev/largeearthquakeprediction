
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Map, Circle } from "lucide-react";

interface ForecastSummaryProps {
  className?: string;
}

export function ForecastSummary({ className }: ForecastSummaryProps) {
  // In a real implementation, this would be derived from our prediction data
  const forecastRegions = [
    { 
      id: 1, 
      name: "San Andreas Fault", 
      riskLevel: "moderate", 
      probability: 38,
      timeframe: "3-7 days",
      activities: "Minor magnetic fluctuations detected"
    },
    { 
      id: 2, 
      name: "Cascadia Subduction Zone", 
      riskLevel: "low", 
      probability: 12,
      timeframe: "30+ days",
      activities: "Stable readings within normal parameters"
    },
    { 
      id: 3, 
      name: "New Madrid Fault Zone", 
      riskLevel: "minimal", 
      probability: 5,
      timeframe: "No immediate concern",
      activities: "Historical patterns show no risk indicators"
    }
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-500">High Risk</Badge>;
      case "moderate":
        return <Badge className="bg-amber-500">Moderate Risk</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low Risk</Badge>;
      case "minimal":
        return <Badge className="bg-green-500">Minimal Risk</Badge>;
      default:
        return <Badge className="bg-slate-500">Unknown</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md">Forecast Summary</CardTitle>
          <CardDescription>Regional earthquake risk assessment</CardDescription>
        </div>
        <Map className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {forecastRegions.map((region) => (
            <div key={region.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{region.name}</span>
                {getRiskBadge(region.riskLevel)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Probability: {region.probability}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Circle className="h-3 w-3" />
                  <span>Timeframe: {region.timeframe}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{region.activities}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
