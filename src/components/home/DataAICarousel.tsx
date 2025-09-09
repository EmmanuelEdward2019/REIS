import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const dataAIProducts = [
  {
    id: 1,
    title: 'AI-Powered Analytics',
    subtitle: 'Intelligent Energy Management',
    description: 'Advanced AI chatbots and analytics platforms that optimize energy consumption, predict maintenance needs, and provide real-time insights for maximum efficiency.',
    image: '/lovable-uploads/14519926-36cd-4536-893d-d86ae346591a.png',
    cta1: 'Explore AI Solutions',
    cta2: 'Request Demo',
    price: 'Starting at $50K'
  },
  {
    id: 2,
    title: 'Global Data Intelligence',
    subtitle: 'Worldwide Energy Insights',
    description: 'Harness the power of global data networks and holographic interfaces to monitor, analyze, and optimize energy systems across multiple locations and time zones.',
    image: '/lovable-uploads/c674919a-db90-4606-a986-db6447308d8f.png',
    cta1: 'View Platform',
    cta2: 'Learn More',
    price: 'Enterprise Solutions'
  },
  {
    id: 3,
    title: 'Carbon Reduction Analytics',
    subtitle: 'Eagle & Thistle Dashboard',
    description: 'Comprehensive carbon footprint analysis with real-time tracking, behavioral change recommendations, and detailed environmental impact reporting.',
    image: '/lovable-uploads/71161c08-3920-48fd-aced-b2b0999ad040.png',
    cta1: 'Try Dashboard',
    cta2: 'Get Started',
    price: 'Custom Pricing'
  }
];

const DataAICarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dataAIProducts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dataAIProducts.length);
    setIsAutoplay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dataAIProducts.length) % dataAIProducts.length);
    setIsAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoplay(false);
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Data & AI
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Revolutionizing energy management through artificial intelligence and advanced data analytics
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative h-[600px] overflow-hidden">
        {dataAIProducts.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="text-blue-300 text-sm font-medium mb-2 uppercase tracking-wide">
                    {product.subtitle}
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                    {product.title}
                  </h3>
                  <p className="text-lg text-gray-200 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="text-cyan-300 font-semibold mb-8 text-lg">
                    {product.price}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      asChild
                      size="lg" 
                      className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium"
                    >
                      <Link to="/data-ai">{product.cta1}</Link>
                    </Button>
                    <Button 
                      asChild
                      size="lg" 
                      variant="outline"
                      className="px-8 py-3 border-white/30 text-white hover:bg-white/10 font-medium"
                    >
                      <Link to="/solutions">{product.cta2}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors hidden md:flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors hidden md:flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {dataAIProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataAICarousel;