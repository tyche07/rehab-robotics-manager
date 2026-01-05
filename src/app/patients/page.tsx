import { patients } from '@/lib/data';
import { PatientListClient } from '@/components/patients/patient-list-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientsPage() {
  // In a real app, you would fetch this data from an API
  const patientData = patients;

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>View and manage patient profiles and therapy progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientListClient patients={patientData} />
        </CardContent>
      </Card>
    </div>
  );
}
