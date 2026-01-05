"use client";

import React from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { SessionDataPoint } from '@/lib/types';

interface LiveDataChartsProps {
  data: SessionDataPoint[];
}

const chartConfig = {
  heartRate: {
    label: "Heart Rate (bpm)",
    color: "hsl(var(--chart-1))",
  },
  muscleLoad: {
    label: "Muscle Load (%)",
    color: "hsl(var(--chart-2))",
  },
};

export function LiveDataCharts({ data }: LiveDataChartsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Biometrics</CardTitle>
        <CardDescription>Real-time patient data from the current session.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
            <div className="grid gap-6">
                <div className="h-[200px] w-full">
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Heart Rate</h4>
                    <ChartContainer config={chartConfig}>
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: -10 }}>
                        <defs>
                            <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-heartRate)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-heartRate)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} tick={false} axisLine={false} />
                        <YAxis domain={[60, 130]} unit="bpm" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="heartRate" stroke="var(--color-heartRate)" fillOpacity={1} fill="url(#colorHeartRate)" />
                    </AreaChart>
                    </ChartContainer>
                </div>
                 <div className="h-[200px] w-full">
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Muscle Load</h4>
                    <ChartContainer config={chartConfig}>
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: -10 }}>
                        <defs>
                            <linearGradient id="colorMuscleLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-muscleLoad)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-muscleLoad)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} tick={false} axisLine={false} />
                        <YAxis domain={[0, 100]} unit="%" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="muscleLoad" stroke="var(--color-muscleLoad)" fillOpacity={1} fill="url(#colorMuscleLoad)" />
                    </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            <p>Waiting for session data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
