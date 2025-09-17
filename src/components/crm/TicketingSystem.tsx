import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  User, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  PlayCircle,
  Calendar,
  MessageSquare,
  Plus
} from 'lucide-react';
import CreateTicketDialog from './CreateTicketDialog';

export type TicketStage = 
  | 'INTAKE' 
  | 'CONSULT' 
  | 'DATA-REVIEW' 
  | 'SITE-AUDIT' 
  | 'ENG' 
  | 'PROC' 
  | 'CONSTR' 
  | 'COMM' 
  | 'O&M';

export type TicketStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export interface TicketData {
  ticketCode: string;
  stage: TicketStage;
  status: TicketStatus;
  title: string;
  description: string;
  assignee?: string;
  created: Date;
  updated: Date;
  dueDate?: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes: string[];
  attachments: string[];
}

interface TicketingSystemProps {
  tickets: TicketData[];
  jobCode?: string;
  onTicketUpdate: (ticketCode: string, updates: Partial<TicketData>) => void;
  onTicketCreate?: (ticket: {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: string;
  }) => void;
  userRole?: 'client' | 'partner' | 'admin';
}

const TicketingSystem: React.FC<TicketingSystemProps> = ({ tickets, jobCode = 'N/A', onTicketUpdate, onTicketCreate, userRole = 'client' }) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const getStageOrder = (): TicketStage[] => [
    'INTAKE', 'CONSULT', 'DATA-REVIEW', 'SITE-AUDIT', 
    'ENG', 'PROC', 'CONSTR', 'COMM', 'O&M'
  ];

  const getStageLabel = (stage: TicketStage): string => {
    const labels: Record<TicketStage, string> = {
      'INTAKE': 'Initial Intake',
      'CONSULT': 'Consultation',
      'DATA-REVIEW': 'Data Review',
      'SITE-AUDIT': 'Site Audit',
      'ENG': 'Engineering',
      'PROC': 'Procurement',
      'CONSTR': 'Construction',
      'COMM': 'Commissioning',
      'O&M': 'Operations & Maintenance'
    };
    return labels[stage];
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'COMPLETED': return 'bg-success text-success-foreground';
      case 'IN_PROGRESS': return 'bg-primary text-primary-foreground';
      case 'ON_HOLD': return 'bg-accent text-accent-foreground';
      case 'CANCELLED': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-destructive';
      case 'HIGH': return 'text-accent';
      case 'MEDIUM': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressPercentage = (): number => {
    const stages = getStageOrder();
    const completedTickets = tickets.filter(t => t.status === 'COMPLETED');
    return (completedTickets.length / stages.length) * 100;
  };

  const activeTickets = tickets.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
  const completedTickets = tickets.filter(t => t.status === 'COMPLETED');
  const allTickets = tickets.sort((a, b) => {
    const stageOrder = getStageOrder();
    return stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {userRole === 'client' ? 'Support Tickets' : 'Project Pipeline'}
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'client' ? 'Create and manage your support requests' : `Job: ${jobCode}`}
          </p>
        </div>
        {userRole === 'client' ? (
          onTicketCreate && <CreateTicketDialog onCreateTicket={onTicketCreate} />
        ) : (
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round(getProgressPercentage())}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={getProgressPercentage()} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Started</span>
            <span>{completedTickets.length} of {getStageOrder().length} stages complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeTickets.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Tickets ({tickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTickets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active tickets</p>
              </CardContent>
            </Card>
          ) : (
            activeTickets.map(ticket => (
              <TicketCard 
                key={ticket.ticketCode} 
                ticket={ticket} 
                onUpdate={onTicketUpdate}
                isSelected={selectedTicket === ticket.ticketCode}
                onSelect={setSelectedTicket}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTickets.map(ticket => (
            <TicketCard 
              key={ticket.ticketCode} 
              ticket={ticket} 
              onUpdate={onTicketUpdate}
              isSelected={selectedTicket === ticket.ticketCode}
              onSelect={setSelectedTicket}
            />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {allTickets.map(ticket => (
            <TicketCard 
              key={ticket.ticketCode} 
              ticket={ticket} 
              onUpdate={onTicketUpdate}
              isSelected={selectedTicket === ticket.ticketCode}
              onSelect={setSelectedTicket}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TicketCardProps {
  ticket: TicketData;
  onUpdate: (ticketCode: string, updates: Partial<TicketData>) => void;
  isSelected: boolean;
  onSelect: (ticketCode: string | null) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onUpdate, isSelected, onSelect }) => {
  const getStageLabel = (stage: TicketStage): string => {
    const labels: Record<TicketStage, string> = {
      'INTAKE': 'Initial Intake',
      'CONSULT': 'Consultation',
      'DATA-REVIEW': 'Data Review',
      'SITE-AUDIT': 'Site Audit',
      'ENG': 'Engineering',
      'PROC': 'Procurement',
      'CONSTR': 'Construction',
      'COMM': 'Commissioning',
      'O&M': 'Operations & Maintenance'
    };
    return labels[stage];
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'COMPLETED': return 'bg-success text-success-foreground';
      case 'IN_PROGRESS': return 'bg-primary text-primary-foreground';
      case 'ON_HOLD': return 'bg-accent text-accent-foreground';
      case 'CANCELLED': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-destructive';
      case 'HIGH': return 'text-accent';
      case 'MEDIUM': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onSelect(isSelected ? null : ticket.ticketCode)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{ticket.ticketCode}</Badge>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </Badge>
            </div>
            <CardTitle className="text-lg">{ticket.title}</CardTitle>
            <CardDescription>{getStageLabel(ticket.stage)}</CardDescription>
          </div>
          <div className={`font-medium ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{ticket.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {ticket.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {ticket.assignee}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {ticket.updated.toLocaleDateString()}
            </div>
            {ticket.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Due: {ticket.dueDate.toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {ticket.notes.length > 0 && (
              <Badge variant="outline">
                <MessageSquare className="h-3 w-3 mr-1" />
                {ticket.notes.length}
              </Badge>
            )}
            {ticket.attachments.length > 0 && (
              <Badge variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                {ticket.attachments.length}
              </Badge>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(ticket.ticketCode, { status: 'IN_PROGRESS' });
                }}
                disabled={ticket.status === 'COMPLETED'}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Start
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(ticket.ticketCode, { status: 'COMPLETED' });
                }}
                disabled={ticket.status === 'COMPLETED'}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(ticket.ticketCode, { status: 'ON_HOLD' });
                }}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Hold
              </Button>
            </div>
            
            {ticket.notes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recent Notes:</h4>
                <div className="space-y-1">
                  {ticket.notes.slice(-2).map((note, index) => (
                    <p key={index} className="text-sm bg-muted p-2 rounded">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketingSystem;