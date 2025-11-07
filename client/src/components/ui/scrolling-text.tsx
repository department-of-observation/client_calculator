import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollingTextProps {
  text: string;
  className?: string;
  speed?: number; // pixels per second
}

export function ScrollingText({ text, className, speed = 30 }: ScrollingTextProps) {
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.scrollWidth;
        setIsOverflowing(textWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  const animationDuration = React.useMemo(() => {
    if (!isOverflowing || !textRef.current) return 0;
    const textWidth = textRef.current.scrollWidth;
    return textWidth / speed;
  }, [isOverflowing, speed, text]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={textRef}
        className={cn(
          "whitespace-nowrap inline-block",
          isOverflowing && isHovered && "animate-scroll"
        )}
        style={
          isOverflowing && isHovered
            ? {
                animation: `scroll ${animationDuration}s linear infinite`,
              }
            : undefined
        }
      >
        {text}
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% + ${containerRef.current?.offsetWidth || 0}px));
          }
        }
      `}</style>
    </div>
  );
}
