import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Brain, GraduationCap, Sun, Database, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const DivisionsSection = () => {
  const divisions = [
    {
      id: 1,
      title: "Renewable Energy Integrated System",
      shortTitle: "REIS",
      description: "Complete renewable energy solutions with smart grid integration, energy storage, and predictive maintenance systems.",
      icon: Zap,
      gradient: "from-green-500 to-emerald-600",
      features: [
        "Solar & Wind Integration",
        "Smart Grid Technology", 
        "Energy Storage Solutions",
        "Predictive Maintenance"
      ],
      stats: { value: "50+", label: "GW Deployed" },
      href: "/solutions/reis"
    },
    {
      id: 2,
      title: "Data & AI",
      shortTitle: "AI",
      description: "Advanced analytics, machine learning, and AI-driven optimization for maximum efficiency and predictive insights.",
      icon: Brain,
      gradient: "from-blue-500 to-cyan-600",
      features: [
        "Predictive Analytics",
        "AI Optimization",
        "Real-time Monitoring",
        "Performance Insights"
      ],
      stats: { value: "99.5%", label: "Accuracy" },
      href: "/solutions/data-ai"
    },
    {
      id: 3,
      title: "Learning Management System",
      shortTitle: "LMS",
      description: "Comprehensive training and certification programs for renewable energy professionals and technicians.",
      icon: GraduationCap,
      gradient: "from-purple-500 to-indigo-600",
      features: [
        "Professional Certification",
        "Interactive Training",
        "Progress Tracking",
        "Industry Standards"
      ],
      stats: { value: "10k+", label: "Certified" },
      href: "/solutions/lms"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sun className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Three Powerful Divisions</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Integrated Solutions for a
            <span className="block text-primary">Sustainable Future</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our three specialized divisions work in harmony to deliver comprehensive renewable energy solutions, 
            from initial planning and AI-driven optimization to professional training and certification.
          </p>
        </div>

        {/* Divisions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {divisions.map((division, index) => {
            const IconComponent = division.icon;
            return (
              <Card key={division.id} className="group hover-lift border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${division.gradient} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{division.stats.value}</div>
                      <div className="text-xs text-muted-foreground">{division.stats.label}</div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {division.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {division.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {division.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={division.href}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Highlight */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 lg:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Database className="w-8 h-8 text-primary" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <Users className="w-8 h-8 text-accent" />
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Seamlessly Integrated Ecosystem
            </h3>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our divisions don't work in isolation. The REIS division generates real-time data that feeds into our AI systems, 
              while our LMS ensures that professionals are trained on the latest technologies and best practices.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                Explore Integration
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DivisionsSection;