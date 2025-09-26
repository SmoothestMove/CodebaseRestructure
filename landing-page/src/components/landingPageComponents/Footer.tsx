import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";

const socials = [
  { name: "Twitter", href: "https://twitter.com/smoothmoves", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com/smoothmoves", icon: Instagram },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/smoothmoves", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/smoothmoves", icon: Github },
];

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <MaxWidthWrapper className="flex flex-col items-center justify-center gap-10 py-14 text-slate-700 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-sm flex-col items-center text-center md:items-start md:text-left">
          <Link href="/" className="text-lg font-bold text-slate-900 dark:text-white">
            Smooth Moves
          </Link>
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            The collaborative move command center for households, organizers, and relocation teams.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Follow our journey
          </p>
          <div className="mt-3 flex gap-3">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-white dark:hover:text-white"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="sr-only">{social.name}</span>
                </Link>
              );
            })}
          </div>
          <small className="mt-6 block text-xs text-slate-500 dark:text-slate-500">
            Smooth Moves (c) {new Date().getFullYear()} - All rights reserved
          </small>
        </div>

        <div className="grid grid-cols-1 gap-10 text-sm font-semibold sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center text-slate-600 dark:text-slate-300 md:text-left">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Explore</h3>
            <ul className="space-y-2">
              <li className="hover:underline hover:underline-offset-2">
                <Link href="#features">Features</Link>
              </li>
              <li className="hover:underline hover:underline-offset-2">
                <Link href="#why">Before vs. After</Link>
              </li>
              <li className="hover:underline hover:underline-offset-2">
                <Link href="#testimonials">Personas</Link>
              </li>
              <li className="hover:underline hover:underline-offset-2">
                <Link href="#waitlist-tiers">Waitlist tiers</Link>
              </li>
              <li className="hover:underline hover:underline-offset-2">
                <Link href="#faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="text-center text-slate-600 dark:text-slate-300 md:text-left">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Company</h3>
            <ul className="space-y-2">
              <li className="hover:underline hover:underline-offset-2">
                <Link href="#story">My story</Link>
              </li>
              <li className="hover:underline hover:underline-offset-2">
                <a href="mailto:hello@smoothmoves.app">Contact</a>
              </li>
              <li className="hover:underline hover:underline-offset-2">
                <Link href="#waitlist">Join waitlist</Link>
              </li>
            </ul>
          </div>

          <div className="text-center text-slate-600 dark:text-slate-300 md:text-left">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Legal</h3>
            <ul className="space-y-2">
              <li className="hover:underline hover:underline-offset-2">
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li className="hover:underline hover:underline-offset-2">
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
