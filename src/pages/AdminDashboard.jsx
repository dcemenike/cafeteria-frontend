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
    const [mealToEdit, setMealToEdit] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const loadMeals = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/meals`);
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.message || 'Could not load the menu — please try again');
                }
                setMeals(data.meals);
            } catch (err) {
                if (err instanceof TypeError) {
                    setError('Unable to reach the server. Check your connection and try again.');
                } else {
                    setError(err.message)
                }
            } finally {
                setLoading(false);
            }
        }

        loadMeals();

    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (!e.target.closest('.kebab-wrapper')) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // ADD MEAL
    const handleAddMeal = async (event) => {
        event.preventDefault();

        if (!mealName.trim()) {
            toast.error('Please enter a meal name.');
            return;
        }
        if (!mealDescription.trim()) {
            toast.error('Please enter a meal description.');
            return;
        }
        if (!mealCategory) {
            toast.error('Please select a category.');
            return;
        }
        if (!mealPrice || Number(mealPrice) < 0) {
            toast.error('Please enter a valid price.');
            return;
        }
        if (!imageUrl.trim()) {
            toast.error('Please add an image URL.');
            return;
        }

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
            toast.error(err.message)
        } finally {
            setLoading(false);
        }
    }
    //EDIT MEAL
    const handleEditMeal = async (event) => {
        event.preventDefault();

        if (!mealName.trim() || !mealDescription.trim() || !mealCategory || !mealPrice || !imageUrl.trim()) {
            toast.error('Please fill in every field.');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const updatedMeal = {
            name: mealName,
            description: mealDescription,
            price: Number(mealPrice),
            category: mealCategory,
            isAvailable: availability === 'true',
            imageUrl: imageUrl,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/meals/${mealToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedMeal),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Could not update meal — please try again');
            }

            setMeals((prev) => prev.map((m) => (m._id === mealToEdit._id ? data.meal : m)));
            toast.success('Meal updated successfully!');
            setMealToEdit(null);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };


    function toggleMenu(mealId) {
        setOpenMenuId((prev) => (prev === mealId ? null : mealId));
    }

    function handleEditClick(meal) {
        setMealName(meal.name);
        setMealDescription(meal.description);
        setMealPrice(meal.price);
        setMealCategory(meal.category);
        setImageUrl(meal.imageUrl);
        setAvailability(meal.isAvailable ? 'true' : 'false');
        setMealToEdit(meal);
        setOpenMenuId(null);
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

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error('Failed to delete meal');
            }

            setMeals((prev) => prev.filter((meal) => meal._id !== mealId));
            toast.success('Meal deleted successfully');
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
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Could not update availability - please try again');
            }
        } catch (err) {
            setMeals((prev) =>
                prev.map((m) => (m._id === mealId ? { ...m, isAvailable: !newValue } : m))
            );
            toast(err.message);
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

                    <div className="admin-topbar-desktop-actions">
                        {/* <!-- From Uiverse.io by elijahgummer --> */}
                        <button role="button" className="golden-button">
                            <span className="golden-text" onClick={() => {
                                setMealName('');
                                setMealDescription('');
                                setMealPrice('');
                                setMealCategory('');
                                setImageUrl('');
                                setAvailability('true');
                                setShowAddForm(true)
                            }}>
                                Create New Meal
                            </span>
                        </button>
                        <span className="admin-username">Hi, {username}</span>
                        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
                    </div>

                    <button className="hamburger-btn" onClick={() => setMobileMenuOpen((prev) => !prev)} type="button">
                        ☰
                    </button>
                    {mobileMenuOpen && (
                        <div className="mobile-admin-menu">
                            <span className="admin-username">Hi, {username}</span>
                            <button
                                className="mobile-menu-item"
                                onClick={() => {
                                    setShowAddForm(true);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Create New Meal
                            </button>
                            <button className="mobile-menu-item mobile-menu-item--danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
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

                                    <div className="kebab-wrapper">
                                        <button className="kebab-btn" onClick={() => toggleMenu(meal._id)} type="button">
                                            ⋮
                                        </button>

                                        {openMenuId === meal._id && (
                                            <div className="kebab-menu">
                                                <button className="kebab-menu-item" onClick={() => handleEditClick(meal)} type="button">
                                                    Edit
                                                </button>
                                                <button
                                                    className="kebab-menu-item kebab-menu-item--danger"
                                                    onClick={() => { setMealToDelete(meal); setOpenMenuId(null); }}
                                                    type="button"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <ToggleSwitch
                                        checked={meal.isAvailable}
                                        onChange={(e) => handleToggle(meal._id, e.target.checked)}
                                    />
                                </div>
                            ))}
                        </section>
                    ))}



                </main>




                {(showAddForm || mealToEdit) && (
                    <div className="modal-backdrop">

                        <form className='mealForm' onSubmit={mealToEdit ? handleEditMeal : handleAddMeal}>
                            <div className="close-btn ">
                                <button className="close-form-button btn"
                                    type='button'
                                    onClick={() => { setShowAddForm(false); setMealToEdit(null); }}>
                                    close
                                </button>
                            </div>

                            <h3>{mealToEdit ? 'Edit Meal' : 'Add New Meal'}</h3>

                            <label htmlFor="Meal Name">
                                <input
                                    placeholder="Meal name"
                                    className="mealInput"
                                    type='text'
                                    value={mealName}
                                    onChange={(e) => setMealName(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="Meal Description">
                                <input
                                    placeholder="Meal Description"
                                    className="mealInput"
                                    type='text'
                                    value={mealDescription}
                                    onChange={(e) => setMealDescription(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="Meal Category">
                                <select name="" id="" className='mealInput w-50'
                                    placeholder="Select Category"
                                    value={mealCategory}
                                    required
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
                                    type='number'
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

                            <button className='addMealButton' disabled={loading}>
                                {loading ? 'Saving...' : (mealToEdit ? 'Save Changes' : 'Submit')}
                            </button>
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
