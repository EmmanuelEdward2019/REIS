import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, HelpCircle, Globe, UserCircle } from 'lucide-react';
import megaMenuReis from '@/assets/mega-menu-reis.jpg';
import megaMenuDataAI from '@/assets/mega-menu-data-ai.jpg';
import megaMenuTraining from '@/assets/mega-menu-training.jpg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);

  const megaMenus = {
    reis: {
      title: 'REIS',
      sections: [
        {
          title: 'Solar Solutions',
          image: megaMenuReis,
          items: [
            { name: 'Solar Systems', href: '/reis/solar' },
            { name: 'Solar-Wind Hybrid', href: '/reis/solar-wind' },
            { name: 'Energy Storage', href: '/reis/storage' },
            { name: 'Hydrogen Solutions', href: '/reis/hydrogen' }
          ]
        },
        {
          title: 'Advanced Systems',
          image: megaMenuReis,
          items: [
            { name: 'Tidal Energy', href: '/reis/tidal' },
            { name: 'Offshore Solutions', href: '/reis/offshore' },
            { name: 'Micro Systems', href: '/reis/micro' }
          ]
        }
      ]
    },
    'data-ai': {
      title: 'Data & AI',
      sections: [
        {
          title: 'Analytics & Strategy',
          image: megaMenuDataAI,
          items: [
            { name: 'AI Strategy', href: '/data-ai/strategy' },
            { name: 'Data Analytics', href: '/data-ai/analytics' },
            { name: 'Machine Learning', href: '/data-ai/ml' },
            { name: 'Data Engineering', href: '/data-ai/engineering' }
          ]
        },
        {
          title: 'Solutions & Security',
          image: megaMenuDataAI,
          items: [
            { name: 'AI Products', href: '/data-ai/products' },
            { name: 'Security Solutions', href: '/data-ai/security' },
            { name: 'Geospatial Analytics', href: '/data-ai/geospatial' }
          ]
        }
      ]
    },
    training: {
      title: 'Training',
      sections: [
        {
          title: 'Learning Systems',
          image: megaMenuTraining,
          items: [
            { name: 'LMS Platform', href: '/training/lms' },
            { name: 'Content Development', href: '/training/content' },
            { name: 'Professional Programs', href: '/training/professional' },
            { name: 'Compliance Training', href: '/training/compliance' }
          ]
        },
        {
          title: 'Specialized Training',
          image: megaMenuTraining,
          items: [
            { name: 'Vocational Training', href: '/training/vocational' },
            { name: 'Assessment Tools', href: '/training/assessment' },
            { name: 'Advisory Services', href: '/training/advisory' }
          ]
        }
      ]
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-foreground flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E&T</span>
                </div>
                <span>Eagle & Thistle</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {/* REIS Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveMega('reis')}
                onMouseLeave={() => setActiveMega(null)}
              >
                <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium">
                  <span>REIS</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {activeMega === 'reis' && (
                  <div className="mega-menu">
                    <div className="max-w-[90vw] mx-auto px-8 py-12">
                      <div className="grid grid-cols-3 gap-12">
                        {/* Solar Solutions Section */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={megaMenuReis} 
                              alt="Solar Solutions"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-6 text-xl">Solar Solutions</h3>
                            <ul className="space-y-4">
                              <li><a href="/reis/residential-solar" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Residential Solar</a></li>
                              <li><a href="/reis/commercial-solar" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Commercial Solar</a></li>
                              <li><a href="/reis/utility-scale" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Utility Scale</a></li>
                              <li><a href="/reis/solar-wind-hybrid" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Solar-Wind Hybrid</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Energy Storage Section */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={megaMenuReis} 
                              alt="Energy Storage"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-6 text-xl">Energy Storage</h3>
                            <ul className="space-y-4">
                              <li><a href="/reis/battery-systems" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Battery Systems</a></li>
                              <li><a href="/reis/grid-storage" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Grid Storage</a></li>
                              <li><a href="/reis/hydrogen-solutions" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Hydrogen Solutions</a></li>
                              <li><a href="/reis/micro-storage" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Micro Storage</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Marine Energy Section */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={megaMenuReis} 
                              alt="Marine Energy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-6 text-xl">Marine Energy</h3>
                            <ul className="space-y-4">
                              <li><a href="/reis/offshore-wind" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Offshore Wind</a></li>
                              <li><a href="/reis/tidal-energy" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Tidal Energy</a></li>
                              <li><a href="/reis/wave-power" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Wave Power</a></li>
                              <li><a href="/reis/floating-solar" className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">Floating Solar</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* REIS Preview Card */}
                      <div className="mt-12 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">REIS Preview</h4>
                            <p className="text-muted-foreground text-sm">Experience our renewable energy systems in action</p>
                          </div>
                          <Button className="bg-primary/90 hover:bg-primary text-white">
                            View Demo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Data & AI Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveMega('data-ai')}
                onMouseLeave={() => setActiveMega(null)}
              >
                <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium">
                  <span>Data & AI</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {activeMega === 'data-ai' && (
                  <div className="mega-menu">
                    <div className="max-w-7xl mx-auto px-8 py-12">
                      <div className="grid grid-cols-2 gap-16">
                        {megaMenus['data-ai'].sections.map((section, idx) => (
                          <div key={idx} className="space-y-6">
                            <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={section.image} 
                                alt={section.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-6 text-xl">{section.title}</h3>
                              <ul className="space-y-4">
                                {section.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Training Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveMega('training')}
                onMouseLeave={() => setActiveMega(null)}
              >
                <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium">
                  <span>Training</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {activeMega === 'training' && (
                  <div className="mega-menu">
                    <div className="max-w-7xl mx-auto px-8 py-12">
                      <div className="grid grid-cols-2 gap-16">
                        {megaMenus.training.sections.map((section, idx) => (
                          <div key={idx} className="space-y-6">
                            <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={section.image} 
                                alt={section.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-6 text-xl">{section.title}</h3>
                              <ul className="space-y-4">
                                {section.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors font-medium block text-base">
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <a href="/services" className="text-foreground hover:text-primary transition-colors font-medium">Services</a>
              <a href="/projects" className="text-foreground hover:text-primary transition-colors font-medium">Projects</a>
              <a href="/calculators" className="text-foreground hover:text-primary transition-colors font-medium">Calculators</a>
              <a href="/shop" className="text-foreground hover:text-primary transition-colors font-medium">Shop</a>
              <a href="/support" className="text-foreground hover:text-primary transition-colors font-medium">Support</a>
              <a href="/about" className="text-foreground hover:text-primary transition-colors font-medium">About</a>
            </nav>

            {/* Tesla-style Icons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="p-2" title="Support">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" title="Region & Language">
                <Globe className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" title="Account" onClick={() => window.location.href = '/auth'}>
                <UserCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-border bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="/products" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Products</a>
                <a href="/solutions" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Solutions</a>
                <a href="/projects" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Projects</a>
                <a href="/about" className="block px-3 py-2 text-foreground hover:text-primary font-medium">About</a>
                <a href="/support" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Support</a>
                <div className="border-t border-border mt-4 pt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start font-medium">Account</Button>
                  <Button className="w-full font-medium">Menu</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

    </>
  );
};

export default Header;