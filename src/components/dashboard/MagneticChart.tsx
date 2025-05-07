
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getMagneticData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--muted-foreground))",
  accent: "hsl(var(--accent-foreground))",
};

interface MagneticChartProps {
  title: string;
  description: string;
}

export function MagneticChart({ title, description }: MagneticChartProps) {
  const { data: magneticData, isLoading, error, refetch } = useQuery({
    queryKey: ['magneticData'],
    queryFn: getMagneticData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleRefresh = async () => {
    toast.info("Refreshing magnetic data...");
    await refetch();
  };

  // Log the data we received for debugging
  useEffect(() => {
    if (magneticData) {
      console.log("MagneticChart data:", magneticData);
    }
    if (error) {
      console.error("MagneticChart error:", error);
    }
  }, [magneticData, error]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-red-500">Error loading magnetic data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = magneticData?.data || [];
  const hasData = Array.isArray(chartData) && chartData.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <div className="text-muted-foreground mb-4">No magnetic data available</div>
            <Button onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="label" 
                tickLine={false}
                tickMargin={10}
                minTickGap={30}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[50, 150]} 
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value}nT`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--background)", borderRadius: "0.5rem", border: "1px solid var(--border)" }}
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value) => [`${value} nT`, "Magnetic Field"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2, fill: "var(--background)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
