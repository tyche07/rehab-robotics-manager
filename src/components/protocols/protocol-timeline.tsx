
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ProtocolPhase } from '@/lib/protocols-data';

interface ProtocolTimelineProps {
  timeline: ProtocolPhase[];
}

export function ProtocolTimeline({ timeline }: ProtocolTimelineProps) {
  return (
    <div className="relative space-y-6 pl-6">
      {/* Timeline line */}
      <div className="absolute left-9 top-2 bottom-2 w-0.5 bg-border"></div>

      {timeline.map((phase, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
            <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
          </div>
          <Card className="ml-8">
            <CardHeader>
              <CardTitle className="text-base">{phase.phaseName}</CardTitle>
              <p className="text-sm text-muted-foreground">Weeks: {phase.weeks}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground">ROM</p>
                  <p className="font-medium">{phase.rom}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Resistance</p>
                  <p className="font-medium">{phase.resistance}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Reps</p>
                  <p className="font-medium">{phase.reps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
