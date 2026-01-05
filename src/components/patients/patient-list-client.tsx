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

interface PatientListClientProps {
  patients: Patient[];
}

export function PatientListClient({ patients }: PatientListClientProps) {
  const router = useRouter();

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  return (
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
  );
}
