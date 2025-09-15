import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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