import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import { sendOrderConfirmationEmail } from "@/app/lib/email";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('userEmail');

        let query = {};
        if (userEmail) {
            query = { userEmail };
        }

        const orders = await Order.find(query)
            .select('-__v')
            .sort({ createdAt: -1 });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        console.log("Received order data:", JSON.stringify(body, null, 2));
        
        const { orderId, date, status, total, items, trackingNumber, userId, userEmail, username, shippingAddress } = body;

        // Validate required fields
        if (!orderId || !date || !status || !total || !items || !userEmail || !shippingAddress || items.length === 0) {
            console.error("Missing required fields:", { orderId, date, status, total, items: !!items, userEmail, username, shippingAddress: !!shippingAddress });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate shipping address fields
        const requiredShippingFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
        const missingFields = requiredShippingFields.filter(field => !shippingAddress[field]);
        if (missingFields.length > 0) {
            console.error("Missing shipping address fields:", missingFields);
            return NextResponse.json({ 
                error: `Missing shipping address fields: ${missingFields.join(', ')}` 
            }, { status: 400 });
        }

        // Generate unique orderId if not provided
        const finalOrderId = orderId || `ORD-${Date.now()}`;

        const orderData = {
            orderId: finalOrderId,
            date: new Date(date),
            status,
            total,
            items,
            trackingNumber: trackingNumber || undefined,
            userId: userId || undefined,
            userEmail,
            userName: username || "Guest",
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                phone: shippingAddress.phone,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country
            }
        };

        console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

        const newOrder = new Order(orderData);

        const savedOrder = await newOrder.save();
        console.log("Order saved successfully:", savedOrder.orderId);

        // Send order confirmation email
        try {
            await sendOrderConfirmationEmail(userEmail, finalOrderId, {
                items,
                total,
                status,
            });
        } catch (emailError) {
            console.error("Failed to send order confirmation email:", emailError);
            // Don't fail the order creation if email fails
        }

        return NextResponse.json({
            message: "Order created successfully",
            order: savedOrder
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("Error creating order:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorDetails = error && typeof error === 'object' && 'errors' in error ? error.errors : undefined;
        if (errorDetails) {
            console.error("Validation errors:", errorDetails);
        }
        return NextResponse.json({ 
            error: "Failed to create order",
            details: errorMessage
        }, { status: 500 });
    }
}
