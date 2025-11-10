"use client"
import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send the form data to an API
        console.log("Form submitted:", formData);
        // Reset form or show success message
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-playfair font-medium mb-4">
                            Contact Us
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have questions about our jewelry or need assistance? We&apos;re here to help.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-playfair font-medium mb-6">Get in Touch</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium mb-2">Address</h3>
                                        <p className="text-muted-foreground">
                                            123 Jewelry Lane<br />
                                            New York, NY 10001<br />
                                            United States
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">Phone</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">Email</h3>
                                        <p className="text-muted-foreground">info@axels.com</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">Hours</h3>
                                        <p className="text-muted-foreground">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <Button variant="outline" size="sm">
                                        Instagram
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Facebook
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Twitter
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Card className="border-secondary/20">
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <footer className="py-8 px-6 border-t border-border">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    <p>© 2024 AXELS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Contact;
