import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Link } from 'react-router-dom';

const dataAIProducts = [
  {
    id: 1,
    title: 'Data & AI',
    model: 'AI-Powered Analytics',
    description: 'Advanced AI chatbots and analytics platforms that optimize energy consumption and predict maintenance needs.',
    image: '/lovable-uploads/14519926-36cd-4536-893d-d86ae346591a.png',
    cta1: 'Explore AI Solutions',
    cta2: 'Request Demo'
  },
  {
    id: 2,
    title: 'Data & AI',
    model: 'Global Data Intelligence',
    description: 'Harness the power of global data networks and holographic interfaces to monitor and optimize energy systems.',
    image: '/lovable-uploads/c674919a-db90-4606-a986-db6447308d8f.png',
    cta1: 'View Platform',
    cta2: 'Learn More'
  },
  {
    id: 3,
    title: 'Data & AI',
    model: 'Carbon Reduction Analytics',
    description: 'Comprehensive carbon footprint analysis with real-time tracking and behavioral change recommendations.',
    image: '/lovable-uploads/71161c08-3920-48fd-aced-b2b0999ad040.png',
    cta1: 'Try Dashboard',
    cta2: 'Get Started'
  }
];

const DataAICarousel = () => {
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
    <section className="relative px-4 md:px-0 md:py-16 lg:py-20">
      <Carousel 
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4 md:ml-[30px] md:gap-6 lg:gap-8">
          {dataAIProducts.map((product, index) => (
            <CarouselItem 
              key={product.id} 
              className="pl-4 md:pl-0 basis-full md:basis-[65%] lg:basis-[70%]"
            >
              <div className="relative h-[70vh] md:h-[75vh] lg:h-[80vh] min-h-[500px] md:min-h-[600px] overflow-hidden rounded-2xl">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 lg:p-16 text-white">
                  {/* Top Left Title */}
                  <div className="flex-1">
                    <h2 className="text-xl md:text-3xl lg:text-5xl font-light tracking-wide">
                      {product.title}
                    </h2>
                  </div>

                  {/* Bottom Left Content */}
                  <div className="relative space-y-2 md:space-y-4">
                    {/* Transparent overlay behind text */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-lg -m-4"></div>
                    
                    <div className="relative p-4">
                      <h3 className="text-lg md:text-2xl lg:text-3xl font-medium">
                        {product.model}
                      </h3>
                      <p className="text-sm md:text-lg lg:text-xl font-light max-w-md opacity-90">
                        {product.description}
                      </p>
                      
                      {/* Buttons */}
                      <div className="flex flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                        <Button 
                          asChild
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-sm font-medium transition-colors text-sm md:text-base"
                        >
                          <Link to="/data-ai">{product.cta1}</Link>
                        </Button>
                        <Button 
                          asChild
                          variant="outline"
                          className="bg-gray-200 hover:bg-gray-300 text-black border-gray-300 px-4 md:px-8 py-2 md:py-3 rounded-sm font-medium transition-colors text-sm md:text-base"
                        >
                          <Link to="/solutions">{product.cta2}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Dots */}
        <div className="absolute md:bottom-8 bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {dataAIProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                current === index + 1
                  ? 'bg-white md:bg-white bg-primary scale-125'
                  : 'bg-white/50 md:bg-white/50 bg-primary/50 hover:bg-white/75 md:hover:bg-white/75 hover:bg-primary/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default DataAICarousel;