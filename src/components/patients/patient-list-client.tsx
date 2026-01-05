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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Patient } from '@/lib/types';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch } from 'firebase/firestore';
import { patients as mockPatients } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PatientListClientProps {
  patients: Patient[];
}

export function PatientListClient({ patients }: PatientListClientProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  const handleSeedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      const patientsCollection = collection(firestore, 'patients');
      
      mockPatients.forEach(patient => {
        // We let Firestore generate the document ID by not specifying it
        const docRef = collection(patientsCollection).doc();
        batch.set(docRef, patient);
      });

      await batch.commit();

      toast({
        title: "Data Seeded Successfully",
        description: "The initial patient data has been loaded into Firestore.",
      });
      // The useCollection hook will automatically update the UI
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
        <p className="text-muted-foreground">Your Firestore database appears to be empty.</p>
        <Button onClick={handleSeedData} disabled={isSeeding}>
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
          <TableHead className="w-[80px]">Avatar</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead className="text-right">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id} onClick={() => handleRowClick(patient.id)} className="cursor-pointer">
            <TableCell>
              <Avatar>
                <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.dataAiHint} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{patient.condition}</Badge>
            </TableCell>
            <TableCell className="text-right">{patient.age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
