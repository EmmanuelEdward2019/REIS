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
import { useRegion } from '@/contexts/RegionContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

const Services = () => {
  const { t } = useTranslation();
  const { formatCurrency, convertPrice } = useRegion();
  const navigate = useNavigate();

  // Base prices in NGN
  const basePrices = {
    installation: 8330000, // ~$5,000 USD
    training: 4165000,     // ~$2,500 USD
    support: 1666000,      // ~$1,000 USD per month
    basic: 833000,         // ~$500/month
    premium: 2499000,      // ~$1,500/month
  };

  const serviceCategories = [
    {
      id: 'performance',
      title: t('services.performance.title'),
      icon: BarChart3,
      description: t('services.performance.description'),
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
      title: t('services.maintenance.title'),
      icon: Wrench,
      description: t('services.maintenance.description'),
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
      title: t('services.monitoring.title'),
      icon: Settings,
      description: t('services.monitoring.description'),
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
      title: t('services.consultation.title'),
      icon: Users,
      description: t('services.consultation.description'),
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
      title: t('services.installation.title'),
      description: t('services.installation.description'),
      icon: Zap,
      features: ['Site Assessment', 'Professional Installation', 'System Commissioning', 'Quality Assurance'],
      price: basePrices.installation
    },
    {
      title: t('services.training.title'),
      description: t('services.training.description'),
      icon: Award,
      features: ['Technical Training', 'Safety Certification', 'Operational Training', 'Ongoing Support'],
      price: basePrices.training
    },
    {
      title: t('services.support_247.title'),
      description: t('services.support_247.description'),
      icon: Headphones,
      features: ['24/7 Monitoring', 'Emergency Response', 'Remote Diagnostics', 'Priority Support'],
      price: basePrices.support
    }
  ];

  const supportTiers = [
    {
      name: 'Basic Support',
      price: basePrices.basic,
      features: [
        'Business hours support',
        'Email support',
        'Monthly reports',
        'Basic monitoring'
      ]
    },
    {
      name: 'Premium Support',
      price: basePrices.premium,
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
      price: null, // Custom pricing
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

  const handleLearnMore = (serviceId: string) => {
    toast.info(`Learn more about ${serviceId} - Contact us for details`);
    // Navigate to contact page or open modal
    navigate('/support');
  };

  const handleGetQuote = (serviceName: string) => {
    toast.success(`Quote request for ${serviceName} submitted! We'll contact you soon.`);
    // Could open a quote request modal or navigate to contact form
  };

  const handleChoosePlan = (planName: string) => {
    toast.success(`${planName} selected! Redirecting to checkout...`);
    // Navigate to checkout or subscription page
    setTimeout(() => {
      navigate('/support');
    }, 1500);
  };

  const handleContactSales = () => {
    navigate('/support');
  };

  const handleScheduleConsultation = () => {
    toast.success('Consultation request submitted! Our team will contact you within 24 hours.');
    navigate('/support');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5 pt-24">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            {t('services.badge')}
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t('services.title').split(' ').slice(0, 1).join(' ')}
            <span className="block text-primary">{t('services.title').split(' ').slice(1).join(' ')}</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">{t('services.projects_completed')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">{t('services.support_available')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">{t('services.uptime_guarantee')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t('services.portfolio_title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.portfolio_description')}
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
                    <Button
                      className="w-full mt-6"
                      variant="outline"
                      onClick={() => handleLearnMore(category.id)}
                    >
                      {t('services.learn_more')}
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
              {t('services.specialized_title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.specialized_description')}
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
                      {t('services.starting_at')} {formatCurrency(convertPrice(service.price))}
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleGetQuote(service.title)}
                    >
                      {t('services.get_quote')}
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
              {t('services.support_plans_title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.support_plans_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                    {t('services.most_popular')}
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary mt-2">
                    {tier.price ? (
                      <>
                        {formatCurrency(convertPrice(tier.price))}
                        <span className="text-sm font-normal text-muted-foreground">{t('services.per_month')}</span>
                      </>
                    ) : (
                      t('services.custom_pricing')
                    )}
                  </div>
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
                  <Button
                    className={`w-full ${tier.popular ? '' : 'variant-outline'}`}
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => handleChoosePlan(tier.name)}
                  >
                    {t('services.choose_plan')}
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
            {t('services.cta_title')}
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t('services.cta_description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="px-8"
              onClick={handleContactSales}
            >
              {t('services.contact_sales')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleScheduleConsultation}
            >
              {t('services.schedule_consultation')}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;