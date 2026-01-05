import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ProtocolsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Therapist Notes & Protocols</CardTitle>
        <CardDescription>Manage standardized therapy protocols and note templates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground">Protocol Management Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
