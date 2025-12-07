import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
    Users,
    Search,
    Eye,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Star,
    Loader2,
    Building,
    Calendar
} from 'lucide-react';

interface Client {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    company_name: string | null;
    service_class: string | null;
    job_count: number;
    total_value: number;
    last_job_date: string | null;
}

interface JobDetail {
    id: string;
    job_code: string;
    project_name: string;
    job_type: string;
    status: string;
    estimated_value: number;
    created_at: string;
}

const PartnerClientManager = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientJobs, setClientJobs] = useState<JobDetail[]>([]);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [partnerApp, setPartnerApp] = useState<any>(null);

    useEffect(() => {
        if (user) {
            fetchPartnerApp();
        }
    }, [user]);

    useEffect(() => {
        if (partnerApp) {
            fetchClients();
        }
    }, [partnerApp]);

    const fetchPartnerApp = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('partner_applications')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setPartnerApp(data);
        } catch (error) {
            console.error('Error fetching partner application:', error);
        }
    };

    const fetchClients = async () => {
        if (!partnerApp) return;

        try {
            setLoading(true);

            // Get all jobs for this partner
            const { data: jobs, error: jobsError } = await supabase
                .from('job_codes')
                .select(`
          id,
          job_code,
          project_name,
          job_type,
          status,
          estimated_value,
          created_at,
          client_id,
          profiles:client_id (
            id,
            full_name,
            email,
            phone,
            city,
            state,
            company_name,
            service_class
          )
        `)
                .eq('partner_id', partnerApp.id)
                .not('client_id', 'is', null);

            if (jobsError) throw jobsError;

            // Group jobs by client
            const clientMap = new Map<string, Client>();

            jobs?.forEach((job: any) => {
                if (!job.profiles) return;

                const clientId = job.client_id;
                if (!clientMap.has(clientId)) {
                    clientMap.set(clientId, {
                        id: clientId,
                        full_name: job.profiles.full_name || 'Unknown',
                        email: job.profiles.email || '',
                        phone: job.profiles.phone,
                        city: job.profiles.city,
                        state: job.profiles.state,
                        company_name: job.profiles.company_name,
                        service_class: job.profiles.service_class,
                        job_count: 0,
                        total_value: 0,
                        last_job_date: null,
                    });
                }

                const client = clientMap.get(clientId)!;
                client.job_count++;
                client.total_value += job.estimated_value || 0;

                if (!client.last_job_date || new Date(job.created_at) > new Date(client.last_job_date)) {
                    client.last_job_date = job.created_at;
                }
            });

            setClients(Array.from(clientMap.values()));
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    const handleViewClient = async (client: Client) => {
        setSelectedClient(client);

        try {
            // Fetch all jobs for this client
            const { data, error } = await supabase
                .from('job_codes')
                .select('*')
                .eq('partner_id', partnerApp.id)
                .eq('client_id', client.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setClientJobs(data || []);
            setShowDetailDialog(true);
        } catch (error) {
            console.error('Error fetching client jobs:', error);
            toast.error('Failed to load client details');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
            assigned: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
            in_progress: { className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
            completed: { className: 'bg-success/10 text-success border-success/20' },
            cancelled: { className: 'bg-destructive/10 text-destructive border-destructive/20' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <Badge variant="outline" className={config.className}>
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const filteredClients = clients.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Statistics
    const totalClients = clients.length;
    const totalProjects = clients.reduce((sum, c) => sum + c.job_count, 0);
    const totalRevenue = clients.reduce((sum, c) => sum + c.total_value, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalClients}</p>
                                <p className="text-sm text-muted-foreground">Total Clients</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalProjects}</p>
                                <p className="text-sm text-muted-foreground">Total Projects</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <Star className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Clients Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                My Clients
                            </CardTitle>
                            <CardDescription>
                                Manage your client relationships and project history
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {filteredClients.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Clients Found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm
                                    ? 'No clients match your search.'
                                    : "You haven't worked with any clients yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client Name</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Projects</TableHead>
                                        <TableHead>Total Value</TableHead>
                                        <TableHead>Last Project</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell>
                                                <div className="font-medium">{client.full_name}</div>
                                                {client.service_class && (
                                                    <Badge variant="outline" className="mt-1 text-xs">
                                                        {client.service_class}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {client.company_name ? (
                                                    <div className="flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {client.company_name}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Mail className="h-3 w-3" />
                                                        {client.email}
                                                    </div>
                                                    {client.phone && (
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Phone className="h-3 w-3" />
                                                            {client.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {client.city || client.state ? (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <MapPin className="h-3 w-3" />
                                                        {[client.city, client.state].filter(Boolean).join(', ')}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{client.job_count}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">₦{client.total_value.toLocaleString()}</div>
                                            </TableCell>
                                            <TableCell>
                                                {client.last_job_date ? (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(client.last_job_date).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewClient(client)}
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Client Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Client Details</DialogTitle>
                        <DialogDescription>
                            {selectedClient?.full_name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedClient && (
                        <div className="space-y-6">
                            {/* Client Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Contact Information</h4>
                                    <p className="text-sm"><strong>Email:</strong> {selectedClient.email}</p>
                                    {selectedClient.phone && <p className="text-sm"><strong>Phone:</strong> {selectedClient.phone}</p>}
                                    {selectedClient.company_name && <p className="text-sm"><strong>Company:</strong> {selectedClient.company_name}</p>}
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Summary</h4>
                                    <p className="text-sm"><strong>Total Projects:</strong> {selectedClient.job_count}</p>
                                    <p className="text-sm"><strong>Total Value:</strong> ₦{selectedClient.total_value.toLocaleString()}</p>
                                    {selectedClient.service_class && <p className="text-sm"><strong>Service Class:</strong> {selectedClient.service_class}</p>}
                                </div>
                            </div>

                            {/* Project History */}
                            <div>
                                <h4 className="font-semibold mb-3">Project History</h4>
                                {clientJobs.length > 0 ? (
                                    <div className="space-y-2">
                                        {clientJobs.map((job) => (
                                            <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <code className="text-sm font-mono">{job.job_code}</code>
                                                        {getStatusBadge(job.status)}
                                                    </div>
                                                    <p className="text-sm font-medium">{job.project_name || 'Untitled Project'}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {job.job_type} • ₦{job.estimated_value?.toLocaleString() || '0'}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(job.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No projects found</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PartnerClientManager;
