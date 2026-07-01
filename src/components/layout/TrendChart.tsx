"use client";

import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendChartProps {
  data: { clock_in: string }[];
}

export function TrendChart({ data }: TrendChartProps) {
  // Group by day
  const dailyCount: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dailyCount[format(date, "yyyy-MM-dd")] = 0;
  }

  data.forEach((att) => {
    const day = format(new Date(att.clock_in), "yyyy-MM-dd");
    if (dailyCount[day] !== undefined) {
      dailyCount[day]++;
    }
  });

  const chartData = Object.entries(dailyCount).map(([date, count]) => ({
    date,
    label: format(new Date(date), "EEE"),
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Absensi 7 Hari Terakhir</CardTitle>
        <CardDescription>Jumlah clock-in per hari</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(value: unknown) => [`${value} clock-in`, "Jumlah"]}
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.date
                    ? format(new Date(payload[0].payload.date), "dd MMM yyyy")
                    : label
                }
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
