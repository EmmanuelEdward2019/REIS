import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Pause } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';

const videoProducts = [
  {
    id: 1,
    title: 'Innovation Showcase',
    subtitle: 'Advanced Energy Solutions',
    videoId: 'lE3rH1Tisng',
    description: 'Discover our cutting-edge renewable energy technologies and innovative approaches',
    cta: 'Learn More'
  },
  {
    id: 2,
    title: 'Smart Infrastructure',
    subtitle: 'Next-Generation Grid Systems',
    videoId: 'oR0yoAAPsMQ',
    description: 'See how we\'re building the intelligent energy infrastructure of tomorrow',
    cta: 'Explore Solutions'
  },
  {
    id: 3,
    title: 'Sustainable Future',
    subtitle: 'Clean Energy Revolution',
    videoId: '4bu-b-QMKdk',
    description: 'Join us in creating a sustainable future through innovative renewable energy',
    cta: 'Get Started'
  },
  {
    id: 4,
    title: 'Training Excellence',
    subtitle: 'Professional Development Programs', 
    videoId: 'fVQGlBXKeD4',
    description: 'Experience our hands-on training facilities and expert-led certification programs',
    cta: 'Explore Courses'
  },
  {
    id: 5,
    title: 'AI Analytics Dashboard', 
    subtitle: 'Real-Time Energy Optimization',
    videoId: 'gYsPq1qwWBc',
    description: 'See how our AI platform optimizes energy usage and reduces costs by up to 30%',
    cta: 'Try Free Demo'
  },
  {
    id: 6,
    title: 'REIS in Action',
    subtitle: 'Commercial Solar Installation Process',
    videoId: '3s9IusiIOTI',
    description: 'Watch our certified technicians install a complete commercial solar system in under 48 hours',
    cta: 'Get Installation Quote'
  }
];

const VideoProductCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [pausedVideos, setPausedVideos] = useState<Set<number>>(new Set());

  const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});

  const postYTCommand = (iframe: HTMLIFrameElement | null | undefined, func: string, args: any[] = []) => {
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  const playVideoById = (id: number) => {
    const iframe = iframeRefs.current[id];
    if (!iframe) return;
    postYTCommand(iframe, "mute");
    postYTCommand(iframe, "playVideo");
  };

  const pauseAllVideosExcept = (id?: number) => {
    Object.entries(iframeRefs.current).forEach(([key, iframe]) => {
      const pid = Number(key);
      if (id && pid === id) return;
      postYTCommand(iframe, "pauseVideo");
    });
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

    const updateOnSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrent(selectedIndex + 1);
      const currentProductId = videoProducts[selectedIndex]?.id;
      if (currentProductId) {
        playVideoById(currentProductId);
        pauseAllVideosExcept(currentProductId);
      }
    };

    updateOnSelect();
    api.on("select", updateOnSelect);
  }, [api]);

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  const toggleVideoPause = (id: number) => {
    setPausedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        // Unpaused: resume playback
        playVideoById(id);
      } else {
        newSet.add(id);
        // Paused: pause this video's playback
        postYTCommand(iframeRefs.current[id], "pauseVideo");
      }
      return newSet;
    });
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
          {videoProducts.map((product, index) => (
            <CarouselItem 
              key={product.id} 
              className="pl-4 md:pl-0 basis-full md:basis-[65%] lg:basis-[70%]"
            >
              <div className="relative h-[70vh] md:h-[75vh] lg:h-[80vh] min-h-[500px] md:min-h-[600px] overflow-hidden rounded-2xl">
                {/* Background Video */}
                <div className="absolute inset-0">
                  <iframe
                    ref={(el) => (iframeRefs.current[product.id] = el)}
                    src={`https://www.youtube.com/embed/${product.videoId}?autoplay=1&mute=1&loop=1&playlist=${product.videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&disablekb=1&fs=0&cc_load_policy=0&start=0&end=0`}
                    className="w-full h-full rounded-2xl"
                    frameBorder="0"
                    allow="autoplay; fullscreen; encrypted-media; accelerometer; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ 
                      pointerEvents: pausedVideos.has(product.id) ? 'none' : 'auto',
                      transform: 'scale(1.05)',
                      transformOrigin: 'center center'
                    }}
                    title={`${product.title} - ${product.subtitle}`}
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
                </div>

                {/* Pause Button - Top Right */}
                <button
                  onClick={() => toggleVideoPause(product.id)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Pause className="w-5 h-5 text-white" />
                </button>

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
                        {product.subtitle}
                      </h3>
                      <p className="text-sm md:text-lg lg:text-xl font-light max-w-md opacity-90">
                        {product.description}
                      </p>
                      
                      {/* Buttons */}
                      <div className="flex flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-sm font-medium transition-colors text-sm md:text-base"
                        >
                          {product.cta}
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Dots */}
        <div className="absolute md:bottom-8 bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {videoProducts.map((_, index) => (
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
    </section>
  );
};

export default VideoProductCarousel;