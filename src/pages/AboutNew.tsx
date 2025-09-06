import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

// Import video/image assets
import heroRenewableIntegration from '@/assets/hero-renewable-integration.jpg';
import heroEnergyStorage from '@/assets/hero-energy-storage.jpg';
import heroTrainingFacility from '@/assets/hero-training-facility.jpg';
import productCommercialSolar from '@/assets/product-commercial-solar.jpg';
import productAnalyticsPlatform from '@/assets/product-analytics-platform.jpg';
import videoInstallationProcess from '@/assets/video-installation-process.jpg';
import videoAnalyticsDashboard from '@/assets/video-analytics-dashboard.jpg';
import videoTrainingExcellence from '@/assets/video-training-excellence.jpg';

const AboutNew = () => {
  const videoSections = [
    {
      id: 1,
      title: 'Pioneering Renewable Energy',
      subtitle: 'Innovation at Every Scale',
      description: 'From residential solar installations to offshore energy platforms, we\'re transforming how the world generates and uses clean energy.',
      video: videoInstallationProcess,
      stats: [
        { value: '2018', label: 'Founded' },
        { value: '25+', label: 'Countries' },
        { value: '500+', label: 'Team Members' }
      ]
    },
    {
      id: 2,
      title: 'AI-Powered Analytics',
      subtitle: 'Intelligence Meets Energy',
      description: 'Our advanced analytics platform uses artificial intelligence to optimize energy systems and maximize efficiency across all our installations.',
      video: videoAnalyticsDashboard,
      stats: [
        { value: '15.2M', label: 'kWh Generated' },
        { value: '2,847', label: 'Tons CO₂ Saved' },
        { value: '98.7%', label: 'System Uptime' }
      ]
    },
    {
      id: 3,
      title: 'Professional Training',
      subtitle: 'Empowering the Next Generation',
      description: 'Through our comprehensive training programs, we\'re building the skilled workforce needed for the renewable energy transition.',
      video: videoTrainingExcellence,
      stats: [
        { value: '10,000+', label: 'Trained Professionals' },
        { value: '50+', label: 'Certification Programs' },
        { value: '95%', label: 'Job Placement Rate' }
      ]
    }
  ];

  const imageGallery = [
    {
      title: 'Offshore Innovation',
      description: 'Pioneering floating solar and wind solutions for marine environments',
      image: heroRenewableIntegration,
      fullWidth: true
    },
    {
      title: 'Energy Storage',
      description: 'Grid-scale battery and hydrogen storage systems',
      image: heroEnergyStorage,
      fullWidth: false
    },
    {
      title: 'Training Excellence',
      description: 'State-of-the-art training facilities',
      image: heroTrainingFacility,
      fullWidth: false
    },
    {
      title: 'Smart Analytics',
      description: 'Real-time monitoring and optimization platforms',
      image: productAnalyticsPlatform,
      fullWidth: true
    },
    {
      title: 'Commercial Solutions',
      description: 'Complete renewable energy systems for businesses',
      image: productCommercialSolar,
      fullWidth: false
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroRenewableIntegration}
            alt="Renewable Energy Systems"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            Accelerating the World's<br />
            <span className="text-primary">Transition to Sustainable Energy</span>
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Through innovative renewable energy systems, AI-powered analytics, and comprehensive training programs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">500+</div>
              <div className="text-sm opacity-80">Team Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold">One Mission</div>
              <div className="text-sm opacity-80">Clean Energy Future</div>
            </div>
            <div>
              <div className="text-4xl font-bold">25+</div>
              <div className="text-sm opacity-80">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Sections */}
      {videoSections.map((section, index) => (
        <section key={section.id} className="min-h-screen flex items-center">
          <div className="w-full">
            <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-screen ${
              index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
            }`}>
              {/* Video/Image Side */}
              <div className={`relative group cursor-pointer ${
                index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
              }`}>
                <div className="absolute inset-0">
                  <img
                    src={section.video}
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 text-black ml-1" />
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className={`flex items-center p-8 lg:p-16 bg-background ${
                index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
              }`}>
                <div className="max-w-xl">
                  <div className="text-sm font-medium text-primary mb-4 uppercase tracking-wider">
                    {section.subtitle}
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
                    {section.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {section.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {section.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button size="lg" className="rounded-full px-8">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Image Gallery Grid */}
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {imageGallery.map((item, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer overflow-hidden ${
                item.fullWidth ? 'lg:col-span-2' : ''
              } ${
                index === 0 ? 'lg:col-span-3' : ''
              }`}
            >
              <div className="aspect-[4/3] lg:aspect-[16/10]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12 text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-lg opacity-90 mb-6 max-w-md">
                  {item.description}
                </p>
                <Button variant="outline" className="w-fit border-white text-white hover:bg-white hover:text-black">
                  Explore
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-32 bg-background text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-8">
            One Mission
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed">
            To accelerate the global transition to sustainable energy through innovative 
            renewable energy systems, intelligent data analytics, and comprehensive 
            professional training programs that empower communities and transform industries.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-muted/30 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-3">2.8k</div>
              <div className="text-sm text-muted-foreground">Tons CO₂ Saved</div>
            </div>
            <div className="p-8 bg-muted/30 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-3">15.2M</div>
              <div className="text-sm text-muted-foreground">kWh Generated</div>
            </div>
            <div className="p-8 bg-muted/30 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-3">₦847M</div>
              <div className="text-sm text-muted-foreground">Cost Savings</div>
            </div>
          </div>

          <Button size="lg" className="px-12 py-4 text-lg rounded-full">
            Join Our Mission
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default AboutNew;