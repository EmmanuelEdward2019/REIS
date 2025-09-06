import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, TrendingUp, Zap, Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Leading Sustainable Energy Innovation</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Renewable Energy
            </span>
            is Here
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Eagle & Thistle delivers integrated renewable energy solutions, advanced data analytics, 
            and comprehensive training programs that accelerate the global transition to sustainable energy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="px-8 py-4 text-lg rounded-full bg-gradient-to-r from-primary to-primary-variant hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
              Explore Solutions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2 hover:bg-accent/10">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">50+</div>
              <div className="text-sm text-muted-foreground">GW Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Tons CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute top-1/4 left-8 hidden lg:block">
        <div className="glass p-4 rounded-xl shadow-lg max-w-xs transform -rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">Energy Generated</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">847 MWh</div>
        </div>
      </div>

      <div className="absolute top-1/3 right-8 hidden lg:block">
        <div className="glass p-4 rounded-xl shadow-lg max-w-xs transform rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">Carbon Offset</div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-accent">2.4k Tons</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;