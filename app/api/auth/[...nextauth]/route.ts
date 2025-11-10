import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

// Define auth options without explicit type - NextAuth will infer it
const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password)
                    throw new Error("Missing credentials");

                await connectDB();
                const user = await User.findOne({ email: credentials.email }).select("+password");
                if (!user) throw new Error("User not found");
                if (!user.password) throw new Error("User password not set");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid password");

                return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
                console.log("User authenticated:", user);
            },
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        },
        async signIn({ user, account }: { user: any, account: any }) {
            if (account?.provider === "google") {
                await connectDB();
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    await User.create({
                        _id: crypto.randomUUID(),
                        name: user.name,
                        email: user.email,
                        role: "user",
                    });
                }
            }
            return true;
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions as unknown as any);
export { handler as GET, handler as POST };
