
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, FileDown, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HistoricalEarthquake {
  id: string;
  time: string;
  latitude: number;
  longitude: number;
  depth: number;
  mag: number;
  magType: string;
  place: string;
  status: string;
}

interface HistoricalDataTableProps {
  data: HistoricalEarthquake[];
  isLoading: boolean;
  error: Error | null;
}

export function HistoricalDataTable({ data, isLoading, error }: HistoricalDataTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  const filteredData = data.filter(
    (item) => 
      item.place.toLowerCase().includes(search.toLowerCase()) ||
      item.mag.toString().includes(search)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = () => {
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," + 
      "time,latitude,longitude,depth,mag,magType,place,status\n" + 
      data.map(item => 
        `${item.time},${item.latitude},${item.longitude},${item.depth},${item.mag},${item.magType},"${item.place}",${item.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "earthquake_training_data_m6plus.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          Historical earthquake data used to train the model
        </CardDescription>
        <div className="flex items-center gap-2 mt-4">
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
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Depth (km)</TableHead>
              <TableHead>Magnitude</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.time).toLocaleString()}</TableCell>
                  <TableCell>{item.place}</TableCell>
                  <TableCell>{item.depth.toFixed(1)}</TableCell>
                  <TableCell className="font-medium text-red-600">
                    {item.mag.toFixed(1)}
                  </TableCell>
                  <TableCell>{item.magType}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
            This dataset contains {data.length} historical M6.0+ earthquake events used for training the earthquake prediction model.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
