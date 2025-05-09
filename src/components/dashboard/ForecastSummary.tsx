
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Map, Circle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getRiskAssessment } from "@/services/api";
import { useEffect, useState } from "react";

interface ForecastSummaryProps {
  className?: string;
}

export function ForecastSummary({ className }: ForecastSummaryProps) {
  // Fetch the latest risk assessment data
  const { data: riskData } = useQuery({
    queryKey: ['riskAssessment'],
    queryFn: getRiskAssessment,
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Use dynamic data based on the risk assessment when available
  const [forecastRegions, setForecastRegions] = useState([
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
  ]);

  // Update forecast based on risk data
  useEffect(() => {
    if (riskData) {
      const riskLevel = riskData.riskLevel || 0;
      
      // Dynamically adjust San Andreas risk based on current risk level
      if (riskLevel > 50) {
        setForecastRegions(prev => prev.map(region => 
          region.id === 1 ? {...region, riskLevel: "high", probability: Math.min(75, 35 + riskLevel/2), timeframe: "24-72 hours"} : region
        ));
      } else if (riskLevel > 30) {
        setForecastRegions(prev => prev.map(region => 
          region.id === 1 ? {...region, riskLevel: "moderate", probability: Math.min(60, 25 + riskLevel/2)} : region
        ));
      } else {
        setForecastRegions(prev => prev.map(region => 
          region.id === 1 ? {...region, riskLevel: "low", probability: Math.min(30, 10 + riskLevel/2), timeframe: "7+ days"} : region
        ));
      }
    }
  }, [riskData]);

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

  const getLastUpdated = () => {
    const now = new Date();
    return `${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md">Forecast Summary</CardTitle>
          <CardDescription className="flex items-center gap-1">
            Regional earthquake risk assessment
            <span className="text-xs text-muted-foreground ml-1">
              Updated: {getLastUpdated()}
            </span>
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            asChild
          >
            <a 
              href="https://earthquake.usgs.gov/earthquakes/map/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Map className="h-3.5 w-3.5" />
              <span className="text-xs">USGS Map</span>
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
          </Button>
        </div>
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
                  <Clock className="h-3 w-3" />
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
