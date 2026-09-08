import { useState } from 'react';
import { groupMealsByCategory } from '../utils/groupMealsByCategory';
import MealCard from './MealCard';

function Dashboard({ meals }) {
    const grouped = groupMealsByCategory(meals);
    const [openCategories, setOpenCategories] = useState({ "Main Course": true });

    function toggleCategory(name) {
        setOpenCategories((prev) => ({     // (prev) => ... = read CURRENT state, avoid stale-click bugs
            ...prev,                      // copy every existing drawer as-is
            [name]: !prev[name],            // flip ONLY this one drawer (undefined flips to true)
        }))
    }

    return (
        <main id="dashboard" className="container main-content">
            {Object.entries(grouped).map(([categoryName, categoryMeals]) => {       // Object.entries: turns { key: value } into [[key, value], ...] so .map() works
                const isOpen = !!openCategories[categoryName]           // !! = force undefined/true into a real false/true

                return (
                    <section key={categoryName} className="category-section mb-3">
                        <button className="category-toggle" onClick={() => toggleCategory(categoryName)} aria-expanded={isOpen}>
                            <span className="section-title">{categoryName}</span>
                            <span className={`chevron ${isOpen ? "open" : ""} `}> ▾ </span>
                        </button>

                        {isOpen && (                    // && trick: renders nothing at all if isOpen is false
                            <div className="meal-grid">         
                                {categoryMeals.map((meal) => (
                                    <div className="meal-grid-item" key={meal._id}>        { /* key = React's per-item tracker, must be unique */}
                                        <MealCard meal={meal} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </main>
    );
}

export default Dashboard;