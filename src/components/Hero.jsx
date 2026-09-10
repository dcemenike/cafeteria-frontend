import React from 'react'

function Hero() {
    return (
        <section className="hero-fullbleed">
            <img
                className="hero-fullbleed-bg"
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
                alt="Campus 360 Cafeteria interior"
                fetchPriority="high"
            />
            <div className="hero-fullbleed-overlay"></div>

            <div className="hero-fullbleed-content">
                <h2>Tastes just like home</h2>
                <p>Fresh meals daily </p>
                <a href="#dashboard" className="explore-btn">
                    Explore Our Menu →
                </a>
            </div>
        </section>
    );
}

export default Hero;
