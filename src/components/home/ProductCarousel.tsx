import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import productCommercialSolar from '@/assets/product-commercial-solar.jpg';
import productAnalyticsPlatform from '@/assets/product-analytics-platform.jpg';
import productTrainingSuite from '@/assets/product-training-suite.jpg';
import productGridStorage from '@/assets/product-grid-storage.jpg';

const products = [
  {
    id: 1,
    title: 'Commercial Solar',
    model: 'REIS Pro',
    image: productCommercialSolar,
    description: 'Complete commercial solar solutions with integrated energy management'
  },
  {
    id: 2,
    title: 'Energy Analytics',
    model: 'Platform AI',
    image: productAnalyticsPlatform,
    description: 'AI-powered analytics for maximum energy efficiency and cost optimization'
  },
  {
    id: 3,
    title: 'Training Suite',
    model: 'Professional',
    image: productTrainingSuite,
    description: 'Comprehensive training programs for renewable energy professionals'
  },
  {
    id: 4,
    title: 'Grid Storage',
    model: 'Systems Pro',
    image: productGridStorage,
    description: 'Industrial-grade battery storage with intelligent grid management'
  }
];

const ProductCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="relative">
      <Carousel 
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {products.map((product, index) => (
            <CarouselItem key={product.id} className="pl-0 basis-[85%] md:basis-[90%]">
              <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-16 text-white">
                  {/* Top Left Title */}
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-light tracking-wide">
                      {product.title}
                    </h2>
                  </div>

                  {/* Bottom Left Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-medium">
                      {product.model}
                    </h3>
                    <p className="text-lg md:text-xl font-light max-w-md opacity-90">
                      {product.description}
                    </p>
                    
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-sm font-medium transition-colors"
                      >
                        Order Now
                      </Button>
                      <Button 
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 text-black border-gray-300 px-8 py-3 rounded-sm font-medium transition-colors"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                current === index + 1
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;