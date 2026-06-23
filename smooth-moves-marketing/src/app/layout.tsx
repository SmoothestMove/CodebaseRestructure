import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Smooth Moves | Professional Grade Moving Logistics, Without the Professional Grade Cost",
  description: "Track every box, coordinate your team, and stay on budget—all from your phone. Moving made manageable.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(nunito.variable, "font-sans antialiased text-neutral-text")}>
        {children}
      </body>
    </html>
  );
}
