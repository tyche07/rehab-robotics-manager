import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function UserManagementPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Access Control</CardTitle>
        <CardDescription>Manage user roles, permissions, and access to patient data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground">User Management Interface Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
