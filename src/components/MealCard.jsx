import React from 'react'
import { useState } from 'react';

function MealCard({ meal }) {
    const [imageFailed, setImageFailed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const unitByCategory = {
    'Main Dish': 'scoop',
    'Soup &  Swallow': 'wrap',
    'Protein': 'piece',
    'Snacks': 'piece',
    'Sides': '',
    'Drinks': 'bottle',
};

    return (
        <div className={`card meal-card ${!meal.isAvailable ? "unavailable" : ""}`}>
            {!meal.isAvailable && <div className="unavailable-fade" />}

            <div className={`card-img-top-wrap ${!imageLoaded && !imageFailed ? "loading" : ""}`}>
                {!imageFailed ? (
                    <img
                        className="meal-photo"
                        src={meal.imageUrl}
                        alt={meal.name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageFailed(true)}
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                    />
                ) : (
                    <span className="meal-emoji-fallback">🍽️</span>
                )}
                <span className={`status-banner ${meal.isAvailable ? "available" : "unavailable"}`}>
                    {meal.isAvailable ? "Available" : "Unavailable"}
                </span>
            </div>

            <div className="card-body d-flex flex-column">
                <span className="category-tag">{meal.category}</span>
                <h3 className="meal-name">{meal.name}</h3>
                <p className="meal-desc">{meal.description}</p>

                <div className="card-footer-custom d-flex justify-content-between align-items-center">
                    <div className="price">
                        ₦{meal.price.toLocaleString()} <small>/ {unitByCategory[meal.category] || 'item'}</small>
                    </div>
                    <div className="updated-at">Updated {new Date(meal.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>
        </div>
    );
}

export default MealCard;