
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Protocol } from '@/lib/protocols-data';

interface ProtocolListProps {
  protocols: Protocol[];
  selectedProtocol: Protocol | null;
  onSelectProtocol: (protocol: Protocol) => void;
}

export function ProtocolList({ protocols, selectedProtocol, onSelectProtocol }: ProtocolListProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <h2 className="text-xl font-bold">Protocols</h2>
      <div className="mt-4 space-y-4">
        <Input placeholder="🔍 Search protocols..." />
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="stroke">Stroke</SelectItem>
            <SelectItem value="ortho">Orthopedic</SelectItem>
            <SelectItem value="sci">SCI</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {protocols.map((protocol) => (
          <Button
            key={protocol.id}
            variant="ghost"
            className={cn(
              'w-full justify-start text-left h-auto py-2',
              selectedProtocol?.id === protocol.id && 'bg-accent text-accent-foreground'
            )}
            onClick={() => onSelectProtocol(protocol)}
          >
            <div>
              <p className="font-semibold">{protocol.name}</p>
              <p className="text-xs text-muted-foreground">{protocol.condition}</p>
            </div>
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <Button className="w-full">[+ New Protocol]</Button>
      </div>
    </div>
  );
}
