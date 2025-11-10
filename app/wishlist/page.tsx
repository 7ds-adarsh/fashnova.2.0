"use client"
import Navigation from "@/app/components/Navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useCart } from "@/app/context/CartContext";
import { useProducts } from "@/app/context/ProductContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useEffect } from "react";

const Wishlist = () => {
    const { addToCart } = useCart();
    const { products: globalProducts, loading: productsLoading } = useProducts();
    const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }
    }, [session, status, router]);

    // Filter products that are in the user's wishlist
    const wishlistProducts = globalProducts.filter(product => {
        const productId = product._id || product.id?.toString();
        return productId && wishlist.includes(productId);
    });

    const handleAddToCart = (product: { _id?: string; id?: string | number; name: string; price: number; image: string }) => {
        addToCart({ id: product._id || product.id?.toString() || '', name: product.name, price: product.price, image: product.image });
    };

    const handleRemoveFromWishlist = (productId: string) => {
        removeFromWishlist(productId);
    };

    if (status === "loading" || productsLoading || wishlistLoading) {
        return (
            <div className="min-h-screen font-inter">
                <Navigation />
                <main className="pt-24 pb-16 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading wishlist...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-playfair font-medium mb-2">My Wishlist</h1>
                        <p className="text-muted-foreground">Your favorite pieces waiting to be yours</p>
                    </div>

                    {wishlistProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistProducts.map((product) => {
                                const productId = product._id || product.id?.toString() || '';
                                return (
                                    <Card key={productId} className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300">
                                        <CardContent className="p-4">
                                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-muted">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={300}
                                                    height={400}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                                    onClick={() => handleRemoveFromWishlist(productId)}
                                                >
                                                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                                </Button>
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-sm font-medium">{product.name}</p>
                                                <p className="text-sm text-accent font-semibold">${product.price}</p>
                                                <Button size="sm" className="mt-2 w-full" onClick={() => handleAddToCart(product)}>
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h2 className="text-2xl font-playfair font-medium mb-2">Your wishlist is empty</h2>
                            <p className="text-muted-foreground mb-6">Start adding your favorite pieces to your wishlist</p>
                            <Button onClick={() => router.push('/shop')}>Start Shopping</Button>
                        </div>
                    )}
                </div>
            </main>
            <footer className="py-8 px-6 border-t border-border">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    <p>© 2024 AXELS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Wishlist;
