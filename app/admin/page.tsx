"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator";
import { Trash2, Edit, Plus, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useProducts } from "@/app/context/ProductContext";
import { useOrders } from "@/app/context/OrderContext";

const AdminDashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { products: globalProducts, loading: productsLoading } = useProducts();
    const { orders: globalOrders, loading: ordersLoading, fetchOrders } = useOrders();
    const [products, setProducts] = useState(globalProducts);
    const [orders, setOrders] = useState(globalOrders);

    interface Product {
        _id?: string;
        id?: string | number;
        name: string;
        price: number;
        category: string;
        image: string;
        description: string;
    }

    interface Order {
        _id?: string;
        orderId: string;
        status: string;
        trackingNumber?: string;
        total: number;
        userEmail: string;
        userName?: string;
        userId?: string | { name?: string; email?: string; address?: string; mobile?: string };
        shippingAddress?: {
            firstName: string;
            lastName: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    }

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [productForm, setProductForm] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
        description: ""
    });

    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [orderForm, setOrderForm] = useState({
        status: "",
        trackingNumber: ""
    });

    const categories = ["Rings", "Necklaces", "Earrings", "Bracelets"];

    useEffect(() => {
        if (status === "loading") return; // Still loading

        if (!session || !session.user) {
            router.push("/login");
            return;
        }

        const userRole = (session.user as { role?: string })?.role;
        if (userRole !== "admin") {
            router.push("/");
            return;
        }
    }, [session, status, router]);

    useEffect(() => {
        setProducts(globalProducts);
    }, [globalProducts]);

    useEffect(() => {
        setOrders(globalOrders);
    }, [globalOrders]);

    // Show loading state while checking authentication
    if (status === "loading") {
        return (
            <div className="min-h-screen font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if not authenticated or not admin
    const userRole = session?.user ? (session.user as { role?: string })?.role : null;
    if (!session || !session.user || userRole !== "admin") {
        return null;
    }

    const handleAddProduct = async () => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productForm.name,
                    price: parseFloat(productForm.price),
                    category: productForm.category,
                    image: productForm.image,
                    description: productForm.description,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Add the new product to the local state
                setProducts([...products, {
                    id: data.product._id,
                    name: data.product.name,
                    price: data.product.price,
                    category: data.product.category,
                    image: data.product.image,
                    description: data.product.description,
                }]);
                setProductForm({ name: "", price: "", category: "", image: "", description: "" });
                setIsProductDialogOpen(false);
                alert('Product added successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            price: product.price.toString(),
            category: product.category,
            image: product.image,
            description: product.description
        });
        setIsProductDialogOpen(true);
    };

    const handleUpdateProduct = async () => {
        try {
            if (!editingProduct) return;
            const response = await fetch(`/api/products/${editingProduct._id || editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productForm.name,
                    price: parseFloat(productForm.price),
                    category: productForm.category,
                    image: productForm.image,
                    description: productForm.description,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update the product in the local state
                setProducts(products.map(p =>
                    (p._id || p.id) === (editingProduct._id || editingProduct.id)
                        ? {
                            id: data.product._id,
                            name: data.product.name,
                            price: data.product.price,
                            category: data.product.category,
                            image: data.product.image,
                            description: data.product.description,
                        }
                        : p
                ));
                setEditingProduct(null);
                setProductForm({ name: "", price: "", category: "", image: "", description: "" });
                setIsProductDialogOpen(false);
                alert('Product updated successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        }
    };

    const handleDeleteProduct = async (id: string | number) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the product from the local state
                setProducts(products.filter(p => (p._id || p.id) !== id));
                alert('Product deleted successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        }
    };

    const getorders = () => {
        fetchOrders();
    }

    const handleEditOrder = (order: Order) => {
        setEditingOrder(order);
        setOrderForm({
            status: order.status,
            trackingNumber: order.trackingNumber || ""
        });
        setIsOrderDialogOpen(true);
    };

    const handleUpdateOrder = async () => {
        if (!editingOrder) return;
        try {
            const response = await fetch(`/api/orders/${editingOrder.orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: orderForm.status,
                    trackingNumber: orderForm.trackingNumber || undefined,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update the order in the local state with full populated data
                setOrders(orders.map(o =>
                    o.orderId === editingOrder.orderId
                        ? {
                            ...o,
                            status: data.order.status,
                            trackingNumber: data.order.trackingNumber,
                            userId: data.order.userId || o.userId
                        }
                        : o
                ));
                setEditingOrder(null);
                setOrderForm({ status: "", trackingNumber: "" });
                setIsOrderDialogOpen(false);
                // Refresh orders to get latest data
                fetchOrders();
                alert('Order updated successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order. Please try again.');
        }
    };

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-playfair font-medium mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage products, orders, and sales</p>
                    </div>

                    {/* Sales Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalOrders}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{deliveredOrders}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="products" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                        </TabsList>

                        <TabsContent value="products" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Product Management</h2>
                                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => {
                                            setEditingProduct(null);
                                            setProductForm({ name: "", price: "", category: "", image: "", description: "" });
                                        }}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Product
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={productForm.name}
                                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="price">Price</Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        value={productForm.price}
                                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="category">Category</Label>
                                                <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(cat => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="image">Image URL</Label>
                                                <Input
                                                    id="image"
                                                    value={productForm.image}
                                                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={productForm.description}
                                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                                                    {editingProduct ? "Update" : "Add"} Product
                                                </Button>
                                                <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.map((product) => (
                                                <TableRow key={product._id || product.id}>
                                                    <TableCell className="font-medium">{product.name}</TableCell>
                                                    <TableCell>{product.category}</TableCell>
                                                    <TableCell>${product.price}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditProduct(product)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const productId = product._id || product.id;
                                                                    if (productId !== undefined) {
                                                                        handleDeleteProduct(productId);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Order Management</h2>
                                <Button
                                    variant="outline"
                                    onClick={() => fetchOrders()}
                                    disabled={ordersLoading}
                                >
                                    {ordersLoading ? "Refreshing..." : "Refresh Orders"}
                                </Button>
                            </div>
                            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Update Order Status</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div>
                                            <Label htmlFor="order-status">Status</Label>
                                            <Select value={orderForm.status} onValueChange={(value) => setOrderForm({ ...orderForm, status: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Processing">Processing</SelectItem>
                                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="tracking-number">Tracking Number</Label>
                                            <Input
                                                id="tracking-number"
                                                value={orderForm.trackingNumber}
                                                onChange={(e) => setOrderForm({ ...orderForm, trackingNumber: e.target.value })}
                                                placeholder="Enter tracking number (optional)"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={handleUpdateOrder}>
                                                Update Order
                                            </Button>
                                            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Customer Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Address</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Tracking</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ordersLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                            Loading orders...
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : orders.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                                        No orders found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                orders.map((order) => {
                                                    // userId might be populated object or just an ID string
                                                    const userIdObj = order.userId && typeof order.userId === 'object' ? order.userId as { name?: string; email?: string; address?: string; mobile?: string } : null;
                                                    const userName = userIdObj?.name || order.userName || "N/A";
                                                    const userEmail = userIdObj?.email || order.userEmail || "N/A";
                                                    const userAddress = userIdObj?.address ||
                                                        (order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}` : "N/A");
                                                    const userMobile = userIdObj?.mobile || (order.shippingAddress?.phone || "Not provided");
                                                    const trackingNumber = order.trackingNumber || "Not assigned";


                                                    return (
                                                        <TableRow key={order._id || order.id}>
                                                            <TableCell className="font-medium">{order.orderId}</TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">{userName}</div>
                                                                    {userMobile !== "Not provided" && (
                                                                        <div className="text-xs text-muted-foreground">{userMobile}</div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{userEmail}</TableCell>
                                                            <TableCell>
                                                                <div className="max-w-xs truncate" title={userAddress}>
                                                                    {userAddress}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                                            <TableCell>
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
                                                            </TableCell>
                                                            <TableCell>${order.total.toFixed(2)}</TableCell>
                                                            <TableCell>
                                                                <div className="max-w-xs truncate font-mono text-xs" title={trackingNumber}>
                                                                    {trackingNumber}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEditOrder(order)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
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

export default AdminDashboard;
