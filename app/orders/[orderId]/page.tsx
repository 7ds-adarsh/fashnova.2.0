"use client";

import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

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

const OrderDetails = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const orderId = params.orderId as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrder(data.order);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [session, status, router, orderId]);

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

    if (error || !order) {
        return (
            <div className="min-h-screen font-inter">
                <Navigation />
                <main className="pt-24 pb-16 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="text-center py-12">
                            <p className="text-red-500">Error: {error || 'Order not found'}</p>
                            <Button className="mt-4" onClick={() => router.back()}>
                                Go Back
                            </Button>
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
                    <div className="mb-8">
                        <Button variant="outline" onClick={() => router.back()} className="mb-4">
                            ← Back to Orders
                        </Button>
                        <h1 className="text-4xl font-playfair font-medium mb-2">Order Details</h1>
                        <p className="text-muted-foreground">Order #{order.orderId}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">Order Summary</CardTitle>
                                        <Badge
                                            variant={
                                                order.status === "Delivered"
                                                    ? "default"
                                                    : order.status === "Shipped"
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Order Date</p>
                                                <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Order ID</p>
                                                <p className="font-medium">{order.orderId}</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="font-medium mb-4">Items Ordered</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-medium">${item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between items-center text-lg font-semibold">
                                            <span>Total</span>
                                            <span>${order.total}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Status & Tracking */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Order Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                                            <Badge
                                                variant={
                                                    order.status === "Delivered"
                                                        ? "default"
                                                        : order.status === "Shipped"
                                                        ? "secondary"
                                                        : "outline"
                                                }
                                                className="text-sm px-3 py-1"
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>

                                        {order.trackingNumber && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Tracking Number</p>
                                                <p className="font-medium">{order.trackingNumber}</p>
                                                <Button variant="outline" size="sm" className="mt-2">
                                                    Track Package
                                                </Button>
                                            </div>
                                        )}

                                        {order.status === "Delivered" && (
                                            <Button variant="outline" size="sm" className="w-full">
                                                Write Review
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
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

export default OrderDetails;
