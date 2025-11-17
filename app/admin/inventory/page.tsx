r"use client";
import { useState, useEffect } from "react";
import Navigation from "@/app/components/Navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { useToast } from "@/app/hooks/use-toast";
import { Loader2, AlertTriangle, Package } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    reservedStock: number;
    minStockThreshold: number;
    category: string;
}

interface InventoryData {
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    reservedStock: number;
    availableStock: number;
    minStockThreshold: number;
    isLowStock: boolean;
}

const InventoryManagementPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products);
                await fetchInventoryData(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: "Error",
                description: "Failed to fetch products",
                variant: "destructive",
            });
        }
    };

    const fetchInventoryData = async (productList: Product[]) => {
        const inventoryPromises = productList.map(async (product) => {
            try {
                const response = await fetch(`/api/products/${product._id}/inventory`);
                if (response.ok) {
                    const data = await response.json();
                    return data.inventory;
                }
            } catch (error) {
                console.error(`Error fetching inventory for ${product.name}:`, error);
            }
            return null;
        });

        const results = await Promise.all(inventoryPromises);
        const validData = results.filter(Boolean) as InventoryData[];
        setInventoryData(validData);
        setLoading(false);
    };

    const updateStock = async (productId: string, newStock: number, newThreshold?: number) => {
        setUpdating(productId);
        try {
            const updateData: { stockQuantity: number; minStockThreshold?: number } = {
                stockQuantity: newStock
            };
            if (newThreshold !== undefined) {
                updateData.minStockThreshold = newThreshold;
            }

            const response = await fetch(`/api/products/${productId}/inventory`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Stock updated successfully",
                });
                await fetchProducts();
            } else {
                throw new Error('Failed to update stock');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            toast({
                title: "Error",
                description: "Failed to update stock",
                variant: "destructive",
            });
        } finally {
            setUpdating(null);
        }
    };

    const lowStockItems = inventoryData.filter(item => item.isLowStock);
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.stockQuantity * 100), 0); // Assuming average price of $100

    if (loading) {
        return (
            <div className="min-h-screen font-inter">
                <Navigation />
                <main className="pt-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading inventory...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-playfair font-medium mb-2">Inventory Management</h1>
                        <p className="text-muted-foreground">Manage your product stock levels and monitor inventory</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{inventoryData.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Inventory Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Inventory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Reserved</TableHead>
                                        <TableHead>Available</TableHead>
                                        <TableHead>Min Threshold</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventoryData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.stockQuantity}</TableCell>
                                            <TableCell>{item.reservedStock}</TableCell>
                                            <TableCell>{item.availableStock}</TableCell>
                                            <TableCell>{item.minStockThreshold}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.isLowStock ? "destructive" : "default"}>
                                                    {item.isLowStock ? "Low Stock" : "In Stock"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateStock(item.id, item.stockQuantity + 10)}
                                                        disabled={updating === item.id}
                                                    >
                                                        {updating === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "+10"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateStock(item.id, Math.max(0, item.stockQuantity - 1))}
                                                        disabled={updating === item.id}
                                                    >
                                                        {updating === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "-1"}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default InventoryManagementPage;
