import Image from "next/image";
import product1 from "@/public/diamond-ring-4.jpg";
import product2 from "@/public/diamond-ring-2.jpg";
import product3 from "@/public/diamond-ring-5.jpg";

const Heritage = () => {
  return (
    <section className="py-16 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-3 gap-6">
            <div className="aspect-square rounded-full overflow-hidden bg-card shadow-lg">
              <Image
                src={product1}
                alt="Gold pendant necklace"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-full overflow-hidden bg-card shadow-lg">
              <Image
                src={product2}
                alt="Diamond ring"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-full overflow-hidden bg-card shadow-lg">
              <Image
                src={product3}
                alt="Pearl bracelet"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-4xl font-playfair font-medium tracking-widest">
              SINCE 1952
            </h3>
            <p className="text-lg text-muted-foreground">
              Sparkle up your style with a piece of jewelry from the glam collection
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heritage;
