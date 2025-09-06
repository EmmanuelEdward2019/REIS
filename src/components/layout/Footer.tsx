import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Links - Single Row with 6 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About</a></li>
              <li><a href="/about#leadership" className="text-muted-foreground hover:text-primary transition-colors text-sm">Leadership</a></li>
              <li><a href="/about#governance" className="text-muted-foreground hover:text-primary transition-colors text-sm">Governance</a></li>
              <li><a href="/about#iso" className="text-muted-foreground hover:text-primary transition-colors text-sm">IMS & ISO</a></li>
              <li><a href="/about#hseq" className="text-muted-foreground hover:text-primary transition-colors text-sm">HSEQ</a></li>
              <li><a href="/careers" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</a></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Solutions</h3>
            <ul className="space-y-3">
              <li><a href="/solutions/reis" className="text-muted-foreground hover:text-primary transition-colors text-sm">REIS</a></li>
              <li><a href="/solutions/data-ai" className="text-muted-foreground hover:text-primary transition-colors text-sm">Data & AI</a></li>
              <li><a href="/solutions/training" className="text-muted-foreground hover:text-primary transition-colors text-sm">Training & LMS</a></li>
              <li><a href="/solutions/offshore" className="text-muted-foreground hover:text-primary transition-colors text-sm">Offshore</a></li>
              <li><a href="/solutions/micro" className="text-muted-foreground hover:text-primary transition-colors text-sm">Micro Packs</a></li>
            </ul>
          </div>

          {/* Services & Support Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Services & Support</h3>
            <ul className="space-y-3">
              <li><a href="/services/performance" className="text-muted-foreground hover:text-primary transition-colors text-sm">Performance</a></li>
              <li><a href="/services/maintenance" className="text-muted-foreground hover:text-primary transition-colors text-sm">Maintenance</a></li>
              <li><a href="/support/ticket" className="text-muted-foreground hover:text-primary transition-colors text-sm">Ticket</a></li>
              <li><a href="/support/warranty" className="text-muted-foreground hover:text-primary transition-colors text-sm">Warranty</a></li>
              <li><a href="/support/downloads" className="text-muted-foreground hover:text-primary transition-colors text-sm">Downloads</a></li>
            </ul>
          </div>

          {/* Tools & Calculators Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Tools & Calculators</h3>
            <ul className="space-y-3">
              <li><a href="/calculators" className="text-muted-foreground hover:text-primary transition-colors text-sm">CO₂</a></li>
              <li><a href="/calculators" className="text-muted-foreground hover:text-primary transition-colors text-sm">Carbon Credit</a></li>
              <li><a href="/calculators" className="text-muted-foreground hover:text-primary transition-colors text-sm">Energy</a></li>
              <li><a href="/calculators" className="text-muted-foreground hover:text-primary transition-colors text-sm">Bill</a></li>
              <li><a href="/calculators" className="text-muted-foreground hover:text-primary transition-colors text-sm">REIS Score</a></li>
            </ul>
          </div>

          {/* Compliance & Docs Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Compliance & Docs</h3>
            <ul className="space-y-3">
              <li><a href="/compliance/iso-certs" className="text-muted-foreground hover:text-primary transition-colors text-sm">ISO Certs</a></li>
              <li><a href="/compliance/policies" className="text-muted-foreground hover:text-primary transition-colors text-sm">Policies</a></li>
              <li><a href="/compliance/abs" className="text-muted-foreground hover:text-primary transition-colors text-sm">ABS</a></li>
              <li><a href="/compliance/dnv" className="text-muted-foreground hover:text-primary transition-colors text-sm">DNV</a></li>
              <li><a href="/compliance/nerc" className="text-muted-foreground hover:text-primary transition-colors text-sm">NERC</a></li>
              <li><a href="/compliance/ncdmb" className="text-muted-foreground hover:text-primary transition-colors text-sm">NCDMB</a></li>
            </ul>
          </div>

          {/* Locations & Contact Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Locations & Contact</h3>
            <ul className="space-y-3">
              <li><a href="/locations/uk-hq" className="text-muted-foreground hover:text-primary transition-colors text-sm">UK HQ</a></li>
              <li><a href="/locations/nigeria-hq" className="text-muted-foreground hover:text-primary transition-colors text-sm">Nigeria HQ</a></li>
              <li><a href="/locations/asaba" className="text-muted-foreground hover:text-primary transition-colors text-sm">Asaba Office</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Form</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter and Social Media Section - New Row */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-base">Stay Updated</h3>
              <p className="text-muted-foreground text-sm">
                Subscribe to our newsletter for the latest updates on renewable energy solutions and industry insights.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-muted border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-base">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.017 0H7.983C3.58 0 0 3.58 0 7.983v4.034C0 16.42 3.58 20 7.983 20h4.034C16.42 20 20 16.42 20 12.017V7.983C20 3.58 16.42 0 12.017 0zM10 15A5 5 0 1110 5a5 5 0 010 10zm6.408-10.845a1.44 1.44 0 01-1.44-1.44 1.44 1.44 0 111.44 1.44z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <span>© 2025 Eagle & Thistle. All rights reserved.</span>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/governance" className="hover:text-primary transition-colors">Governance</a>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>🌱 Carbon Neutral Operations</span>
            <span>•</span>
            <span>ISO 14001 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;