
import { EarthquakeMap } from "@/components/maps/EarthquakeMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { AlertTriangle, MapPin, Activity, Signal } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { getRiskAssessment } from "@/services/api";

const Map = () => {
  // Fetch risk assessment data
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ["riskAssessment"],
    queryFn: getRiskAssessment,
    refetchInterval: 30000,
  });

  // Determine risk level
  const riskLevel = riskData?.riskLevel || 20;
  const riskTrend = riskData?.trend || "stable";

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Geographic Visualization</h1>
          <p className="text-muted-foreground">
            Mapping earthquake risk areas based on magnetic field analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {riskLevel > 40 && (
            <div className="bg-red-500/20 border border-red-500 rounded-full px-3 py-1 text-sm animate-pulse flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">High Risk Alert</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard 
          title="Overall Risk Level" 
          value={`${riskLevel}%`} 
          description="Based on magnetic field analysis"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={riskTrend}
          className="md:col-span-1"
        />
        <StatusCard 
          title="Active Monitoring Areas" 
          value="5 Regions" 
          description="Across major fault lines"
          icon={<MapPin className="h-4 w-4" />}
          trend="stable"
          className="md:col-span-1"
        />
        <StatusCard 
          title="Anomaly Detection" 
          value={riskLevel > 40 ? "Active" : "Normal"} 
          description="Current magnetic field status"
          icon={<Activity className="h-4 w-4" />}
          trend={riskTrend}
          className="md:col-span-1"
        />
      </div>

      <div className="mt-6">
        <Tabs defaultValue="risk" className="w-full">
          <TabsList>
            <TabsTrigger value="risk">Risk Map</TabsTrigger>
            <TabsTrigger value="sensors">Sensor Network</TabsTrigger>
            <TabsTrigger value="historical">Historical Events</TabsTrigger>
          </TabsList>

          <TabsContent value="risk" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="h-[500px]">
                <EarthquakeMap />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">High Risk Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center justify-between">
                        <span>San Andreas Fault</span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
                          High Risk
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Ring of Fire - Japan</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs">
                          Moderate Risk
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Cascadia Subduction Zone</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs">
                          Moderate Risk
                        </span>
                      </li>
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
                        <span className="font-medium">47 / 50</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Regional Coverage</span>
                        <span className="font-medium">86%</span>
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
                    <CardTitle className="text-base">Current Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        <span>High magnetic anomaly in California</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                        <span>Moderate anomaly detected in Pacific Northwest</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span>All systems normal in Central US</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sensor Network</CardTitle>
                <CardDescription>
                  Geographic distribution of monitoring stations
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex flex-col">
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
                  
                  <p className="text-muted-foreground text-center bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                    The network consists of 50 monitoring stations distributed across key seismic zones.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">50</div>
                      <div className="text-xs text-muted-foreground">Sensors</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-500">47</div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-500">3</div>
                      <div className="text-xs text-muted-foreground">Offline</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">98.7%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Events</CardTitle>
                <CardDescription>
                  Map of past seismic events and associated magnetic anomalies
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
                    <h3 className="font-semibold mb-2">Historical Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      The map shows historical earthquake events from the past decade, with the size of each marker indicating magnitude.
                      Red markers indicate events where magnetic anomalies were detected prior to the event.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-background border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Correlation Analysis</div>
                    <p className="text-xs text-muted-foreground">
                      68% of major seismic events were preceded by detectable magnetic field anomalies within a 72-hour window.
                    </p>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Prediction Success Rate</div>
                    <p className="text-xs text-muted-foreground">
                      The current model has achieved a 73% success rate in predicting events magnitude 5.0 or greater.
                    </p>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">False Alarm Rate</div>
                    <p className="text-xs text-muted-foreground">
                      The false positive rate has decreased from 42% to 17% over the past 6 months of model refinement.
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
