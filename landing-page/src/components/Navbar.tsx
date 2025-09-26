"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ThemeToggle from "./ThemeToggle";
import { buttonVariants } from "./ui/button";

function Navbar() {
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm transition-all dark:border-slate-800 dark:bg-slate-950/75">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center justify-center gap-8">
            <Link href="/" className="flex z-40 font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              Smooth Moves
            </Link>

            <div className="hidden items-center justify-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-200 md:flex lg:gap-10">
              <Link href="#features" className="hover:text-slate-900 hover:underline hover:underline-offset-2 dark:hover:text-white">
                Features
              </Link>
              <Link href="#why" className="hover:text-slate-900 hover:underline hover:underline-offset-2 dark:hover:text-white">
                Why Smooth Moves
              </Link>
              <Link href="#demo" className="hover:text-slate-900 hover:underline hover:underline-offset-2 dark:hover:text-white">
                Preview
              </Link>
              <Link href="#faq" className="hover:text-slate-900 hover:underline hover:underline-offset-2 dark:hover:text-white">
                FAQ
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <Menu className="h-6 w-6 cursor-pointer text-slate-600 dark:text-slate-200" />
          </div>

          <div className="hidden items-center space-x-2 text-sm font-semibold md:flex">
            <ThemeToggle />
            <Link href="https://app.smoothmoves.example" className="text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
              Log in
            </Link>
            <Link href="#waitlist" className={cn(buttonVariants({ size: "sm" }), "flex items-center justify-center px-4 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white")}>Join waitlist</Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
