"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Session } from '@/lib/types';
import { format } from 'date-fns';

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
    rangeOfMotion: Math.max(...session.data.map(d => d.rangeOfMotion)),
    robotResistance: Math.max(...session.data.map(d => d.robotResistance)),
  }));

  if (sessions.length === 0) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground"><p>No session data available to display charts.</p></div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Max Range of Motion per Session</h3>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis unit="°" />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="rangeOfMotion" fill="var(--color-rangeOfMotion)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Peak Robot Resistance per Session</h3>
         <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
  );
}
