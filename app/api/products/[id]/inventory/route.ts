import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const inventoryData = {
            id: product._id,
            name: product.name,
            sku: product.sku,
            stockQuantity: product.stockQuantity,
            reservedStock: product.reservedStock,
            availableStock: product.stockQuantity - product.reservedStock,
            minStockThreshold: product.minStockThreshold,
            isLowStock: (product.stockQuantity - product.reservedStock) <= product.minStockThreshold
        };

        return NextResponse.json({ inventory: inventoryData });
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();
        const { stockQuantity, minStockThreshold } = body;

        const updateData: { stockQuantity?: number; minStockThreshold?: number } = {};
        if (stockQuantity !== undefined) updateData.stockQuantity = stockQuantity;
        if (minStockThreshold !== undefined) updateData.minStockThreshold = minStockThreshold;

        const { id } = await params;
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Inventory updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating inventory:", error);
        return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
    }
}
