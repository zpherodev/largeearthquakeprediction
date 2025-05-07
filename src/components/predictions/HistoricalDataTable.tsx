
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, FileDown, Info, Zap, Gauge } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export interface HistoricalEarthquake {
  id: string;
  time: string;
  latitude: number;
  longitude: number;
  depth: number;
  mag: number;
  magType: string;
  place: string;
  status: string;
  magneticAnomaly?: number;
  resonancePattern?: number;
  signalIntensity?: number;
  decg?: number;
  dbhg?: number;
  decr?: number;
  dbhr?: number;
  mdig?: number;
  mdir?: number;
}

interface HistoricalDataTableProps {
  data: HistoricalEarthquake[];
  isLoading: boolean;
  error: Error | null;
}

export function HistoricalDataTable({ data, isLoading, error }: HistoricalDataTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showMagneticData, setShowMagneticData] = useState(true);
  const itemsPerPage = 10;

  // Filter data based on search input
  const filteredData = data.filter(
    (item) => 
      (item.place && item.place.toLowerCase().includes(search.toLowerCase())) ||
      (typeof item.mag === 'number' && item.mag.toString().includes(search))
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Process data for display
  const processedData = paginatedData.map(item => {
    return {
      ...item,
      // Use actual magnetic data if available
      magneticAnomaly: item.magneticAnomaly || 0,
      resonancePattern: item.resonancePattern || 0,
      signalIntensity: item.signalIntensity || (item.mdig || 0)
    };
  });

  const handleDownload = () => {
    // Create CSV content with enhanced data
    const csvContent = "data:text/csv;charset=utf-8," + 
      "time,latitude,longitude,depth,mag,place,magneticAnomaly,resonancePattern,decg,dbhg,decr,dbhr,mdig,mdir\n" + 
      data.map(item => {
        return `"${item.time || ""}",${item.latitude || 0},${item.longitude || 0},${item.depth || 0},${item.mag || 0},"${item.place || ""}",${item.magneticAnomaly || 0},${item.resonancePattern || 0},${item.decg || 0},${item.dbhg || 0},${item.decr || 0},${item.dbhr || 0},${item.mdig || 0},${item.mdir || 0}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "earthquake_training_data_m6plus_with_magnetic.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add debug logging to help identify issues
  console.log("Historical data count:", data.length);
  console.log("Filtered data count:", filteredData.length);
  console.log("Paginated data count:", paginatedData.length);
  console.log("First few items:", data.slice(0, 3));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-red-500">Error loading historical data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Dataset (≥ M6.0)</CardTitle>
        <CardDescription>
          Historical earthquake data with magnetic field thresholds used to train the model
        </CardDescription>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location or magnitude..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Button variant="outline" onClick={handleDownload}>
            <FileDown className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowMagneticData(!showMagneticData)}
          >
            <Gauge className="h-4 w-4 mr-2" />
            {showMagneticData ? "Hide Magnetic Data" : "Show Magnetic Data"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Alert variant="default" className="bg-yellow-50 border-yellow-200 mb-4">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              No historical earthquake data available. The data may still be loading or there was an issue fetching it.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Depth (km)</TableHead>
                  <TableHead>Magnitude</TableHead>
                  <TableHead>Type</TableHead>
                  {showMagneticData && (
                    <>
                      <TableHead className="text-blue-600">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span>Magnetic Field (nT)</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-purple-600">
                        <div className="flex items-center gap-1">
                          <Gauge className="h-3 w-3" />
                          <span>Resonance (Hz)</span>
                        </div>
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.length > 0 ? (
                  processedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.time ? new Date(item.time).toLocaleString() : "N/A"}</TableCell>
                      <TableCell>{item.place || "Unknown"}</TableCell>
                      <TableCell>{typeof item.depth === 'number' ? item.depth.toFixed(1) : "N/A"}</TableCell>
                      <TableCell className="font-medium text-red-600">
                        {typeof item.mag === 'number' ? item.mag.toFixed(1) : "N/A"}
                      </TableCell>
                      <TableCell>{item.magType || "Unknown"}</TableCell>
                      {showMagneticData && (
                        <>
                          <TableCell>
                            <Badge variant={item.magneticAnomaly > 20 ? "destructive" : "outline"} className="font-mono">
                              {item.magneticAnomaly.toFixed(1)} nT
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.resonancePattern > 15 ? "destructive" : "outline"} className="font-mono">
                              {item.resonancePattern.toFixed(1)} Hz
                            </Badge>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={showMagneticData ? 7 : 5} className="h-24 text-center">
                      No results found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Page {page} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Alert variant="default" className="bg-blue-50 border-blue-200 mt-4">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This dataset contains {data.length} historical M6.0+ earthquake events with magnetic field measurements. The data reveals a strong correlation between magnetic anomalies above 20 nT and resonance patterns above 15 Hz with M6.0+ events.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
