"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Navigation from "@/app/components/Navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/app/components/ui/sheet";
import { Slider } from "@/app/components/ui/slider";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { useCart } from "@/app/context/CartContext";
import { useProducts } from "@/app/context/ProductContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useSession } from "next-auth/react";
import { Search, Filter, Loader2 } from "lucide-react";
import { Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/app/hooks/use-toast";

import Image from "next/image";
import Link from "next/link";

const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"];

const ShopContent = () => {
    const { products: globalProducts, loading, error } = useProducts();
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("featured");
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Initialize search query from URL params using lazy initialization
    const [searchQuery, setSearchQuery] = useState(() => {
        // This will only run on initial mount, avoiding setState in effect
        return "";
    });

    // Update search query when URL params change (but not on initial render)
    useEffect(() => {
        const searchParam = searchParams.get('search');
        if (searchParam !== null && searchParam !== searchQuery) {
            // Use a small timeout to avoid synchronous setState
            const timer = setTimeout(() => {
                setSearchQuery(searchParam);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [searchParams, searchQuery]);

    // Show error toast if there's an error
    useEffect(() => {
        if (error) {
            toast({
                title: "Error loading products",
                description: "Failed to load products. Please try again.",
                variant: "destructive",
            });
        }
    }, [error, toast]);

    // Use global products from API
    const productsToUse = globalProducts;

    const filteredProducts = useMemo(() => {
        return productsToUse
            .filter(
                (product) =>
                    (selectedCategory === "All" || product.category === selectedCategory) &&
                    product.price >= priceRange[0] &&
                    product.price <= priceRange[1] &&
                    (searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low":
                        return a.price - b.price;
                    case "price-high":
                        return b.price - a.price;
                    case "name":
                        return a.name.localeCompare(b.name);
                    default:
                        return 0;
                }
            });
    }, [productsToUse, selectedCategory, priceRange, searchQuery, sortBy]);

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 px-6">
                <div className="container mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <h1 className="text-4xl font-playfair font-medium mb-4 md:mb-0">
                            Our Collection
                        </h1>

                        <div className="flex items-center gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            {/* Mobile Filter Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden border-secondary/20 hover:border-secondary/50">
                                        <FilterIcon className="w-4 h-4 mr-2" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Filter Products</SheetTitle>
                                        <SheetDescription>
                                            Adjust filters to find your perfect piece
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        {/* Mobile Category Filter */}
                                        <div>
                                            <h3 className="text-sm font-medium mb-3">Categories</h3>
                                            <div className="space-y-2">
                                                {categories.map((category) => (
                                                    <div key={category} className="flex items-center">
                                                        <Checkbox
                                                            id={`category-${category}`}
                                                            checked={selectedCategory === category}
                                                            onCheckedChange={() => setSelectedCategory(category)}
                                                        />
                                                        <label
                                                            htmlFor={`category-${category}`}
                                                            className="text-sm ml-2"
                                                        >
                                                            {category}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Mobile Price Range Filter */}
                                        <div>
                                            <h3 className="text-sm font-medium mb-3">Price Range</h3>
                                            <Slider
                                                defaultValue={[0, 5000]}
                                                max={5000}
                                                step={100}
                                                value={priceRange}
                                                onValueChange={setPriceRange}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between mt-2">
                                                <span className="text-sm">${priceRange[0]}</span>
                                                <span className="text-sm">${priceRange[1]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Sort Dropdown */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px] border-secondary/20 hover:border-secondary/50">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-8">
                        {/* Desktop Sidebar Filters */}
                        <div className="hidden md:block w-64 space-y-8">
                            {/* Category Filter */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <div key={category} className="flex items-center">
                                            <Checkbox
                                                id={`desktop-category-${category}`}
                                                checked={selectedCategory === category}
                                                onCheckedChange={() => setSelectedCategory(category)}
                                            />
                                            <label
                                                htmlFor={`desktop-category-${category}`}
                                                className="text-sm ml-2"
                                            >
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Price Range</h3>
                                <Slider
                                    defaultValue={[0, 5000]}
                                    max={5000}
                                    step={100}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="w-full"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm">${priceRange[0]}</span>
                                    <span className="text-sm">${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-muted-foreground">Loading products...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 product-grid">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product._id || product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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

const Shop = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
};

const FilterIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
        />
    </svg>
);

interface ProductCardProps {
    product: {
        _id?: string;
        id?: string | number;
        name: string;
        price: number;
        image: string;
        category?: string;
    };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { data: session } = useSession();

    const handleAddToCart = () => addToCart({ id: product._id || product.id?.toString() || '', name: product.name, price: product.price, image: product.image });

    const handleWishlistToggle = () => {
        if (!session) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        const productId = product._id || product.id?.toString() || '';
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    return (
        <Link href={`/shop/${product._id || product.id}`}>
            <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300">
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
                            onClick={(e) => {
                                e.preventDefault();
                                handleWishlistToggle();
                            }}
                        >
                            <Heart className={`w-4 h-4 ${isInWishlist(product._id || product.id?.toString() || '') ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </Button>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-sm text-accent font-semibold">${product.price}</p>
                        <Button size="sm" className="mt-2 w-full" onClick={(e) => { e.preventDefault(); handleAddToCart(); }}>Add to cart</Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default Shop;
