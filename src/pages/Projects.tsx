import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Calendar, Zap, Users } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Solar Valley Initiative',
      location: 'California, USA',
      capacity: '500 MW',
      status: 'Operational',
      year: '2023',
      description: 'Large-scale solar installation with integrated energy storage and smart grid technology.',
      impact: {
        co2Saved: '750K tons/year',
        homesEmpowered: '150K homes',
        jobsCreated: '2,500 jobs'
      },
      image: '/api/placeholder/600/400',
      tags: ['Solar', 'Energy Storage', 'Smart Grid']
    },
    {
      id: 2,
      title: 'Offshore Wind Farm',
      location: 'North Sea, UK',
      capacity: '800 MW',
      status: 'Under Construction',
      year: '2024',
      description: 'Advanced offshore wind installation using AI-powered optimization and predictive maintenance.',
      impact: {
        co2Saved: '1.2M tons/year',
        homesEmpowered: '200K homes',
        jobsCreated: '3,000 jobs'
      },
      image: '/api/placeholder/600/400',
      tags: ['Wind', 'Offshore', 'AI Optimization']
    },
    {
      id: 3,
      title: 'Hybrid Energy Campus',
      location: 'Singapore',
      capacity: '300 MW',
      status: 'Planning',
      year: '2025',
      description: 'Integrated solar and wind facility with training center and data analytics hub.',
      impact: {
        co2Saved: '450K tons/year',
        homesEmpowered: '100K homes',
        jobsCreated: '1,800 jobs'
      },
      image: '/api/placeholder/600/400',
      tags: ['Hybrid', 'Training Center', 'Data Hub']
    }
  ];

  const stats = [
    { label: 'Total Capacity', value: '2.5+ GW', icon: Zap },
    { label: 'Projects Completed', value: '150+', icon: MapPin },
    { label: 'Countries', value: '25+', icon: Users },
    { label: 'CO₂ Reduced', value: '3M+ tons', icon: Zap }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Global Impact Portfolio
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Projects Powering
            <span className="block text-primary">Sustainable Future</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Explore our portfolio of renewable energy projects across the globe, from large-scale 
            solar installations to innovative offshore wind farms and hybrid energy systems.
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover some of our most impactful renewable energy projects that are transforming 
              communities and reducing carbon emissions worldwide.
            </p>
          </div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <Card key={project.id} className={`overflow-hidden hover-lift ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <div className="h-64 lg:h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <Zap className="w-16 h-16 text-primary mx-auto mb-4" />
                        <div className="text-4xl font-bold text-primary mb-2">{project.capacity}</div>
                        <div className="text-muted-foreground">Capacity</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant={
                          project.status === 'Operational' ? 'default' :
                          project.status === 'Under Construction' ? 'secondary' : 'outline'
                        }>
                          {project.status}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.year}
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        {project.location}
                      </div>
                      <CardDescription className="text-base leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{project.impact.co2Saved}</div>
                          <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                        </div>
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{project.impact.homesEmpowered}</div>
                          <div className="text-xs text-muted-foreground">Homes Powered</div>
                        </div>
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{project.impact.jobsCreated}</div>
                          <div className="text-xs text-muted-foreground">Jobs Created</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="w-full">
                        View Project Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Partner with Us on Your Next Project
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Ready to bring renewable energy solutions to your community or business? 
            Let's discuss how we can create a sustainable energy future together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Download Portfolio
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;