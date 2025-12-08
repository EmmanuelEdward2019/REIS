import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingEnergyMetrics from './FloatingEnergyMetrics';
import heroRenewableIntegration from '@/assets/hero-renewable-integration.jpg';
import heroResidentialSolar from '@/assets/hero-residential-solar.jpg';
import heroTrainingFacility from '@/assets/hero-training-facility.jpg';
import heroEnergyStorageSystems from '@/assets/hero-energy-storage-systems.jpg';

const slides = [
  {
    id: 1,
    title: 'REIS Integration',
    subtitle: 'Renewable Energy Integrated Systems',
    description: 'Advanced offshore renewable energy integration with AI-powered optimization',
    image: heroRenewableIntegration,
    cta1: 'Order Now',
    cta1Link: '/shop',
    cta2: 'Learn More',
    cta2Link: '/about',
    price: 'Starting at $2.5M'
  },
  {
    id: 2,
    title: 'Residential Solar',
    subtitle: 'Smart Home Energy Solutions',
    description: 'Complete residential solar installations with battery storage systems',
    image: heroResidentialSolar,
    cta1: 'Get Quote',
    cta1Link: '/reis',
    cta2: 'Learn More',
    cta2Link: '/about',
    price: 'Starting at $15,000'
  },
  {
    id: 3,
    title: 'Training Academy',
    subtitle: 'Professional Development',
    description: 'Comprehensive training programs for renewable energy professionals',
    image: heroTrainingFacility,
    cta1: 'Enroll Now',
    cta1Link: '/lms',
    cta2: 'View Courses',
    cta2Link: '/lms',
    price: 'Starting at $500'
  },
  {
    id: 4,
    title: 'Energy Storage',
    subtitle: 'Grid-Scale Battery & Hydrogen Solutions',
    description: 'Industrial energy storage systems with Eagle & Thistle branding',
    image: heroEnergyStorageSystems,
    cta1: 'Order Now',
    cta1Link: '/shop',
    cta2: 'Learn More',
    cta2Link: '/about',
    price: 'Starting at $500K'
  },
  {
    id: 5,
    title: 'Engineering a Cleaner, Smarter Future.',
    subtitle: 'Sustainable Innovation',
    description: 'Join us in transforming the energy landscape with cutting-edge renewable solutions',
    image: heroRenewableIntegration,
    cta1: 'Explore REIS',
    cta1Link: '/reis',
    cta2: 'Join as Partner',
    cta2Link: '/become-a-partner',
    price: 'Partnership Opportunities Available'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoplay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoplay(false);
  };

  return (
    <section className="relative h-[85vh] overflow-hidden">
      <FloatingEnergyMetrics />
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-start justify-center pt-24">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                <div className="text-white">
                  <div className="mb-8">
                    <div className="text-sm font-medium opacity-90 mb-2 underline underline-offset-4">{slide.subtitle}</div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg mb-3 opacity-90 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                    <div className="text-base font-medium mb-8">
                      {slide.price}
                    </div>
                  </div>

                  <div className="flex flex-row gap-4 justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="flex-1 max-w-[200px] px-6 py-3 text-base font-medium bg-primary text-white hover:bg-primary/90 rounded-md transition-colors"
                    >
                      <Link to={slide.cta1Link}>{slide.cta1}</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="flex-1 max-w-[200px] px-6 py-3 text-base font-medium bg-gray-200 hover:bg-gray-300 text-black border-gray-300 rounded-md transition-colors"
                    >
                      <Link to={slide.cta2Link}>{slide.cta2}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Tesla style */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors hidden md:flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5 text-black" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors hidden md:flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5 text-black" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;