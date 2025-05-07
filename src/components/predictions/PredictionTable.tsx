
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getPredictions } from "@/services/api";

interface Prediction {
  id: string;
  timestamp: string;
  location: string;
  magnitude: number;
  probability: number;
  timeframe: string;
  confidence?: number;
}

export function PredictionTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictions,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const predictions: Prediction[] = data?.predictions || [];

  function getProbabilityColor(probability: number): string {
    if (probability < 30) return "text-green-500";
    if (probability < 60) return "text-amber-500";
    return "text-red-500";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earthquake Predictions</CardTitle>
          <CardDescription>
            Generated forecasts based on magnetic field analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earthquake Predictions</CardTitle>
          <CardDescription>
            Generated forecasts based on magnetic field analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              {error ? "Error loading predictions" : "No predictions available"}
            </p>
          </div>
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
              {predictions[0].confidence !== undefined && (
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
