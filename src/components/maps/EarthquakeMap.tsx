
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

// Using a placeholder for the map as we can't directly integrate mapping libraries
export function EarthquakeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRegion, setActiveRegion] = useState(0);

  const regions = [
    { name: "San Andreas Fault", risk: "moderate", coordinates: "34.0522° N, 118.2437° W" },
    { name: "Cascadia Subduction Zone", risk: "low", coordinates: "45.5051° N, 122.6750° W" },
    { name: "New Madrid Fault Zone", risk: "minimal", coordinates: "36.5707° N, 89.1089° W" },
  ];

  const nextRegion = () => {
    setActiveRegion((prev) => (prev + 1) % regions.length);
  };

  const prevRegion = () => {
    setActiveRegion((prev) => (prev - 1 + regions.length) % regions.length);
  };

  useEffect(() => {
    // This is where we would initialize a map library
    // For now, we'll just simulate a map loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
  }, []);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-500">High Risk</Badge>;
      case "moderate":
        return <Badge className="bg-amber-500">Moderate Risk</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low Risk</Badge>;
      case "minimal":
        return <Badge className="bg-green-500">Minimal Risk</Badge>;
      default:
        return <Badge className="bg-slate-500">Unknown</Badge>;
    }
  };

  return (
    <Card className="col-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Earthquake Risk Map</CardTitle>
          <CardDescription>Geographic visualization of potential seismic events</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-5rem)]">
        <div ref={mapRef} className="bg-slate-100 dark:bg-slate-800 h-full w-full relative rounded-b-lg overflow-hidden">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {mapLoaded && (
            <>
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-2">Map Placeholder</p>
                  <p className="text-xs text-muted-foreground">
                    In a real implementation, this would display a map with earthquake risk indicators 
                    based on magnetic field readings and predictions from the model.
                  </p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={prevRegion}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <h3 className="font-medium">{regions[activeRegion].name}</h3>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{regions[activeRegion].coordinates}</span>
                      {getRiskBadge(regions[activeRegion].risk)}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={nextRegion}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
