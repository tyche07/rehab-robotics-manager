
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProtocolList } from '@/components/protocols/protocol-list';
import { ProtocolOverview } from '@/components/protocols/protocol-overview';
import { mockProtocols, type Protocol } from '@/lib/protocols-data';

export default function ProtocolsPage() {
  const [selectedProtocol, setSelectedProtocol] = React.useState<Protocol | null>(mockProtocols[0] || null);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[70vh]">
          <div className="md:col-span-1 border-r">
            <ProtocolList
              protocols={mockProtocols}
              selectedProtocol={selectedProtocol}
              onSelectProtocol={setSelectedProtocol}
            />
          </div>
          <div className="md:col-span-3">
            {selectedProtocol ? (
              <ProtocolOverview protocol={selectedProtocol} />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Select a protocol to view its details.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
