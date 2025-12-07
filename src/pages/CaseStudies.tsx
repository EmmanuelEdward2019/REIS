import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Zap, Building2, MapPin, ArrowRight, Quote } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  project_type: string;
  location: string | null;
  system_size_kw: number | null;
  energy_savings_percent: number | null;
  roi_months: number | null;
  testimonial: string | null;
  testimonial_author: string | null;
  status: string;
  is_featured: boolean;
  challenge: string | null;
  solution: string | null;
  results: string | null;
}

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how we've helped businesses and homeowners achieve energy independence and sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-border overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  <div className="bg-muted p-6 flex flex-col justify-center relative min-h-[200px]">
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {study.project_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-center space-y-4">
                      {study.system_size_kw && (
                        <div>
                          <p className="text-3xl font-bold text-primary">{study.system_size_kw}kW</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">System Size</p>
                        </div>
                      )}
                      {study.energy_savings_percent && (
                        <div>
                          <p className="text-3xl font-bold text-green-600">{study.energy_savings_percent}%</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Energy Savings</p>
                        </div>
                      )}
                      {study.roi_months && (
                        <div>
                          <p className="text-3xl font-bold text-blue-600">{study.roi_months} Mo</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">ROI Period</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium text-foreground">{study.client_name}</span>
                        {study.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {study.location}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {study.challenge || study.results}
                      </p>
                    </div>

                    {study.testimonial && (
                      <div className="mt-auto mb-6 bg-muted/50 p-4 rounded-lg italic text-sm relative">
                        <Quote className="h-4 w-4 text-muted-foreground/40 absolute top-2 left-2" />
                        <p className="pl-4 text-muted-foreground">"{study.testimonial}"</p>
                        {study.testimonial_author && (
                          <p className="text-xs font-medium mt-2 text-right">— {study.testimonial_author}</p>
                        )}
                      </div>
                    )}

                    <Button variant="outline" className="w-full mt-auto group">
                      View Case Study
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {caseStudies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No case studies published yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CaseStudies;
