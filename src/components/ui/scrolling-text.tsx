import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollingTextProps {
  text: string;
  className?: string;
  speed?: number; // pixels per second
}

type TextDimensions = {
  containerWidth: number;
  textWidth: number;
};

export function ScrollingText({ text, className, speed = 30 }: ScrollingTextProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [dimensions, setDimensions] = React.useState<TextDimensions>({
    containerWidth: 0,
    textWidth: 0,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !textRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setDimensions((prev) => {
        if (prev.containerWidth === containerWidth && prev.textWidth === textWidth) {
          return prev;
        }
        return { containerWidth, textWidth };
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  const isOverflowing = dimensions.textWidth > dimensions.containerWidth;
  const animationDuration = isOverflowing ? dimensions.textWidth / speed : 0;
  const scrollOffset = Math.max(dimensions.textWidth - dimensions.containerWidth, 0);

  const animationStyles =
    isOverflowing && isHovered
      ? ({
          animation: `scroll ${animationDuration}s linear infinite`,
          "--scroll-offset": `${scrollOffset}px`,
        } as React.CSSProperties)
      : undefined;

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
        style={animationStyles}
      >
        {text}
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * var(--scroll-offset, 0px)));
          }
        }
      `}</style>
    </div>
  );
}
