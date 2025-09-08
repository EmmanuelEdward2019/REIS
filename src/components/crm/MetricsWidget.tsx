import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, 
  Zap, 
  TrendingUp, 
  Award, 
  Download, 
  AlertTriangle,
  BarChart3,
  Coins
} from 'lucide-react';

interface MetricsData {
  co2Saved: number;
  carbonCreditsEarned: number;
  carbonCreditsValue: number;
  energyGeneration: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  billSavings: number;
  reisScore: number;
  maintenanceAlerts: number;
  lcoeTracker: number;
  gridEquivalent: number;
  isLiveSystem: boolean;
}

interface MetricsWidgetProps {
  data: MetricsData;
  jobCode?: string;
}

const MetricsWidget: React.FC<MetricsWidgetProps> = ({ data, jobCode }) => {
  const getREISScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-accent';
    return 'text-destructive';
  };

  const getREISScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">REIS Metrics Dashboard</h2>
          <p className="text-muted-foreground">
            {data.isLiveSystem ? 'Live System Data' : 'Simulation Based on Regional Defaults'}
          </p>
          {jobCode && (
            <Badge variant="outline" className="mt-1">
              Job: {jobCode}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-success" />
              CO₂ Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.co2Saved.toFixed(1)} tons</div>
            <p className="text-xs text-muted-foreground">Environmental impact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4 text-accent" />
              Carbon Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.carbonCreditsEarned}</div>
            <p className="text-xs text-muted-foreground">
              Value: ${data.carbonCreditsValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Energy Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.energyGeneration.yearly.toLocaleString()} kWh</div>
            <p className="text-xs text-muted-foreground">
              Monthly: {data.energyGeneration.monthly.toLocaleString()} kWh
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Bill Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.billSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Annual savings</p>
          </CardContent>
        </Card>
      </div>

      {/* REIS Score and LCOE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              REIS Score
            </CardTitle>
            <CardDescription>Renewable Energy Integration Score (0-100)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-bold ${getREISScoreColor(data.reisScore)}`}>
                  {data.reisScore}
                </span>
                <Badge variant="outline" className={getREISScoreColor(data.reisScore)}>
                  {getREISScoreLabel(data.reisScore)}
                </Badge>
              </div>
              <Progress value={data.reisScore} className="h-3" />
              <div className="text-sm text-muted-foreground">
                Based on efficiency, sustainability, and grid integration
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              LCOE Tracker
            </CardTitle>
            <CardDescription>Levelized Cost of Energy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    ${data.lcoeTracker.toFixed(3)}
                  </div>
                  <p className="text-sm text-muted-foreground">Your LCOE</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    ${data.gridEquivalent.toFixed(3)}
                  </div>
                  <p className="text-sm text-muted-foreground">Grid Rate</p>
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <span className="text-lg font-bold text-success">
                  {(((data.gridEquivalent - data.lcoeTracker) / data.gridEquivalent) * 100).toFixed(0)}% 
                </span>
                <span className="text-sm text-muted-foreground ml-1">Cost Savings</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Equivalents */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Equivalents</CardTitle>
          <CardDescription>Put your CO₂ savings into perspective</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-xl font-bold">{(data.co2Saved * 2.5).toFixed(0)}</div>
              <p className="text-sm text-muted-foreground">Trees planted equivalent</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-xl font-bold">{(data.co2Saved * 2204).toFixed(0)} miles</div>
              <p className="text-sm text-muted-foreground">Car emissions avoided</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-xl font-bold">{(data.energyGeneration.yearly / 3650).toFixed(0)}</div>
              <p className="text-sm text-muted-foreground">Homes powered per day</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Alerts */}
      {data.maintenanceAlerts > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Maintenance Alerts ({data.maintenanceAlerts})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You have {data.maintenanceAlerts} pending maintenance items. 
              Please check your O&M dashboard for details.
            </p>
            <Button variant="destructive" size="sm" className="mt-2">
              View Maintenance Tasks
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MetricsWidget;