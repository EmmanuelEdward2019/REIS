import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Headphones, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const DivisionsSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">

        {/* Integration Highlight (CTA) */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 lg:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Seamlessly Integrated Ecosystem
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our divisions work together: REIS powers our data, AI drives decisions, and LMS ensures teams are certified on the latest tech.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/support">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg" aria-label="Go to Services & Support">
                  <Headphones className="w-5 h-5 mr-2" />
                  Services & Support
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/become-a-partner">
                <Button variant="outline" size="lg" aria-label="Become a Partner">
                  <Handshake className="w-5 h-5 mr-2" />
                  Become a Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DivisionsSection;