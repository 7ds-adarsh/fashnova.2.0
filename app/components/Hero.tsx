import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import heroImage from "@/public/hero-jewelry.jpg";

const Hero = () => {
  return (
    <section className="pt-24 pb-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[600px]">
          <div className="space-y-6 hero-content">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-medium leading-tight hero-title">
              Sparkle up your style with a piece of jewelry from the glam collection
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Each season&apos;s most sought-after customer favorite designs - curated just for you
            </p>
            <Button variant="cta" size="lg" className="rounded-full btn-responsive">
              Buy Now
            </Button>
          </div>
          
          <div className="relative">
            <Image
              src={heroImage}
              alt="Luxury gold jewelry collection"
              width={800}
              height={600}
              className="w-full h-auto rounded-3xl object-cover shadow-2xl"
            />
            <div className="absolute -left-8 -top-8 w-32 h-32 opacity-20">
              <svg viewBox="0 0 100 100" className="text-accent">
                <path 
                  d="M50 0 C50 50, 50 50, 100 50 C50 50, 50 50, 50 100 C50 50, 50 50, 0 50 C50 50, 50 50, 50 0" 
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
