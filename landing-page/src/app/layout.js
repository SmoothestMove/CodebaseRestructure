import { Mulish } from 'next/font/google'
import "./globals.css";
import { cn, constructMetadata } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const mulish = Mulish({ subsets: ['latin'] });

const themeScript = `(() => {
  const storageKey = 'smooth-moves-theme';
  try {
    const stored = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
    document.documentElement.classList.remove(nextTheme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.add(nextTheme);
  } catch (error) {
    document.documentElement.classList.add('light');
  }
})();`;

export const metadata = constructMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='light !scroll-smooth' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} id="theme-script" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="22623642-4859-4b11-bc9c-5e1be448cb2c"></script>
      </head>
      <body className={cn('min-h-screen bg-white font-sans antialiased transition-colors dark:bg-slate-950', mulish.className)}>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
}