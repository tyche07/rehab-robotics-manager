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
import type { Patient, SessionDataPoint } from '@/lib/types';
import { LiveDataCharts } from '@/components/dashboard/live-data-charts';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);
  const [sessionData, setSessionData] = React.useState<SessionDataPoint[]>([]);

  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();

  const patientsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    // Query the 'patients' subcollection under the current user's document
    return query(collection(firestore, 'users', user.uid, 'patients'));
  }, [firestore, user]);

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

  const isLoading = isAuthLoading || isLoadingPatients;

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Session Monitor</CardTitle>
          <div className="w-full max-w-xs">
            {isLoading ? (
               <Skeleton className="h-10 w-full" />
            ) : (
              <Select onValueChange={setSelectedPatientId} value={selectedPatientId ?? ''} disabled={!patients || patients.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={!patients || patients.length === 0 ? "Please add a patient" : "Select a patient..."} />
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
             <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
               <div className="lg:col-span-3">
                 <SessionControls 
                    patient={selectedPatient} 
                    sessionData={sessionData}
                    onDataPoint={setSessionData} />
               </div>
               <div className="lg:col-span-2">
                  <LiveDataCharts data={sessionData} />
               </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-64" />
                </>
              ):  
              (!patients || patients.length === 0) ? <p>No patients found. Please add a patient on the Patients page.</p> :
              <p>Please select a patient to start a session.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
