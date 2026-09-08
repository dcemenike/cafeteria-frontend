import React from 'react'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admins/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUsername', data.admin.username);

            navigate('/admin/dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <div className="auth-page">
                <div className="auth-card auth-card--photo">
                    <div className="auth-card-overlay"></div>

                    <div className="auth-card-content">
                        <div className="auth-logo-mark">360</div>
                        <h1 className="auth-title">Admin Sign In</h1>
                        <p className="auth-sub">Campus 360 staff login</p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <label className="auth-label">
                            Username
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </label>

                        <label className="auth-label">
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </label>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                        </form>

                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
