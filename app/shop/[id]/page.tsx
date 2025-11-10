"use client"
import { notFound, useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { useCart } from "@/app/context/CartContext";
import { useProducts } from "@/app/context/ProductContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useSession } from "next-auth/react";
// import CartDrawer from "@/app/components/CartDrawer";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import React from "react";

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface ProductType {
    _id?: string;
    id?: string | number;
    name: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
    const { products: globalProducts, loading, error } = useProducts();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { data: session } = useSession();
    const router = useRouter();
    const [productId, setProductId] = React.useState<string>('');
    const [product, setProduct] = React.useState<ProductType | undefined>(undefined);

    React.useEffect(() => {
        params.then((resolvedParams) => {
            const id = resolvedParams.id;
            setProductId(id);
            const foundProduct = globalProducts.find((p) => p._id === id || p.id?.toString() === id);
            setProduct(foundProduct);
        });
    }, [params, globalProducts]);

    const handleWishlistToggle = () => {
        if (!session) {
            // Redirect to login if not authenticated
            router.push('/login');
            return;
        }

        if (!product) return;

        const prodId = product._id || product.id?.toString();
        if (prodId) {
            if (isInWishlist(prodId)) {
                removeFromWishlist(prodId);
            } else {
                addToWishlist(prodId);
            }
        }
    };

    if (loading || !productId) {
        return (
            <div className="min-h-screen font-inter">
                <Navigation />
                <main className="pt-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading product...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !product) {
        notFound();
    }

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
                            Shop
                        </Link>
                        <span className="mx-2 text-muted-foreground">/</span>
                        <span className="text-sm text-foreground">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                                onClick={handleWishlistToggle}
                            >
                                <Heart className={`w-6 h-6 ${isInWishlist(product._id || product.id?.toString() || '') ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </Button>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-playfair font-medium mb-2">{product.name}</h1>
                                <p className="text-2xl font-semibold text-accent">${product.price}</p>
                                <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium mb-3">Description</h2>
                                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                            </div>

                            <div className="flex gap-4">
                                <AddToCartButton product={product} />
                            </div>
                        </div>
                    </div>

                    {/* Related Products or Additional Info */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-playfair font-medium mb-8">You might also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {product && globalProducts
                                .filter((p) => (p._id !== product._id && p.id !== product.id) && p.category === product.category)
                                .slice(0, 4)
                                .map((relatedProduct) => (
                                    <RelatedProductCard key={relatedProduct._id || relatedProduct.id} product={relatedProduct} />
                                ))}
                        </div>
                    </div>
                </div>
            </main>
            <footer className="py-8 px-6 border-t border-border mt-16">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    <p>© 2024 AXELS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

interface ProductType {
    _id?: string;
    id?: string | number;
    name: string;
    price: number;
    image: string;
}

const AddToCartButton = ({ product }: { product: ProductType }) => {
    const { addToCart } = useCart();
    const handleAddToCart = () => addToCart({ id: product._id || product.id?.toString() || '', name: product.name, price: product.price, image: product.image });

    return (
        <Button size="lg" className="flex-1" onClick={handleAddToCart}>
            Add to Cart
        </Button>
    );
};

const RelatedProductCard = ({ product }: { product: ProductType }) => {
    return (
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
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductDetailPage;
