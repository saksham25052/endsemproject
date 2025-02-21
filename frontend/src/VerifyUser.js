import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

const VerifyUser = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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

        setIsLoading(true);
        try {
            const { data } = await axios.post('http://localhost:3000/api/users/verify', {
                email,
                verificationCode
            });
            
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            setError({ submit: err.response?.data?.message || 'Verification failed' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Verify Your Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please enter your email and verification code to continue
                    </p>
                </div>

                {isSuccess ? (
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="text-green-600 font-medium">Verification successful! Redirecting...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-2 border ${
                                        error.email ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {error.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {error.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                                Verification Code
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-2 border ${
                                        error.code ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                                    placeholder="Enter verification code"
                                />
                            </div>
                            {error.code && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {error.code}
                                </p>
                            )}
                        </div>

                        {error.submit && (
                            <div className="p-3 bg-red-50 rounded-md">
                                <p className="text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {error.submit}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Account'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VerifyUser;