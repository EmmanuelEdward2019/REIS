import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, HelpCircle, Globe, UserCircle, ChevronRight } from 'lucide-react';
import megaMenuReis from '@/assets/mega-menu-reis.jpg';
import megaMenuDataAI from '@/assets/mega-menu-data-ai.jpg';
import megaMenuTraining from '@/assets/mega-menu-training.jpg';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuState, setMobileMenuState] = useState({
    reis: false,
    dataAi: false,
    lms: false
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const megaMenus = {
    reis: {
      title: 'REIS',
      sections: [
        {
          title: 'Solar Solutions',
          image: megaMenuReis,
          items: [
            { name: 'Solar Systems', href: '/reis' },
            { name: 'Solar-Wind Hybrid', href: '/reis' },
            { name: 'Energy Storage', href: '/reis' },
            { name: 'Hydrogen Solutions', href: '/reis' }
          ]
        },
        {
          title: 'Advanced Systems',
          image: megaMenuReis,
          items: [
            { name: 'Tidal Energy', href: '/reis' },
            { name: 'Offshore Solutions', href: '/reis' },
            { name: 'Micro Systems', href: '/reis' }
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
            { name: 'AI Strategy', href: '/data-and-ai' },
            { name: 'Data Analytics', href: '/data-and-ai' },
            { name: 'Machine Learning', href: '/data-and-ai' },
            { name: 'Data Engineering', href: '/data-and-ai' }
          ]
        },
        {
          title: 'Solutions & Security',
          image: megaMenuDataAI,
          items: [
            { name: 'AI Products', href: '/data-and-ai' },
            { name: 'Security Solutions', href: '/data-and-ai' },
            { name: 'Geospatial Analytics', href: '/data-and-ai' }
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
            { name: 'LMS Platform', href: '/lms' },
            { name: 'Content Development', href: '/lms' },
            { name: 'Professional Programs', href: '/lms' },
            { name: 'Compliance Training', href: '/lms' }
          ]
        },
        {
          title: 'Specialized Training',
          image: megaMenuTraining,
          items: [
            { name: 'Vocational Training', href: '/lms' },
            { name: 'Assessment Tools', href: '/lms' },
            { name: 'Advisory Services', href: '/lms' }
          ]
        }
      ]
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border' 
          : 'bg-transparent'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - Far Left */}
            <div className="flex items-center mr-auto">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/76f8e1a6-f2ed-41a8-ac1e-dbcff484f1ea.png" 
                  alt="Eagle & Thistle Group" 
                  className={`h-10 w-auto transition-all duration-300 ${
                    isScrolled ? 'brightness-100' : 'brightness-0 invert'
                  }`}
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {/* REIS Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveMega('reis')}
                onMouseLeave={() => setActiveMega(null)}
              >
                <Link to="/reis" className={`flex items-center space-x-1 hover:text-primary transition-colors font-medium ${
                  isScrolled ? 'text-foreground' : 'text-white'
                }`}>
                  <span>REIS</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
                
                {activeMega === 'reis' && (
                  <div className="fixed top-16 left-0 right-0 w-full bg-background/95 backdrop-blur-md border-t border-border shadow-2xl z-50">
                    <div className="max-w-[1400px] mx-auto px-8 py-10">
                      <div className="grid grid-cols-4 gap-8">
                        {/* Solar Solutions */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/76f8e1a6-f2ed-41a8-ac1e-dbcff484f1ea.png" 
                              alt="Solar Solutions"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">Solar Solutions</h3>
                            <ul className="space-y-2">
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Residential Solar</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Commercial Solar</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Utility Scale</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Solar-Wind Hybrid</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Energy Storage */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/a0b4d24a-a102-4800-8a4f-c35888e7c359.png" 
                              alt="Energy Storage"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">Energy Storage</h3>
                            <ul className="space-y-2">
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Battery Systems</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Grid Storage</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Hydrogen Solutions</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Micro Storage</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Marine Energy */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/b6450dea-940c-4706-9e7b-3adfa0b8c3cb.png" 
                              alt="Marine Energy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">Marine Energy</h3>
                            <ul className="space-y-2">
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Offshore Wind</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Tidal Energy</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Wave Power</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Floating Solar</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-3">
                          <h4 className="text-base font-bold text-foreground">REIS Platform</h4>
                          <p className="text-foreground/70 text-xs leading-relaxed">Experience our comprehensive renewable energy infrastructure solutions designed for the future.</p>
                          <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            Explore REIS
                          </Button>
                          <div className="pt-3 border-t border-border/50">
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
                <Link to="/data-and-ai" className={`flex items-center space-x-1 hover:text-primary transition-colors font-medium whitespace-nowrap ${
                  isScrolled ? 'text-foreground' : 'text-white'
                }`}>
                  <span>Data & AI</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
                
                {activeMega === 'data-ai' && (
                  <div className="fixed top-16 left-0 right-0 w-full bg-background/95 backdrop-blur-md border-t border-border shadow-2xl z-50">
                    <div className="max-w-[1400px] mx-auto px-8 py-10">
                      <div className="grid grid-cols-3 gap-10">
                        {/* Analytics & Strategy */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/14519926-36cd-4536-893d-d86ae346591a.png" 
                              alt="Analytics & Strategy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">Analytics & Strategy</h3>
                            <ul className="space-y-2">
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">AI Strategy</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Data Analytics</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Machine Learning</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Data Engineering</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Solutions & Security */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/c674919a-db90-4606-a986-db6447308d8f.png" 
                              alt="Solutions & Security"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">Solutions & Security</h3>
                            <ul className="space-y-2">
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">AI Products</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Security Solutions</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Geospatial Analytics</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-3">
                          <h4 className="text-base font-bold text-foreground">AI Innovation Hub</h4>
                          <p className="text-foreground/70 text-xs leading-relaxed">Transform your business with cutting-edge AI and data analytics solutions.</p>
                          <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            Discover AI Solutions
                          </Button>
                          <div className="pt-3 border-t border-border/50">
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
                <Link to="/lms" className={`flex items-center space-x-1 hover:text-primary transition-colors font-medium ${
                  isScrolled ? 'text-foreground' : 'text-white'
                }`}>
                  <span>LMS</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
                
                {activeMega === 'training' && (
                  <div className="fixed top-16 left-0 right-0 w-full bg-background/95 backdrop-blur-md border-t border-border shadow-2xl z-50">
                    <div className="max-w-[1400px] mx-auto px-8 py-10">
                      <div className="grid grid-cols-3 gap-10">
                        {/* Learning Systems */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/71161c08-3920-48fd-aced-b2b0999ad040.png" 
                              alt="Learning Systems"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">Learning Systems</h3>
                            <ul className="space-y-2">
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">LMS Platform</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Content Development</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Professional Programs</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Compliance Training</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Specialized Training */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/ed58d01d-4b26-4d11-9c91-d54c61f0fde0.png" 
                              alt="Specialized Training"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">Specialized Training</h3>
                            <ul className="space-y-2">
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Vocational Training</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Assessment Tools</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">Advisory Services</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-3">
                          <h4 className="text-base font-bold text-foreground">Training Excellence</h4>
                          <p className="text-foreground/70 text-xs leading-relaxed">Empower your workforce with comprehensive training solutions and professional development.</p>
                          <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            Start Training
                          </Button>
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-xs text-foreground/60">25,000+ certified professionals</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/partners" className={`hover:text-primary transition-colors font-medium ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>Partners</Link>
              <Link to="/services" className={`hover:text-primary transition-colors font-medium ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>Services</Link>
              <Link to="/projects" className={`hover:text-primary transition-colors font-medium ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>Projects</Link>
              <Link to="/calculators" className={`hover:text-primary transition-colors font-medium ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>Calculators</Link>
              <Link to="/shop" className={`hover:text-primary transition-colors font-medium ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>Shop</Link>
              <Link to="/support" className={`hover:text-primary transition-colors font-medium ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>Support</Link>
              <Link to="/about" className={`hover:text-primary transition-colors font-medium ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>About</Link>
            </nav>

            {/* Tesla-style Icons - Far Right */}
            <div className="hidden lg:flex items-center space-x-3 ml-auto">
              <Button variant="ghost" size="sm" className={`p-2 transition-colors ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
              }`} title="Support">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className={`p-2 transition-colors ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
              }`} title="Region & Language">
                <Globe className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className={`p-2 transition-colors ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
              }`} title="Account" asChild>
                <Link to="/auth">
                  <UserCircle className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Mobile menu button and icons */}
            <div className="lg:hidden">
              {/* Menu button with text only */}
              <Button 
                variant="ghost" 
                className="px-3 py-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="text-sm font-medium">Menu</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-border bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* REIS Dropdown */}
                <Collapsible 
                  open={mobileMenuState.reis} 
                  onOpenChange={(open) => setMobileMenuState(prev => ({ ...prev, reis: open }))}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-foreground hover:text-primary font-medium">
                    <span>REIS</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${mobileMenuState.reis ? 'rotate-90' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Residential Solar</Link>
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Commercial Solar</Link>
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Battery Systems</Link>
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Offshore Wind</Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Data & AI Dropdown */}
                <Collapsible 
                  open={mobileMenuState.dataAi} 
                  onOpenChange={(open) => setMobileMenuState(prev => ({ ...prev, dataAi: open }))}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-foreground hover:text-primary font-medium">
                    <span>Data & AI</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${mobileMenuState.dataAi ? 'rotate-90' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">AI Strategy</Link>
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Data Analytics</Link>
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">AI Products</Link>
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Security Solutions</Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* LMS Dropdown */}
                <Collapsible 
                  open={mobileMenuState.lms} 
                  onOpenChange={(open) => setMobileMenuState(prev => ({ ...prev, lms: open }))}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-foreground hover:text-primary font-medium">
                    <span>LMS</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${mobileMenuState.lms ? 'rotate-90' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">LMS Platform</Link>
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Content Development</Link>
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Professional Programs</Link>
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">Vocational Training</Link>
                  </CollapsibleContent>
                </Collapsible>

                <Link to="/partners" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Partners</Link>
                <Link to="/services" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Services</Link>
                <Link to="/projects" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Projects</Link>
                <Link to="/calculators" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Calculators</Link>
                <Link to="/shop" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Shop</Link>
                <Link to="/support" className="block px-3 py-2 text-foreground hover:text-primary font-medium">Support</Link>
                <Link to="/about" className="block px-3 py-2 text-foreground hover:text-primary font-medium">About</Link>
                
                {/* Tesla-style Icons in mobile menu */}
                <div className="border-t border-border mt-4 pt-4 px-3">
                  <div className="flex items-center justify-center space-x-6">
                    <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3" title="Support">
                      <HelpCircle className="w-6 h-6" />
                      <span className="text-xs">Support</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3" title="Region & Language">
                      <Globe className="w-6 h-6" />
                      <span className="text-xs">Region</span>
                    </Button>
                      <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3" title="Account" asChild>
                        <Link to="/auth">
                          <UserCircle className="w-6 h-6" />
                          <span className="text-xs">Account</span>
                        </Link>
                      </Button>
                  </div>
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