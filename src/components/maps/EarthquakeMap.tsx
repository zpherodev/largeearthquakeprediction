
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Using a placeholder for the map as we can't directly integrate mapping libraries
export function EarthquakeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // This is where we would initialize a map library
    // For now, we'll just simulate a map loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
  }, []);

  return (
    <Card className="col-span-2 h-full">
      <CardHeader>
        <CardTitle>Earthquake Risk Map</CardTitle>
        <CardDescription>Geographic visualization of potential seismic events</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-5rem)]">
        <div ref={mapRef} className="bg-slate-100 dark:bg-slate-800 h-full w-full relative rounded-b-lg overflow-hidden">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {mapLoaded && (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground mb-2">Map Placeholder</p>
                <p className="text-xs text-muted-foreground">
                  In a real implementation, this would display a map with earthquake risk indicators 
                  based on magnetic field readings and predictions from the model.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
