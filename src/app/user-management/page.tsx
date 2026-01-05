
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Upload, Download, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const users = [
    {
        id: 'usr1',
        name: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        role: 'Patient',
        status: 'Active',
        lastLogin: 'Today, 09:15 AM',
        avatar: PlaceHolderImages.find(p => p.id === 'patient-2')?.imageUrl,
        avatarHint: 'woman portrait',
    },
    {
        id: 'usr2',
        name: 'Dr. Vijay Rao',
        email: 'vijay.rao@rehab.clinic',
        role: 'Therapist',
        status: 'Active',
        lastLogin: 'Today, 08:40 AM',
        avatar: "https://picsum.photos/seed/doc1/100/100",
        avatarHint: 'doctor portrait',
    },
    {
        id: 'usr3',
        name: 'Amit Kumar',
        email: 'amit.kumar@rehab.clinic',
        role: 'Admin',
        status: 'Active',
        lastLogin: 'Yesterday, 02:30 PM',
        avatar: PlaceHolderImages.find(p => p.id === 'patient-3')?.imageUrl,
        avatarHint: 'man smiling',
    },
    {
        id: 'usr4',
        name: 'Riya Malhotra',
        email: 'riya.malhotra@example.com',
        role: 'Patient',
        status: 'Suspended',
        lastLogin: '3 days ago',
        avatar: "https://picsum.photos/seed/patient4/100/100",
        avatarHint: 'woman smiling',
    },
     {
        id: 'usr5',
        name: 'Dr. Priya Chen',
        email: 'priya.chen@rehab.clinic',
        role: 'Therapist',
        status: 'Active',
        lastLogin: 'Today, 11:05 AM',
        avatar: "https://picsum.photos/seed/doc2/100/100",
        avatarHint: 'doctor portrait smiling',
    },
];

const stats = {
    total: users.length,
    therapists: users.filter(u => u.role === 'Therapist').length,
    patients: users.filter(u => u.role === 'Patient').length,
    admins: users.filter(u => u.role === 'Admin').length,
    active: users.filter(u => u.status === 'Active').length,
    suspended: users.filter(u => u.status === 'Suspended').length,
}


export default function UserManagementPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Users Overview</CardTitle>
                <CardDescription>Manage and monitor all user accounts and access levels.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <StatCard title="Total Users" value={stats.total} />
                    <StatCard title="Therapists" value={stats.therapists} />
                    <StatCard title="Patients" value={stats.patients} />
                    <StatCard title="Admins" value={stats.admins} />
                    <StatCard title="Active" value={stats.active} />
                    <StatCard title="Suspended" value={stats.suspended} />
                </div>
                 <div className="flex flex-col sm:flex-row items-center gap-2">
                    <Button><PlusCircle /> Add User</Button>
                    <Button variant="outline"><Upload /> Import Users</Button>
                    <Button variant="outline"><Download /> Export</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>User List</CardTitle>
                <CardDescription>Search, filter, and manage individual user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search by name, email..." className="pl-10" />
                    </div>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="Patient">Patient</SelectItem>
                            <SelectItem value="Therapist">Therapist</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.avatarHint} />
                                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} 
                                className={user.status === 'Active' ? 'bg-green-600/20 text-green-300 border-green-600/30' : ''}>
                                    {user.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                                    <DropdownMenuItem>View Audit Logs</DropdownMenuItem>
                                    <DropdownMenuItem className="text-yellow-500 hover:!text-yellow-500">Reset Password</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500 hover:!text-red-500">Disable User</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}


function StatCard({title, value}: {title: string, value: number}) {
    return (
        <Card className="text-center">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}
