import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin, AlertTriangle } from "lucide-react";

export function EarthquakeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRegion, setActiveRegion] = useState(0);
  const [zoom, setZoom] = useState(1);

  const regions = [
    { 
      name: "San Andreas Fault - Northern Section", 
      risk: "high", 
      coordinates: "37.7749° N, 122.4194° W",
      anomalyLevel: 72,
      lastActivity: "2 days ago"
    },
    { 
      name: "San Andreas Fault - Central Section", 
      risk: "high", 
      coordinates: "35.3733° N, 120.4522° W",
      anomalyLevel: 68,
      lastActivity: "3 days ago"
    },
    { 
      name: "San Andreas Fault - Southern Section", 
      risk: "moderate", 
      coordinates: "33.9416° N, 116.8111° W",
      anomalyLevel: 58,
      lastActivity: "5 days ago"
    },
    { 
      name: "Cascadia Subduction Zone - North", 
      risk: "moderate", 
      coordinates: "48.3895° N, 124.6351° W",
      anomalyLevel: 48,
      lastActivity: "1 week ago"
    },
    { 
      name: "Cascadia Subduction Zone - South", 
      risk: "moderate", 
      coordinates: "42.8865° N, 124.5641° W",
      anomalyLevel: 42,
      lastActivity: "2 weeks ago"
    },
    { 
      name: "New Madrid Fault Zone", 
      risk: "minimal", 
      coordinates: "36.5707° N, 89.1089° W",
      anomalyLevel: 12,
      lastActivity: "8 months ago"
    },
    { 
      name: "Aleutian Islands - Western", 
      risk: "low", 
      coordinates: "52.8222° N, 173.1686° W",
      anomalyLevel: 32,
      lastActivity: "3 weeks ago"
    },
    { 
      name: "Aleutian Islands - Eastern", 
      risk: "low", 
      coordinates: "56.8083° N, 157.3960° W",
      anomalyLevel: 28,
      lastActivity: "1 month ago"
    },
    { 
      name: "Ring of Fire - Japan (Kanto)", 
      risk: "high", 
      coordinates: "35.6762° N, 139.6503° E",
      anomalyLevel: 64,
      lastActivity: "2 days ago"
    },
    { 
      name: "Ring of Fire - Japan (Tohoku)", 
      risk: "moderate", 
      coordinates: "38.2682° N, 140.8694° E",
      anomalyLevel: 45,
      lastActivity: "6 days ago"
    },
    { 
      name: "Ring of Fire - Japan (Kyushu)", 
      risk: "moderate", 
      coordinates: "33.5904° N, 130.4017° E",
      anomalyLevel: 40,
      lastActivity: "1 week ago"
    },
    { 
      name: "Denali Fault System", 
      risk: "low", 
      coordinates: "63.1148° N, 151.1926° W",
      anomalyLevel: 22,
      lastActivity: "2 months ago"
    },
  ];

  const nextRegion = () => {
    setActiveRegion((prev) => (prev + 1) % regions.length);
  };

  const prevRegion = () => {
    setActiveRegion((prev) => (prev - 1 + regions.length) % regions.length);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  useEffect(() => {
    // This simulates loading a map
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
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

  // Generate map markers based on all regions
  const renderMapMarkers = () => {
    return regions.map((region, index) => {
      const isActive = index === activeRegion;
      
      // Calculate position based on coordinates
      // Converting coordinates to relative positions (simplified for visualization)
      const coordinates = region.coordinates.split(", ");
      const latStr = coordinates[0];
      const lngStr = coordinates[1];
      
      // Extract numeric values and direction (N/S/E/W)
      const latVal = parseFloat(latStr.substring(0, latStr.length - 3));
      const latDir = latStr.slice(-1);
      const lngVal = parseFloat(lngStr.substring(0, lngStr.length - 3));
      const lngDir = lngStr.slice(-1);
      
      // Normalize to 0-100 range (simplified mapping)
      // North is up, East is right
      let left, top;
      
      // Northern hemisphere (N) is top half, Southern (S) is bottom half
      if (latDir === 'N') {
        top = 50 - (latVal / 90 * 50); // 0 at equator, lower values as we go north
      } else {
        top = 50 + (latVal / 90 * 50); // 0 at equator, higher values as we go south
      }
      
      // Western hemisphere (W) is left half, Eastern (E) is right half
      if (lngDir === 'W') {
        left = 50 - (lngVal / 180 * 50); // 0 at prime meridian, lower values as we go west
      } else {
        left = 50 + (lngVal / 180 * 50); // 0 at prime meridian, higher values as we go east
      }
      
      // Apply some offset for better visual distribution
      left = Math.max(5, Math.min(95, left));
      top = Math.max(5, Math.min(95, top));
      
      return (
        <div 
          key={index}
          className={`absolute transition-all duration-300 ${isActive ? 'z-10' : 'z-0'}`} 
          style={{ left: `${left}%`, top: `${top}%` }}
        >
          <div 
            className={`
              flex flex-col items-center 
              ${isActive ? 'scale-125' : 'scale-100'} 
              transition-all duration-300 cursor-pointer
            `}
            onClick={() => setActiveRegion(index)}
          >
            <MapPin 
              className={`
                ${isActive ? 'text-red-500' : 'text-gray-500'}
                ${region.risk === 'high' ? 'animate-pulse' : ''}
              `} 
              size={isActive ? 32 : 24} 
              strokeWidth={isActive ? 2.5 : 1.5}
              fill={region.risk === 'high' ? 'rgba(255,0,0,0.2)' : 'transparent'}
            />
            {isActive && (
              <div className="absolute -top-12 bg-background border border-border rounded-md p-2 shadow-lg whitespace-nowrap">
                {region.name}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <Card className="col-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Earthquake Risk Map</CardTitle>
          <CardDescription>Geographic visualization of potential seismic events</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-5rem)]">
        <div 
          ref={mapRef} 
          className="bg-slate-100 dark:bg-slate-800 h-full w-full relative rounded-b-lg overflow-hidden"
          style={{ transform: `scale(${zoom})` }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {mapLoaded && (
            <>
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
                  {/* Fault Lines */}
                  <path
                    d="M250,150 Q300,200 350,150 T450,200"
                    className="text-red-500"
                    strokeDasharray="5,5"
                    strokeWidth="2"
                  />
                  <path
                    d="M550,250 Q600,300 650,250"
                    className="text-amber-500"
                    strokeDasharray="5,5"
                    strokeWidth="2"
                  />
                  <path
                    d="M750,200 Q800,250 850,200"
                    className="text-blue-500"
                    strokeDasharray="5,5"
                    strokeWidth="2"
                  />
                  
                  {/* Grid lines */}
                  <line x1="0" y1="250" x2="1000" y2="250" className="text-slate-300 dark:text-slate-700" strokeDasharray="5,5" strokeWidth="0.5" />
                  <line x1="500" y1="0" x2="500" y2="500" className="text-slate-300 dark:text-slate-700" strokeDasharray="5,5" strokeWidth="0.5" />
                </svg>
              </div>
              
              {/* Render the interactive map markers */}
              <div className="absolute inset-0 transition-transform duration-300">
                {renderMapMarkers()}
              </div>
              
              {/* Alert indicators for high risk areas */}
              {regions.some(r => r.risk === 'high') && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 bg-red-500/20 border border-red-500 rounded-full px-3 py-1 text-xs animate-pulse">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-red-500 font-medium">Active Alert</span>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={prevRegion}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <h3 className="font-medium">{regions[activeRegion].name}</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{regions[activeRegion].coordinates}</span>
                      {getRiskBadge(regions[activeRegion].risk)}
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Anomaly:</span>
                        <span className={`font-medium ${regions[activeRegion].anomalyLevel > 50 ? 'text-red-500' : regions[activeRegion].anomalyLevel > 30 ? 'text-amber-500' : 'text-green-500'}`}>
                          {regions[activeRegion].anomalyLevel}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Last Activity:</span>
                        <span className="font-medium">{regions[activeRegion].lastActivity}</span>
                      </div>
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
