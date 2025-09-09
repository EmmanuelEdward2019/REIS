import React from 'react';
import { Button } from '@/components/ui/button';
import heroRenewableIntegration from '@/assets/hero-renewable-integration.jpg';
import heroDataAnalytics from '@/assets/hero-data-analytics.jpg';
import heroTrainingFacility from '@/assets/hero-training-facility.jpg';

const sections = [
  {
    id: 1,
    title: 'REIS',
    subtitle: 'Limited Time: 25% Off Solar Installations',
    image: heroRenewableIntegration,
    link: '/reis'
  },
  {
    id: 2,
    title: 'Data & AI',
    subtitle: 'Free Analytics Platform Trial',
    image: heroDataAnalytics,
    link: '/data-and-ai'
  },
  {
    id: 3,
    title: 'Learning Management System',
    subtitle: 'Professional Certification Bundle',
    image: heroTrainingFacility,
    link: '/lms'
  }
];

const CurrentOffers = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-muted rounded-lg p-8 flex items-center justify-between min-h-[200px]"
            >
              {/* Left Content */}
              <div className="flex-1 pr-6">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {section.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {section.subtitle}
                </p>
                <Button 
                  className="bg-background text-foreground hover:bg-background/90 border border-border font-medium"
                  onClick={() => (window.location.hash = section.link.startsWith('/') ? `#${section.link}` : `#/${section.link}`)}
                >
                  Learn More
                </Button>
              </div>
              
              {/* Right Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentOffers;