import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Star, Zap } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Limited Time: 25% Off Solar Installations',
    description: 'Get 25% off all commercial solar installations when you order before December 31st',
    badge: 'Limited Time',
    icon: Zap,
    cta: 'Get Quote',
    terms: 'Valid for new orders only. Some restrictions apply.',
    expires: 'Expires December 31, 2024'
  },
  {
    id: 2,
    title: 'Free Analytics Platform Trial',
    description: '3 months free of our AI-powered energy analytics platform with any REIS purchase',
    badge: 'New Customer',
    icon: Star,
    cta: 'Learn More',
    terms: 'New customers only. Valid with qualifying purchases.',
    expires: 'Limited time offer'
  },
  {
    id: 3,
    title: 'Professional Certification Bundle',
    description: 'Save 40% when you bundle 3 or more professional certification courses',
    badge: 'Bundle Deal',
    icon: Clock,
    cta: 'View Courses',
    terms: 'Cannot be combined with other offers.',
    expires: 'Ongoing promotion'
  }
];

const CurrentOffers = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Current Offers
          </h2>
          <p className="text-xl text-muted-foreground">
            Limited time deals on our most popular solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <div
                key={offer.id}
                className="bg-background border border-border rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Badge and Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {offer.badge}
                  </span>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {offer.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {offer.description}
                  </p>
                  
                  {/* Terms */}
                  <div className="space-y-1 text-sm text-muted-foreground/80">
                    <p>{offer.terms}</p>
                    <p className="font-medium">{offer.expires}</p>
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full rounded-none font-medium">
                  {offer.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Questions about our current offers?
          </p>
          <Button variant="outline" className="rounded-none font-medium">
            Contact Sales Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CurrentOffers;