import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { 
  Trophy,
  Star,
  Award,
  Gift,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  Medal,
  Crown,
  Zap,
  Target,
  Calendar,
  Mail,
  Send
} from 'lucide-react';

const AdminLoyaltyManager = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Mock loyalty data
  const loyaltyMetrics = {
    totalRewards: 45680,
    activeMembers: 342,
    rewardsDistributed: 12450,
    avgLoyaltyScore: 76.4,
    topTierMembers: 23,
    recentRewards: 156
  };

  // Top customers based on loyalty metrics
  const topCustomers = [
    {
      id: 1,
      rank: 1,
      name: 'Steel Works Nigeria',
      segment: 'Industrial',
      loyaltyScore: 98,
      tier: 'Platinum',
      totalSpent: 2340000,
      transactionCount: 125,
      transactionFrequency: 'Daily',
      lastTransaction: '2 hours ago',
      rewardsEarned: 23400,
      rewardsRedeemed: 15600,
      joinDate: '2023-05-10',
      email: 'operations@steelworks.ng',
      phone: '+234-903-555-6666',
      badges: ['Early Adopter', 'Big Spender', 'Consistent Customer', 'Referral Champion']
    },
    {
      id: 2,
      rank: 2,
      name: 'TechCorp Ltd',
      segment: 'Commercial',
      loyaltyScore: 96,
      tier: 'Platinum',
      totalSpent: 456780,
      transactionCount: 45,
      transactionFrequency: 'Weekly',
      lastTransaction: '1 day ago',
      rewardsEarned: 4567,
      rewardsRedeemed: 2800,
      joinDate: '2023-08-15',
      email: 'admin@techcorp.com',
      phone: '+234-901-111-2222',
      badges: ['Consistent Customer', 'Tech Pioneer', 'Sustainability Champion']
    },
    {
      id: 3,
      rank: 3,
      name: 'GreenMart Stores',
      segment: 'Commercial',
      loyaltyScore: 94,
      tier: 'Gold',
      totalSpent: 298450,
      transactionCount: 38,
      transactionFrequency: 'Bi-weekly',
      lastTransaction: '3 days ago',
      rewardsEarned: 2984,
      rewardsRedeemed: 1200,
      joinDate: '2023-09-22',
      email: 'energy@greenmart.com',
      phone: '+234-802-333-4444',
      badges: ['Eco Warrior', 'Growth Partner', 'Community Leader']
    },
    {
      id: 4,
      rank: 4,
      name: 'Sarah Johnson',
      segment: 'Residential',
      loyaltyScore: 92,
      tier: 'Gold',
      totalSpent: 23850,
      transactionCount: 18,
      transactionFrequency: 'Bi-weekly',
      lastTransaction: '1 week ago',
      rewardsEarned: 238,
      rewardsRedeemed: 120,
      joinDate: '2023-11-22',
      email: 'sarah.johnson@email.com',
      phone: '+234-802-345-6789',
      badges: ['Loyal Customer', 'Referral Star', 'Early Adopter']
    },
    {
      id: 5,
      rank: 5,
      name: 'Energy Solutions Ltd',
      segment: 'Commercial',
      loyaltyScore: 90,
      tier: 'Gold',
      totalSpent: 187600,
      transactionCount: 28,
      transactionFrequency: 'Monthly',
      lastTransaction: '4 days ago',
      rewardsEarned: 1876,
      rewardsRedeemed: 800,
      joinDate: '2024-01-10',
      email: 'contact@energysolutions.com',
      phone: '+234-805-777-8888',
      badges: ['Innovation Partner', 'Consistent Customer']
    },
    {
      id: 6,
      rank: 6,
      name: 'John Smith',
      segment: 'Residential',
      loyaltyScore: 88,
      tier: 'Silver',
      totalSpent: 15420,
      transactionCount: 12,
      transactionFrequency: 'Monthly',
      lastTransaction: '5 days ago',
      rewardsEarned: 154,
      rewardsRedeemed: 80,
      joinDate: '2024-01-15',
      email: 'john.smith@email.com',
      phone: '+234-901-234-5678',
      badges: ['Steady Customer', 'First Time Buyer']
    },
    {
      id: 7,
      rank: 7,
      name: 'Lagos Manufacturing',
      segment: 'Industrial',
      loyaltyScore: 86,
      tier: 'Silver',
      totalSpent: 145300,
      transactionCount: 15,
      transactionFrequency: 'Monthly',
      lastTransaction: '1 week ago',
      rewardsEarned: 1453,
      rewardsRedeemed: 600,
      joinDate: '2023-12-05',
      email: 'procurement@lagosmanufacturing.com',
      phone: '+234-806-999-0000',
      badges: ['Industrial Pioneer', 'Growth Customer']
    },
    {
      id: 8,
      rank: 8,
      name: 'David Wilson',
      segment: 'Residential',
      loyaltyScore: 84,
      tier: 'Silver',
      totalSpent: 12800,
      transactionCount: 9,
      transactionFrequency: 'Quarterly',
      lastTransaction: '2 weeks ago',
      rewardsEarned: 128,
      rewardsRedeemed: 50,
      joinDate: '2024-02-20',
      email: 'david.wilson@email.com',
      phone: '+234-807-123-4567',
      badges: ['New Customer', 'Tech Savvy']
    },
    {
      id: 9,
      rank: 9,
      name: 'Bright Hotels Chain',
      segment: 'Commercial',
      loyaltyScore: 82,
      tier: 'Silver',
      totalSpent: 89400,
      transactionCount: 12,
      transactionFrequency: 'Bi-monthly',
      lastTransaction: '10 days ago',
      rewardsEarned: 894,
      rewardsRedeemed: 300,
      joinDate: '2024-03-15',
      email: 'facilities@brighthotels.com',
      phone: '+234-808-456-7890',
      badges: ['Hospitality Partner', 'Sustainability Focused']
    },
    {
      id: 10,
      rank: 10,
      name: 'Mary Okafor',
      segment: 'Residential',
      loyaltyScore: 80,
      tier: 'Bronze',
      totalSpent: 8750,
      transactionCount: 6,
      transactionFrequency: 'Quarterly',
      lastTransaction: '3 weeks ago',
      rewardsEarned: 87,
      rewardsRedeemed: 30,
      joinDate: '2024-04-08',
      email: 'mary.okafor@email.com',
      phone: '+234-809-234-5678',
      badges: ['New Customer', 'Residential Pioneer']
    }
  ];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
          <Crown className="h-3 w-3 mr-1" />
          Platinum
        </Badge>;
      case 'Gold':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Medal className="h-3 w-3 mr-1" />
          Gold
        </Badge>;
      case 'Silver':
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <Star className="h-3 w-3 mr-1" />
          Silver
        </Badge>;
      case 'Bronze':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
          <Award className="h-3 w-3 mr-1" />
          Bronze
        </Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Residential':
        return 'text-blue-600';
      case 'Commercial':
        return 'text-green-600';
      case 'Industrial':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Loyalty Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loyaltyMetrics.totalRewards.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loyaltyMetrics.activeMembers}</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Gift className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loyaltyMetrics.rewardsDistributed.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Distributed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loyaltyMetrics.avgLoyaltyScore}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Crown className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loyaltyMetrics.topTierMembers}</p>
                <p className="text-sm text-muted-foreground">Top Tier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loyaltyMetrics.recentRewards}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Customers for Rewards */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top 10 Customers - Loyalty Rewards
              </CardTitle>
              <CardDescription>
                Customers ranked by transaction volume, amount, and frequency for rewards consideration
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={async () => {
                  try {
                    const winners = topCustomers.slice(0, 3);
                    const emails = winners.map(c => c.email).join(', ');
                    toast.success(`Notification emails sent to: ${emails}`);
                    // In production, this would send actual emails via your email service
                  } catch (error) {
                    toast.error('Failed to send notifications');
                  }
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Notify Winners
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const rewardsToSend = topCustomers.slice(0, 5);
                    let successCount = 0;
                    
                    for (const customer of rewardsToSend) {
                      // In production, this would create reward records in the database
                      // and process the actual reward distribution
                      successCount++;
                    }
                    
                    toast.success(`Rewards sent to ${successCount} top customers`);
                  } catch (error) {
                    toast.error('Failed to send rewards');
                  }
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Rewards
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Loyalty Metrics</TableHead>
                  <TableHead>Transaction History</TableHead>
                  <TableHead>Rewards Status</TableHead>
                  <TableHead>Achievements</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {getRankIcon(customer.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{customer.name}</div>
                        <div className={`text-sm ${getSegmentColor(customer.segment)}`}>
                          {customer.segment}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Member since {customer.joinDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {getTierBadge(customer.tier)}
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{customer.loyaltyScore}</span>
                          <span className="text-xs text-muted-foreground">score</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer.transactionFrequency}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-success" />
                          <span className="font-medium">${customer.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {customer.transactionCount} transactions
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          {customer.lastTransaction}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-success font-medium">${customer.rewardsEarned}</span>
                          <span className="text-muted-foreground"> earned</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-primary font-medium">${customer.rewardsRedeemed}</span>
                          <span className="text-muted-foreground"> redeemed</span>
                        </div>
                        <Progress 
                          value={(customer.rewardsRedeemed / customer.rewardsEarned) * 100} 
                          className="h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {customer.badges.slice(0, 2).map((badge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {customer.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{customer.badges.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast.success(`Reward sent to ${customer.name}`);
                          }}
                        >
                          <Gift className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast.success(`Notification sent to ${customer.email}`);
                          }}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
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
};

export default AdminLoyaltyManager;