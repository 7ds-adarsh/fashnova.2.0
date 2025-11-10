"use client";

import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

const Order = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const userEmail = session.user?.email;

                if (!userEmail) {
                    throw new Error('User email not found');
                }

                const response = await fetch(`/api/orders?userEmail=${encodeURIComponent(userEmail)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data.orders);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session, status, router]);

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-playfair font-medium mb-2">My Orders</h1>
                        <p className="text-muted-foreground">Track and manage your order history</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">Error: {error}</p>
                            <Button className="mt-4" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Card key={order.orderId} className="border-secondary/20">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
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
                                            <div>
                                                <h4 className="font-medium mb-2">Items</h4>
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span>{item.name} (x{item.quantity})</span>
                                                        <span>${item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Total: ${order.total}</span>
                                                {order.trackingNumber && (
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                                                        <p className="text-sm font-medium">{order.trackingNumber}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${order.orderId}`)}>
                                                    View Details
                                                </Button>
                                                {order.status === "Delivered" && (
                                                    <Button variant="outline" size="sm">
                                                        Write Review
                                                    </Button>
                                                )}
                                                {order.trackingNumber && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(`https://www.fedex.com/en-us/tracking.html?tracknumbers=${order.trackingNumber}`, '_blank')}
                                                    >
                                                        Track Package
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!loading && !error && orders.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No orders found.</p>
                            <Link href={'/shop'}><Button className="mt-4">Start Shopping</Button></Link>
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

export default Order;
