
import { MagneticChart } from "@/components/dashboard/MagneticChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const MagneticData = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

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
                          <p className="text-2xl font-bold">Medium</p>
                          <p className="text-xs text-muted-foreground">Within expected parameters</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Anomaly Score</h3>
                          <p className="text-2xl font-bold">0.37</p>
                          <p className="text-xs text-muted-foreground">Below detection threshold</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium">Frequency Range</h3>
                          <p className="text-2xl font-bold">0.1-10 Hz</p>
                          <p className="text-xs text-muted-foreground">Standard ULF range</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Signal-to-Noise</h3>
                          <p className="text-2xl font-bold">14.2 dB</p>
                          <p className="text-xs text-muted-foreground">Good quality reading</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sensor Status</CardTitle>
                    <CardDescription>Monitoring station information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Station ID</span>
                        <span className="text-sm font-medium">EMAG-1042</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Location</span>
                        <span className="text-sm font-medium">37.7749° N, 122.4194° W</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last Calibration</span>
                        <span className="text-sm font-medium">2025-04-23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Status</span>
                        <span className="text-sm font-medium flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Online
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Quality</span>
                        <span className="text-sm font-medium">High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
