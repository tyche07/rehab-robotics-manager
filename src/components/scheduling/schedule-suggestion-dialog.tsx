'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot, CalendarDays } from 'lucide-react';
import type { ScheduleOptimizerOutput } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ScheduleSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  suggestion: ScheduleOptimizerOutput;
}

export function ScheduleSuggestionDialog({
  isOpen,
  onOpenChange,
  suggestion,
}: ScheduleSuggestionDialogProps) {
  const { suggestedSlots, justification } = suggestion;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span>AI-Optimized Schedule</span>
          </DialogTitle>
          <DialogDescription>
            The AI has generated an optimized schedule based on all constraints.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className='space-y-4'>
                <h4 className="font-semibold text-lg">Suggested Appointments</h4>
                 <ScrollArea className="h-64">
                    <div className="space-y-4 pr-4">
                        {suggestedSlots.map((slot, index) => (
                            <div key={index} className="rounded-lg border p-3">
                                <p className="font-semibold">{slot.patientName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(slot.date), 'EEEE, MMM d')}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                    <Badge variant="outline">{slot.startTime} - {slot.endTime}</Badge>
                                    <span className="text-sm text-muted-foreground">Therapist: {slot.therapistId}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className='space-y-4'>
                <h4 className="font-semibold text-lg">Justification</h4>
                <div className="rounded-lg border bg-secondary/30 p-4 text-sm text-secondary-foreground">
                    <p>{justification}</p>
                </div>
            </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Dismiss
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            <CalendarDays className="mr-2" />
            Accept & Add to Calendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
