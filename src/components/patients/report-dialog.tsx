"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Printer } from 'lucide-react';
import type { Patient } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';

interface ReportDialogProps {
  patient: Patient;
}

export function ReportDialog({ patient }: ReportDialogProps) {
  const latestSession = patient.sessions.length > 0 ? patient.sessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Therapy Progress Report</DialogTitle>
          <DialogDescription>
            Patient: {patient.name} | Report Date: {format(new Date(), 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Patient Summary</h3>
            <p className="text-sm text-muted-foreground">
              <strong>{patient.name}</strong>, age {patient.age}, is undergoing therapy for <strong>{patient.condition}</strong>.
            </p>
            
            <Separator />
            
            <h3 className="font-semibold text-lg">Therapy Goals</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {patient.therapyGoals.map((goal, index) => <li key={index}>{goal}</li>)}
            </ul>

            <Separator />
            
            <h3 className="font-semibold text-lg">Latest Session Details</h3>
            {latestSession ? (
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Date:</strong> {format(new Date(latestSession.date), 'MMMM d, yyyy')}</p>
                <p><strong>Duration:</strong> {latestSession.duration} minutes</p>
                <p><strong>Therapist Notes:</strong> {latestSession.notes}</p>
                 <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="rounded-md border p-3">
                    <h4 className="font-semibold">Max Range of Motion</h4>
                    <p className="text-xl font-bold text-foreground">{Math.max(...latestSession.data.map(d => d.rangeOfMotion))}°</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <h4 className="font-semibold">Peak Muscle Load</h4>
                    <p className="text-xl font-bold text-foreground">{Math.max(...latestSession.data.map(d => d.muscleLoad))}%</p>
                  </div>
                   <div className="rounded-md border p-3">
                    <h4 className="font-semibold">Peak Resistance</h4>
                    <p className="text-xl font-bold text-foreground">{Math.max(...latestSession.data.map(d => d.robotResistance))}%</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No session data available.</p>
            )}

            <Separator />
            
            <h3 className="font-semibold text-lg">Overall Progress</h3>
            <p className="text-sm text-muted-foreground">
              Patient has completed {patient.sessions.length} sessions. Consistent improvement is noted in range of motion and ability to handle resistance.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
