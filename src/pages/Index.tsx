
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import TemplateModal from '@/components/TemplateModal';
import { Layout, LayoutTemplate, PenTool, Eye } from 'lucide-react';

// Sample layout options data
const layoutOptions = [
  {
    id: 'layout-1',
    name: 'Single Column',
    description: 'Clean single column layout ideal for text-heavy content.',
    thumbnailSrc: 'https://placehold.co/600x400/e9f5ff/1a73e8?text=Single+Column',
  },
  {
    id: 'layout-2',
    name: 'Two Columns',
    description: 'Split content into two balanced columns for a magazine style.',
    thumbnailSrc: 'https://placehold.co/600x400/e9fff5/18a97e?text=Two+Columns',
  },
  {
    id: 'layout-3',
    name: 'Header & Content',
    description: 'Large header with content section below. Great for featured articles.',
    thumbnailSrc: 'https://placehold.co/600x400/fff9e9/e89b1a?text=Header+%26+Content',
  },
  {
    id: 'layout-4',
    name: 'Media Gallery',
    description: 'Showcase multiple images or videos in an elegant grid layout.',
    thumbnailSrc: 'https://placehold.co/600x400/f5e9ff/8e1ae8?text=Media+Gallery',
  },
  {
    id: 'layout-5',
    name: 'Hero Banner',
    description: 'Full-width hero image with overlaid text. Perfect for landing pages.',
    thumbnailSrc: 'https://placehold.co/600x400/ffe9e9/e81a1a?text=Hero+Banner',
  },
  {
    id: 'layout-6',
    name: 'Cards Grid',
    description: 'Organize content into structured cards for easy scanning.',
    thumbnailSrc: 'https://placehold.co/600x400/e9eeff/1a36e8?text=Cards+Grid',
  },
];

// Sample initial pages data
const initialPages = [
  { pageNumber: 1, selectedLayoutId: 'layout-1' },
  { pageNumber: 2, selectedLayoutId: 'layout-3' },
];

interface Page {
  pageNumber: number;
  selectedLayoutId: string;
}

const Index = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLayouts, setSelectedLayouts] = useState<Page[]>(initialPages);

  const handleSave = (pages: Page[]) => {
    setSelectedLayouts(pages);
    toast({
      title: "Template Saved",
      description: `Updated layout for ${pages.length} pages`,
      duration: 3000,
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Helper function to get layout name by ID
  const getLayoutName = (layoutId: string) => {
    return layoutOptions.find(layout => layout.id === layoutId)?.name || 'Unknown Layout';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30 flex flex-col">
      <header className="py-6 px-8 border-b backdrop-blur-sm bg-white/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PenTool className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-medium tracking-tight">Template Designer</h1>
            </div>
            <Button className="flex items-center space-x-2" onClick={openModal}>
              <LayoutTemplate size={16} />
              <span>Configure Template</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Layout className="h-4 w-4 mr-2" />
              Template Configuration Modal
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Design Your Perfect Template
            </h2>
            <p className="text-xl text-muted-foreground">
              Customize your template with our intuitive layout editor. 
              Choose from various layouts for each page to create a unique experience.
            </p>
            <div className="flex items-center justify-center pt-6">
              <Button size="lg" onClick={openModal} className="animate-pulse-soft">
                Open Layout Configuration
              </Button>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border p-8 animate-fade-in">
            <h3 className="text-xl font-medium mb-4">Current Template Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedLayouts.map((page) => (
                <div 
                  key={page.pageNumber} 
                  className="glass-panel rounded-lg p-4 border transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">Page {page.pageNumber}</span>
                    <div className="px-2 py-1 bg-primary/10 rounded-full text-xs text-primary font-medium">
                      {getLayoutName(page.selectedLayoutId)}
                    </div>
                  </div>
                  <div className="relative aspect-[3/4] rounded-md overflow-hidden border">
                    <img 
                      src={layoutOptions.find(l => l.id === page.selectedLayoutId)?.thumbnailSrc || '/placeholder.svg'} 
                      alt={`Page ${page.pageNumber} layout`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center p-3">
                      <div className="text-white text-sm font-medium">
                        {getLayoutName(page.selectedLayoutId)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="flex items-center gap-2" onClick={openModal}>
                <Eye size={16} />
                Review & Edit
              </Button>
            </div>
          </section>
        </div>
      </main>

      <TemplateModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialPages={selectedLayouts}
        layouts={layoutOptions}
      />

      <footer className="py-6 px-8 border-t bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          Template Designer &copy; {new Date().getFullYear()} • Built with precision and care
        </div>
      </footer>
    </div>
  );
};

export default Index;
