import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Brain, GraduationCap, Calculator, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Solutions = () => {
  const solutions = [
    {
      id: 'reis',
      title: 'Renewable Energy Integrated System',
      shortTitle: 'REIS',
      description: 'Complete renewable energy solutions with smart grid integration and energy storage.',
      icon: Zap,
      color: 'from-green-500 to-emerald-600',
      features: ['Solar Integration', 'Wind Power', 'Energy Storage', 'Smart Grid', 'Predictive Maintenance'],
      benefits: ['Reduced Energy Costs', 'Carbon Footprint Reduction', 'Grid Stability', 'Scalable Solutions'],
      href: '/solutions/reis'
    },
    {
      id: 'data-ai',
      title: 'Data & AI Solutions',
      shortTitle: 'AI',
      description: 'Advanced analytics and AI-driven optimization for maximum efficiency.',
      icon: Brain,
      color: 'from-blue-500 to-cyan-600',
      features: ['Predictive Analytics', 'Machine Learning', 'Real-time Monitoring', 'Performance Optimization'],
      benefits: ['99.5% Accuracy', 'Automated Insights', 'Cost Optimization', 'Proactive Maintenance'],
      href: '/solutions/data-ai'
    },
    {
      id: 'lms',
      title: 'Learning Management System',
      shortTitle: 'LMS',
      description: 'Comprehensive training and certification programs for renewable energy professionals.',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-600',
      features: ['Professional Certification', 'Interactive Training', 'Progress Tracking', 'Industry Standards'],
      benefits: ['Industry Recognition', 'Skill Development', 'Career Advancement', 'Compliance Training'],
      href: '/solutions/lms'
    }
  ];

  const tools = [
    { name: 'CO₂ Savings Calculator', icon: Calculator, description: 'Calculate your carbon footprint reduction' },
    { name: 'Energy Generation Estimator', icon: TrendingUp, description: 'Estimate renewable energy output' },
    { name: 'Bill Savings Calculator', icon: Calculator, description: 'Calculate potential cost savings' },
    { name: 'REIS Score Preview', icon: Calculator, description: 'Get your renewable energy readiness score' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Complete Solutions Portfolio
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Integrated Solutions for
            <span className="block text-primary">Sustainable Energy</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Discover our comprehensive suite of renewable energy solutions, from integrated systems 
            and AI-driven optimization to professional training and certification programs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              Schedule Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Three Powerful Divisions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each division specializes in a critical aspect of the renewable energy ecosystem, 
              working together to deliver comprehensive solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {solutions.map((solution) => {
              const IconComponent = solution.icon;
              return (
                <Card key={solution.id} className="group hover-lift border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                      {solution.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {solution.features.map((feature) => (
                          <div key={feature} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {solution.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Link to={solution.href}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Interactive Tools Section */}
          <div className="bg-gradient-to-r from-secondary/30 to-accent/10 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Interactive Planning Tools
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Use our powerful calculators and assessment tools to evaluate your renewable energy potential 
                and calculate potential savings and environmental impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div key={tool.name} className="bg-background/50 rounded-xl p-4 text-center hover-lift">
                    <IconComponent className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold text-sm text-foreground mb-2">{tool.name}</h4>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <Button size="lg" variant="outline" className="border-2">
                Access Interactive Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Solutions;