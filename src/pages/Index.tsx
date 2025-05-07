
import { Compass, Radar, Earth, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { MagneticChart } from "@/components/dashboard/MagneticChart";
import { RiskAssessment } from "@/components/dashboard/RiskAssessment";
import { EarthquakeMap } from "@/components/maps/EarthquakeMap";
import { ModelStatus } from "@/components/models/ModelStatus";

const Dashboard = () => {
  const { data: magneticData, isLoading } = useQuery({
  queryKey: ["magneticData"],
  queryFn: getMagneticData,
  refetchInterval: 30000,
});

const latest = magneticData?.data?.[magneticData.data.length - 1];

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
  title="Current EMAG Reading" 
  value={latest ? `${latest.value} nT` : "Loading..."} 
  description="Normal range (90-110 nT)"
  icon={<Compass />}
  trend="stable"
/>

        <StatusCard 
          title="Signal Intensity" 
          value="Medium" 
          description="↑ 7% from baseline"
          icon={<Radar />}
          trend="up"
        />
        <StatusCard 
          title="Anomaly Detection" 
          value="Active" 
          description="Monitoring 7 regions"
          icon={<Earth />}
          trend="stable" 
        />
        <StatusCard 
          title="Prediction Confidence" 
          value="76%" 
          description="Based on current data"
          icon={<TrendingDown />}
          trend="down" 
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
        <EarthquakeMap />
        <ModelStatus />
      </div>
    </div>
  );
};

export default Dashboard;
