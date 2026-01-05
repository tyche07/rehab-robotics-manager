
"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Session } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface ProgressChartsProps {
  sessions: Session[];
}

const chartConfig = {
  rangeOfMotion: {
    label: "Range of Motion (°)",
    color: "hsl(var(--chart-1))",
  },
  robotResistance: {
    label: "Robot Resistance (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ProgressCharts({ sessions }: ProgressChartsProps) {
  const chartData = sessions
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map(session => ({
    date: format(new Date(session.date), 'MMM d'),
    rangeOfMotion: Math.max(0, ...session.data.map(d => d.rangeOfMotion)),
    robotResistance: Math.max(0, ...session.data.map(d => d.robotResistance)),
  }));

  if (sessions.length === 0) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground"><p>No session data available to display charts.</p></div>
  }

  return (
     <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Visualizing patient progress over recent sessions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="h-[300px] w-full">
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Max Range of Motion</h4>
                    <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis unit="°" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="rangeOfMotion" fill="var(--color-rangeOfMotion)" radius={4} />
                    </BarChart>
                    </ChartContainer>
                </div>
                <div className="h-[300px] w-full">
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Peak Robot Resistance</h4>
                    <ChartContainer config={chartConfig}>
                    <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis unit="%" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line dataKey="robotResistance" type="monotone" stroke="var(--color-robotResistance)" strokeWidth={2} dot={true} />
                    </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
