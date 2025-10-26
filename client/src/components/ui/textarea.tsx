import { useDialogComposition } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as React from "react";

function Textarea({
  className,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: React.ComponentProps<"textarea">) {
  // Get dialog composition context if available (will be no-op if not inside Dialog)
  const dialogComposition = useDialogComposition();

  // Handle composition events for IME (Input Method Editor) support
  const handleCompositionStart = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    dialogComposition.setComposing(true);
    onCompositionStart?.(e);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    dialogComposition.markCompositionEnd();
    // Delay setting composing to false to handle Safari's event order
    setTimeout(() => {
      dialogComposition.setComposing(false);
    }, 100);
    onCompositionEnd?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if composition is active using native event property
    const isComposing = (e.nativeEvent as any).isComposing || dialogComposition.justEndedComposing();

    // Block Enter key during composition (but allow Shift+Enter for newlines)
    if (e.key === "Enter" && !e.shiftKey && isComposing) {
      return;
    }

    // Call user's onKeyDown handler
    onKeyDown?.(e);
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export { Textarea };

