import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('wishlist');
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ wishlist: user.wishlist || [] });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, productId, action } = body;

        if (!email || !productId || !action) {
            return NextResponse.json({ error: "Email, productId, and action are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (action === 'add') {
            if (!user.wishlist) {
                user.wishlist = [];
            }
            if (!user.wishlist.includes(productId)) {
                user.wishlist.push(productId);
            }
        } else if (action === 'remove') {
            if (user.wishlist) {
                user.wishlist = user.wishlist.filter(id => id !== productId);
            }
        } else {
            return NextResponse.json({ error: "Invalid action. Use 'add' or 'remove'" }, { status: 400 });
        }

        await user.save();

        return NextResponse.json({
            message: `Product ${action === 'add' ? 'added to' : 'removed from'} wishlist successfully`,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error("Error updating wishlist:", error);
        return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
    }
}
