import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../components/ToggleSwitch';
import { groupMealsByCategory } from '../utils/groupMealsByCategory';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('adminUsername');
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mealName, setMealName] = useState('');
    const [mealDescription, setMealDescription] = useState('');
    const [mealPrice, setMealPrice] = useState('');
    const [mealCategory, setMealCategory] = useState('');
    const [availability, setAvailability] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [mealToDelete, setMealToDelete] = useState(null);


    useEffect(() => {
        const loadMeals = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/meals`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load meals');
                }
                setMeals(data.meals);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadMeals();

    }, []);

    const handleAddMeal = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('adminToken');
        const newMeal = {
            name: mealName,
            description: mealDescription,
            price: mealPrice,
            category: mealCategory,
            isAvailable: availability === 'true',
            imageUrl: imageUrl
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/meals`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newMeal),

                },)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Meal could not be added");
            }

            setMeals((prev) => [...prev, data.meal]);
            setMealName('');
            setMealPrice('');
            setMealDescription('');
            setMealCategory('');
            setImageUrl('');
            toast.success("Meal created successfully!")
            setShowAddForm(false)
        } catch (err) {
            setError(err.message);
            toast.error(err.message)
        } finally {
            setLoading(false);
        }
    }
    // DELETE MEAL
    const confirmDeleteMeal = () => {
        if (!mealToDelete) return;
        handleDeleteMeal(mealToDelete._id);
        setMealToDelete(null);
    };

    const handleDeleteMeal = async (mealId) => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/meals/${mealId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete meal');
            setMeals((prev) => prev.filter((meal) => meal._id !== mealId));
            toast.success(data.message);
        } catch (err) {
            toast.error(err.message);
        }
    };



    // AVAILABILIY TOGGLE
    const handleToggle = async (mealId, newValue) => {
        const token = localStorage.getItem('adminToken');

        setMeals((prev) =>
            prev.map((meal) => (meal._id === mealId ? { ...meal, isAvailable: newValue } : meal))
        );

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/meals/${mealId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isAvailable: newValue }),
            }
            );
            if (!response.ok) {
                throw new Error('Failed to update — reverting');
            }
        } catch (err) {
            setMeals((prev) =>
                prev.map((m) => (m._id === mealId ? { ...m, isAvailable: !newValue } : m))
            );
            alert(err.message);
        }
    }
    //LOGOUT
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin/signin');
    }

    const grouped = groupMealsByCategory(meals)

    return (
        <div>
            <div className="admin-page">
                <header className="admin-topbar">
                    <div className="admin-brand">
                        <div className="logo-mark">
                            <img src="https://res.cloudinary.com/dmevmqfw/image/upload/v1789035341/image-removebg-preview_d2euxv.png" alt="" />
                        </div>
                        <span>Campus 360 Admin</span>
                    </div>
                    <div>
                        {/* <!-- From Uiverse.io by elijahgummer --> */}
                        <button role="button" className="golden-button">
                            <span className="golden-text" onClick={() => setShowAddForm(true)}>Create New Meal</span>
                        </button>

                    </div>
                    <div className="admin-topbar-right">
                        <span className="admin-username">Hi, {username}</span>
                        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                <main className="admin-content">
                    {loading && <p>Loading meals...</p>}
                    {error && <p className="auth-error">{error}</p>}

                    {!loading && !error && Object.entries(grouped).map(([categoryName, categoryMeals]) => (
                        <section key={categoryName} className="admin-category-section">
                            <h2 className="admin-category-title">{categoryName}</h2>
                            {categoryMeals.map((meal) => (
                                <div className="admin-meal-row" key={meal._id}>
                                    <div className="admin-meal-info">
                                        <span className="admin-meal-name">{meal.name}</span>
                                        <span className="admin-meal-price">₦{meal.price.toLocaleString()}</span>
                                    </div>

                                    <button className="delete-meal-btn btn bg-transparent" onClick={() => setMealToDelete(meal)} type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /></svg>
                                    </button>

                                    <ToggleSwitch
                                        checked={meal.isAvailable}
                                        onChange={(e) => handleToggle(meal._id, e.target.checked)}
                                    />
                                </div>
                            ))}
                        </section>
                    ))}



                </main>




                {showAddForm && (
                    <div className="modal-backdrop">

                        <form className='mealForm' onSubmit={handleAddMeal}>



                            <div className="close-btn ">
                                <button className="close-form-button btn " onClick={() => setShowAddForm(false)} type='button'>close</button>
                            </div>



                            <label htmlFor="Meal Name">
                                <input
                                    placeholder="Meal name"
                                    className="mealInput"
                                    type='text'
                                    value={mealName}
                                    onChange={(e) => setMealName(e.target.value)}
                                />
                            </label>

                            <label htmlFor="Meal Description">
                                <input
                                    placeholder="Meal Description"
                                    className="mealInput"
                                    type='text'
                                    value={mealDescription}
                                    onChange={(e) => setMealDescription(e.target.value)}
                                />
                            </label>

                            <label htmlFor="Meal Category">
                                <select name="" id="" className='mealInput w-50'
                                    placeholder="Select Category"
                                    value={mealCategory}
                                    onChange={(e) => setMealCategory(e.target.value)}
                                >
                                    <option className='bg-dark' value="">Select Category</option>
                                    <option className='bg-dark' value="Main Dish">Main Dish</option>
                                    <option className='bg-dark' value="Snacks">Snacks</option>
                                    <option className='bg-dark' value="Drinks">Drinks</option>
                                    <option className='bg-dark' value="Sides">Sides</option>
                                    <option className='bg-dark' value="Protein">Protein</option>
                                    <option className='bg-dark' value="Soup &  Swallow">Soup &  Swallow</option>
                                </select>

                            </label>

                            <label htmlFor="Meal Price">
                                <input
                                    placeholder="Price"
                                    className="mealInput"
                                    type='text'
                                    value={mealPrice}
                                    onChange={(e) => setMealPrice(e.target.value)}
                                />
                            </label>

                            <label htmlFor="Image Url">
                                <input
                                    placeholder="Image Url"
                                    className="mealInput"
                                    type='text'
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </label>

                            <button className='addMealButton'>Submit</button>

                        </form>
                    </div>
                )}

                {mealToDelete && (
                    <div className="modal-backdrop">
                        <div className="modal-content-custom">
                            <h3>Delete Meal?</h3>
                            <p>Are you sure you want to delete <strong>{mealToDelete.name}</strong>? This cannot be undone.</p>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setMealToDelete(null)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDeleteMeal}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminDashboard
