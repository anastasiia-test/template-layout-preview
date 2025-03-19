import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, X, Check, PenTool, Pages, Columns, Save, Undo, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import PagePreview from './PagePreview';
import LayoutOption from './LayoutOption';

// Types
interface LayoutOption {
  id: string;
  name: string;
  description: string;
  thumbnailSrc: string;
}

interface Page {
  pageNumber: number;
  selectedLayoutId: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pages: Page[]) => void;
  initialPages?: Page[];
  layouts: LayoutOption[];
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPages = [],
  layouts,
}) => {
  // Setup initial state - default to 2 pages with first layout each
  const [pages, setPages] = useState<Page[]>(
    initialPages.length > 0 
      ? initialPages 
      : [
          { pageNumber: 1, selectedLayoutId: layouts[0]?.id || '' },
          { pageNumber: 2, selectedLayoutId: layouts[0]?.id || '' },
        ]
  );
  
  const [activePageNumber, setActivePageNumber] = useState(1);
  const [layoutThumbnails, setLayoutThumbnails] = useState<Record<string, string>>({});
  
  // Create a map of layout IDs to their thumbnails for easy access
  useEffect(() => {
    const thumbnails: Record<string, string> = {};
    layouts.forEach(layout => {
      thumbnails[layout.id] = layout.thumbnailSrc;
    });
    setLayoutThumbnails(thumbnails);
  }, [layouts]);

  // Handle page layout selection
  const selectLayout = (layoutId: string) => {
    setPages(prevPages =>
      prevPages.map(page =>
        page.pageNumber === activePageNumber
          ? { ...page, selectedLayoutId: layoutId }
          : page
      )
    );
  };

  // Navigate to previous/next page
  const navigatePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && activePageNumber > 1) {
      setActivePageNumber(prev => prev - 1);
    } else if (direction === 'next' && activePageNumber < pages.length) {
      setActivePageNumber(prev => prev + 1);
    }
  };

  // Add a new page (up to 4 max)
  const addPage = () => {
    if (pages.length < 4) {
      const newPageNumber = pages.length + 1;
      setPages(prev => [...prev, { pageNumber: newPageNumber, selectedLayoutId: layouts[0]?.id || '' }]);
      setActivePageNumber(newPageNumber);
    }
  };

  // Remove a page (keeping at least 2)
  const removePage = (pageNumber: number) => {
    if (pages.length <= 2) return; // Maintain at least 2 pages
    
    const newPages = pages.filter(page => page.pageNumber !== pageNumber)
      .map((page, index) => ({ ...page, pageNumber: index + 1 }));
    
    setPages(newPages);
    setActivePageNumber(prev => (prev > newPages.length ? newPages.length : prev));
  };

  // Handle saving template configuration
  const handleSave = () => {
    onSave(pages);
    onClose();
  };

  // Get the active page's selected layout
  const activePage = pages.find(page => page.pageNumber === activePageNumber);
  const selectedLayoutId = activePage?.selectedLayoutId || '';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PenTool size={18} className="text-primary" />
              <DialogTitle className="text-xl font-medium">Template Configuration</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
          <DialogDescription className="pt-2">
            Select layouts for each page of your template. Navigation between pages and customize the layout for each.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Left sidebar - Page previews */}
          <div className="w-full sm:w-48 border-r bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Pages size={16} className="mr-2" />
                Pages
              </h3>
              {pages.length < 4 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={addPage}
                >
                  + Add
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {pages.map((page) => (
                <div key={page.pageNumber} className="relative">
                  <PagePreview
                    pageNumber={page.pageNumber}
                    layoutId={page.selectedLayoutId}
                    isActive={activePageNumber === page.pageNumber}
                    onSelect={() => setActivePageNumber(page.pageNumber)}
                    layoutThumbnails={layoutThumbnails}
                  />
                  {pages.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-muted/70 hover:bg-destructive hover:text-white transition-colors"
                      onClick={() => removePage(page.pageNumber)}
                    >
                      <X size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Active page navigation */}
            <div className="flex items-center justify-between px-6 py-3 border-b">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigatePage('prev')}
                  disabled={activePageNumber <= 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm font-medium">
                  Page {activePageNumber} of {pages.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigatePage('next')}
                  disabled={activePageNumber >= pages.length}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center px-2 py-1 bg-muted rounded-md">
                  <Columns size={16} className="mr-2 text-muted-foreground" />
                  <span className="text-xs font-medium">Select Layout</span>
                </div>
              </div>
            </div>
            
            {/* Layout options */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Choose Layout for Page {activePageNumber}</h2>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                      <Info size={12} />
                      <span>Click on a layout to apply it</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Each layout offers a different content structure for this page.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {layouts.map(layout => (
                    <LayoutOption
                      key={layout.id}
                      id={layout.id}
                      name={layout.name}
                      thumbnailSrc={layout.thumbnailSrc}
                      description={layout.description}
                      isSelected={selectedLayoutId === layout.id}
                      onSelect={selectLayout}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter className="border-t px-6 py-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" className="flex items-center gap-2" onClick={onClose}>
              <Undo size={16} />
              Cancel
            </Button>
            <Button className="flex items-center gap-2" onClick={handleSave}>
              <Save size={16} />
              Save Template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
