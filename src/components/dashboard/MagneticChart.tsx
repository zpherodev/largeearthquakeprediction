
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getMagneticData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCcw, SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import { toast } from "sonner";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--muted-foreground))",
  accent: "hsl(var(--accent-foreground))",
};

interface MagneticChartProps {
  title: string;
  description: string;
}

export function MagneticChart({ title, description }: MagneticChartProps) {
  const { data: magneticData, isLoading, error, refetch } = useQuery({
    queryKey: ['magneticData'],
    queryFn: getMagneticData,
    refetchInterval: 60000, // Refetch every 60 seconds
    retry: 3,
    staleTime: 30000,
  });

  const handleRefresh = async () => {
    toast.info("Refreshing magnetic data...");
    await refetch();
  };

  // Log the data we received for debugging
  useEffect(() => {
    if (magneticData) {
      console.log("MagneticChart data:", magneticData);
    }
    if (error) {
      console.error("MagneticChart error:", error);
    }
  }, [magneticData, error]);

  // Calculate signal characteristics from the data
  const getSignalCharacteristics = () => {
    if (!magneticData?.data || !Array.isArray(magneticData.data) || magneticData.data.length === 0) {
      return {
        strength: 0,
        anomalyScore: 0,
        signalToNoise: 0
      };
    }

    // Calculate the average magnetic field strength
    const values = magneticData.data
      .map(item => parseFloat(item.value) || parseFloat(String(item.mfig)) || 0)
      .filter(val => !isNaN(val));
    
    if (values.length === 0) return { strength: 0, anomalyScore: 0, signalToNoise: 0 };
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calculate standard deviation
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, diff) => sum + diff, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);
    
    // Get the most recent value
    const latestValue = values[values.length - 1] || 0;
    
    // Calculate signal characteristics
    const strength = Math.min(100, Math.max(0, latestValue * 5)); // Scale appropriately
    const anomalyScore = Math.min(100, Math.max(0, Math.abs(latestValue - avg) / stdDev * 25));
    const signalToNoise = stdDev > 0 ? Math.min(100, Math.max(0, (avg / stdDev) * 10)) : 50;
    
    return {
      strength,
      anomalyScore,
      signalToNoise
    };
  };

  const signalCharacteristics = getSignalCharacteristics();

  // Determine signal status icon based on anomaly score
  const getSignalStatusIcon = (score: number) => {
    if (score > 70) return <SignalHigh className="h-5 w-5 text-red-500" />;
    if (score > 30) return <SignalMedium className="h-5 w-5 text-amber-500" />;
    return <SignalLow className="h-5 w-5 text-green-500" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center flex-col gap-4">
            <div className="text-red-500">Error loading magnetic data</div>
            <Button onClick={handleRefresh} variant="default">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = magneticData?.data || [];
  const hasData = Array.isArray(chartData) && chartData.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <div className="text-muted-foreground mb-4">No magnetic data available</div>
            <Button onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="label" 
                tickLine={false}
                tickMargin={10}
                minTickGap={30}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value}nT`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--background)", borderRadius: "0.5rem", border: "1px solid var(--border)" }}
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value) => [`${value} nT`, "Magnetic Field"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2, fill: "var(--background)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Signal Characteristics Section */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium">Signal Characteristics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Magnetic Intensity</span>
                {getSignalStatusIcon(signalCharacteristics.strength)}
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div 
                  className={`h-1.5 rounded-full ${signalCharacteristics.strength > 70 ? 'bg-red-500' : signalCharacteristics.strength > 30 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${signalCharacteristics.strength}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{Math.round(signalCharacteristics.strength)}%</span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Anomaly Score</span>
                {getSignalStatusIcon(signalCharacteristics.anomalyScore)}
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div 
                  className={`h-1.5 rounded-full ${signalCharacteristics.anomalyScore > 70 ? 'bg-red-500' : signalCharacteristics.anomalyScore > 30 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${signalCharacteristics.anomalyScore}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{Math.round(signalCharacteristics.anomalyScore)}%</span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Signal/Noise</span>
                {getSignalStatusIcon(100 - signalCharacteristics.signalToNoise)}
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div 
                  className={`h-1.5 rounded-full ${signalCharacteristics.signalToNoise > 70 ? 'bg-green-500' : signalCharacteristics.signalToNoise > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${signalCharacteristics.signalToNoise}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{Math.round(signalCharacteristics.signalToNoise)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
