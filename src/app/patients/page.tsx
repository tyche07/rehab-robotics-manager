"use client";

import { PatientListClient } from '@/components/patients/patient-list-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Patient } from '@/lib/types';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientsPage() {
  const firestore = useFirestore();

  // In a real app, you would scope this to the logged-in user.
  // For this demo, we'll fetch all patients.
  const patientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'patients'));
  }, [firestore]);

  const { data: patients, isLoading } = useCollection<Patient>(patientsQuery);

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>View and manage patient profiles and therapy progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <PatientListClient patients={patients || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
