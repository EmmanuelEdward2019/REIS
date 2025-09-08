import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, Users, Award, Globe, Leaf, Shield } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability First',
      description: 'Every decision we make prioritizes environmental impact and long-term sustainability.'
    },
    {
      icon: Target,
      title: 'Innovation Driven',
      description: 'We push the boundaries of technology to create more efficient renewable energy solutions.'
    },
    {
      icon: Users,
      title: 'Partnership Focused',
      description: 'We believe in collaborative approaches that empower communities and businesses.'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'ISO 14001 certified operations ensure the highest standards in everything we do.'
    }
  ];

  const certifications = [
    'ISO 14001 Environmental Management',
    'ISO 9001 Quality Management',
    'OHSAS 18001 Health & Safety',
    'Carbon Neutral Operations',
    'B-Corp Certified',
    'Green Energy Certified'
  ];

  const leadership = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Executive Officer',
      bio: '20+ years in renewable energy, former Tesla Energy executive',
      expertise: 'Strategic Leadership, Clean Energy Policy'
    },
    {
      name: 'Marcus Thompson',
      role: 'Chief Technology Officer',
      bio: 'PhD in Electrical Engineering, pioneered smart grid technologies',
      expertise: 'AI Systems, Grid Integration'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Chief Sustainability Officer',
      bio: 'Environmental scientist and sustainability advocate',
      expertise: 'Environmental Impact, ESG Strategy'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              About Eagle & Thistle
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Pioneering the Future of
              <span className="block text-primary">Sustainable Energy</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Founded on the principle that sustainable energy should be accessible, efficient, and intelligent, 
              Eagle & Thistle has grown to become a global leader in integrated renewable energy solutions.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">2018</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Eagle & Thistle - USPs */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              About Eagle & Thistle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Innovative</h3>
                <p className="text-muted-foreground">
                  Cutting-edge technology and forward-thinking solutions that push the boundaries of renewable energy.
                </p>
              </div>
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Sustainable</h3>
                <p className="text-muted-foreground">
                  Environmental stewardship at the core of every decision, driving long-term sustainable impact.
                </p>
              </div>
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Scalable</h3>
                <p className="text-muted-foreground">
                  Solutions designed to grow from local communities to global implementations seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Statement */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Our Sustainability Commitment
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              At Eagle & Thistle, sustainability isn't just a goal—it's our foundation. We operate under comprehensive 
              ESG principles with a strong focus on HSEQ standards, serving both African and global markets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <Shield className="w-6 h-6 text-primary mr-3" />
                  ESG Principles
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Environmental responsibility, social impact, and governance excellence guide every aspect of our operations. 
                  We measure success not just in financial terms, but in our positive contribution to communities and the planet.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <Award className="w-6 h-6 text-primary mr-3" />
                  HSEQ Focus
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Health, Safety, Environment, and Quality are integrated into our core operations. Our comprehensive 
                  management systems ensure we deliver excellence while protecting our people and the environment.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <Globe className="w-6 h-6 text-primary mr-3" />
                  African & Global Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rooted in African innovation with a global perspective, we develop solutions that address local needs 
                  while meeting international standards. Our vision extends from community empowerment to worldwide 
                  sustainable energy transformation.
                </p>
              </div>
              
              <div className="p-6 bg-background rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-3">Our Commitments</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center"><div className="w-2 h-2 bg-primary rounded-full mr-3"></div>Carbon neutral operations by 2024</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-primary rounded-full mr-3"></div>50% renewable energy workforce training by 2025</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-primary rounded-full mr-3"></div>Community impact programs in 25+ countries</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-primary rounded-full mr-3"></div>Zero waste to landfill manufacturing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To accelerate the global transition to sustainable energy through innovative renewable 
                    energy systems, intelligent data analytics, and comprehensive professional training programs.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A world powered by clean, intelligent, and accessible renewable energy systems that 
                    benefit communities, businesses, and the environment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {values.map((value) => {
                const IconComponent = value.icon;
                return (
                  <Card key={value.title} className="hover-lift">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced leadership team brings together decades of expertise in renewable energy, 
              technology, and sustainable business practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader) => (
              <Card key={leader.name} className="text-center hover-lift">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-variant rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{leader.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {leader.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {leader.bio}
                  </p>
                  <div className="text-xs text-foreground font-medium">
                    {leader.expertise}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Certifications */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Governance */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-8 h-8 text-primary" />
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Governance & Compliance
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Integrated Management System (IMS)
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our comprehensive IMS integrates quality, environmental, and health & safety 
                    management systems to ensure consistent, high-standard operations across all divisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Health, Safety, Environment & Quality (HSEQ)
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    HSEQ is at the core of our operations, ensuring the safety of our employees, 
                    protection of the environment, and delivery of high-quality solutions.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Certifications */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-primary" />
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Certifications & Standards
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-medium text-foreground">{cert}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Global Impact</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Carbon neutral operations since 2020, with a commitment to net-negative emissions by 2025.
                </p>
                <Button variant="outline" size="sm">
                  View Sustainability Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Join us in creating a sustainable energy future. Whether you're looking for renewable energy solutions, 
            AI-driven optimization, or professional training programs, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              Contact Our Team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;