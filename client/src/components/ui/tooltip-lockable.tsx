import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface TooltipLockableProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  lockDuration?: number; // milliseconds to hold before locking
}

export function TooltipLockable({ 
  content, 
  children, 
  className,
  lockDuration = 3000 
}: TooltipLockableProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const progressIntervalRef = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isLocked) return;

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8
      });
    }
    
    setIsVisible(true);
    setProgress(0);

    // Start progress animation
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / lockDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        setIsLocked(true);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }, 16); // ~60fps
  };

  const handleMouseLeave = () => {
    if (isLocked) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsVisible(false);
    setProgress(0);
  };

  const handleClose = () => {
    setIsLocked(false);
    setIsVisible(false);
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  if (!content) return <>{children}</>;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block relative"
      >
        {children}
        {isVisible && progress > 0 && progress < 100 && (
          <div className="absolute top-2 right-2 pointer-events-none">
            <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                className="text-primary transition-all"
                opacity="0.8"
              />
            </svg>
          </div>
        )}
      </div>
      {isVisible && (
        <div
          className={cn(
            "fixed z-50 max-w-sm rounded-md bg-popover px-4 py-3 text-sm text-popover-foreground shadow-xl border border-border animate-in fade-in-0 zoom-in-95 max-h-96 overflow-y-auto",
            className
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {isLocked && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className={cn("whitespace-pre-line leading-relaxed", isLocked && "pr-6")}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

