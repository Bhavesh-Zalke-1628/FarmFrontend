import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createAccount } from '../Redux/Slice/authSlice';
import { FiUser, FiSmartphone, FiLock, FiArrowRight } from 'react-icons/fi';
import Layout from '../Layout/Layout';

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        password: '',
    });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Name must be at least 3 characters';
        }
        if (!formData.mobileNumber) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = 'Invalid mobile number';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        try {
            const res = await dispatch(createAccount(formData)).unwrap();
            if (res) {
                navigate("/login")
            }

        } catch (error) {
            setErrors({ apiError: error.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>

            <div className="mt-28 bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Create a new account</h2>
                    <p className="text-sm text-center text-gray-500 mt-1">
                        Or{' '}
                        <Link to="/login" className="text-green-600 hover:underline">
                            sign in to your account
                        </Link>
                    </p>

                    {errors.apiError && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                            <p className="text-sm text-red-700">{errors.apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <FiUser className="h-5 w-5" />
                                </span>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2 rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 outline-none shadow-sm`}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <FiSmartphone className="h-5 w-5" />
                                </span>
                                <input
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    type="tel"
                                    placeholder="9876543210"
                                    maxLength="10"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2 rounded-xl border ${errors.mobileNumber ? 'border-red-400' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 outline-none shadow-sm`}
                                />
                            </div>
                            {errors.mobileNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <FiLock className="h-5 w-5" />
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 outline-none shadow-sm`}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters</p>
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating account...' : <>Register <FiArrowRight /></>}
                            </button>
                        </div>
                    </form>

                    {/* Terms */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    By registering, you agree to our
                                </span>
                            </div>
                        </div>

                        <div className="mt-2 text-center text-sm text-gray-600">
                            <Link to="/terms" className="text-green-600 hover:underline">Terms of Service</Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    );
}

export default SignUp;
