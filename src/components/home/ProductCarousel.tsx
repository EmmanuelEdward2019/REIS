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
    <section className="relative">
      <Carousel 
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {products.map((product, index) => (
            <CarouselItem key={product.id} className="pl-4 basis-[80%] md:basis-[85%]">
              <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-2xl"
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
                        className="bg-gray-200 hover:bg-gray-300 text-black border-gray-300 px-8 py-3 rounded-sm font-medium transition-colors"
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