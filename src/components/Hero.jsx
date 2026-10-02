import React from 'react'

function Hero() {
    return (
        <section className="hero-fullbleed">
            <img
                className="hero-fullbleed-bg"
                src="https://res.cloudinary.com/dmevmqfw/image/upload/v1790933312/DSC_2374_irsbnz.jpg"
                alt="Campus 360 Cafeteria interior"
                fetchPriority="high"
            />
            <div className="hero-fullbleed-warmwash"></div>
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
