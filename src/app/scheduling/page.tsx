
'use client';

import * as React from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
        id: 'apt5',
        patientName: 'Emily Brown',
        condition: 'ACL Reconstruction',
        time: '01:00 PM',
        date: new Date(),
        avatar: PlaceHolderImages.find(p => p.id === 'patient-2')?.imageUrl, // Placeholder, can be changed
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

    const DayCell = React.memo(function DayCell({ date, displayMonth }: { date: Date; displayMonth: Date }) {
      const appointmentsForDay = mockAppointments.filter(apt => isSameDay(apt.date, date));
      const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();

      return (
        <div className={cn("flex h-full flex-col p-2", isOutsideMonth ? "text-muted-foreground/50" : "")}>
          <span className="font-semibold">{format(date, 'd')}</span>
          {appointmentsForDay.length > 0 && (
            <ScrollArea className="mt-2 flex-1">
              <div className="space-y-2">
                {appointmentsForDay.map(apt => (
                  <div key={apt.id} className="rounded-lg bg-secondary/30 p-2 text-left">
                    <p className="text-xs font-semibold">{apt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{apt.time}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      );
    });
    DayCell.displayName = "DayCell";


  return (
    <Card>
      <CardHeader>
        <CardTitle>Therapy Scheduling</CardTitle>
        <CardDescription>Manage patient appointments and therapist availability.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0"
                classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4",
                    month: "space-y-4 w-full",
                    caption_label: "text-lg font-medium",
                    table: "w-full border-collapse",
                    head_row: "flex border-b",
                    head_cell: "text-muted-foreground w-full py-2 text-center text-sm font-normal",
                    row: "flex w-full border-b",
                    cell: "h-36 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:not(:last-child)]:border-r",
                    day: "h-full w-full p-0 font-normal aria-selected:opacity-100",
                    day_selected: "bg-accent text-accent-foreground",
                    day_today: "bg-secondary/50",
                    day_outside: "text-muted-foreground opacity-50",
                }}
                components={{
                    DayContent: DayCell,
                }}
            />
        </div>
      </CardContent>
    </Card>
  );
}
