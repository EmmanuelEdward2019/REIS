import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Brain, BarChart3, Database, Shield } from 'lucide-react';
import heroDataAnalytics from '@/assets/hero-data-analytics.jpg';

const DataAI = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="absolute inset-0">
          <img
            src={heroDataAnalytics}
            alt="Data Analytics and AI"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Data & AI Solutions
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Transform your business with cutting-edge artificial intelligence and advanced data analytics platforms.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
                View Demo
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
              AI-Powered Analytics Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leverage the power of artificial intelligence to unlock insights from your data and drive intelligent decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Machine Learning</h3>
              <p className="text-muted-foreground">Advanced ML algorithms for predictive analytics and automation.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data Analytics</h3>
              <p className="text-muted-foreground">Real-time analytics and business intelligence dashboards.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data Engineering</h3>
              <p className="text-muted-foreground">Scalable data pipelines and cloud infrastructure solutions.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Security</h3>
              <p className="text-muted-foreground">Enterprise-grade security for AI applications and data protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Free Analytics Platform Trial
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Experience our AI-powered analytics platform with a 3-month free trial. No credit card required.
              </p>
              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Real-time data processing and visualization
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Advanced machine learning models
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Custom dashboard creation
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  API integration and automation
                </li>
              </ul>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
            </div>
            <div className="bg-background rounded-lg p-8">
              <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Unlock Your Data's Potential?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contact our AI specialists to learn how our platform can transform your business intelligence.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Schedule Demo
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default DataAI;