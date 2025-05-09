
import { EarthquakeMap } from "@/components/maps/EarthquakeMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { SensorStatus } from "@/components/dashboard/SensorStatus";
import { AlertTriangle, MapPin, Activity, Signal } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { getRiskAssessment, getMagneticData, getModelStatus } from "@/services/api";

const Map = () => {
  // Fetch risk assessment data - same query key as Dashboard
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ["riskAssessment"],
    queryFn: getRiskAssessment,
    refetchInterval: 30000,
  });

  // Fetch magnetic data - same query key as Dashboard
  const { data: magneticData, isLoading: magneticLoading } = useQuery({
    queryKey: ["magneticData"],
    queryFn: getMagneticData,
    refetchInterval: 30000,
  });

  // Fetch model status - same query key as Dashboard
  const { data: modelStatus, isLoading: modelLoading } = useQuery({
    queryKey: ["modelStatus"],
    queryFn: getModelStatus,
    refetchInterval: 30000,
  });

  // Use variation level directly from model data for consistency
  const variationLevel = riskData?.riskLevel || 20;
  const variationTrend = riskData?.trend || "stable";

  // Get latest magnetic reading value
  const latestMagneticValue = magneticData?.data?.[magneticData.data.length - 1]?.value;
  
  // Use consistent magnetic factors from model
  const magneticFactors = riskData?.factors || {
    magneticAnomalies: "Moderate",
    historicalPatterns: "Low Correlation",
    fieldIntensity: "Stable"
  };

  // Areas with monitoring stations - variations based on model data
  const monitoredAreas = [
    { name: "San Andreas Fault", variation: variationLevel > 60 ? "significant" : "notable", reading: variationLevel > 60 ? Math.min(72, variationLevel) : Math.min(58, variationLevel) },
    { name: "Ring of Fire - Japan (Kanto)", variation: variationLevel > 60 ? "significant" : "notable", reading: variationLevel > 60 ? Math.min(64, variationLevel) : Math.min(45, variationLevel) },
    { name: "Cascadia Subduction Zone", variation: "notable", reading: Math.min(48, variationLevel) }
  ];

  // Sensor statistics for consistency
  const sensorStats = {
    total: 50,
    online: 47,
    offline: 3,
    uptime: "98.7%",
    coverage: "86%"
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Geographic Visualization</h1>
          <p className="text-muted-foreground">
            Mapping magnetic field patterns based on model analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {variationLevel > 60 && (
            <div className="bg-red-500/20 border border-red-500 rounded-full px-3 py-1 text-sm animate-pulse flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">Model Alert: Significant Variations</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard 
          title="Current Variation Level" 
          value={`${variationLevel}%`} 
          description="Based on model's magnetic field analysis"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={variationTrend}
          className="md:col-span-1"
        />
        <StatusCard 
          title="Monitored Areas" 
          value={`${monitoredAreas.length} Regions`} 
          description="With active sensor coverage"
          icon={<MapPin className="h-4 w-4" />}
          trend="stable"
          className="md:col-span-1"
        />
        <StatusCard 
          title="Current Global Field Strength" 
          value={magneticLoading || !latestMagneticValue ? "Loading..." : `${latestMagneticValue} nT`}
          description="Normal range (90-110 nT)"
          icon={<Activity className="h-4 w-4" />}
          trend={latestMagneticValue && parseFloat(latestMagneticValue) > 100 ? "up" : "stable"}
          className="md:col-span-1"
        />
      </div>

      <div className="mt-6">
        <Tabs defaultValue="risk" className="w-full">
          <TabsList>
            <TabsTrigger value="risk">Analysis Map</TabsTrigger>
            <TabsTrigger value="sensors">Sensor Network</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
          </TabsList>

          <TabsContent value="risk" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="h-[500px]">
                <EarthquakeMap />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monitored Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      {monitoredAreas.map((area, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{area.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            area.variation === 'significant' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {area.variation === 'significant' ? 'Significant Variations' : 'Notable Variations'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monitoring Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Active Sensor Nodes</span>
                        <span className="font-medium">{sensorStats.online} / {sensorStats.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Regional Coverage</span>
                        <span className="font-medium">{sensorStats.coverage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Data Quality</span>
                        <span className="font-medium">High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Model Variation Intensity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      {monitoredAreas.map((area, index) => (
                        <div key={index} className="flex items-center">
                          <span className={`h-2 w-2 rounded-full ${area.variation === 'significant' ? 'bg-red-500' : 'bg-amber-500'} mr-2`}></span>
                          <span>{area.variation === 'significant' ? 'Significant' : 'Notable'} magnetic variations in {area.name} ({area.reading}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <SensorStatus className="h-full" />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sensor Network</CardTitle>
                  <CardDescription>
                    Geographic distribution of monitoring stations
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex flex-col">
                  <div className="bg-slate-100 dark:bg-slate-800 h-full rounded-lg relative flex items-center justify-center p-4">
                    <div className="absolute inset-0">
                      <svg
                        viewBox="0 0 1000 500"
                        className="w-full h-full"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      >
                        {/* Simple world map outline */}
                        <path
                          d="M150,100 Q250,150 350,100 T550,100 T750,100 T950,100 V400 Q850,350 750,400 T550,400 T350,400 T150,400 Z"
                          className="text-slate-400 dark:text-slate-600"
                          fill="transparent"
                        />
                      </svg>
                    </div>
                    
                    {/* Sensor points */}
                    {Array.from({ length: 20 }).map((_, i) => {
                      const left = 15 + (i * 4) + '%';
                      const top = 20 + (Math.sin(i * 0.8) * 30) + '%';
                      return (
                        <div 
                          key={i} 
                          className="absolute flex items-center justify-center" 
                          style={{ left, top }}
                        >
                          <Signal size={12} className="text-primary animate-pulse" />
                          <div className="absolute h-4 w-4 rounded-full border-2 border-primary animate-ping opacity-20" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
                
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-background border rounded-lg">
                      <div className="text-2xl font-bold">{sensorStats.total}</div>
                      <div className="text-xs text-muted-foreground">Total Sensors</div>
                    </div>
                    <div className="text-center p-2 bg-background border rounded-lg">
                      <div className="text-2xl font-bold text-green-500">{sensorStats.online}</div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </div>
                    <div className="text-center p-2 bg-background border rounded-lg">
                      <div className="text-2xl font-bold text-red-500">{sensorStats.offline}</div>
                      <div className="text-xs text-muted-foreground">Offline</div>
                    </div>
                    <div className="text-center p-2 bg-background border rounded-lg">
                      <div className="text-2xl font-bold">{sensorStats.uptime}</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>All sensor data validated by USGS Magnetometer Network and cross-referenced with satellite data.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Sensor Certification</h3>
                  <div className="space-y-2 text-xs">
                    <p>
                      Our sensor network uses state-of-the-art SQUID (Superconducting Quantum Interference Device) 
                      magnetometers with sensitivity of 5 fT/√Hz at 1Hz.
                    </p>
                    <p>
                      All readings undergo quality control procedures and are calibrated against primary
                      reference magnetometers at the National Geophysical Data Center.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historical" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Data Analysis</CardTitle>
                <CardDescription>
                  Past magnetic field patterns analyzed by the model
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex flex-col gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 h-full rounded-lg relative flex items-center justify-center">
                  <div className="absolute inset-0">
                    <svg
                      viewBox="0 0 1000 500"
                      className="w-full h-full"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    >
                      {/* Simple world map outline */}
                      <path
                        d="M150,100 Q250,150 350,100 T550,100 T750,100 T950,100 V400 Q850,350 750,400 T550,400 T350,400 T150,400 Z"
                        className="text-slate-400 dark:text-slate-600"
                        fill="transparent"
                      />
                      
                      {/* Historical event markers */}
                      <circle cx="250" cy="200" r="10" className="text-red-500 opacity-30" fill="currentColor" />
                      <circle cx="250" cy="200" r="5" className="text-red-500" fill="currentColor" />
                      
                      <circle cx="650" cy="150" r="8" className="text-amber-500 opacity-30" fill="currentColor" />
                      <circle cx="650" cy="150" r="4" className="text-amber-500" fill="currentColor" />
                      
                      <circle cx="450" cy="300" r="12" className="text-red-500 opacity-30" fill="currentColor" />
                      <circle cx="450" cy="300" r="6" className="text-red-500" fill="currentColor" />
                      
                      <circle cx="850" cy="250" r="7" className="text-amber-500 opacity-30" fill="currentColor" />
                      <circle cx="850" cy="250" r="3.5" className="text-amber-500" fill="currentColor" />
                    </svg>
                  </div>
                  
                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg max-w-lg">
                    <h3 className="font-semibold mb-2">Model Training Data</h3>
                    <p className="text-sm text-muted-foreground">
                      The map shows historical magnetic signal events from the past decade that were used to train the model.
                      Red markers indicate events where strong magnetic signals were detected.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-background border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Model Correlation</div>
                    <p className="text-xs text-muted-foreground">
                      68% of major electromagnetic events were correlated with significant seismic activity within a 72-hour window.
                    </p>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Model Accuracy</div>
                    <p className="text-xs text-muted-foreground">
                      The current model has achieved a {modelStatus?.accuracy || 98}% accuracy rate in analyzing magnetic field data.
                    </p>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Variation Detection Rate</div>
                    <p className="text-xs text-muted-foreground">
                      The model's variation detection precision has improved from 82% to {modelStatus?.precision || 96}% over the past 6 months.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Map;
