import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
const products = [
  {
    id: 1,
    title: 'Solaris Systems',
    model: 'LIGHTBOX to ULTRAGRIDE',
    image: '/lovable-uploads/b6450dea-940c-4706-9e7b-3adfa0b8c3cb.png',
    description: 'Complete range of solar energy storage solutions for every need'
  },
  {
    id: 2,
    title: 'Community Lighting',
    model: 'Solar Village',
    image: '/lovable-uploads/a0b4d24a-a102-4800-8a4f-c35888e7c359.png',
    description: 'Empowering communities with sustainable solar-powered infrastructure'
  },
  {
    id: 3,
    title: 'Point of Sale Systems',
    model: 'Solar POS',
    image: '/lovable-uploads/7286c659-1089-4352-be3a-0e60950b0289.png',
    description: 'Solar-powered payment and communication systems for remote locations'
  },
  {
    id: 4,
    title: 'Cyber Cafe Solutions',
    model: 'Connected',
    image: '/lovable-uploads/ed58d01d-4b26-4d11-9c91-d54c61f0fde0.png',
    description: 'Complete solar-powered internet cafe and learning centers'
  },
  {
    id: 5,
    title: 'Commercial Services',
    model: 'Business Solar',
    image: '/lovable-uploads/f5f08cbc-a641-4cac-874c-e3e94350784c.png',
    description: 'Solar solutions for barber shops, salons, and small businesses'
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
          {products.map((product, index) => (
            <CarouselItem 
              key={product.id} 
              className="pl-4 md:pl-0 basis-full md:basis-[400px] lg:basis-[450px]"
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
                  <div className="space-y-2 md:space-y-4">
                    <h3 className="text-lg md:text-2xl lg:text-3xl font-medium">
                      {product.model}
                    </h3>
                    <p className="text-sm md:text-lg lg:text-xl font-light max-w-md opacity-90">
                      {product.description}
                    </p>
                    
                    {/* Buttons */}
                    <div className="flex flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-sm font-medium transition-colors text-sm md:text-base"
                      >
                        Order Now
                      </Button>
                      <Button 
                        variant="outline"
                        className="bg-gray-200 hover:bg-gray-300 text-black border-gray-300 px-4 md:px-8 py-2 md:py-3 rounded-sm font-medium transition-colors text-sm md:text-base"
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
        <div className="absolute md:bottom-8 -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {products.map((_, index) => (
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

export default ProductCarousel;