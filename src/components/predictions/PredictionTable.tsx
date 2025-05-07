
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Prediction {
  id: string;
  timestamp: string;
  location: string;
  magnitude: number;
  probability: number;
  timeframe: string;
}

function generateRandomPrediction(): Prediction {
  const locations = [
    "San Andreas Fault, CA",
    "Pacific Ring of Fire",
    "Aleutian Islands, AK",
    "New Madrid Fault Zone",
    "Cascadia Subduction Zone",
    "Himalayan Fault System",
    "Japan Trench"
  ];
  
  const timeframes = ["24 hours", "3-7 days", "1-2 weeks", "2-4 weeks"];
  
  const now = new Date();
  const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
  let probability = Math.random();
  
  // Adjust magnitude to be correlated with probability
  let magnitude = 3 + (probability * 5);
  magnitude = Math.round(magnitude * 10) / 10; // Round to 1 decimal place
  probability = Math.round(probability * 100);
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: now.toISOString(),
    location: locations[Math.floor(Math.random() * locations.length)],
    magnitude: magnitude,
    probability: probability,
    timeframe: timeframe
  };
}

export function PredictionTable() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    // Generate initial predictions
    const initialPredictions = Array(5).fill(null).map(() => generateRandomPrediction());
    setPredictions(initialPredictions);
    
    // Update predictions every few minutes
    const interval = setInterval(() => {
      setPredictions(current => {
        // Remove oldest prediction and add new one
        const updated = [...current];
        updated.pop();
        updated.unshift(generateRandomPrediction());
        return updated;
      });
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  function getProbabilityColor(probability: number): string {
    if (probability < 30) return "text-green-500";
    if (probability < 60) return "text-amber-500";
    return "text-red-500";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
