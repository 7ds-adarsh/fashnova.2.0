import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // ✅ Valid — update your DB order status here
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}