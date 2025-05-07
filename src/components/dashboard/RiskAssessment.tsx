
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RiskAssessmentProps {
  className?: string;
}

export function RiskAssessment({ className }: RiskAssessmentProps) {
  const [riskLevel, setRiskLevel] = useState(15);
  const [trend, setTrend] = useState<"increasing" | "decreasing" | "stable">("stable");
  
  useEffect(() => {
    // Simulate dynamic risk level changes
    const interval = setInterval(() => {
      setRiskLevel(prev => {
        // Random value between -5 and 5
        const change = Math.floor(Math.random() * 11) - 5;
        const newValue = Math.max(0, Math.min(100, prev + change));
        
        if (change > 2) {
          setTrend("increasing");
        } else if (change < -2) {
          setTrend("decreasing");
        } else {
          setTrend("stable");
        }
        
        return newValue;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getRiskColor = () => {
    if (riskLevel < 30) return "bg-green-500";
    if (riskLevel < 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getRiskText = () => {
    if (riskLevel < 30) return "Low Risk";
    if (riskLevel < 60) return "Moderate Risk";
    return "High Risk";
  };
  
  const getTrendText = () => {
    if (trend === "increasing") return "Risk is increasing";
    if (trend === "decreasing") return "Risk is decreasing";
    return "Risk is stable";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Earthquake Risk Assessment</CardTitle>
        <CardDescription>Based on current magnetic field data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Current Risk Level</h4>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  riskLevel < 30 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                  riskLevel < 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : 
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {getRiskText()}
              </span>
            </div>
            <Progress value={riskLevel} className="h-2" indicatorClassName={getRiskColor()} />
            <p className="text-xs text-muted-foreground">{getTrendText()}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Risk Factors</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center justify-between">
                <span>Magnetic Anomalies</span>
                <span className="text-xs font-medium">Moderate</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Historical Patterns</span>
                <span className="text-xs font-medium">Low Correlation</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Signal Intensity</span>
                <span className="text-xs font-medium">Stable</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
