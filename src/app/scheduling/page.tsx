
'use client';

import * as React from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mockAppointments = [
    {
        id: 'apt1',
        patientName: 'John Doe',
        condition: 'Post-Stroke Hemiparesis',
        time: '10:00 AM',
        date: new Date(),
        avatar: PlaceHolderImages.find(p => p.id === 'patient-1')?.imageUrl,
        avatarHint: 'man portrait',
    },
    {
        id: 'apt2',
        patientName: 'Jane Smith',
        condition: 'Rotator Cuff Tear',
        time: '11:30 AM',
        date: new Date(),
        avatar: PlaceHolderImages.find(p => p.id === 'patient-2')?.imageUrl,
        avatarHint: 'woman portrait',
    },
    {
        id: 'apt3',
        patientName: 'Samuel Green',
        condition: 'Arthritis in Knee',
        time: '02:00 PM',
        date: addDays(new Date(), 2),
        avatar: PlaceHolderImages.find(p => p.id === 'patient-3')?.imageUrl,
        avatarHint: 'man smiling',
    },
    {
        id: 'apt4',
        patientName: 'John Doe',
        condition: 'Post-Stroke Hemiparesis',
        time: '09:00 AM',
        date: addDays(new Date(), 4),
        avatar: PlaceHolderImages.find(p => p.id === 'patient-1')?.imageUrl,
        avatarHint: 'man portrait',
    },
];


export default function SchedulingPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const appointmentsForSelectedDay = React.useMemo(() => {
        return mockAppointments.filter(apt => date && isSameDay(apt.date, date));
    }, [date]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Therapy Scheduling</CardTitle>
        <CardDescription>Manage patient appointments and therapist availability.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border md:col-span-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-0"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4",
                month: "space-y-4 w-full",
                caption_label: "text-lg font-medium",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-between",
                head_cell: "text-muted-foreground rounded-md w-full justify-between",
                row: "flex w-full mt-2 justify-between",
                cell: "h-14 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-14 w-full p-1 font-normal aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              }}
              components={{
                DayContent: ({ date }) => {
                    const hasAppointment = mockAppointments.some(apt => isSameDay(apt.date, date));
                    return (
                        <div className="relative flex h-full w-full flex-col items-center justify-center">
                            <span className="absolute top-1 left-1.5 text-xs">{format(date, 'd')}</span>
                            {hasAppointment && (
                                <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                            )}
                        </div>
                    );
                }
              }}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Appointments for {date ? format(date, 'MMMM d, yyyy') : '...'}
            </h3>
             {appointmentsForSelectedDay.length > 0 ? (
                <div className="space-y-4">
                    {appointmentsForSelectedDay.map((apt) => (
                        <div key={apt.id} className="rounded-lg border p-4">
                           <div className="flex items-start gap-4">
                             <Avatar className="h-12 w-12 border">
                                <AvatarImage src={apt.avatar} data-ai-hint={apt.avatarHint} />
                                <AvatarFallback>{apt.patientName.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div className="flex-1">
                                <p className="font-semibold">{apt.patientName}</p>
                                <p className="text-sm text-muted-foreground">{apt.time}</p>
                                <Badge variant="secondary" className="mt-2">{apt.condition}</Badge>
                             </div>
                           </div>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-12">
                    <p className="text-muted-foreground">No appointments for this day.</p>
                </div>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
