

"use client";

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Target, LineChart, Activity, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCharts } from '@/components/patients/progress-charts';
import { ReportDialog } from '@/components/patients/report-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Patient } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Move3d } from '@/components/ui/move-3d';
import { Button } from '@/components/ui/button';

export default function PatientDetailPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const params = useParams();
  const patientId = params.id as string;

  const patientRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !patientId) return null;
    return doc(firestore, 'users', user.uid, 'patients', patientId);
  }, [firestore, user, patientId]);

  const { data: patient, isLoading } = useDoc<Patient>(patientRef);

  const { latestSession, maxRom, peakResistance, peakMuscleLoad } = useMemo(() => {
    if (!patient || !patient.sessions || patient.sessions.length === 0) {
      return { latestSession: null, maxRom: 0, peakResistance: 0, peakMuscleLoad: 0 };
    }

    const sortedSessions = [...patient.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sortedSessions[0];
    const maxRom = latest ? Math.max(0, ...latest.data.map(d => d.rangeOfMotion)) : 0;
    const peakResistance = latest ? Math.max(0, ...latest.data.map(d => d.robotResistance)) : 0;
    const peakMuscleLoad = latest ? Math.max(0, ...latest.data.map(d => d.muscleLoad)) : 0;

    return { latestSession: latest, maxRom, peakResistance, peakMuscleLoad };
  }, [patient]);
  
  if (isLoading) {
    return <PatientDetailSkeleton />;
  }

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-start gap-6 sm:flex-row">
           <div className="flex-1">
             <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">{patient.name}</CardTitle>
                <ReportDialog patient={patient} asTrigger={
                  <Button variant="outline">
                    View Report
                  </Button>
                } />
             </div>
             <CardDescription className="mt-1 text-base">{patient.condition}</CardDescription>
             <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Age: {patient.age}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{patient.sessions?.length || 0} sessions completed</span>
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
            {latestSession && (
                <>
                <Separator className="my-6" />
                <div>
                    <h3 className="mb-4 flex items-center text-lg font-semibold"><LineChart className="mr-2 h-5 w-5 text-primary" /> Latest Session KPIs</h3>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Max Range of Motion</CardTitle>
                                <Move3d className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{maxRom}°</div>
                                <p className="text-xs text-muted-foreground">on {format(new Date(latestSession.date), 'MMM d')}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Peak Resistance</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{peakResistance}%</div>
                                 <p className="text-xs text-muted-foreground">on {format(new Date(latestSession.date), 'MMM d')}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Peak Muscle Load</CardTitle>
                                <Heart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{peakMuscleLoad}%</div>
                                 <p className="text-xs text-muted-foreground">on {format(new Date(latestSession.date), 'MMM d')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                </>
            )}
        </CardContent>
      </Card>

      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">Progress Analysis</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>
        <TabsContent value="progress">
          <ProgressCharts sessions={patient.sessions || []} />
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
                  {(patient.sessions || []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(session => {
                    const maxRom = Math.max(0,...session.data.map(d => d.rangeOfMotion));
                    const peakResistance = Math.max(0,...session.data.map(d => d.robotResistance));
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


function PatientDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
            <div className="mt-4 flex items-center gap-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
       <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">Progress Analysis</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>
        </Tabs>
    </div>
  )
}
