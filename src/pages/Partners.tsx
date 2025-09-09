import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, MapPin, Star, Users, Zap, Shield, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "SolarTech Solutions Ltd",
      type: "Installation Company",
      location: "London, UK",
      rating: 4.9,
      projects: 150,
      capacity: "500 kW/week",
      specialties: ["Commercial", "Industrial", "Grid Connection"],
      verified: true,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "GreenEnergy Nigeria",
      type: "System Integrator",
      location: "Lagos, Nigeria",
      rating: 4.8,
      projects: 89,
      capacity: "2 MW/week",
      specialties: ["Oil & Gas", "Offshore", "Energy Storage"],
      verified: true,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Nordic Renewables AB",
      type: "Engineering Consultancy",
      location: "Stockholm, Sweden",
      rating: 4.9,
      projects: 200,
      capacity: "Design only",
      specialties: ["Wind", "Grid Integration", "SCADA/Controls"],
      verified: true,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "EcoInstall Pro",
      type: "Installation Company",
      location: "Manchester, UK",
      rating: 4.7,
      projects: 75,
      capacity: "300 kW/week",
      specialties: ["Residential", "Commercial", "Energy Storage"],
      verified: true,
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "African Solar Dynamics",
      type: "Marketing Company",
      location: "Accra, Ghana",
      rating: 4.8,
      projects: 45,
      capacity: "Sales & Distribution",
      specialties: ["Residential", "Business Marketing", "E-commerce"],
      verified: true,
      image: "/placeholder.svg"
    },
    {
      id: 6,
      name: "PowerGrid Solutions",
      type: "System Integrator",
      location: "Dublin, Ireland",
      rating: 4.9,
      projects: 120,
      capacity: "1 MW/week",
      specialties: ["Industrial", "Grid Protection", "Smart Grid"],
      verified: true,
      image: "/placeholder.svg"
    }
  ];

  const stats = [
    { icon: Users, label: "Active Partners", value: "150+" },
    { icon: Globe, label: "Countries", value: "25+" },
    { icon: Zap, label: "Total Capacity", value: "50 GW" },
    { icon: Award, label: "Completed Projects", value: "2,500+" }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Installation Company':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'System Integrator':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Engineering Consultancy':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'Marketing Company':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Global Partner Network</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our Trusted
              <span className="block text-primary">Partners</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Meet our certified partners who deliver exceptional renewable energy solutions across the globe. 
              Join our network and expand your business with industry-leading support and resources.
            </p>
            
            <Link to="/become-a-partner">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="text-center border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Featured Partners
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our certified partners who are driving the renewable energy revolution worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
                <Card key={partner.id} className="group hover-lift border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={partner.image} alt={partner.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                          {partner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {partner.name}
                          </CardTitle>
                          {partner.verified && (
                            <Shield className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <Badge variant="outline" className={getTypeColor(partner.type)}>
                          {partner.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{partner.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{partner.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-secondary/20 rounded-lg">
                        <div className="text-lg font-bold text-foreground">{partner.projects}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center p-3 bg-secondary/20 rounded-lg">
                        <div className="text-xs font-bold text-foreground">{partner.capacity}</div>
                        <div className="text-xs text-muted-foreground">Capacity</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-sm font-medium text-foreground mb-2">Specialties:</div>
                      <div className="flex flex-wrap gap-1">
                        {partner.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {partner.specialties.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{partner.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Join Our Partner Network?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Expand your business with our comprehensive partner program. Access training, resources, 
              and a global network of renewable energy professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/become-a-partner">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" size="lg">
                  Partner Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Partners;