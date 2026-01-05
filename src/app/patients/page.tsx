"use client";

import { PatientListClient } from '@/components/patients/patient-list-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import type { Patient } from '@/lib/types';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();

  const patientsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'patients'));
  }, [firestore, user]);

  const { data: patients, isLoading: isLoadingPatients } = useCollection<Patient>(patientsQuery);
  const isLoading = isAuthLoading || isLoadingPatients;

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
            <PatientListClient patients={patients || []} userId={user?.uid} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
