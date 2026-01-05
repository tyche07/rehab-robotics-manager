
'use client';

import * as React from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScheduleSuggestionDialog } from '@/components/scheduling/schedule-suggestion-dialog';
import { useToast } from '@/hooks/use-toast';
import { optimizeSchedule } from '@/ai/flows/schedule-optimizer-flow';
import type { ScheduleOptimizerOutput } from '@/lib/types';
import { getSchedulingData } from '@/lib/scheduling-tools';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { SmartSessionCard } from '@/components/scheduling/smart-session-card';

const mockAppointments = [
    {
        id: 'apt1',
        patientName: 'Ananya S.',
        condition: 'Post-Stroke Hemiparesis',
        time: '09:00 AM',
        date: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
        duration: 45, // minutes
        therapist: 'Dr. Mehta',
        robot: 'EXO-02',
        therapyType: 'Upper Limb Rehab',
        aiStatus: 'Normal',
        fatigueLevel: 'Low',
        safetyScore: 98,
        avatar: PlaceHolderImages.find(p => p.id === 'patient-2')?.imageUrl,
        avatarHint: 'woman portrait',
    },
    {
        id: 'apt2',
        patientName: 'Rajesh Kumar',
        condition: 'ACL Reconstruction',
        time: '11:00 AM',
        date: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
        duration: 60,
        therapist: 'Dr. Mehta',
        robot: 'EXO-04',
        therapyType: 'Gait Training',
        aiStatus: 'Fatigue-Aware',
        fatigueLevel: 'Medium',
        safetyScore: 92,
        avatar: PlaceHolderImages.find(p => p.id === 'patient-1')?.imageUrl,
        avatarHint: 'man portrait',
    },
     {
        id: 'apt3',
        patientName: 'Priya Sharma',
        condition: 'Spinal Cord Injury',
        time: '02:00 PM',
        date: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1), // Tuesday
        duration: 75,
        therapist: 'Dr. Chen',
        robot: 'EXO-02',
        therapyType: 'Hand Mobility',
        aiStatus: 'Risk / Overload',
        fatigueLevel: 'High',
        safetyScore: 85,
        avatar: PlaceHolderImages.find(p => p.id === 'patient-2')?.imageUrl,
        avatarHint: 'woman smiling',
    },
     {
        id: 'apt4',
        patientName: 'Amit Patel',
        condition: 'Rotator Cuff Tear',
        time: '09:00 AM',
        date: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2), // Wednesday
        duration: 45,
        therapist: 'Dr. Mehta',
        robot: 'EXO-03',
        therapyType: 'Remote / Tele-rehab',
        aiStatus: 'Remote Session',
        fatigueLevel: 'Low',
        safetyScore: 99,
        avatar: PlaceHolderImages.find(p => p.id === 'patient-3')?.imageUrl,
        avatarHint: 'man smiling',
    },
];

const timeSlots = Array.from({ length: 10 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);


export default function SchedulingPage() {
    const { toast } = useToast();
    const [currentWeek, setCurrentWeek] = React.useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [suggestion, setSuggestion] = React.useState<ScheduleOptimizerOutput | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const weekDays = Array.from({ length: 5 }, (_, i) => addDays(currentWeek, i));

    const handleGenerateSchedule = async () => {
        setIsGenerating(true);
        try {
            const result = await optimizeSchedule(getSchedulingData());
            setSuggestion(result);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Failed to generate schedule:", error);
            toast({
                variant: 'destructive',
                title: 'Scheduling Failed',
                description: 'Could not generate an optimized schedule. Please try again later.'
            });
        } finally {
            setIsGenerating(false);
        }
    }
    
    const getAppointmentForSlot = (day: Date, time: string) => {
        return mockAppointments.find(apt => {
            const aptDate = new Date(apt.date);
            const aptTime = format(aptDate.setHours(parseInt(time.split(':')[0]), 0), 'HH:00');
            const slotTime = format(new Date().setHours(parseInt(time.split(':')[0]), 0), 'HH:00');
            
            return aptDate.getFullYear() === day.getFullYear() &&
                   aptDate.getMonth() === day.getMonth() &&
                   aptDate.getDate() === day.getDate() &&
                   apt.time.startsWith(time.split(':')[0]);
        });
    };
    
    const getCardColor = (status: string) => {
        switch (status) {
            case 'Fatigue-Aware': return 'bg-yellow-400/80 border-yellow-500';
            case 'Risk / Overload': return 'bg-red-400/80 border-red-500';
            case 'Remote Session': return 'bg-blue-400/80 border-blue-500';
            default: return 'bg-green-400/80 border-green-500';
        }
    }


  return (
    <>
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle className="text-3xl font-bold">Smart Calendar</CardTitle>
            <CardDescription>AI-assisted, robot-aware, and patient-centric scheduling.</CardDescription>
        </div>
        <Button onClick={handleGenerateSchedule} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
            Generate Optimal Schedule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
            {/* Smart Filters Column */}
            <div className="w-1/4 space-y-4">
                <h3 className="text-lg font-semibold">Smart Filters</h3>
                 <div className="space-y-2">
                    <Label>Therapist</Label>
                    <Select defaultValue="all">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Therapists</SelectItem>
                            <SelectItem value="mehta">Dr. Mehta</SelectItem>
                            <SelectItem value="chen">Dr. Chen</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                  <div className="space-y-2">
                    <Label>Robot</Label>
                    <Select defaultValue="all">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Robots</SelectItem>
                            <SelectItem value="exo02">EXO-02</SelectItem>
                            <SelectItem value="exo03">EXO-03</SelectItem>
                             <SelectItem value="exo04">EXO-04</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                  <div className="space-y-2">
                    <Label>Patient</Label>
                    <Select defaultValue="all">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Patients</SelectItem>
                            <SelectItem value="ananya">Ananya S.</SelectItem>
                            <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                             <SelectItem value="priya">Priya Sharma</SelectItem>
                              <SelectItem value="amit">Amit Patel</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <Button variant="outline" className="w-full">[+ New Slot]</Button>
            </div>

            {/* Weekly View Column */}
            <div className="w-3/4">
                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold">
                        {format(weekDays[0], 'MMMM d')} - {format(weekDays[4], 'd, yyyy')}
                    </h3>
                    <div className="flex items-center gap-2">
                         <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, -7))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                         <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, 7))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-2 rounded-lg border bg-muted/20 p-2">
                    {/* Day Headers */}
                    {weekDays.map(day => (
                        <div key={day.toString()} className="text-center">
                            <p className="font-semibold text-lg">{format(day, 'E')}</p>
                            <p className="text-muted-foreground">{format(day, 'd')}</p>
                        </div>
                    ))}

                    {/* Schedule Grid */}
                    <div className="col-span-5 grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr] gap-x-2">
                         {/* Time Gutter */}
                        <div className="space-y-2 text-right">
                             {timeSlots.map(time => (
                                <div key={time} className="h-20 text-xs text-muted-foreground pr-2">{time}</div>
                            ))}
                        </div>

                         {/* Day columns */}
                        {weekDays.map(day => (
                            <div key={day.toString()} className="relative col-span-1 space-y-2 border-l">
                                {timeSlots.map(time => {
                                    const appointment = getAppointmentForSlot(day, time);
                                    return (
                                        <div key={time} className="h-20 border-t pl-1">
                                            {appointment && (
                                                <SmartSessionCard appointment={appointment}>
                                                    <div className={cn("h-full rounded-md p-2 text-white text-sm cursor-pointer", getCardColor(appointment.aiStatus))}>
                                                        <p className="font-bold">{appointment.patientName}</p>
                                                        <p className="text-xs">{appointment.therapyType}</p>
                                                    </div>
                                                </SmartSessionCard>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
    {suggestion && (
        <ScheduleSuggestionDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            suggestion={suggestion}
        />
    )}
    </>
  );
}

    