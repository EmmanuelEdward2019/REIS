import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  User,
  MessageSquare,
  Eye,
  EyeOff,
  Plus,
  Timer,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface InternalMemo {
  id: string;
  user_id: string;
  user_name: string;
  memo_content: string;
  customer_visible_status: string | null;
  created_at: string;
}

interface EnhancedTicket {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'pending' | 'work_in_progress' | 'closed';
  hierarchy_level: 'L1' | 'L2' | 'L3' | 'L4';
  sla_deadline: string;
  sla_status: 'within_sla' | 'approaching_breach' | 'breached';
  assigned_to: string | null;
  assigned_to_name: string | null;
  escalated_from: string | null;
  escalation_reason: string | null;
  created_at: string;
  updated_at: string;
  internal_memos: InternalMemo[];
}

interface EnhancedTicketingSystemProps {
  userRole: 'client' | 'partner' | 'admin';
  userId: string;
  filter?: 'all' | 'overdue' | 'high_priority';
}

const EnhancedTicketingSystem: React.FC<EnhancedTicketingSystemProps> = ({ userRole, userId, filter = 'all' }) => {
  const [selectedTicket, setSelectedTicket] = useState<EnhancedTicket | null>(null);
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);
  const [newMemo, setNewMemo] = useState('');
  const [customerVisibleStatus, setCustomerVisibleStatus] = useState('');

  // Mock data - replace with actual Supabase queries
  const [tickets, setTickets] = useState<EnhancedTicket[]>([]);

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedTickets: EnhancedTicket[] = (data || []).map(ticket => ({
        id: ticket.id,
        ticket_number: ticket.ticket_code || '',
        title: ticket.title || '',
        description: ticket.description || '',
        priority: (ticket.priority?.toLowerCase() as any) || 'medium',
        status: (ticket.status?.toLowerCase() as any) || 'open',
        hierarchy_level: (ticket.hierarchy_level as any) || 'L1',
        sla_deadline: new Date(new Date(ticket.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(), // Mock SLA for now
        sla_status: 'within_sla', // Mock SLA status
        assigned_to: ticket.assigned_to,
        assigned_to_name: null, // Need to join with profiles to get name
        escalated_from: null,
        escalation_reason: null,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        internal_memos: [] // Need to fetch memos separately
      }));

      let filteredTickets = transformedTickets;
      if (filter === 'overdue') {
        // Filter for tickets where SLA deadline is passed (mock logic for now as sla_deadline is mocked)
        // Or simply check created_at > 7 days ago as per dashboard logic
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filteredTickets = transformedTickets.filter(t => new Date(t.created_at) < sevenDaysAgo && t.status === 'open');
      } else if (filter === 'high_priority') {
        filteredTickets = transformedTickets.filter(t => t.priority === 'high' || t.priority === 'critical');
      }

      setTickets(filteredTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    }
  };

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'within_sla': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'approaching_breach': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'breached': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'low': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getHierarchyColor = (level: string) => {
    switch (level) {
      case 'L1': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'L2': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'L3': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'L4': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff < 0) return 'Overdue';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const handleEscalate = async (ticket: EnhancedTicket) => {
    const nextLevel = ticket.hierarchy_level === 'L1' ? 'L2' :
      ticket.hierarchy_level === 'L2' ? 'L3' : 'L4';

    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          hierarchy_level: nextLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticket.id);

      if (error) throw error;

      toast.success(`Ticket ${ticket.ticket_number} escalated to ${nextLevel}`);
      fetchTickets(); // Refresh list
    } catch (error) {
      console.error('Error escalating ticket:', error);
      toast.error('Failed to escalate ticket');
    }
  };

  const handleAssign = (ticketId: string, partnerId: string) => {
    // In real implementation, this would call Supabase
    toast.success('Ticket assigned successfully');
  };

  const handleAddMemo = () => {
    if (!selectedTicket || !newMemo.trim()) return;

    // In real implementation, this would call Supabase
    toast.success('Internal memo added');
    setNewMemo('');
    setCustomerVisibleStatus('');
    setMemoDialogOpen(false);
  };

  const canViewInternalMemos = userRole === 'admin' || userRole === 'partner';
  const canEscalate = userRole === 'admin';
  const canAssign = userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-sm text-muted-foreground">Total Tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">
              {tickets.filter(t => t.sla_status === 'within_sla').length}
            </div>
            <p className="text-sm text-muted-foreground">Within SLA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">
              {tickets.filter(t => t.sla_status === 'approaching_breach').length}
            </div>
            <p className="text-sm text-muted-foreground">Approaching Breach</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">
              {tickets.filter(t => t.sla_status === 'breached').length}
            </div>
            <p className="text-sm text-muted-foreground">SLA Breached</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            Manage tickets with SLA tracking and escalation hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>SLA Status</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-mono"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      {ticket.ticket_number}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>
                    <Badge className={getHierarchyColor(ticket.hierarchy_level)}>
                      {ticket.hierarchy_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSLAColor(ticket.sla_status)}>
                      {ticket.sla_status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      {formatTimeRemaining(ticket.sla_deadline)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.assigned_to_name || (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canEscalate && ticket.hierarchy_level !== 'L4' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEscalate(ticket)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      )}
                      {canViewInternalMemos && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setMemoDialogOpen(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Internal Memo Dialog */}
      {canViewInternalMemos && (
        <Dialog open={memoDialogOpen} onOpenChange={setMemoDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Internal Memos - {selectedTicket?.ticket_number}</DialogTitle>
              <DialogDescription>
                Internal communication not visible to customers
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Existing Memos */}
              <div>
                <Label>Previous Memos</Label>
                <ScrollArea className="h-[200px] border rounded-lg p-4 mt-2">
                  {selectedTicket?.internal_memos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No internal memos yet</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedTicket?.internal_memos.map((memo) => (
                        <div key={memo.id} className="border-b pb-3 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{memo.user_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(memo.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{memo.memo_content}</p>
                          {memo.customer_visible_status && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <Eye className="h-3 w-3" />
                              <span className="text-muted-foreground">
                                Customer sees: "{memo.customer_visible_status}"
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Add New Memo */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="memo-content">Internal Memo</Label>
                  <Textarea
                    id="memo-content"
                    value={newMemo}
                    onChange={(e) => setNewMemo(e.target.value)}
                    placeholder="Add internal notes about actions taken, findings, etc..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="customer-status">Customer Visible Status (Optional)</Label>
                  <Select value={customerVisibleStatus} onValueChange={setCustomerVisibleStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status to show customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investigating">Investigating issue</SelectItem>
                      <SelectItem value="parts_ordered">Parts ordered, awaiting delivery</SelectItem>
                      <SelectItem value="scheduled">Technician visit scheduled</SelectItem>
                      <SelectItem value="in_progress">Work in progress</SelectItem>
                      <SelectItem value="testing">Testing solution</SelectItem>
                      <SelectItem value="resolved">Issue resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMemoDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMemo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Memo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedTicketingSystem;

