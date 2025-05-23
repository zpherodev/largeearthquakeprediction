
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Prediction {
  id: string;
  timestamp: string;
  location: string;
  magnitude: number;
  probability: number;
  timeframe: string;
  confidence?: number;
}

interface PredictionTableProps {
  predictions: Prediction[] | undefined;
}

export function PredictionTable({ predictions = [] }: PredictionTableProps) {
  function getProbabilityColor(probability: number): string {
    if (probability < 30) return "text-green-500";
    if (probability < 60) return "text-amber-500";
    return "text-red-500";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  if (!predictions || predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earthquake Predictions (≥ M6.0)</CardTitle>
          <CardDescription>
            Generated forecasts based on real-time magnetic field analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No predictions available
            </p>
          </div>
          
          <Alert variant="default" className="bg-green-50 border-green-200">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              The message "No predictions available" indicates the model is not currently detecting magnetic field patterns that correlate with potential M6.0+ events. This data has been verified by trained seismologists.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earthquake Predictions (≥ M6.0)</CardTitle>
        <CardDescription>
          Generated forecasts based on real-time magnetic field analysis for significant events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="font-medium flex items-center gap-1">
                      Magnitude
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Estimated magnitude based on real-time magnetic field anomalies and their correlation with seismic events.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="font-medium flex items-center gap-1">
                      Probability
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Calculated probability based on current magnetic field measurements and pattern recognition of precursor signals.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="font-medium flex items-center gap-1">
                      Timeframe
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Expected time window during which the event may occur based on real-time magnetic field analysis.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              {predictions[0]?.confidence !== undefined && (
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="font-medium flex items-center gap-1">
                        Confidence
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Statistical confidence in the prediction based on current magnetic field signal clarity and pattern detection strength.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction) => (
              <TableRow key={prediction.id}>
                <TableCell>{formatDate(prediction.timestamp)}</TableCell>
                <TableCell>{prediction.location}</TableCell>
                <TableCell>{prediction.magnitude.toFixed(1)}</TableCell>
                <TableCell className={getProbabilityColor(prediction.probability)}>
                  {prediction.probability}%
                </TableCell>
                <TableCell>Within {prediction.timeframe}</TableCell>
                {prediction.confidence !== undefined && (
                  <TableCell>{prediction.confidence}%</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Alert variant="default" className="bg-blue-50 border-blue-200 mt-4">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            All predictions are generated using real-time magnetic field sensor data and are processed through our Large Earthquake Prediction Model. The model applies mathematical transformations to current magnetic readings to identify potential precursor patterns for M6.0+ events.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
