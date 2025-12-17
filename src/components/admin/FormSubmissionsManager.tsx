import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Eye,
  CheckCircle,
  Archive,
  Trash2,
  MessageSquare,
  Send,
  RefreshCw,
  Download,
  Clock,
  User,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

interface FormSubmission {
  id: string;
  form_type: string;
  name: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  interest: string | null;
  source_page: string | null;
  metadata: any;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  replied_at: string | null;
}

const FormSubmissionsManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load form submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'read' || status === 'replied') {
        updates.read_at = new Date().toISOString();
      }
      if (status === 'replied') {
        updates.replied_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('form_submissions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success(`Status updated to ${status}`);
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const saveNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;
      toast.success('Notes saved');
      fetchSubmissions();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Submission deleted');
      setIsViewDialogOpen(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const getFormTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      contact: 'bg-blue-100 text-blue-800',
      newsletter: 'bg-green-100 text-green-800',
      consultation: 'bg-purple-100 text-purple-800',
      quote_request: 'bg-orange-100 text-orange-800',
      partner_inquiry: 'bg-yellow-100 text-yellow-800',
      support: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      new: 'default',
      read: 'secondary',
      replied: 'outline',
      archived: 'secondary',
      spam: 'destructive'
    };
    return variants[status] || 'outline';
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      (sub.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (sub.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || sub.form_type === filterType;
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    newsletter: submissions.filter(s => s.form_type === 'newsletter').length,
    consultation: submissions.filter(s => s.form_type === 'consultation').length,
    contact: submissions.filter(s => s.form_type === 'contact').length
  };

  const openViewDialog = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.notes || '');
    setIsViewDialogOpen(true);
    
    // Mark as read if new
    if (submission.status === 'new') {
      updateSubmissionStatus(submission.id, 'read');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status'];
    const rows = filteredSubmissions.map(s => [
      format(new Date(s.created_at), 'yyyy-MM-dd HH:mm'),
      s.form_type,
      s.name || '',
      s.email,
      s.phone || '',
      s.subject || '',
      (s.message || '').replace(/,/g, ';'),
      s.status
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.new}</p>
                <p className="text-sm text-muted-foreground">New</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.newsletter}</p>
                <p className="text-sm text-muted-foreground">Newsletter</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.consultation}</p>
                <p className="text-sm text-muted-foreground">Consultations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.contact}</p>
                <p className="text-sm text-muted-foreground">Contact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Form Submissions</CardTitle>
              <CardDescription>Manage all form submissions from the website</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchSubmissions}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Form Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="quote_request">Quote Request</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject/Interest</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading submissions...
                    </TableCell>
                  </TableRow>
                ) : filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className={submission.status === 'new' ? 'bg-blue-50/50' : ''}>
                      <TableCell className="text-sm">
                        {format(new Date(submission.created_at), 'MMM d, yyyy')}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(submission.created_at), 'HH:mm')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormTypeBadge(submission.form_type)}`}>
                          {submission.form_type}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {submission.name || '-'}
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
                          {submission.email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {submission.subject || submission.interest || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(submission.status)}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormTypeBadge(selectedSubmission?.form_type || '')}`}>
                {selectedSubmission?.form_type}
              </span>
              Form Submission
            </DialogTitle>
            <DialogDescription>
              Received {selectedSubmission && format(new Date(selectedSubmission.created_at), 'MMMM d, yyyy at HH:mm')}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Name
                  </p>
                  <p className="font-medium">{selectedSubmission.name || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </p>
                  <a href={`mailto:${selectedSubmission.email}`} className="font-medium text-primary hover:underline">
                    {selectedSubmission.email}
                  </a>
                </div>
                {selectedSubmission.phone && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone
                    </p>
                    <a href={`tel:${selectedSubmission.phone}`} className="font-medium text-primary hover:underline">
                      {selectedSubmission.phone}
                    </a>
                  </div>
                )}
                {selectedSubmission.interest && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Interest</p>
                    <p className="font-medium">{selectedSubmission.interest}</p>
                  </div>
                )}
              </div>

              {/* Subject */}
              {selectedSubmission.subject && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedSubmission.subject}</p>
                </div>
              )}

              {/* Message */}
              {selectedSubmission.message && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Message</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </div>
              )}

              {/* Source Page */}
              {selectedSubmission.source_page && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Source Page</p>
                  <p className="text-sm">{selectedSubmission.source_page}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Admin Notes</p>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this submission..."
                  className="min-h-[80px]"
                />
                <Button
                  size="sm"
                  onClick={() => saveNotes(selectedSubmission.id, adminNotes)}
                >
                  Save Notes
                </Button>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, 'replied')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Replied
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, 'archived')}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || 'Your inquiry'}`, '_blank')}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Reply via Email
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSubmission(selectedSubmission.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormSubmissionsManager;
