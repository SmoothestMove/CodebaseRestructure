"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "smooth-moves-theme";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  className?: string;
};

function applyTheme(nextTheme: Theme): void {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  const themes: Theme[] = ["light", "dark"];
  themes.forEach((theme) => {
    if (theme !== nextTheme) {
      root.classList.remove(theme);
    }
  });

  root.classList.add(nextTheme);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const handleToggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label="Toggle color mode"
      onClick={handleToggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white",
        className,
      )}
      disabled={!mounted}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">Toggle color theme</span>
    </button>
  );
}

export default ThemeToggle;
