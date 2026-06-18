import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CarbonCoach",
  description: "Your AI coach for real carbon reductions — one action at a time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-[#020617] text-slate-100 antialiased min-h-screen flex flex-col`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:rounded-md focus:font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
