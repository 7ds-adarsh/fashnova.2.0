"use client"
import Navigation from "@/app/components/Navigation";
import Hero from "@/app/components/Hero";
import Heritage from "@/app/components/Heritage";
import BestSeller from "@/app/components/BestSeller";
import InstagramFeed from "@/app/components/InstagramFeed";
import ContactComponent from "@/app/components/Contact";
import NewsLetter from "@/app/components/NewsLetter";
import { Link } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <main>
        <Hero />
        <Heritage />
        <BestSeller />
        <InstagramFeed />
        <ContactComponent />
        <NewsLetter />
      </main>
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Fashnova. Developer - <Link href="https://github.com/7ds-adarsh/7ds_adarsh/7ds-adarsh" target="_blank">7DS-Adarsh</Link>.</p>
        </div>
      </footer>
    </div>
  );
}
