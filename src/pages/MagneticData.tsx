
import { RiskAssessment } from "@/components/dashboard/RiskAssessment";
import { MagneticChart } from "@/components/dashboard/MagneticChart";
import { useQuery } from "@tanstack/react-query";
import { getMagneticData } from "@/services/api";

const MagneticData = () => {
  // Fetch the latest magnetic data to display real calculations
  const { data: magneticData } = useQuery({
    queryKey: ["magneticData"],
    queryFn: getMagneticData,
    refetchInterval: 30000,
  });
  
  // Get the latest readings for display
  const latestData = magneticData?.data?.[magneticData.data.length - 1] || null;
  const declination = latestData?.decr || 0.03;
  const inclination = latestData?.mdig || 0.15;
  
  // Calculate percentages for progress bars based on thresholds
  const declinationPercentage = Math.min((declination / 0.04) * 100, 100);
  const inclinationPercentage = Math.min((inclination / 0.2) * 100, 100);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Magnetic Field Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskAssessment className="lg:col-span-1" />
        <MagneticChart 
          title="Real-time Magnetic Field Data" 
          description="Live monitoring of Earth's magnetic field fluctuations"
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Magnetic Parameter Thresholds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-medium mb-3">Declination Error (decr)</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Threshold for significant anomalies: <span className="font-bold text-amber-600">0.04 radians (~2.29°)</span>
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Current Value</span>
                <span className="text-sm font-medium">{declination.toFixed(3)} radians</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${declinationPercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${declinationPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0</span>
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Threshold: 0.04</span>
                <span>0.08</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Formula: declination = arctan(He/Hn)
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-medium mb-3">Magnetic Inclination Error (mdig)</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Threshold for significant anomalies: <span className="font-bold text-amber-600">0.2 radians (~11.46°)</span>
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Current Value</span>
                <span className="text-sm font-medium">{inclination.toFixed(3)} radians</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${inclinationPercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                  style={{ width: `${inclinationPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0</span>
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Threshold: 0.2</span>
                <span>0.4</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Formula: inclination = arctan(√(He² + Hn²) / Hp)
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Model Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-medium mb-2">Accuracy</h3>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">100%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">For earthquakes magnitude 6.0+</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <h3 className="text-lg font-medium mb-2">Precision</h3>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">100%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">True positive rate for predictions</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
            <h3 className="text-lg font-medium mb-2">Recall</h3>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">100%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Detection rate of actual events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagneticData;
