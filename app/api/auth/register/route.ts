import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        if (!name || !email || !password)
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return NextResponse.json({ error: "User already exists" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ message: "User registered", user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
