
import { EarthquakeMap } from "@/components/maps/EarthquakeMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Map = () => {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8">
      <h1 className="text-2xl font-bold">Geographic Visualization</h1>
      <p className="text-muted-foreground">
        Mapping earthquake risk areas based on magnetic field analysis
      </p>

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
                        <span>Cascadia Subduction Zone</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs">
                          Moderate Risk
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>New Madrid Fault Zone</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                          Low Risk
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
                        <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                        <span>Minor anomaly detected in Pacific Northwest</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span>All systems normal in Central US</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span>All systems normal in Northeast</span>
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
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Sensor network map would be displayed here in a complete implementation.
                </p>
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
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Historical event map would be displayed here in a complete implementation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Map;
