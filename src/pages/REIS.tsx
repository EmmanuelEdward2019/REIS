import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Zap, Battery, Sun, Wind } from 'lucide-react';
import heroRenewableIntegration from '@/assets/hero-renewable-integration.jpg';

const REIS = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="absolute inset-0">
          <img
            src={heroRenewableIntegration}
            alt="Renewable Energy Infrastructure"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Renewable Energy Infrastructure Solutions
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Comprehensive renewable energy solutions for a sustainable future. From solar installations to energy storage systems.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Quote
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Our REIS Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete renewable energy infrastructure designed for residential, commercial, and utility-scale applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Solar Systems</h3>
              <p className="text-muted-foreground">Residential and commercial solar installations with maximum efficiency.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Battery className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Energy Storage</h3>
              <p className="text-muted-foreground">Advanced battery systems for reliable energy storage and grid stability.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Wind Solutions</h3>
              <p className="text-muted-foreground">Offshore and onshore wind energy systems for maximum power generation.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Grid Integration</h3>
              <p className="text-muted-foreground">Smart grid solutions for seamless renewable energy integration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your Energy Infrastructure?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contact our REIS specialists to design a custom renewable energy solution for your needs.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Schedule Consultation
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default REIS;