import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import FormDialog from '@/components/common/FormDialog';
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    Calendar,
    MapPin,
    Users,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    Video,
    Globe
} from 'lucide-react';

interface Event {
    id: string;
    title: string;
    description: string | null;
    event_type: string;
    start_date: string;
    end_date: string | null;
    location: string | null;
    is_virtual: boolean;
    meeting_link: string | null;
    max_attendees: number | null;
    current_attendees: number;
    price_ngn: number | null;
    price_gbp: number | null;
    status: string;
    featured_image: string | null;
    organizer_id: string | null;
    created_at: string;
    updated_at: string;
}

interface EventFormData {
    title: string;
    description: string;
    event_type: string;
    start_date: string;
    end_date: string;
    location: string;
    is_virtual: boolean;
    meeting_link: string;
    max_attendees: string;
    price_ngn: string;
    price_gbp: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    featured_image: string;
}

const EventsManager = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        event_type: 'webinar',
        start_date: '',
        end_date: '',
        location: '',
        is_virtual: false,
        meeting_link: '',
        max_attendees: '',
        price_ngn: '0',
        price_gbp: '0',
        status: 'upcoming',
        featured_image: '',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('start_date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.title || !formData.start_date) {
                toast.error('Please fill in title and start date');
                return;
            }

            const { error } = await supabase
                .from('events')
                .insert([{
                    title: formData.title,
                    description: formData.description || null,
                    event_type: formData.event_type,
                    start_date: formData.start_date,
                    end_date: formData.end_date || null,
                    location: formData.location || null,
                    is_virtual: formData.is_virtual,
                    meeting_link: formData.meeting_link || null,
                    max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                    price_ngn: formData.price_ngn ? parseFloat(formData.price_ngn) : null,
                    price_gbp: formData.price_gbp ? parseFloat(formData.price_gbp) : null,
                    status: formData.status,
                    featured_image: formData.featured_image || null,
                    organizer_id: user?.id || null,
                    current_attendees: 0,
                }]);

            if (error) throw error;

            toast.success('Event created successfully');
            setShowAddDialog(false);
            resetForm();
            fetchEvents();
        } catch (error: any) {
            console.error('Error creating event:', error);
            toast.error(error.message || 'Failed to create event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('events')
                .update({
                    title: formData.title,
                    description: formData.description || null,
                    event_type: formData.event_type,
                    start_date: formData.start_date,
                    end_date: formData.end_date || null,
                    location: formData.location || null,
                    is_virtual: formData.is_virtual,
                    meeting_link: formData.meeting_link || null,
                    max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                    price_ngn: formData.price_ngn ? parseFloat(formData.price_ngn) : null,
                    price_gbp: formData.price_gbp ? parseFloat(formData.price_gbp) : null,
                    status: formData.status,
                    featured_image: formData.featured_image || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingEvent.id);

            if (error) throw error;

            toast.success('Event updated successfully');
            setShowEditDialog(false);
            setEditingEvent(null);
            resetForm();
            fetchEvents();
        } catch (error: any) {
            console.error('Error updating event:', error);
            toast.error(error.message || 'Failed to update event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async (event: Event) => {
        if (!confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', event.id);

            if (error) throw error;

            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error: any) {
            console.error('Error deleting event:', error);
            toast.error(error.message || 'Failed to delete event');
        }
    };

    const openEditDialog = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            event_type: event.event_type,
            start_date: event.start_date,
            end_date: event.end_date || '',
            location: event.location || '',
            is_virtual: event.is_virtual,
            meeting_link: event.meeting_link || '',
            max_attendees: event.max_attendees?.toString() || '',
            price_ngn: event.price_ngn?.toString() || '0',
            price_gbp: event.price_gbp?.toString() || '0',
            status: event.status as any,
            featured_image: event.featured_image || '',
        });
        setShowEditDialog(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            event_type: 'webinar',
            start_date: '',
            end_date: '',
            location: '',
            is_virtual: false,
            meeting_link: '',
            max_attendees: '',
            price_ngn: '0',
            price_gbp: '0',
            status: 'upcoming',
            featured_image: '',
        });
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        const matchesType = typeFilter === 'all' || event.event_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            upcoming: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Clock },
            ongoing: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            completed: { className: 'bg-muted/10 text-muted-foreground border-muted/20', icon: CheckCircle },
            cancelled: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    // Statistics
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const ongoingEvents = events.filter(e => e.status === 'ongoing').length;
    const totalAttendees = events.reduce((sum, e) => sum + e.current_attendees, 0);

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalEvents}</p>
                                <p className="text-sm text-muted-foreground">Total Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcomingEvents}</p>
                                <p className="text-sm text-muted-foreground">Upcoming</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <CheckCircle className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{ongoingEvents}</p>
                                <p className="text-sm text-muted-foreground">Ongoing</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalAttendees}</p>
                                <p className="text-sm text-muted-foreground">Total Attendees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Events Management Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Events Management
                            </CardTitle>
                            <CardDescription>
                                Manage webinars, workshops, conferences, and other events
                            </CardDescription>
                        </div>
                        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Event
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="webinar">Webinar</SelectItem>
                                <SelectItem value="workshop">Workshop</SelectItem>
                                <SelectItem value="conference">Conference</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="meetup">Meetup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Events Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Event Details</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Attendees</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEvents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                No events found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{event.title}</div>
                                                        {event.description && (
                                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                                {event.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{event.event_type}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(event.start_date).toLocaleDateString()}
                                                        </div>
                                                        {event.end_date && (
                                                            <div className="text-xs text-muted-foreground">
                                                                to {new Date(event.end_date).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        {event.is_virtual ? (
                                                            <>
                                                                <Video className="h-3 w-3" />
                                                                Virtual
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MapPin className="h-3 w-3" />
                                                                {event.location || 'TBA'}
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {event.current_attendees}
                                                        {event.max_attendees && ` / ${event.max_attendees}`}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {event.price_ngn === 0 || event.price_ngn === null ? (
                                                            <Badge variant="outline" className="bg-success/10 text-success">Free</Badge>
                                                        ) : (
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="h-3 w-3" />
                                                                ₦{event.price_ngn?.toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(event.status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(event)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteEvent(event)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Event Dialog */}
            <FormDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                title="Create New Event"
                description="Schedule a new webinar, workshop, or event"
                onSubmit={handleCreateEvent}
                submitLabel="Create Event"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Solar Energy Workshop 2024"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Event description..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="event_type">Event Type</Label>
                            <Select
                                value={formData.event_type}
                                onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="webinar">Webinar</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="conference">Conference</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                    <SelectItem value="meetup">Meetup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date *</Label>
                            <Input
                                id="start_date"
                                type="datetime-local"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                type="datetime-local"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_virtual"
                            checked={formData.is_virtual}
                            onChange={(e) => setFormData({ ...formData, is_virtual: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="is_virtual" className="cursor-pointer">
                            Virtual Event
                        </Label>
                    </div>

                    {formData.is_virtual ? (
                        <div className="space-y-2">
                            <Label htmlFor="meeting_link">Meeting Link</Label>
                            <Input
                                id="meeting_link"
                                value={formData.meeting_link}
                                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Lagos, Nigeria"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="max_attendees">Max Attendees</Label>
                            <Input
                                id="max_attendees"
                                type="number"
                                value={formData.max_attendees}
                                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                                placeholder="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_ngn">Price (NGN)</Label>
                            <Input
                                id="price_ngn"
                                type="number"
                                value={formData.price_ngn}
                                onChange={(e) => setFormData({ ...formData, price_ngn: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_gbp">Price (GBP)</Label>
                            <Input
                                id="price_gbp"
                                type="number"
                                value={formData.price_gbp}
                                onChange={(e) => setFormData({ ...formData, price_gbp: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="featured_image">Featured Image URL</Label>
                        <Input
                            id="featured_image"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>
            </FormDialog>

            {/* Edit Event Dialog */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Event"
                description="Update event details and settings"
                onSubmit={handleUpdateEvent}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit_title">Event Title *</Label>
                        <Input
                            id="edit_title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_description">Description</Label>
                        <Textarea
                            id="edit_description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_event_type">Event Type</Label>
                            <Select
                                value={formData.event_type}
                                onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="webinar">Webinar</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="conference">Conference</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                    <SelectItem value="meetup">Meetup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_start_date">Start Date *</Label>
                            <Input
                                id="edit_start_date"
                                type="datetime-local"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_end_date">End Date</Label>
                            <Input
                                id="edit_end_date"
                                type="datetime-local"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit_is_virtual"
                            checked={formData.is_virtual}
                            onChange={(e) => setFormData({ ...formData, is_virtual: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="edit_is_virtual" className="cursor-pointer">
                            Virtual Event
                        </Label>
                    </div>

                    {formData.is_virtual ? (
                        <div className="space-y-2">
                            <Label htmlFor="edit_meeting_link">Meeting Link</Label>
                            <Input
                                id="edit_meeting_link"
                                value={formData.meeting_link}
                                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="edit_location">Location</Label>
                            <Input
                                id="edit_location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_max_attendees">Max Attendees</Label>
                            <Input
                                id="edit_max_attendees"
                                type="number"
                                value={formData.max_attendees}
                                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_price_ngn">Price (NGN)</Label>
                            <Input
                                id="edit_price_ngn"
                                type="number"
                                value={formData.price_ngn}
                                onChange={(e) => setFormData({ ...formData, price_ngn: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_price_gbp">Price (GBP)</Label>
                            <Input
                                id="edit_price_gbp"
                                type="number"
                                value={formData.price_gbp}
                                onChange={(e) => setFormData({ ...formData, price_gbp: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_featured_image">Featured Image URL</Label>
                        <Input
                            id="edit_featured_image"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                        />
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default EventsManager;
