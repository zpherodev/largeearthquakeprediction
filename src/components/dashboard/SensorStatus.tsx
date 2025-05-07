
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Server, AlertTriangle, CheckCircle } from "lucide-react";

interface SensorStatusProps {
  className?: string;
}

export function SensorStatus({ className }: SensorStatusProps) {
  // In a real app, this would be fetched from an API
  const sensors = [
    { id: 1, name: "EMAG-West", status: "online", uptimePercent: 99.8, lastReading: "12:42 PM" },
    { id: 2, name: "EMAG-Central", status: "online", uptimePercent: 100, lastReading: "12:45 PM" },
    { id: 3, name: "EMAG-East", status: "warning", uptimePercent: 89.2, lastReading: "12:32 PM" },
    { id: 4, name: "EMAG-North", status: "online", uptimePercent: 99.5, lastReading: "12:44 PM" },
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

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md">Sensor Network Status</CardTitle>
          <CardDescription>Real-time status of magnetic field sensors</CardDescription>
        </div>
        <Server className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Overall Network Status</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">97.1% Uptime</Badge>
          </div>

          {sensors.map((sensor) => (
            <div key={sensor.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {sensor.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {sensor.status === "online" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className="text-sm">{sensor.name}</span>
                </div>
                {getStatusBadge(sensor.status)}
              </div>
              <Progress value={sensor.uptimePercent} className="h-1" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uptime: {sensor.uptimePercent}%</span>
                <span>Last reading: {sensor.lastReading}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
