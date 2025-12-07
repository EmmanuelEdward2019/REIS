import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';
import heroTrainingFacility from '@/assets/hero-training-facility.jpg';

const LMS = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] min-h-[500px] bg-gradient-to-r from-primary/20 to-accent/20 pt-32 pb-20">
        <div className="absolute inset-0">
          <img
            src={heroTrainingFacility}
            alt="Learning Management System"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Learning Management System
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Comprehensive training and certification platform designed for professional development and organizational learning.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Courses
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
                Free Preview
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Professional Learning Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced learning management system with certification programs, compliance training, and skill development courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Certification</h3>
              <p className="text-muted-foreground">Industry-recognized certification programs for career advancement.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Course Development</h3>
              <p className="text-muted-foreground">Custom content creation and curriculum development services.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Training</h3>
              <p className="text-muted-foreground">Collaborative learning environments for organizational development.</p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Compliance Training</h3>
              <p className="text-muted-foreground">Regulatory compliance and safety training programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Professional Certification Bundle
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Save 40% when you bundle 3 or more professional certification courses. Advance your career with industry-recognized credentials.
              </p>
              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Interactive learning modules and assessments
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Progress tracking and analytics
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Mobile-friendly learning platform
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Expert instructor support
                </li>
              </ul>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View Certification Bundle
              </Button>
            </div>
            <div className="bg-background rounded-lg p-8">
              <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-16 h-16 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contact our learning specialists to design a custom training program for your organization.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Contact Learning Team
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default LMS;