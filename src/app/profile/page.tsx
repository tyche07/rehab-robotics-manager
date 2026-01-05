
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, BookText, Edit, Shield, Bot } from 'lucide-react';

const doctorProfile = {
    name: 'Dr. Roberts',
    role: 'Lead Therapist',
    department: 'Orthopedic Rehab',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/seed/user/100/100',
    avatarHint: 'doctor portrait',
    lastLogin: 'Today, 08:40 AM',
    devices: 'Web, Tablet',
    activity: {
        sessionsConducted: 124,
        protocolsCreated: 18,
        aiOverrides: 6
    }
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage src={doctorProfile.avatarUrl} alt={doctorProfile.name} data-ai-hint={doctorProfile.avatarHint} />
                    <AvatarFallback className="text-3xl">{doctorProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-4xl font-bold">{doctorProfile.name}</CardTitle>
                        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                    </div>
                    <CardDescription className="mt-1 text-lg">{doctorProfile.role} - {doctorProfile.department}</CardDescription>
                    <div className="mt-4 flex items-center gap-4">
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30">Active</Badge>
                        <span className="text-sm text-muted-foreground">Last Login: {doctorProfile.lastLogin}</span>
                    </div>
                </div>
            </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                        icon={<Activity className="text-primary" />}
                        label="Sessions Conducted"
                        value={doctorProfile.activity.sessionsConducted}
                    />
                    <StatCard 
                        icon={<BookText className="text-primary" />}
                        label="Protocols Created"
                        value={doctorProfile.activity.protocolsCreated}
                    />
                     <StatCard 
                        icon={<Bot className="text-primary" />}
                        label="AI Overrides"
                        value={doctorProfile.activity.aiOverrides}
                    />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>System & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Recent Devices</span>
                        <span className="font-semibold">{doctorProfile.devices}</span>
                    </div>
                    <Separator />
                    <Button variant="secondary" className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        View Audit Logs
                    </Button>
                    <Button variant="outline" className="w-full">Change Password</Button>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}


function StatCard({icon, label, value}: {icon: React.ReactNode, label: string, value: string | number}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}
