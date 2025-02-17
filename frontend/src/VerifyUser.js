import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyUser = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!email) errors.email = 'Email is required';
        if (!verificationCode) errors.code = 'Verification code is required';
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const { data } = await axios.post('http://localhost:3000/api/users/verify', {
                email,
                verificationCode
            });
            
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            setError({ submit: err.response?.data?.message || 'Verification failed' });
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-box">
                <h2>Verify Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        {error.email && <span className="error">{error.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="verificationCode">Verification Code</label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter verification code"
                            required
                        />
                        {error.code && <span className="error">{error.code}</span>}
                    </div>
                    {error.submit && <div className="error">{error.submit}</div>}
                    <button type="submit">Verify</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyUser;