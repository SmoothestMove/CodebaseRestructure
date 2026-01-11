import { cn } from "@/lib/utils";
import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin, Globe } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Use Cases", href: "#use-cases" },
      { name: "Roadmap", href: "#roadmap" },
      { name: "What's New", href: "#whats-new" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#docs" },
      { name: "Quick Start Guide", href: "#guide" },
      { name: "Video Tutorials", href: "#tutorials" },
      { name: "API Docs", href: "#api" },
      { name: "Community", href: "#community" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Press Kit", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookie" },
      { name: "Security", href: "#security" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl transition-colors group-hover:bg-primary-action group-hover:text-white">
                SM
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Smooth Moves
              </span>
            </Link>
            <p className="text-secondary/80 text-sm mb-8 leading-relaxed">
              Professional Grade Moving Logistics, Without the Professional Grade Cost. Moving made manageable.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Twitter size={20} className="text-secondary" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Facebook size={20} className="text-secondary" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Instagram size={20} className="text-secondary" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Linkedin size={20} className="text-secondary" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-bold text-lg mb-6">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-secondary/80 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-secondary/60 text-sm">
            © 2025 Smooth Moves. All rights reserved.
          </p>
          <div className="flex gap-8 items-center text-sm text-secondary/60">
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <Globe size={16} />
              <span>English</span>
            </div>
            <div className="cursor-pointer hover:text-white transition-colors">
              United States
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
