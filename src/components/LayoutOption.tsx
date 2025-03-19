
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface LayoutOptionProps {
  id: string;
  name: string;
  thumbnailSrc: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const LayoutOption: React.FC<LayoutOptionProps> = ({
  id,
  name,
  thumbnailSrc,
  description,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={cn(
        "layout-option-card h-44 animate-fade-in",
        isSelected && "selected"
      )}
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="relative h-28 w-full overflow-hidden rounded-t-md">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent" />
        <img
          src={thumbnailSrc}
          alt={`${name} layout`}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 rounded-full bg-primary p-1 text-white shadow-md animate-scale-up">
            <Check size={14} />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium mb-1">{name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default LayoutOption;
