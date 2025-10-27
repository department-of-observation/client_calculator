import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onCategorySelect,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-card border-r border-border z-50 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Filter by Category</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Category List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => handleCategoryClick('all')}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

