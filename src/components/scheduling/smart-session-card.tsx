
'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Appointment = {
    id: string;
    patientName: string;
    condition: string;
    time: string;
    date: Date;
    duration: number;
    therapist: string;
    robot: string;
    therapyType: string;
    aiStatus: string;
    fatigueLevel: 'Low' | 'Medium' | 'High';
    safetyScore: number;
    avatar: string | undefined;
    avatarHint: string;
};

interface SmartSessionCardProps {
    appointment: Appointment;
    children: React.ReactNode;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Fatigue-Aware': return 'bg-yellow-400/20 text-yellow-200 border-yellow-400/30';
        case 'Risk / Overload': return 'bg-red-400/20 text-red-200 border-red-400/30';
        case 'Remote Session': return 'bg-blue-400/20 text-blue-200 border-blue-400/30';
        default: return 'bg-green-400/20 text-green-200 border-green-400/30';
    }
}


export function SmartSessionCard({ appointment, children }: SmartSessionCardProps) {
    const endTime = new Date(new Date(appointment.date).setHours(
        parseInt(appointment.time.split(':')[0]) + (appointment.time.includes('PM') && parseInt(appointment.time.split(':')[0]) !== 12 ? 12 : 0),
        parseInt(appointment.time.split(':')[1].slice(0,2)) + appointment.duration
    ));
    const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TooltipProvider delayDuration={100}>
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent className="w-80 border-border bg-card p-4 text-card-foreground shadow-xl" side="right" align="start">
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/50">
                            <AvatarImage src={appointment.avatar} alt={appointment.patientName} data-ai-hint={appointment.avatarHint} />
                            <AvatarFallback>{appointment.patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-lg font-bold">{appointment.patientName}</p>
                            <p className="text-muted-foreground">{appointment.therapyType}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p><strong>Robot:</strong></p><p>{appointment.robot}</p>
                        <p><strong>Time:</strong></p><p>{appointment.time} - {formattedEndTime}</p>
                        <p><strong>Therapist:</strong></p><p>{appointment.therapist}</p>
                    </div>
                    
                    <div className="space-y-2 rounded-lg border bg-secondary/30 p-3">
                        <div className="flex justify-between">
                            <p><strong>AI Status:</strong></p>
                            <Badge className={getStatusColor(appointment.aiStatus)}>
                                {appointment.aiStatus}
                            </Badge>
                        </div>
                         <div className="flex justify-between">
                            <p><strong>Fatigue Level:</strong></p><p>{appointment.fatigueLevel}</p>
                        </div>
                         <div className="flex justify-between">
                            <p><strong>Safety Score:</strong></p><p>{appointment.safetyScore}%</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="default" size="sm">View Details</Button>
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

    