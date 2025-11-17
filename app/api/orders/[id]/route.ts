import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const order = await Order.findOne({ orderId: id })
            .select('-__v');

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();
        const { status, trackingNumber } = body;

        // Validate status if provided
        if (status && !["Processing", "Shipped", "Delivered"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updateData: { status?: string; trackingNumber?: string } = {};
        if (status) updateData.status = status;
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

        const { id } = await params;
        const order = await Order.findOne({ orderId: id });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // If status is being changed to "Shipped" or "Delivered", decrement reserved stock and update stock quantity
        if (status && (status === "Shipped" || status === "Delivered") && order.status === "Processing") {
            for (const item of order.items) {
                await Product.findOneAndUpdate(
                    { name: item.name },
                    {
                        $inc: {
                            reservedStock: -item.quantity,
                            stockQuantity: -item.quantity
                        }
                    }
                );
            }
        }

        // If status is being changed back to "Processing" from "Shipped" or "Delivered", restore reserved stock
        if (status && status === "Processing" && (order.status === "Shipped" || order.status === "Delivered")) {
            for (const item of order.items) {
                await Product.findOneAndUpdate(
                    { name: item.name },
                    { $inc: { reservedStock: item.quantity } }
                );
            }
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: id },
            updateData,
            { new: true }
        )
            .select('-__v');

        return NextResponse.json({
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const deletedOrder = await Order.findOneAndDelete({ orderId: id });

        if (!deletedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order deleted successfully" });

    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
