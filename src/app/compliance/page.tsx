import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CompliancePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Logging</CardTitle>
        <CardDescription>View audit trails and generate compliance reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground">Compliance Logging Dashboard Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
