"use client"
import Navigation from "@/app/components/Navigation";
import Hero from "@/app/components/Hero";
import Heritage from "@/app/components/Heritage";
import BestSeller from "@/app/components/BestSeller";
import InstagramFeed from "@/app/components/InstagramFeed";
import ContactComponent from "@/app/components/Contact";
// import CartDrawer from "@/app/components/CartDrawer";
import NewsLetter from "@/app/components/NewsLetter";

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
          <p>© 2024 AXELS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
