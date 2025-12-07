import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, MapPin, Video, Users, Clock, ArrowRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  is_virtual: boolean;
  meeting_link: string | null;
  price_ngn: number | null;
  price_gbp: number | null;
  status: string;
  featured_image: string | null;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .neq('status', 'cancelled')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const isPast = new Date(event.start_date) < new Date();
    return filter === 'upcoming' ? !isPast : isPast;
  });

  // Sort past events descending (newest past event first)
  if (filter === 'past') {
    filteredEvents.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  }

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
            <h1 className="text-4xl font-bold mb-4">Events & Webinars</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our upcoming workshops, training sessions, and industry conferences.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              className="w-32"
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              onClick={() => setFilter('past')}
              className="w-32"
            >
              Past Events
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="flex flex-col h-full hover:shadow-md transition-shadow border-border">
                <div className="h-48 bg-muted relative overflow-hidden rounded-t-xl">
                  {event.featured_image ? (
                    <img
                      src={event.featured_image}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <Calendar className="h-12 w-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                    {event.event_type}
                  </Badge>
                  {event.price_ngn === 0 || event.price_ngn === null ? (
                    <Badge variant="secondary" className="absolute bottom-4 left-4 bg-green-500/90 text-white hover:bg-green-600/90">
                      Free
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="absolute bottom-4 left-4">
                      Starting from ₦{event.price_ngn?.toLocaleString()}
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.start_date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(event.start_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.is_virtual ? (
                        <>
                          <Video className="h-4 w-4" />
                          <span>Virtual Event</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          <span>{event.location || 'TBA'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full group" disabled={filter === 'past'}>
                    {filter === 'upcoming' ? 'Register Now' : 'Event Ended'}
                    {filter === 'upcoming' && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No {filter} events found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
