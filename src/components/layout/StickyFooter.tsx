import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const StickyFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            className="flex-1 max-w-[200px] px-6 py-3 text-sm font-medium bg-background text-foreground border-border hover:bg-muted rounded-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask a Question
          </Button>
          <Button 
            asChild
            className="flex-1 max-w-[200px] px-6 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
          >
            <Link to="/client-dashboard">
              <Calendar className="w-4 h-4 mr-2" />
              Get a Quote
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyFooter;