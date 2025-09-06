import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  BarChart3, 
  Shield, 
  Headphones, 
  Settings, 
  Zap,
  Award,
  Clock,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Services = () => {
  const serviceCategories = [
    {
      id: 'performance',
      title: 'Performance Services',
      icon: BarChart3,
      description: 'Optimize system performance and maximize energy output',
      services: [
        'System Performance Analysis',
        'Energy Output Optimization',
        'Predictive Analytics',
        'Performance Reporting',
        'Efficiency Audits'
      ]
    },
    {
      id: 'maintenance',
      title: 'Maintenance & Support',
      icon: Wrench,
      description: 'Comprehensive maintenance and technical support services',
      services: [
        'Preventive Maintenance',
        'Emergency Repairs',
        '24/7 Technical Support',
        'Component Replacement',
        'System Upgrades'
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Analytics',
      icon: Settings,
      description: 'Real-time system monitoring and data analytics',
      services: [
        'Real-time Monitoring',
        'Data Analytics Dashboard',
        'Alert Management',
        'Performance Metrics',
        'Custom Reporting'
      ]
    },
    {
      id: 'consultation',
      title: 'Consultation & Advisory',
      icon: Users,
      description: 'Expert consultation and strategic advisory services',
      services: [
        'System Design Consultation',
        'Feasibility Studies',
        'Regulatory Compliance',
        'Financial Advisory',
        'Project Management'
      ]
    }
  ];

  const specializedServices = [
    {
      title: 'Installation Services',
      description: 'Professional installation by certified technicians',
      icon: Zap,
      features: ['Site Assessment', 'Professional Installation', 'System Commissioning', 'Quality Assurance'],
      price: 'Starting at $5,000'
    },
    {
      title: 'Training & Certification',
      description: 'Comprehensive training programs for your team',
      icon: Award,
      features: ['Technical Training', 'Safety Certification', 'Operational Training', 'Ongoing Support'],
      price: 'Starting at $2,500'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock technical support and monitoring',
      icon: Headphones,
      features: ['24/7 Monitoring', 'Emergency Response', 'Remote Diagnostics', 'Priority Support'],
      price: 'Starting at $1,000/mo'
    }
  ];

  const supportTiers = [
    {
      name: 'Basic Support',
      price: '$500/month',
      features: [
        'Business hours support',
        'Email support',
        'Monthly reports',
        'Basic monitoring'
      ]
    },
    {
      name: 'Premium Support',
      price: '$1,500/month',
      features: [
        '24/7 support',
        'Phone & email support',
        'Weekly reports',
        'Advanced monitoring',
        'Priority response',
        'Remote diagnostics'
      ],
      popular: true
    },
    {
      name: 'Enterprise Support',
      price: 'Custom pricing',
      features: [
        'Dedicated support team',
        'On-site support',
        'Real-time monitoring',
        'Custom SLA',
        'Dedicated account manager',
        'Quarterly business reviews'
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5 pt-24">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Professional Services
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Comprehensive
            <span className="block text-primary">Energy Services</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            From installation to ongoing support, our comprehensive service portfolio ensures 
            optimal performance and maximum return on your renewable energy investment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Service Portfolio
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive services designed to maximize the performance and longevity of your renewable energy systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover-lift">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.services.map((service, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{service}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant="outline">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="section-padding bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Specialized Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert services tailored to your specific needs and requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specializedServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-variant rounded-full mx-auto mb-4 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-muted-foreground">
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-lg font-bold text-primary mb-4">
                      {service.price}
                    </div>
                    <Button className="w-full">
                      Get Quote
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Support Plans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the support level that best fits your needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary mt-2">{tier.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.popular ? '' : 'variant-outline'}`}>
                    Choose Plan
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
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Contact our team to discuss your service needs and get a customized solution that fits your requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              Contact Sales Team
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

export default Services;