import { notFound } from 'next/navigation';
import { patients } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { List, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCharts } from '@/components/patients/progress-charts';
import { ReportDialog } from '@/components/patients/report-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-start gap-6 sm:flex-row">
           <Avatar className="h-24 w-24 border">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.dataAiHint} />
              <AvatarFallback className="text-3xl">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
           </Avatar>
           <div className="flex-1">
             <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">{patient.name}</CardTitle>
                <ReportDialog patient={patient} />
             </div>
             <CardDescription className="mt-1 text-base">{patient.condition}</CardDescription>
             <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Age: {patient.age}</span>
             </div>
           </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <h3 className="mb-2 flex items-center text-lg font-semibold"><List className="mr-2 h-5 w-5 text-primary" /> Medical History</h3>
                    <p className="text-sm text-muted-foreground">{patient.medicalHistory}</p>
                </div>
                 <div>
                    <h3 className="mb-2 flex items-center text-lg font-semibold"><Target className="mr-2 h-5 w-5 text-primary" /> Therapy Goals</h3>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                       {patient.therapyGoals.map((goal, index) => <li key={index}>{goal}</li>)}
                    </ul>
                </div>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">Progress Analysis</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Visualizing patient progress over recent sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressCharts sessions={patient.sessions} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
           <Card>
            <CardHeader>
              <CardTitle>Session Log</CardTitle>
              <CardDescription>A detailed history of all therapy sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Max ROM</TableHead>
                    <TableHead>Peak Resistance</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.sessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(session => {
                    const maxRom = Math.max(...session.data.map(d => d.rangeOfMotion));
                    const peakResistance = Math.max(...session.data.map(d => d.robotResistance));
                    return (
                      <TableRow key={session.id}>
                        <TableCell>{format(new Date(session.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{session.duration} min</TableCell>
                        <TableCell>{maxRom}°</TableCell>
                        <TableCell>{peakResistance}%</TableCell>
                        <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
