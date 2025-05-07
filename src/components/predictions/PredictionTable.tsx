
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          <CardTitle>Earthquake Predictions</CardTitle>
          <CardDescription>
            Generated forecasts based on magnetic field analysis
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
              The message "No predictions available" is actually reassuring - it means the system is working properly and not detecting any conditions that would warrant an earthquake prediction. This is much better than seeing a list of potential earthquakes!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earthquake Predictions</CardTitle>
        <CardDescription>
          Generated forecasts based on magnetic field analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Magnitude</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Timeframe</TableHead>
              {predictions[0]?.confidence !== undefined && (
                <TableHead>Confidence</TableHead>
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
      </CardContent>
    </Card>
  );
}
