import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import productCommercialSolar from '@/assets/product-commercial-solar.jpg';
import productAnalyticsPlatform from '@/assets/product-analytics-platform.jpg';
import productTrainingSuite from '@/assets/product-training-suite.jpg';
import productGridStorage from '@/assets/product-grid-storage.jpg';

const products = [
  {
    id: 1,
    name: 'REIS Commercial Solar',
    category: 'Renewable Energy Systems',
    image: productCommercialSolar,
    price: 'Starting at $50,000',
    features: ['25-year warranty', 'AI optimization', '99.9% uptime'],
    description: 'Complete commercial solar solutions with integrated energy management'
  },
  {
    id: 2,
    name: 'Energy Analytics Platform',
    category: 'Data & AI',
    image: productAnalyticsPlatform,
    price: 'Starting at $5,000/mo',
    features: ['Real-time monitoring', 'Predictive maintenance', 'Custom dashboards'],
    description: 'AI-powered analytics for maximum energy efficiency and cost optimization'
  },
  {
    id: 3,
    name: 'Professional Training Suite',
    category: 'Learning Management',
    image: productTrainingSuite,
    price: 'Starting at $500',
    features: ['Certified instructors', 'Hands-on labs', 'Industry certificates'],
    description: 'Comprehensive training programs for renewable energy professionals'
  },
  {
    id: 4,
    name: 'Grid Storage Systems',
    category: 'Energy Storage',
    image: productGridStorage,
    price: 'Starting at $25,000',
    features: ['Scalable design', 'Smart grid integration', '15-year lifespan'],
    description: 'Industrial-grade battery storage with intelligent grid management'
  }
];

const ProductCarousel = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our Product Range
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive renewable energy solutions designed for the future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group relative overflow-hidden rounded-none ${
                index < 2 ? 'md:aspect-[4/3]' : 'md:aspect-[4/3]'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <div className="mb-4">
                  <div className="text-sm font-medium opacity-90 mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                    {product.name}
                  </h3>
                  <p className="text-lg opacity-90 mb-4">
                    {product.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="text-lg font-medium mb-6">
                    {product.price}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="bg-white text-black hover:bg-white/90 rounded-none font-medium"
                  >
                    Order Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-black rounded-none font-medium"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;