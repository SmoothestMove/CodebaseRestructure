import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[9999] max-w-xs overflow-hidden rounded-lg border border-slate-600/50 bg-slate-800/95 backdrop-blur-sm px-3 py-2 text-sm font-medium text-slate-100 shadow-xl",
        // Modern entrance/exit animations
        "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",
        // Directional slide animations
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // Subtle glow effect for modern appearance
        "before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-r before:from-slate-700/20 before:to-slate-600/20 before:blur-sm",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
