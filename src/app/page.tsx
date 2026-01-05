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
import type { Patient } from '@/lib/types';
import { LiveDataCharts } from '@/components/dashboard/live-data-charts';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);
  const [sessionData, setSessionData] = React.useState<any[]>([]);

  const firestore = useFirestore();

  // In a real app, you'd scope this to the logged-in user.
  // For this demo, we'll fetch all patients.
  const patientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'patients'));
  }, [firestore]);

  const { data: patients, isLoading: isLoadingPatients } = useCollection<Patient>(patientsQuery);

  const selectedPatient = React.useMemo(() => {
    return patients?.find(p => p.id === selectedPatientId) || null;
  }, [selectedPatientId, patients]);

  // Auto-select the first patient once data is loaded
  React.useEffect(() => {
    if (patients && patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Session Monitor</CardTitle>
          <div className="w-full max-w-xs">
            {isLoadingPatients ? (
               <Skeleton className="h-10 w-full" />
            ) : (
              <Select onValueChange={setSelectedPatientId} value={selectedPatientId ?? ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients?.map((patient: Patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
              {isLoadingPatients ? <p>Loading patients...</p> : <p>Please select a patient to start a session.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
