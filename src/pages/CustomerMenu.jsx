import { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";

function CustomerMenu() {
    const [scrolled, setScrolled] = useState(false);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > window.innerHeight - 100);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/meals`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch meals');
                }
                setMeals(data.meals);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMeals();
        const intervalId = setInterval(fetchMeals, 20000); 

        return () => clearInterval(intervalId);
    }, [])

    return (
        <>
            <Header scrolled={scrolled} />
            <Hero />
            {loading && <div class="loader">
                <div class="cup">
                    <div class="cup-handle"></div>
                    <div class="smoke one"></div>
                    <div class="smoke two"></div>
                    <div class="smoke three"></div>
                </div>
                <div class="load">..........................</div>
            </div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && <Dashboard meals={meals} />}
            <Footer />
        </>
    );
}
export default CustomerMenu;