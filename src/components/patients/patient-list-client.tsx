
"use client";

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Patient } from '@/lib/types';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { patients as mockPatients } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BarChart2, FileText } from 'lucide-react';
import Link from 'next/link';
import { ReportDialog } from './report-dialog';

interface PatientListClientProps {
  patients: Patient[];
  userId?: string;
}

export function PatientListClient({ patients, userId }: PatientListClientProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!firestore || !userId) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be signed in to seed data.",
        });
        return;
    }
    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      const userPatientsCollection = collection(firestore, 'users', userId, 'patients');
      
      mockPatients.forEach(patient => {
        const docRef = doc(userPatientsCollection);
        batch.set(docRef, patient);
      });

      await batch.commit();

      toast({
        title: "Data Seeded Successfully",
        description: "The initial patient data has been loaded for your user.",
      });
    } catch (error) {
      console.error("Error seeding data:", error);
      toast({
        variant: "destructive",
        title: "Error Seeding Data",
        description: "Could not load initial patient data. Check the console for details.",
      });
    } finally {
      setIsSeeding(false);
    }
  };
  
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
        <h3 className="text-xl font-semibold">No Patient Data Found</h3>
        <p className="text-muted-foreground">Your patient list is empty.</p>
        <Button onClick={handleSeedData} disabled={isSeeding || !userId}>
          {isSeeding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...</> : 'Seed Initial Data'}
        </Button>
      </div>
    )
  }

  return (
    <>
    <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/patients/add-patient">Add New Patient</Link>
        </Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead className="text-right">Age</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id} className="group">
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{patient.condition}</Badge>
            </TableCell>
            <TableCell className="text-right">{patient.age}</TableCell>
            <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/patients/${patient.id}`)}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        View Charts
                    </Button>
                    <ReportDialog patient={patient} asTrigger={
                        <Button variant="ghost" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View Report
                        </Button>
                    } />
                </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
