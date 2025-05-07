
import { MagneticChart } from "@/components/dashboard/MagneticChart";
import { SensorStatus } from "@/components/dashboard/SensorStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMagneticData } from "@/services/api";
import { SignalHigh, SignalMedium, SignalLow } from "lucide-react";

const MagneticData = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [signalCharacteristics, setSignalCharacteristics] = useState({
    strength: { value: "Medium", percentage: 65, status: "normal" },
    anomalyScore: { value: 0.37, percentage: 37, status: "normal" },
    frequencyRange: { value: "0.1-10 Hz", description: "Standard ULF range" },
    signalToNoise: { value: "14.2 dB", percentage: 71, status: "good" }
  });

  const { data: magneticData, isLoading, error } = useQuery({
    queryKey: ['magneticData'],
    queryFn: getMagneticData,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Calculate signal characteristics based on live data
  useEffect(() => {
    if (magneticData?.data && Array.isArray(magneticData.data) && magneticData.data.length > 0) {
      // Extract values for calculations
      const values = magneticData.data
        .map(item => parseFloat(item.value) || parseFloat(String(item.mfig)) || 0)
        .filter(val => !isNaN(val));
      
      if (values.length === 0) return;
      
      // Calculate average and standard deviation
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const squareDiffs = values.map(value => Math.pow(value - avg, 2));
      const avgSquareDiff = squareDiffs.reduce((sum, diff) => sum + diff, 0) / squareDiffs.length;
      const stdDev = Math.sqrt(avgSquareDiff);
      
      // Get the most recent value
      const latestValue = values[values.length - 1];
      
      // Calculate signal characteristics
      const strengthPercentage = Math.min(100, Math.max(0, latestValue / 150 * 100));
      const strengthStatus = strengthPercentage > 75 ? "high" : strengthPercentage > 40 ? "medium" : "low";
      const strengthValue = strengthStatus === "high" ? "High" : strengthStatus === "medium" ? "Medium" : "Low";
      
      const anomalyValue = Math.min(1, Math.max(0, Math.abs(latestValue - avg) / (stdDev * 3)));
      const anomalyPercentage = anomalyValue * 100;
      const anomalyStatus = anomalyPercentage > 70 ? "critical" : anomalyPercentage > 40 ? "warning" : "normal";
      
      const signalToNoiseValue = stdDev > 0 ? (avg / stdDev).toFixed(1) : "14.2";
      const snrPercentage = Math.min(100, Math.max(0, parseFloat(signalToNoiseValue) * 5));
      const snrStatus = snrPercentage > 70 ? "good" : snrPercentage > 40 ? "moderate" : "poor";
      
      setSignalCharacteristics({
        strength: { 
          value: strengthValue, 
          percentage: strengthPercentage, 
          status: strengthStatus 
        },
        anomalyScore: { 
          value: anomalyValue.toFixed(2), 
          percentage: anomalyPercentage, 
          status: anomalyStatus 
        },
        frequencyRange: { 
          value: "0.1-10 Hz", 
          description: "Standard ULF range" 
        },
        signalToNoise: { 
          value: `${signalToNoiseValue} dB`, 
          percentage: snrPercentage, 
          status: snrStatus 
        }
      });
    }
  }, [magneticData]);

  // Helper function to get appropriate signal icon based on status
  const getSignalIcon = (status: string) => {
    switch(status) {
      case "high":
      case "critical":
        return <SignalHigh className="h-5 w-5 text-red-500" />;
      case "medium":
      case "warning":
      case "moderate":
        return <SignalMedium className="h-5 w-5 text-amber-500" />;
      default:
        return <SignalLow className="h-5 w-5 text-green-500" />;
    }
  };
  
  // Helper function to get status text color
  const getStatusTextColor = (status: string) => {
    switch(status) {
      case "high":
      case "critical":
      case "poor":
        return "text-red-500";
      case "medium":
      case "warning":
      case "moderate":
        return "text-amber-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8">
      <h1 className="text-2xl font-bold">Magnetic Field Data</h1>
      <p className="text-muted-foreground">
        Real-time and historical electromagnetic readings used for earthquake prediction
      </p>

      <div className="mt-6">
        <Tabs defaultValue="realtime" className="w-full">
          <TabsList>
            <TabsTrigger value="realtime">Real-Time Data</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-end">
                <div className="inline-flex items-center rounded-md border border-input bg-background p-1 text-sm">
                  <button 
                    className={`px-3 py-1 rounded-sm ${selectedTimeRange === '1h' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedTimeRange('1h')}
                  >
                    1h
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-sm ${selectedTimeRange === '6h' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedTimeRange('6h')}
                  >
                    6h
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-sm ${selectedTimeRange === '24h' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedTimeRange('24h')}
                  >
                    24h
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-sm ${selectedTimeRange === '7d' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedTimeRange('7d')}
                  >
                    7d
                  </button>
                </div>
              </div>

              <MagneticChart 
                title="EMAG Readings" 
                description="Electromagnetic anomaly detection data"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Signal Characteristics</CardTitle>
                    <CardDescription>Analysis of current magnetic signals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium">Signal Strength</h3>
                          <div className="flex items-center gap-1.5">
                            <p className="text-2xl font-bold">{signalCharacteristics.strength.value}</p>
                            {getSignalIcon(signalCharacteristics.strength.status)}
                          </div>
                          <p className={`text-xs ${getStatusTextColor(signalCharacteristics.strength.status)}`}>
                            {signalCharacteristics.strength.status === "high" 
                              ? "Above normal parameters" 
                              : signalCharacteristics.strength.status === "medium"
                                ? "Within expected parameters"
                                : "Below expected parameters"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Anomaly Score</h3>
                          <div className="flex items-center gap-1.5">
                            <p className="text-2xl font-bold">{signalCharacteristics.anomalyScore.value}</p>
                            {getSignalIcon(signalCharacteristics.anomalyScore.status)}
                          </div>
                          <p className={`text-xs ${getStatusTextColor(signalCharacteristics.anomalyScore.status)}`}>
                            {signalCharacteristics.anomalyScore.status === "critical"
                              ? "Above detection threshold"
                              : signalCharacteristics.anomalyScore.status === "warning"
                                ? "Approaching threshold"
                                : "Below detection threshold"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium">Frequency Range</h3>
                          <p className="text-2xl font-bold">{signalCharacteristics.frequencyRange.value}</p>
                          <p className="text-xs text-muted-foreground">{signalCharacteristics.frequencyRange.description}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Signal-to-Noise</h3>
                          <div className="flex items-center gap-1.5">
                            <p className="text-2xl font-bold">{signalCharacteristics.signalToNoise.value}</p>
                            {getSignalIcon(signalCharacteristics.signalToNoise.status)}
                          </div>
                          <p className={`text-xs ${getStatusTextColor(signalCharacteristics.signalToNoise.status)}`}>
                            {signalCharacteristics.signalToNoise.status === "good"
                              ? "Good quality reading"
                              : signalCharacteristics.signalToNoise.status === "moderate"
                                ? "Moderate quality reading"
                                : "Poor quality reading"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <SensorStatus />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historical" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>
                  Long-term electromagnetic data trends and patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Historical data visualization would appear here in a complete implementation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Magnetic Data Analysis</CardTitle>
                <CardDescription>
                  Correlation between magnetic anomalies and seismic events
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Advanced analysis tools would be available here in a complete implementation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MagneticData;
