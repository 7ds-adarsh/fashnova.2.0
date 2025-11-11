import { useEffect } from 'react';

const InstagramFeed = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <section className="py-16 sm:py-20 px-6 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12 space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-medium">
                        Follow Our Journey
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover daily inspiration and behind-the-scenes moments from our atelier
                    </p>
                </div>

                <div className="lightwidget-widget rounded-3xl overflow-hidden shadow-xl">
                    <iframe
                        src="//lightwidget.com/widgets/0f4796a7261e5009a1332c9e05a00a60.html"
                        scrolling="no"
                        // allowTransparency={true}
                        className="w-full"
                        style={{
                            border: 0,
                            overflow: 'hidden',
                            width: '100%',
                            height: '300px',
                        }}
                        title="Instagram Feed"
                    />
                </div>

                <div className="text-center mt-6 sm:mt-8">
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Follow us on Instagram{' '}
                        <a
                            href="https://www.instagram.com/fashnovajewels"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent/80 font-medium transition-colors"
                        >
                            @fashnova
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;