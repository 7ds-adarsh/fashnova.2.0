"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Separator } from "@/app/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useOrders } from "@/app/context/OrderContext";
import { useWishlist } from "@/app/context/WishlistContext";

const Dashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { userData, loading: userLoading, updateUserData } = useUser();
    const { orders } = useOrders();
    const { wishlist } = useWishlist();

    const [isEditing, setIsEditing] = useState(false);
    // Initialize formData from userData using lazy initialization
    const [formData, setFormData] = useState(() => ({
        name: userData?.name || "",
        email: userData?.email || "",
        mobile: userData?.mobile || "",
        address: userData?.address || "",
    }));

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }
    }, [session, status, router]);

    // Update formData when userData changes, but only if form hasn't been edited
    // Use a ref to track initial load to avoid setState in effect warning
    const initialLoadRef = React.useRef(true);
    useEffect(() => {
        if (userData && !isEditing && initialLoadRef.current) {
            // Use setTimeout to defer state update and avoid synchronous setState warning
            const timer = setTimeout(() => {
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    mobile: userData.mobile || "",
                    address: userData.address || "",
                });
                initialLoadRef.current = false;
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [userData, isEditing]);

    const handleSave = async () => {
        try {
            await updateUserData({
                name: formData.name,
                mobile: formData.mobile,
                address: formData.address,
            });
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile. Please try again.");
        }
    };

    const handleCancel = () => {
        if (userData) {
            setFormData({
                name: userData.name || "",
                email: userData.email || "",
                mobile: userData.mobile || "",
                address: userData.address || "",
            });
        }
        setIsEditing(false);
    };

    if (status === "loading" || userLoading) {
        return (
            <div className="min-h-screen font-inter">
                <Navigation />
                <main className="pt-24 pb-16 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!session || !userData) {
        return null;
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-playfair font-medium mb-2">My Dashboard</h1>
                        <p className="text-muted-foreground">Manage your account and preferences</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Information */}
                        <div className="md:col-span-2">
                            <Card className="border-secondary/20">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Personal Information</CardTitle>
                                        {!isEditing ? (
                                            <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button onClick={handleSave} size="sm">
                                                    Save
                                                </Button>
                                                <Button onClick={handleCancel} variant="outline" size="sm">
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                disabled={true} // Email should not be editable
                                                className="bg-muted"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <Label htmlFor="address">Address</Label>
                                                <Textarea
                                                    id="address"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    disabled={!isEditing}
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Account Summary */}
                        <div className="space-y-6">
                            <Card className="border-secondary/20">
                                <CardHeader>
                                    <CardTitle>Account Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Orders</span>
                                        <span className="font-medium">{orders.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Spent</span>
                                        <span className="font-medium">${totalSpent.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Wishlist Items</span>
                                        <span className="font-medium">{wishlist.length}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-secondary/20">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => router.push('/orders')}
                                    >
                                        View Orders
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => router.push('/wishlist')}
                                    >
                                        Manage Wishlist
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Change Password
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Download Invoice
                                    </Button>
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

export default Dashboard;
