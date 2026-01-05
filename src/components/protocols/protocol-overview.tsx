
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot } from 'lucide-react';
import type { Protocol } from '@/lib/protocols-data';
import { ProtocolTimeline } from './protocol-timeline';

interface ProtocolOverviewProps {
  protocol: Protocol;
}

export function ProtocolOverview({ protocol }: ProtocolOverviewProps) {
  return (
    <div className="p-6 h-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{protocol.name}</CardTitle>
          <CardDescription>Last Updated: {new Date(protocol.lastUpdated).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Condition</p>
              <p className="font-semibold">{protocol.condition}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Body Part</p>
              <p className="font-semibold">{protocol.bodyPart}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Duration</p>
              <p className="font-semibold">{protocol.duration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Difficulty</p>
              <p className="font-semibold">{protocol.difficulty}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Created By</p>
              <p className="font-semibold">{protocol.createdBy}</p>
            </div>
             <div className="space-y-1">
              <p className="text-muted-foreground">Safety Level</p>
              <Badge variant={protocol.safetyLevel === 'High' ? 'default' : 'secondary'}>{protocol.safetyLevel}</Badge>
            </div>
          </div>
           <div className="flex items-center gap-2 rounded-md bg-secondary/50 p-3">
              <Bot className="h-5 w-5 text-primary" />
              <p className="font-semibold">AI Adaptive: </p>
              <Badge variant={protocol.isAiAdaptive ? 'default' : 'outline'} className={protocol.isAiAdaptive ? 'bg-green-600/20 text-green-300 border-green-600/30' : ''}>
                {protocol.isAiAdaptive ? 'Enabled' : 'Disabled'}
              </Badge>
           </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Protocol Timeline</h3>
            <ProtocolTimeline timeline={protocol.timeline} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
