import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SchedulingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Therapy Scheduling</CardTitle>
        <CardDescription>Manage patient appointments and therapist availability.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground">Scheduling Calendar Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
