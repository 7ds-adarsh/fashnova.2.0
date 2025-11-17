import { Card, CardContent } from "@/app/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import { Button } from "@/app/components/ui/button";
import { useCart } from "@/app/context/CartContext";
import { useProducts } from "@/app/context/ProductContext";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id?: string;
  id?: string | number;
  name: string;
  price: number;
  image: string;
}

const BestSeller = () => {
  const { addToCart } = useCart();
  const { products: globalProducts } = useProducts();

  // Use global products from API
  const products = globalProducts.slice(0, 12);

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product._id || product.id?.toString() || '', name: product.name, price: product.price, image: product.image });
  };

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-4xl font-playfair font-medium">
            Best Seller
          </h3>
          <button className="text-sm text-muted-foreground hover:text-accent transition-colors" suppressHydrationWarning={true}>
            See More
          </button>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
              skipSnaps: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product._id || product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <Link href={`/shop/${product._id || product.id}`}>
                    <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-muted">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-sm text-accent font-semibold">${product.price}</p>
                          <div>
                            <Button
                              size="sm"
                              onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                              className="mt-2 w-full"
                              suppressHydrationWarning={true}
                            >
                              Add to cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-background border-2 border-secondary/20 hover:bg-secondary/10 hover:border-secondary/50" />
            <CarouselNext className="hidden md:flex -right-12 bg-background border-2 border-secondary/20 hover:bg-secondary/10 hover:border-secondary/50" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
