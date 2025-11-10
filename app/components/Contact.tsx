import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import contactImage from "@/public/contact-image.jpg";

const Contact = () => {
  return (
    <section className="py-16 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={contactImage}
              alt="Luxury jewelry showcase"
              width={600}
              height={500}
              className="w-full h-[500px] object-cover"
            />
            
            {/* Decorative line art */}
            <div className="absolute bottom-0 right-0 w-48 h-48 opacity-30">
              <svg viewBox="0 0 100 100" className="text-accent w-full h-full">
                <path 
                  d="M0,50 Q25,25 50,50 T100,50" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  fill="none"
                  className="animate-pulse"
                />
                <path 
                  d="M0,60 Q25,35 50,60 T100,60" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  fill="none"
                  className="animate-pulse"
                />
                <path 
                  d="M0,70 Q25,45 50,70 T100,70" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
          
          <div className="bg-accent/20 rounded-3xl p-12 space-y-6">
            <h3 className="text-4xl font-playfair font-medium">
              Contact Us
            </h3>
            <p className="text-lg text-muted-foreground">
              Sparkle up your style with a piece of jewelry from the glam collection
            </p>
            <Button variant="secondary" size="lg" className="rounded-full">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
