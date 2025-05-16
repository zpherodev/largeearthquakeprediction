
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
  const { data: riskData, isLoading } = useQuery({
    queryKey: ['riskAssessment'],
    queryFn: getRiskAssessment,
    refetchInterval: 60000, // Refetch every minute
  });
  
  const variationLevel = riskData?.riskLevel || 15;
  const trend = riskData?.trend || "stable";
  const factors = riskData?.factors || {
    magneticAnomalies: "Minimal",
    historicalPatterns: "Low Correlation",
    fieldIntensity: "Within Normal Range"
  };
  
  const getVariationColor = () => {
    if (variationLevel < 30) return "bg-green-500";
    if (variationLevel < 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getVariationText = () => {
    if (variationLevel < 30) return "Minimal Variations";
    if (variationLevel < 60) return "Notable Variations";
    return "Significant Variations";
  };
  
  const getTrendText = () => {
    if (trend === "increasing") return "Magnetic variations are increasing";
    if (trend === "decreasing") return "Magnetic variations are decreasing";
    return "Magnetic variations are stable";
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Magnetic Field Analysis</CardTitle>
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
        <CardTitle>Magnetic Field Analysis</CardTitle>
        <CardDescription>Based on NOAA GOES Magnetometer data (24h)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Field Variations</h4>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  variationLevel < 30 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                  variationLevel < 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : 
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {getVariationText()}
              </span>
            </div>
            <Progress value={variationLevel} className="h-2" indicatorClassName={getVariationColor()} />
            <p className="text-xs text-muted-foreground">{getTrendText()}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Data Analysis Metrics</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center justify-between">
                <span>Field Variations</span>
                <span className="text-xs font-medium">{factors.magneticAnomalies}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Historical Correlation</span>
                <span className="text-xs font-medium">{factors.historicalPatterns}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Current Field Intensity</span>
                <span className="text-xs font-medium">{factors.fieldIntensity}</span>
              </li>
            </ul>
          </div>

          {variationLevel > 60 && (
            <Alert variant="destructive" className="bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-300 text-xs">
                Note: Significant variations detected in magnetic field data over the past 24 hours.
              </AlertDescription>
            </Alert>
          )}
          
          <Alert className="bg-blue-50 border-blue-200 mt-2">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs text-blue-800">
              Analysis based on the last 24 hours of NOAA GOES magnetometer data compared to historical patterns.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
