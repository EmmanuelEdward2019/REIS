import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import videoInstallationProcess from '@/assets/video-installation-process.jpg';
import videoAnalyticsDashboard from '@/assets/video-analytics-dashboard.jpg';
import videoTrainingExcellence from '@/assets/video-training-excellence.jpg';

const videoProducts = [
  {
    id: 1,
    title: 'REIS in Action',
    subtitle: 'See Our Commercial Solar Installation Process',
    video: '/api/placeholder/800/450', // Would be actual video
    thumbnail: videoInstallationProcess,
    description: 'Watch our certified technicians install a complete commercial solar system in under 48 hours',
    duration: '3:42',
    cta: 'Get Installation Quote'
  },
  {
    id: 2,
    title: 'AI Analytics Dashboard',
    subtitle: 'Real-Time Energy Optimization',
    video: '/api/placeholder/800/450',
    thumbnail: videoAnalyticsDashboard,
    description: 'See how our AI platform optimizes energy usage and reduces costs by up to 30%',
    duration: '2:18',
    cta: 'Try Free Demo'
  },
  {
    id: 3,
    title: 'Training Excellence',
    subtitle: 'Professional Development Programs',
    video: '/api/placeholder/800/450',
    thumbnail: videoTrainingExcellence,
    description: 'Experience our hands-on training facilities and expert-led certification programs',
    duration: '4:15',
    cta: 'Explore Courses'
  }
];

const VideoProductCarousel = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const toggleVideo = (id: number) => {
    setPlayingVideo(playingVideo === id ? null : id);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            See Our Solutions in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real projects, real results. Watch how we're transforming the energy landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {videoProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-background border border-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-muted">
                {playingVideo === product.id ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    {/* This would be actual video player */}
                    <div className="text-white text-center">
                      <div className="mb-4">Video Playing...</div>
                      <Button
                        onClick={() => toggleVideo(product.id)}
                        variant="outline"
                        size="sm"
                        className="text-white border-white hover:bg-white hover:text-black"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                      <button
                        onClick={() => toggleVideo(product.id)}
                        className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200 group-hover:scale-110 transform transition-transform"
                      >
                        <Play className="w-6 h-6 text-black ml-1" />
                      </button>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {product.duration}
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-sm font-medium text-primary mb-1">
                    {product.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <Button className="w-full rounded-none font-medium">
                  {product.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16 bg-muted/30 rounded-lg p-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Energy Infrastructure?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of businesses who have already made the switch to intelligent renewable energy systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-none font-medium">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" className="rounded-none font-medium">
              View All Case Studies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoProductCarousel;