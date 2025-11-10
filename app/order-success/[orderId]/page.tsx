"use client";

import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    orderId: string;
    date: string;
    status: "Processing" | "Shipped" | "Delivered";
    total: number;
    items: OrderItem[];
    trackingNumber?: string;
    userEmail: string;
}

const OrderSuccess = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }
                const data = await response.json();
                setOrder(data.order);
            } catch (error) {
                console.error('Error fetching order:', error);
                router.push('/orders');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId, router]);

    if (loading) {
        return (
            <div className="min-h-screen font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen font-inter">
                <Navigation />
                <main className="pt-24 pb-16 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="text-center py-12">
                            <p className="text-red-500">Order not found</p>
                            <Link href="/orders">
                                <Button className="mt-4">View My Orders</Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-playfair font-medium mb-2">Order Placed Successfully!</h1>
                        <p className="text-muted-foreground text-lg">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order ID:</span>
                                        <span className="font-medium">{order.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Date:</span>
                                        <span className="font-medium">
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className="font-medium capitalize">{order.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total:</span>
                                        <span className="font-semibold text-lg">${order.total}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Items Ordered</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-medium">${item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Next Steps */}
                    <Card className="mb-8">
                        <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                What&apos;s Next?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-primary">1</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Order Processing</p>
                                        <p className="text-sm text-muted-foreground">
                                            We&apos;re preparing your order for shipment. You&apos;ll receive an email update when it ships.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-primary">2</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Shipping</p>
                                        <p className="text-sm text-muted-foreground">
                                            Once shipped, you&apos;ll get tracking information to monitor your package.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-primary">3</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Delivery</p>
                                        <p className="text-sm text-muted-foreground">
                                            Your order will be delivered to your doorstep. Enjoy your new items!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/orders">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Track My Orders
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Continue Shopping
                            </Button>
                        </Link>
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

export default OrderSuccess;
