import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, price, category, image, description, stockQuantity, minStockThreshold } = body;

        // Validate required fields
        if (!name || !price || !category || !image || !description) {
            return NextResponse.json(
                { error: "Name, price, category, image, and description are required" },
                { status: 400 }
            );
        }

        // Create new product
        const newProduct = new Product({
            name,
            price: parseFloat(price),
            category,
            image,
            description,
            stockQuantity: stockQuantity || 0,
            reservedStock: 0,
            minStockThreshold: minStockThreshold || 5,
        });

        const savedProduct = await newProduct.save();

        return NextResponse.json(
            { message: "Product added successfully", product: savedProduct },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const products = await Product.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
