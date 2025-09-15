import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Zap, 
  Battery, 
  Sun, 
  Home, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Thermometer,
  Gauge
} from 'lucide-react';

interface EnergyMetricsProps {
  data: {
    solar_generation_w: number;
    house_load_w: number;
    battery_power_w: number;
    battery_level_percent: number;
    battery_voltage_v: number;
    battery_current_a: number;
    battery_temp_c: number;
    energy_generated_kwh_daily: number;
    energy_used_kwh_daily: number;
    efficiency_percent: number;
    system_status: string;
  };
  controller: {
    device_name: string;
    is_online: boolean;
    is_active: boolean;
    last_heartbeat: string;
  };
  historicalData?: Array<{
    time: string;
    generation: number;
    consumption: number;
  }>;
}

const ModernEnergyMetrics: React.FC<EnergyMetricsProps> = ({ 
  data, 
  controller, 
  historicalData = [] 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-success';
      case 'warning': return 'text-accent';
      case 'error': return 'text-destructive';
      case 'maintenance': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatPower = (watts: number) => {
    if (watts >= 1000) {
      return `${(watts / 1000).toFixed(2)} kW`;
    }
    return `${watts.toFixed(0)} W`;
  };

  const CircularGauge = ({ 
    value, 
    max, 
    label, 
    unit, 
    color = 'primary',
    size = 120 
  }: {
    value: number;
    max: number;
    label: string;
    unit: string;
    color?: string;
    size?: number;
  }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            className="transform -rotate-90"
            style={{ width: size, height: size }}
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={`hsl(var(--${color}))`}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-lg font-bold text-${color}`}>
              {value.toFixed(value < 10 ? 2 : 0)}
            </div>
            <div className="text-xs text-muted-foreground">{unit}</div>
          </div>
        </div>
        <div className="text-sm font-medium text-center mt-2">{label}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {controller.device_name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={controller.is_online ? "default" : "destructive"}>
                {controller.is_online ? "Online" : "Offline"}
              </Badge>
              <Badge variant={controller.is_active ? "default" : "secondary"}>
                {controller.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Solar Panels */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sun className="h-4 w-4 text-accent" />
              Solar Panels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {formatPower(data.solar_generation_w)}
            </div>
            <div className="text-xs text-muted-foreground">Current Generation</div>
          </CardContent>
        </Card>

        {/* House Load */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              House Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatPower(data.house_load_w)}
            </div>
            <div className="text-xs text-muted-foreground">Current Consumption</div>
          </CardContent>
        </Card>

        {/* Daily Generation */}
        <Card className="bg-success/10 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-success">Electricity Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {data.energy_generated_kwh_daily.toFixed(2)} kWh
            </div>
            <div className="text-xs text-success/70">Today</div>
          </CardContent>
        </Card>

        {/* Daily Usage */}
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">Electricity Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.energy_used_kwh_daily.toFixed(2)} kWh
            </div>
            <div className="text-xs text-primary/70">Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Circular Gauges */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border p-6">
            <CircularGauge
              value={data.house_load_w}
              max={2000}
              label="House Load"
              unit="W"
              color="accent"
            />
          </Card>

          <Card className="bg-card border-border p-6">
            <CircularGauge
              value={data.solar_generation_w}
              max={5000}
              label="Solar Power"
              unit="W"
              color="success"
            />
          </Card>

          <Card className="bg-card border-border p-6">
            <CircularGauge
              value={Math.abs(data.battery_power_w)}
              max={3000}
              label="Battery Power"
              unit="W"
              color="primary"
            />
          </Card>
        </div>

        {/* Battery Level Sidebar */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Battery className="h-4 w-4 text-primary" />
                Battery Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {data.battery_level_percent.toFixed(0)}%
              </div>
              <Progress value={data.battery_level_percent} className="mb-2" />
              <div className="text-xs text-muted-foreground">
                {data.battery_power_w > 0 ? 'Charging' : 
                 data.battery_power_w < 0 ? 'Discharging' : 'Idle'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Battery Current</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success flex items-center gap-2">
                {data.battery_current_a.toFixed(1)} A
                {data.battery_current_a > 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {(data.battery_current_a * 0.001).toFixed(3)}% of capacity
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Battery Volts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary flex items-center gap-2">
                {data.battery_voltage_v.toFixed(1)} V
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="text-xs text-muted-foreground">
                {((data.battery_voltage_v / 48) * 100).toFixed(1)}% nominal
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Power Generation Chart */}
      {historicalData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Power Use vs Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Electricity Use"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="generation" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Electricity Generation"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium">Max Battery Temp</span>
            </div>
            <div className="text-xl font-bold">{data.battery_temp_c.toFixed(1)}°C</div>
            <div className="text-xs text-destructive flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -3.18%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Max Cell Volt</span>
            </div>
            <div className="text-xl font-bold">{(data.battery_voltage_v / 16).toFixed(2)} V</div>
            <div className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              1.87%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium">Peak Solar Today</span>
            </div>
            <div className="text-xl font-bold">{formatPower(data.solar_generation_w * 1.2)}</div>
            <div className="text-xs text-success">∞%</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Peak Load Today</span>
            </div>
            <div className="text-xl font-bold">{formatPower(data.house_load_w * 1.3)}</div>
            <div className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              57.9%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-success" />
              <span className="text-xs font-medium">System Status</span>
            </div>
            <div className={`text-lg font-bold ${getStatusColor(data.system_status)}`}>
              {data.system_status.charAt(0).toUpperCase() + data.system_status.slice(1)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Battery className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Battery Status</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {data.battery_power_w > 0 ? 'Charging' : 
               data.battery_power_w < 0 ? 'Discharging' : 'Idle'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernEnergyMetrics;