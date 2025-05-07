
import { Compass, BarChart, Activity, TrendingDown } from "lucide-react";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { MagneticChart } from "@/components/dashboard/MagneticChart";
import { RiskAssessment } from "@/components/dashboard/RiskAssessment";
import { EarthquakeMap } from "@/components/maps/EarthquakeMap";
import { ModelStatus } from "@/components/models/ModelStatus";
import { SensorStatus } from "@/components/dashboard/SensorStatus";
import { ForecastSummary } from "@/components/dashboard/ForecastSummary";
import { AnomalyDetection } from "@/components/dashboard/AnomalyDetection";
import { useQuery } from '@tanstack/react-query';
import { getMagneticData, getModelStatus, getRiskAssessment } from "@/services/api";

const Dashboard = () => {
  // Fetch magnetic data for the chart and EMAG readings
  const { data: magneticData, isLoading: magneticLoading } = useQuery({
    queryKey: ["magneticData"],
    queryFn: getMagneticData,
    refetchInterval: 30000,
  });

  // Fetch model status for the status cards
  const { data: modelStatus, isLoading: modelLoading } = useQuery({
    queryKey: ["modelStatus"],
    queryFn: getModelStatus,
    refetchInterval: 30000,
  });

  // Fetch risk assessment data
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ["riskAssessment"],
    queryFn: getRiskAssessment,
    refetchInterval: 30000,
  });

  const latest = magneticData?.data?.[magneticData.data.length - 1];
  
  // Determine signal intensity trend based on risk assessment
  const signalIntensity = riskData?.factors?.signalIntensity || "Medium";
  const signalTrend = signalIntensity === "High" ? "up" : 
                      signalIntensity === "Low" ? "down" : "stable";
  
  // Determine anomaly detection status
  const anomalyActive = riskData?.riskLevel > 30;
  const regions = Math.floor(Math.random() * 5) + 3; // Simulate 3-8 regions being monitored
  
  // Get prediction confidence from model data
  const predictionConfidence = modelStatus?.accuracy || 76;
  const confidenceTrend = predictionConfidence > 80 ? "up" : 
                          predictionConfidence < 70 ? "down" : "stable";

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          title="Current EMAG Reading" 
          value={magneticLoading || !latest ? "Loading..." : `${latest.value} nT`}
          description="Normal range (90-110 nT)"
          icon={<Compass />}
          trend={latest && parseFloat(latest.value) > 100 ? "up" : "stable"}
        />

        <StatusCard 
          title="Signal Intensity" 
          value={signalIntensity} 
          description={`${signalTrend === "up" ? "↑" : signalTrend === "down" ? "↓" : "→"} from baseline`}
          icon={<Activity />}
          trend={signalTrend}
        />
        <StatusCard 
          title="Anomaly Detection" 
          value={anomalyActive ? "Active" : "Monitoring"} 
          description={`Monitoring ${regions} regions`}
          icon={<BarChart />}
          trend="stable" 
        />
        <StatusCard 
          title="Prediction Confidence" 
          value={`${predictionConfidence}%`} 
          description="Based on current data"
          icon={<TrendingDown />}
          trend={confidenceTrend} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <MagneticChart 
            title="Magnetic Field Readings" 
            description="Live EMAG data updates every 30 seconds" 
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
        <ForecastSummary className="lg:col-span-2" />
        <AnomalyDetection />
      </div>
    </div>
  );
};

export default Dashboard;
