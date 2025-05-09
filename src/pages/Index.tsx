
import { Compass, BarChart, Activity, TrendingDown } from "lucide-react";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { MagneticChart } from "@/components/dashboard/MagneticChart";
import { RiskAssessment } from "@/components/dashboard/RiskAssessment";
import { EarthquakeMap } from "@/components/maps/EarthquakeMap";
import { ModelStatus } from "@/components/models/ModelStatus";
import { SensorStatus } from "@/components/dashboard/SensorStatus";
import { AnomalyDetection } from "@/components/dashboard/AnomalyDetection";
import { useQuery } from '@tanstack/react-query';
import { getMagneticData, getModelStatus, getRiskAssessment, fetchNOAAMagneticData } from "@/services/api";
import { toast } from "sonner";

const Dashboard = () => {
  // Direct fetch from NOAA API for the most up-to-date data
  const { data: noaaData, isLoading: noaaLoading, error: noaaError } = useQuery({
    queryKey: ["noaaMagneticData"],
    queryFn: fetchNOAAMagneticData,
    refetchInterval: 60000, // Refresh every minute
    retry: 3,
  });

  // Fetch model status
  const { data: modelStatus, isLoading: modelLoading } = useQuery({
    queryKey: ["modelStatus"],
    queryFn: getModelStatus,
    refetchInterval: 60000,
  });

  // Fetch risk assessment data
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ["riskAssessment"],
    queryFn: getRiskAssessment,
    refetchInterval: 60000,
  });

  // Show toast notification if there's an error with NOAA data
  if (noaaError) {
    console.error("Failed to fetch NOAA data:", noaaError);
    toast.error("Unable to connect to NOAA data service. Some information may not be current.");
  }

  // Get latest reading value directly from NOAA data
  const latest = noaaData?.data?.[noaaData.data.length - 1];
  
  // Determine risk level from risk assessment data
  const riskLevel = riskData?.riskLevel || 20;
  
  // Signal intensity based on current magnetic readings
  const signalIntensity = riskData?.factors?.signalIntensity || "Medium";
  const signalTrend = signalIntensity === "High" ? "up" : 
                      signalIntensity === "Low" ? "down" : "stable";
  
  // Determine anomaly detection status based on risk level
  const anomalyActive = riskLevel > 30;
  const regions = riskData?.monitoredRegions || 3;
  
  // Get prediction confidence from model data
  const predictionConfidence = modelStatus?.accuracy || 76;
  const confidenceTrend = predictionConfidence > 80 ? "up" : 
                          predictionConfidence < 70 ? "down" : "stable";

  // Format the EMAG reading with unit and timestamp
  const formatEMAGReading = () => {
    if (noaaLoading || !latest) return "Loading...";
    const value = parseFloat(latest.value);
    return `${value.toFixed(1)} nT`;
  };

  // Get the timestamp for the latest reading
  const getLatestTimestamp = () => {
    if (!latest || !latest.timestamp) return "Latest reading";
    const time = new Date(latest.timestamp);
    return `${time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} UTC`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          title="Current Global Field Strength" 
          value={formatEMAGReading()}
          description={`NOAA GOES Magnetometer | ${getLatestTimestamp()}`}
          icon={<Compass className="text-blue-600" />}
          trend={latest && parseFloat(latest.value) > 100 ? "up" : "stable"}
        />

        <StatusCard 
          title="Signal Intensity" 
          value={signalIntensity} 
          description={`${signalTrend === "up" ? "↑" : signalTrend === "down" ? "↓" : "→"} from baseline`}
          icon={<Activity className="text-amber-600" />}
          trend={signalTrend}
        />
        <StatusCard 
          title="Anomaly Detection" 
          value={anomalyActive ? "Active" : "Monitoring"} 
          description={`Monitoring ${regions} regions`}
          icon={<BarChart className="text-purple-600" />}
          trend="stable" 
        />
        <StatusCard 
          title="Prediction Confidence" 
          value={`${predictionConfidence}%`} 
          description="Based on current data"
          icon={<TrendingDown className="text-green-600" />}
          trend={confidenceTrend} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <MagneticChart 
            title="Magnetic Field Readings" 
            description="Live NOAA GOES Magnetometer data" 
          />
        </div>
        <RiskAssessment />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <EarthquakeMap />
        </div>
        <div className="space-y-4">
          <ModelStatus />
          <SensorStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <AnomalyDetection className="lg:col-span-3" />
      </div>
    </div>
  );
};

export default Dashboard;
