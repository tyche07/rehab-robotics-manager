"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionControls } from '@/components/dashboard/session-controls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { patients } from '@/lib/data';
import type { Patient } from '@/lib/types';
import { LiveDataCharts } from '@/components/dashboard/live-data-charts';

export default function DashboardPage() {
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(patients[0]?.id ?? null);
  const [sessionData, setSessionData] = React.useState<any[]>([]);

  const selectedPatient = React.useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [selectedPatientId]);

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Session Monitor</CardTitle>
          <div className="w-full max-w-xs">
            <Select onValueChange={setSelectedPatientId} defaultValue={selectedPatientId ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient: Patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedPatient ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
               <div className="xl:col-span-2">
                 <SessionControls patient={selectedPatient} onDataPoint={setSessionData} />
               </div>
               <div className="xl:col-span-1">
                  <LiveDataCharts data={sessionData} />
               </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <p>Please select a patient to start a session.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
