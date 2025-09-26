"use client";

import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const baseAnimationMs = 30000;

type InfiniteSliderProps = {
  children: ReactNode;
  gap?: number;
  speed?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 1,
  direction = "horizontal",
  reverse = false,
  pauseOnHover = true,
  className,
}: InfiniteSliderProps) {
  const animationName = direction === "horizontal" ? "slider-scroll-x" : "slider-scroll-y";
  const animationDuration = useMemo(() => {
    if (!speed || speed <= 0) {
      return baseAnimationMs;
    }

    return baseAnimationMs / speed;
  }, [speed]);

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn("slider-track flex w-max items-center", direction === "horizontal" ? "flex-row" : "flex-col")}
        style={{
          gap,
          animationName: `${animationName}-${reverse ? "reverse" : "forward"}`,
          animationDuration: `${animationDuration}ms`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
        data-pause-on-hover={pauseOnHover}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
