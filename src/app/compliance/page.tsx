
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, AlertTriangle, Shield, Bot, FileText, Activity, Power, UserCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const complianceData = {
    overview: [
        { title: 'Data Privacy Compliance', status: 'Compliant', icon: <UserCheck className="h-5 w-5 text-green-500" /> },
        { title: 'Device Safety Compliance', status: 'Compliant', icon: <Shield className="h-5 w-5 text-green-500" /> },
        { title: 'AI Governance Compliance', status: 'Review Needed', icon: <Bot className="h-5 w-5 text-yellow-500" /> },
        { title: 'Clinical Protocol Compliance', status: 'Compliant', icon: <FileText className="h-5 w-5 text-green-500" /> },
    ],
    audits: {
        last: '10 Jan 2026',
        next: '10 Apr 2026'
    },
    incidentReports: [
        { id: 'inc1', date: '08/01/26', type: 'Force Spike', severity: 'Medium', status: 'Resolved' },
        { id: 'inc2', date: '02/01/26', type: 'EMG Failure', severity: 'Low', status: 'Logged' },
    ]
};

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'compliant':
            return <Badge className="bg-green-600/20 text-green-300 border-green-600/30">Compliant</Badge>;
        case 'review needed':
            return <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-600/30">Review Needed</Badge>;
        case 'non-compliant':
            return <Badge variant="destructive">Non-Compliant</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}


export default function CompliancePage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Compliance Dashboard</CardTitle>
                <CardDescription>Overview of governance, audits, and compliance status.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Compliance Status Overview</h3>
                        <div className="space-y-3">
                            {complianceData.overview.map(item => (
                                <div key={item.title} className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span className="font-medium">{item.title}</span>
                                    </div>
                                    {getStatusBadge(item.status)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Card>
                             <CardHeader className="pb-2">
                                <CardTitle className="text-md font-medium">Audit Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Last Full Audit: <span className="font-semibold text-foreground">{complianceData.audits.last}</span></p>
                                <p className="text-sm text-muted-foreground">Next Scheduled Audit: <span className="font-semibold text-foreground">{complianceData.audits.next}</span></p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader className="pb-2">
                                <CardTitle className="text-md font-medium">Regulatory Standards</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <ul className="list-disc list-inside">
                                    <li>HIPAA, GDPR</li>
                                    <li>ISO 13485, IEC 60601</li>
                                    <li>AI Explainability Requirements</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card>
                <CardHeader>
                    <CardTitle>AI Governance & Explainability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">AI Module:</span>
                        <span className="text-muted-foreground">Adaptive Therapy Engine v2.3</span>
                    </div>
                     <Separator />
                    <div className="flex items-center justify-between">
                         <span className="font-medium">Model Status:</span>
                         <Badge className="bg-green-600/20 text-green-300 border-green-600/30">Verified</Badge>
                    </div>
                     <Separator />
                    <p className="text-sm text-muted-foreground"><strong className="text-foreground">Last AI Decision:</strong> "Resistance reduced due to EMG fatigue drop"</p>
                     <div className="flex justify-end gap-2">
                        <Button variant="outline">View Model Logs</Button>
                        <Button variant="secondary">Freeze Model</Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Robot Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Robot ID:</span>
                        <span className="text-muted-foreground">EXO-02</span>
                    </div>
                    <Separator />
                     <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-green-400"><CheckCircle className="h-4 w-4" /> Calibration Up-to-date</li>
                        <li className="flex items-center gap-2 text-green-400"><CheckCircle className="h-4 w-4" /> Electrical Safety Check Passed</li>
                        <li className="flex items-center gap-2 text-green-400"><CheckCircle className="h-4 w-4" /> Emergency Stop Verified</li>
                    </ul>
                     <Separator />
                     <p className="text-sm text-muted-foreground">Last Inspection: 05 Jan 2026</p>
                    <div className="flex justify-end">
                        <Button>Download Certificate</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Incident & Safety Reports</CardTitle>
                <CardDescription>Log of automated and manually reported safety incidents.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex justify-end mb-4">
                    <Button><AlertTriangle className="mr-2 h-4 w-4" />Report New Incident</Button>
                 </div>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {complianceData.incidentReports.map(report => (
                            <TableRow key={report.id}>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>{report.type}</TableCell>
                                <TableCell>
                                     <Badge variant={report.severity === 'Medium' ? 'secondary' : 'default'} className={report.severity === 'Medium' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30' : ''}>
                                        {report.severity}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                     <Badge variant={report.status === 'Resolved' ? 'default' : 'outline'} className={report.status === 'Resolved' ? 'bg-green-600/20 text-green-300 border-green-600/30' : ''}>
                                        {report.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    </div>
  );
}
