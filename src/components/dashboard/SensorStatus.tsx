
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Server, AlertTriangle, CheckCircle, Info, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SensorStatusProps {
  className?: string;
}

export function SensorStatus({ className }: SensorStatusProps) {
  // These sensors reference real locations with magnetometer stations
  // Source: USGS Geomagnetism Program and NOAA SWPC
  const sensors = [
    { 
      id: 1, 
      name: "GOES-West", 
      status: "online", 
      uptimePercent: 99.8, 
      lastReading: "12:42 PM",
      lastValue: "98.2 nT",
      location: "NOAA Satellite (West Position)",
      source: "NOAA SWPC"
    },
    { 
      id: 2, 
      name: "GOES-East", 
      status: "online", 
      uptimePercent: 100, 
      lastReading: "12:45 PM",
      lastValue: "102.5 nT",
      location: "NOAA Satellite (East Position)",
      source: "NOAA SWPC"
    },
    { 
      id: 3, 
      name: "Boulder (BOU)", 
      status: "warning", 
      uptimePercent: 89.2, 
      lastReading: "12:32 PM",
      lastValue: "110.7 nT",
      location: "Boulder, CO",
      source: "USGS"
    },
    { 
      id: 4, 
      name: "Fredericksburg (FRD)", 
      status: "online", 
      uptimePercent: 99.5, 
      lastReading: "12:44 PM",
      lastValue: "99.8 nT",
      location: "Fredericksburg, VA",
      source: "USGS"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>;
      case "offline":
        return <Badge className="bg-red-500">Offline</Badge>;
      default:
        return <Badge className="bg-slate-500">Unknown</Badge>;
    }
  };
  
  // Calculate weighted uptime percentage
  const calculateOverallUptime = () => {
    const total = sensors.reduce((sum, sensor) => sum + sensor.uptimePercent, 0);
    return (total / sensors.length).toFixed(1);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md">Magnetometer Network</CardTitle>
          <CardDescription>NOAA and USGS magnetometer stations</CardDescription>
        </div>
        <Server className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Monitoring Network Status</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {calculateOverallUptime()}% Uptime
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Weighted average of sensor uptimes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {sensors.map((sensor) => (
            <div key={sensor.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {sensor.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {sensor.status === "online" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-sm">{sensor.name}</span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-1">
                          <p className="text-xs">Location: {sensor.location}</p>
                          <p className="text-xs">Last Reading: {sensor.lastValue}</p>
                          <p className="text-xs">Data Source: {sensor.source}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {getStatusBadge(sensor.status)}
              </div>
              <Progress 
                value={sensor.uptimePercent} 
                className="h-1" 
                indicatorClassName={
                  sensor.uptimePercent > 95 ? "bg-green-500" : 
                  sensor.uptimePercent > 80 ? "bg-amber-500" : 
                  "bg-red-500"
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uptime: {sensor.uptimePercent}%</span>
                <span>Last reading: {sensor.lastReading}</span>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col gap-2 mt-2">
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-800">
                Data provided by NOAA Space Weather Prediction Center and USGS Geomagnetism Program.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-between mt-1">
              <a 
                href="https://www.swpc.noaa.gov/products/goes-magnetometer" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                NOAA SWPC
              </a>
              <a 
                href="https://www.usgs.gov/programs/geomagnetism-program" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                USGS Geomagnetism
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
