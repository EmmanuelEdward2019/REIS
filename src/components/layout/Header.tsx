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
                  <div className="absolute top-full left-0 w-screen bg-background border-t border-border shadow-2xl z-50">
                    <div className="max-w-[1400px] mx-auto px-12 py-16">
                      <div className="grid grid-cols-4 gap-12">
                        {/* Solar Solutions */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={megaMenuReis} 
                              alt="Solar Solutions"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-4 text-lg">Solar Solutions</h3>
                            <ul className="space-y-3">
                              <li><a href="/reis/residential-solar" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Residential Solar</a></li>
                              <li><a href="/reis/commercial-solar" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Commercial Solar</a></li>
                              <li><a href="/reis/utility-scale" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Utility Scale</a></li>
                              <li><a href="/reis/solar-wind-hybrid" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Solar-Wind Hybrid</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Energy Storage */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={megaMenuReis} 
                              alt="Energy Storage"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-4 text-lg">Energy Storage</h3>
                            <ul className="space-y-3">
                              <li><a href="/reis/battery-systems" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Battery Systems</a></li>
                              <li><a href="/reis/grid-storage" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Grid Storage</a></li>
                              <li><a href="/reis/hydrogen-solutions" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Hydrogen Solutions</a></li>
                              <li><a href="/reis/micro-storage" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Micro Storage</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Marine Energy */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={megaMenuReis} 
                              alt="Marine Energy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-4 text-lg">Marine Energy</h3>
                            <ul className="space-y-3">
                              <li><a href="/reis/offshore-wind" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Offshore Wind</a></li>
                              <li><a href="/reis/tidal-energy" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Tidal Energy</a></li>
                              <li><a href="/reis/wave-power" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Wave Power</a></li>
                              <li><a href="/reis/floating-solar" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Floating Solar</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 space-y-4">
                          <h4 className="text-lg font-bold text-foreground">REIS Platform</h4>
                          <p className="text-foreground/70 text-sm leading-relaxed">Experience our comprehensive renewable energy infrastructure solutions designed for the future.</p>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            Explore REIS
                          </Button>
                          <div className="pt-4 border-t border-border/50">
                            <p className="text-xs text-foreground/60">Trusted by 500+ organizations worldwide</p>
                          </div>
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
                  <div className="absolute top-full left-0 w-screen bg-background border-t border-border shadow-2xl z-50">
                    <div className="max-w-[1400px] mx-auto px-12 py-16">
                      <div className="grid grid-cols-3 gap-16">
                        {/* Analytics & Strategy */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={megaMenuDataAI} 
                              alt="Analytics & Strategy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-4 text-lg">Analytics & Strategy</h3>
                            <ul className="space-y-3">
                              <li><a href="/data-ai/strategy" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">AI Strategy</a></li>
                              <li><a href="/data-ai/analytics" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Data Analytics</a></li>
                              <li><a href="/data-ai/ml" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Machine Learning</a></li>
                              <li><a href="/data-ai/engineering" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Data Engineering</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Solutions & Security */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={megaMenuDataAI} 
                              alt="Solutions & Security"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-4 text-lg">Solutions & Security</h3>
                            <ul className="space-y-3">
                              <li><a href="/data-ai/products" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">AI Products</a></li>
                              <li><a href="/data-ai/security" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Security Solutions</a></li>
                              <li><a href="/data-ai/geospatial" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Geospatial Analytics</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 space-y-4">
                          <h4 className="text-lg font-bold text-foreground">AI Innovation Hub</h4>
                          <p className="text-foreground/70 text-sm leading-relaxed">Transform your business with cutting-edge AI and data analytics solutions.</p>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            Discover AI Solutions
                          </Button>
                          <div className="pt-4 border-t border-border/50">
                            <p className="text-xs text-foreground/60">99.9% uptime guarantee</p>
                          </div>
                        </div>
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
                  <div className="absolute top-full left-0 w-screen bg-background border-t border-border shadow-2xl z-50">
                    <div className="max-w-[1400px] mx-auto px-12 py-16">
                      <div className="grid grid-cols-3 gap-16">
                        {/* Learning Systems */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={megaMenuTraining} 
                              alt="Learning Systems"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-4 text-lg">Learning Systems</h3>
                            <ul className="space-y-3">
                              <li><a href="/training/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">LMS Platform</a></li>
                              <li><a href="/training/content" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Content Development</a></li>
                              <li><a href="/training/professional" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Professional Programs</a></li>
                              <li><a href="/training/compliance" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Compliance Training</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Specialized Training */}
                        <div className="space-y-6">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={megaMenuTraining} 
                              alt="Specialized Training"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-4 text-lg">Specialized Training</h3>
                            <ul className="space-y-3">
                              <li><a href="/training/vocational" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Vocational Training</a></li>
                              <li><a href="/training/assessment" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Assessment Tools</a></li>
                              <li><a href="/training/advisory" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Advisory Services</a></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 space-y-4">
                          <h4 className="text-lg font-bold text-foreground">Training Excellence</h4>
                          <p className="text-foreground/70 text-sm leading-relaxed">Empower your workforce with comprehensive training solutions and professional development.</p>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            Start Training
                          </Button>
                          <div className="pt-4 border-t border-border/50">
                            <p className="text-xs text-foreground/60">25,000+ certified professionals</p>
                          </div>
                        </div>
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