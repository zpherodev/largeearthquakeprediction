
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--muted-foreground))",
  accent: "hsl(var(--accent-foreground))",
};

interface MagneticChartProps {
  title: string;
  description: string;
}

// Simulated magnetic field data
function generateMagneticData(length: number, baseline: number = 100) {
  const data = [];
  let value = baseline;
  const now = new Date();

  for (let i = length - 1; i >= 0; i--) {
    // Add some randomness plus occasional spikes
    const spikeProbability = 0.05;
    const isSpike = Math.random() < spikeProbability;
    
    const randomChange = (Math.random() - 0.5) * 10;
    const spikeAmount = isSpike ? (Math.random() * 50 - 25) : 0;
    
    value = value + randomChange + spikeAmount;
    value = Math.max(50, Math.min(150, value)); // Keep within reasonable bounds
    
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i * 5); // 5 minutes intervals
    
    data.push({
      timestamp: date.toISOString(),
      label: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
      value: value.toFixed(2)
    });
  }

  return data;
}

export function MagneticChart({ title, description }: MagneticChartProps) {
  const [data, setData] = useState(() => generateMagneticData(30));

  // Update data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newData = [...currentData.slice(1)];
        const lastValue = parseFloat(currentData[currentData.length - 1].value);
        
        const now = new Date();
        const randomChange = (Math.random() - 0.5) * 10;
        const spikeProbability = 0.05;
        const isSpike = Math.random() < spikeProbability;
        const spikeAmount = isSpike ? (Math.random() * 50 - 25) : 0;
        
        let newValue = lastValue + randomChange + spikeAmount;
        newValue = Math.max(50, Math.min(150, newValue));
        
        newData.push({
          timestamp: now.toISOString(),
          label: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
          value: newValue.toFixed(2)
        });
        
        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
