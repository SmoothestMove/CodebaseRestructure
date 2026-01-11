"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    name: "Features",
    href: "#features",
    dropdown: [
      { name: "QR Inventory", href: "#features-qr" },
      { name: "Team Collaboration", href: "#features-collab" },
      { name: "Truck Loading", href: "#features-truck" },
    ],
  },
  {
    name: "Use Cases",
    href: "#use-cases",
    dropdown: [
      { name: "Family Moves", href: "#family-moves" },
      { name: "Downsizing", href: "#downsizing" },
      { name: "First-Time Movers", href: "#first-movers" },
    ],
  },
  { name: "Pricing", href: "#pricing" },
  { name: "Docs", href: "#docs" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8",
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-md shadow-sm"
          : "py-6 bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-primary-action transition-colors">
            SM
          </div>
          <span className="text-2xl font-bold text-primary tracking-tight">
            Smooth Moves
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className="flex items-center gap-1 text-secondary font-semibold hover:text-primary transition-colors py-2"
              >
                {link.name}
                {link.dropdown && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      activeDropdown === link.name && "rotate-180"
                    )}
                  />
                )}
              </Link>

              {/* Dropdown Menu */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl p-2 border border-neutral-bg/50"
                    >
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-neutral-bg transition-all rounded-lg"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <button className="btn-primary py-2 px-5 text-sm">
            Start Moving
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-neutral-bg overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className="text-lg font-bold text-primary flex items-center justify-between"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="mt-4 flex flex-col gap-3 pl-4 border-l-2 border-neutral-bg">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="text-secondary font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button className="btn-primary w-full mt-4">
                Start Moving
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
