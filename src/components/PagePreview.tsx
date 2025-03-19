
import React from 'react';
import { cn } from '@/lib/utils';

interface PagePreviewProps {
  pageNumber: number;
  layoutId: string;
  isActive: boolean;
  onSelect: () => void;
  layoutThumbnails: Record<string, string>;
}

const PagePreview: React.FC<PagePreviewProps> = ({
  pageNumber,
  layoutId,
  isActive,
  onSelect,
  layoutThumbnails,
}) => {
  return (
    <div
      className={cn(
        "relative p-1 rounded-md transition-all duration-300 ease-in-out",
        isActive 
          ? "bg-primary/10 ring-1 ring-primary/30" 
          : "bg-transparent hover:bg-secondary/80"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden aspect-[3/4] rounded-md cursor-pointer border transition-all duration-300",
          isActive ? "border-primary shadow-sm" : "border-muted hover:border-muted-foreground/30"
        )}
        onClick={onSelect}
      >
        <img
          src={layoutThumbnails[layoutId] || '/placeholder.svg'}
          alt={`Page ${pageNumber} preview`}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-gradient-to-t from-black/40 to-transparent">
          <span className="text-xs font-medium text-white">Page {pageNumber}</span>
        </div>
      </div>
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary/10 animate-fade-in"></div>
      )}
    </div>
  );
};

export default PagePreview;
