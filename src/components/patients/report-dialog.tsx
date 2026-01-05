
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
import { Bot, FileText, Download, Sparkles } from 'lucide-react';
import type { Patient } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';
import { generateTherapyReport } from '@/ai/flows/generate-report-flow';
import type { GenerateReportOutput } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface ReportDialogProps {
  patient: Patient;
  asTrigger?: React.ReactElement;
}

export function ReportDialog({ patient, asTrigger }: ReportDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAiReportOpen, setIsAiReportOpen] = React.useState(false);
  const [aiReport, setAiReport] = React.useState<GenerateReportOutput | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const latestSession = patient.sessions && patient.sessions.length > 0 ? [...patient.sessions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

  const handleGenerateAiReport = async () => {
    setIsGenerating(true);
    setAiReport(null);
    setIsOpen(false); // Close the first dialog
    setIsAiReportOpen(true);
    try {
        const report = await generateTherapyReport({
            patient: {
                name: patient.name,
                age: patient.age,
                condition: patient.condition,
                therapyGoals: patient.therapyGoals,
            },
            sessions: patient.sessions || [],
        });
        setAiReport(report);
    } catch (error) {
        console.error("Failed to generate AI report:", error);
        toast({
            variant: "destructive",
            title: "AI Report Failed",
            description: "Could not generate the AI-powered report. Please try again.",
        });
        setIsAiReportOpen(false);
    } finally {
        setIsGenerating(false);
    }
  }

  const handlePrint = () => {
      window.print();
  }

  const Trigger = asTrigger ? React.cloneElement(asTrigger, { onClick: () => setIsOpen(true) }) : null;


  return (
    <>
      {Trigger}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {!asTrigger && (
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Report
                </Button>
            </DialogTrigger>
          )}
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
                        <p className="text-xl font-bold text-foreground">{Math.max(0, ...latestSession.data.map(d => d.rangeOfMotion))}°</p>
                      </div>
                      <div className="rounded-md border p-3">
                        <h4 className="font-semibold">Peak Muscle Load</h4>
                        <p className="text-xl font-bold text-foreground">{Math.max(0, ...latestSession.data.map(d => d.muscleLoad))}%</p>
                      </div>
                      <div className="rounded-md border p-3">
                        <h4 className="font-semibold">Peak Resistance</h4>
                        <p className="text-xl font-bold text-foreground">{Math.max(0, ...latestSession.data.map(d => d.robotResistance))}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No session data available.</p>
                )}

                <Separator />
                
                <h3 className="font-semibold text-lg">Overall Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Patient has completed {patient.sessions?.length || 0} sessions. Consistent improvement is noted in range of motion and ability to handle resistance.
                </p>
              </div>
            </div>
            <DialogFooter className="justify-between sm:justify-between">
                <Button onClick={handleGenerateAiReport} disabled={isGenerating}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Generate AI Summary'}
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                    <Download className="mr-2 h-4 w-4" />
                    Print / Download PDF
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      <Dialog open={isAiReportOpen} onOpenChange={setIsAiReportOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span>AI-Powered Therapy Report</span>
            </DialogTitle>
            <DialogDescription>
              An AI-generated analysis of {patient.name}'s progress and future recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
              {isGenerating || !aiReport ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                        <Skeleton className="h-16 w-full" />
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Progress Analysis</h3>
                        <Skeleton className="h-24 w-full" />
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Future Recommendations</h3>
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
              ) : (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg">Executive Summary</h3>
                        <p className="text-sm text-muted-foreground">{aiReport.executiveSummary}</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-lg">Progress Analysis</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiReport.progressAnalysis}</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-lg">Future Recommendations</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiReport.futureRecommendations}</p>
                    </div>
                </div>
              )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiReportOpen(false)}>Close</Button>
            <Button onClick={handlePrint} disabled={isGenerating}>
                <Download className="mr-2 h-4 w-4" />
                Print / Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
