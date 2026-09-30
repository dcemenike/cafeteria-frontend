import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  //this disables the button and shows feedback WHILE user waits
    const [registerSecret, setRegisterSecret] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-register-secret': `${registerSecret}`
                },
                body: JSON.stringify({ username, password, email })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Could not create account — please try again');
            }

            navigate('/admin/signin');
        }
        catch (err) {
            if (err instanceof TypeError) {
                setError('Unable to reach the server. Check your connection and try again.')
            } else {
                setError(err.message);
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-logo-mark">360</div>
                    <h1 className="auth-title">Create Admin Account</h1>
                    <p className="auth-sub">Campus 360 staff sign up</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <label className="auth-label">
                            Email
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </label>

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
                            <div className="password-field-wrapper">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="auth-input"
                                />
                                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        <label className="secret-key">
                            {/* <!-- From Uiverse.io by 0xnihilism --> */}
                            <div className="brutalist-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="auth-input"
                                />
                                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        <label className="secret-key">
                            <div className="brutalist-container">
                                <input
                                    placeholder="********"
                                    className="brutalist-input smooth-type"
                                    type={showSecret ? "text" : "password"}
                                    value={registerSecret}
                                    onChange={(e) => setRegisterSecret(e.target.value)}
                                />
                                <label className="brutalist-label">SECRET KEY</label>
                                <button type="button" className="brutalist-toggle-btn" onClick={() => setShowSecret((prev) => !prev)}>
                                    {showSecret ? "Hide" : "Show"}
                                </button>
                            </div>


                        </label>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="auth-footer-link">
                        Already have an account? <Link to="/admin/signin">Sign In</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default SignUp
