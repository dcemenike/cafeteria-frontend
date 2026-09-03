import React from 'react'
import { useState } from 'react';

function MealCard({ meal }) {
    const [imageFailed, setImageFailed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className={`card meal-card ${!meal.available ? "unavailable" : ""}`}>
            {!meal.available && <div className="unavailable-fade" />}

            <div className={`card-img-top-wrap ${!imageLoaded && !imageFailed ? "loading" : ""}`}>
                {!imageFailed ? (
                    <img
                        className="meal-photo"
                        src={meal.image}
                        alt={meal.name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageFailed(true)}
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                    />
                ) : (
                    <span className="meal-emoji-fallback">{meal.emoji}</span>
                )}
                <span className={`status-banner ${meal.available ? "available" : "unavailable"}`}>
                    {meal.available ? "Available" : "Unavailable"}
                </span>
            </div>

            <div className="card-body d-flex flex-column">
                <span className="category-tag">{meal.category}</span>
                <h3 className="meal-name">{meal.name}</h3>
                <p className="meal-desc">{meal.description}</p>

                <div className="card-footer-custom d-flex justify-content-between align-items-center">
                    <div className="price">
                        ₦{meal.price.toLocaleString()} <small>/ scoop</small>
                    </div>
                    <div className="updated-at">Updated {meal.updatedAt}</div>
                </div>
            </div>
        </div>
    );
}

export default MealCard;