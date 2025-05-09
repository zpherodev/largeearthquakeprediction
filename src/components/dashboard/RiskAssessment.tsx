
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRiskAssessment } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RiskAssessmentProps {
  className?: string;
}

export function RiskAssessment({ className }: RiskAssessmentProps) {
  const { data: riskData, isLoading, error } = useQuery({
    queryKey: ['riskAssessment'],
    queryFn: getRiskAssessment,
    refetchInterval: 60000, // Refetch every minute
  });
  
  const anomalyLevel = riskData?.riskLevel || 15;
  const trend = riskData?.trend || "stable";
  const factors = riskData?.factors || {
    magneticAnomalies: "Moderate",
    historicalPatterns: "Low Correlation",
    signalIntensity: "Stable"
  };
  
  const getAnomalyColor = () => {
    if (anomalyLevel < 30) return "bg-green-500";
    if (anomalyLevel < 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getAnomalyText = () => {
    if (anomalyLevel < 30) return "Low Signal";
    if (anomalyLevel < 60) return "Moderate Signal";
    return "Strong Signal";
  };
  
  const getTrendText = () => {
    if (trend === "increasing") return "Signal level is increasing";
    if (trend === "decreasing") return "Signal level is decreasing";
    return "Signal level is stable";
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Magnetic Signal Assessment</CardTitle>
          <CardDescription>Analyzing patterns in Earth's magnetic field</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Magnetic Signal Assessment</CardTitle>
        <CardDescription>Based on NOAA GOES Magnetometer data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Current Signal Level</h4>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  anomalyLevel < 30 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                  anomalyLevel < 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : 
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {getAnomalyText()}
              </span>
            </div>
            <Progress value={anomalyLevel} className="h-2" indicatorClassName={getAnomalyColor()} />
            <p className="text-xs text-muted-foreground">{getTrendText()}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Observed Factors</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center justify-between">
                <span>Magnetic Signals</span>
                <span className="text-xs font-medium">{factors.magneticAnomalies}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Historical Patterns</span>
                <span className="text-xs font-medium">{factors.historicalPatterns}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Signal Intensity</span>
                <span className="text-xs font-medium">{factors.signalIntensity}</span>
              </li>
            </ul>
          </div>

          {anomalyLevel > 60 && (
            <Alert variant="destructive" className="bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-300 text-xs">
                Note: Strong magnetic signal detected. Continued monitoring recommended.
              </AlertDescription>
            </Alert>
          )}
          
          <Alert className="bg-blue-50 border-blue-200 mt-2">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs text-blue-800">
              This assessment is based on real-time NOAA GOES magnetometer data and historical correlation analysis.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
