import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID || process.env.ROZERPAY_KEY_ID;
        const keySecret =
            process.env.RAZORPAY_KEY_SECRET || process.env.ROZERPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return NextResponse.json(
                { error: "Razorpay is not configured. Missing env keys." },
                { status: 500 }
            );
        }

        const { amount, currency = "INR" } = await req.json();
        if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount. Provide a positive number." },
                { status: 400 }
            );
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const options = {
            amount: Math.round(amount * 100), // Razorpay uses paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("create-order error:", error);
        return NextResponse.json(
            { error: "Failed to create Razorpay order." },
            { status: 500 }
        );
    }
}
