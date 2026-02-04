import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Fashnova - Trendsetting Fashion for the Modern You",
  description: "Discover the latest trends in fashion with Fashnova. Explore our curated collection of stylish clothing, accessories, and more. Stay ahead of the fashion curve with Fashnova's trendsetting designs and timeless classics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-inter`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
