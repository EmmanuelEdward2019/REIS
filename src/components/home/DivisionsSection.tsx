import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Users, Brain, Headphones, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const DivisionsSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">

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
              <Link to="/support">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                  <Headphones className="w-5 h-5 mr-2" />
                  Services & Support
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/become-a-partner">
                <Button variant="outline" size="lg">
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