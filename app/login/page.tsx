"use client";

import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
        });

        setLoading(false);

        if (result?.error) {
            setErrorMsg(result.error);
        } else {
            router.push("/"); // redirect on success
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Card className="w-full max-w-md border-secondary/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-playfair">Welcome Back</CardTitle>
                        <p className="text-muted-foreground">Sign in to your AXELS account</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                        >
                            Sign in with Google
                        </Button>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                            <p className="text-sm">
                                <Link href="/forgot-password" className="text-muted-foreground hover:underline">
                                    Forgot your password?
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <footer className="py-8 px-6 border-t border-border">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    <p>© 2024 AXELS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Login;
