import Navigation from "@/app/components/Navigation";
import Image from "next/image";
import heroImage from "@/public/hero-jewelry.jpg";
import contactImage from "@/public/contact-image.jpg";

const About = () => {
    return (
        <div className="min-h-screen font-inter">
            <Navigation />
            <main className="pt-24 pb-16">
                <section className="px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h1 className="text-5xl md:text-6xl font-playfair font-medium">
                                About AXELS
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                A legacy of excellence in fine jewelry craftsmanship
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-playfair font-medium">
                                    Our Story
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Founded with a passion for creating timeless beauty, AXELS has been crafting
                                    exceptional jewelry pieces for generations. Our commitment to excellence and
                                    attention to detail has made us a trusted name in luxury jewelry.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Each piece is meticulously designed and handcrafted by our skilled artisans,
                                    combining traditional techniques with contemporary design. We source only the
                                    finest materials to ensure every creation is a masterpiece.
                                </p>
                            </div>
                            <div className="rounded-3xl overflow-hidden">
                                <Image
                                    src={heroImage}
                                    alt="AXELS Jewelry Workshop"
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                            <div className="rounded-3xl overflow-hidden order-2 md:order-1">
                                <Image
                                    src={contactImage}
                                    alt="Craftsmanship"
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="space-y-6 order-1 md:order-2">
                                <h2 className="text-3xl md:text-4xl font-playfair font-medium">
                                    Our Craftsmanship
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Every AXELS piece represents hours of dedicated work by master craftsmen
                                    who bring decades of experience to their art. From the initial sketch to
                                    the final polish, we maintain the highest standards of quality.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We believe that jewelry is more than adornment—it&apos;s a celebration of life&apos;s
                                    most precious moments. That&apos;s why we pour our hearts into every creation,
                                    ensuring each piece tells its own unique story.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/30 rounded-3xl p-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-playfair font-medium mb-6">
                                Our Values
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8 mt-12">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-playfair font-medium">Excellence</h3>
                                    <p className="text-muted-foreground">
                                        Unwavering commitment to the highest standards in every detail
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-playfair font-medium">Authenticity</h3>
                                    <p className="text-muted-foreground">
                                        Genuine materials and transparent practices in all we do
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-playfair font-medium">Heritage</h3>
                                    <p className="text-muted-foreground">
                                        Honoring timeless traditions while embracing innovation
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="py-8 px-6 border-t border-border">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    <p>© 2024 AXELS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default About;
