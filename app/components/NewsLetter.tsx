import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const NewsLetter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setStatus("error");
            return;
        }

        setStatus("loading");
        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            setEmail("");
            // Reset success message after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        }, 1000);
    };

    return (
        <section className="py-12 sm:py-16 px-6 bg-secondary/5">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-medium mb-4">
                    Subscribe to Our Newsletter
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Stay updated with our latest collections, exclusive offers, and jewelry care tips.
                    Join our community of jewelry enthusiasts.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="flex-1">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-secondary/20 focus:border-secondary/50 h-10 sm:h-12"
                            disabled={status === "loading" || status === "success"}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="h-10 sm:h-12 px-6 sm:px-8 btn-responsive"
                    >
                        {status === "loading" ? "Subscribing..." : "Subscribe"}
                    </Button>
                </form>

                {/* Status Messages */}
                <div className="h-6 mt-4">
                    {status === "error" && (
                        <p className="text-sm text-destructive">Please enter a valid email address.</p>
                    )}
                    {status === "success" && (
                        <p className="text-sm text-accent">Thank you for subscribing!</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewsLetter;