import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginAccount, sendOtp, verifyOtp } from '../Redux/Slice/authSlice';
import { FiSmartphone, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [authMethod, setAuthMethod] = useState('password');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        mobileNumber: '',
        password: '',
        otp: ''
    });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.mobileNumber) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = 'Invalid mobile number';
        }
        if (authMethod === 'password' && !formData.password) {
            newErrors.password = 'Password is required';
        }
        if (authMethod === 'otp' && otpSent && !formData.otp) {
            newErrors.otp = 'OTP is required';
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
            let res;
            if (authMethod === 'password') {
                res = await dispatch(loginAccount({
                    mobileNumber: formData.mobileNumber,
                    password: formData.password
                })).unwrap();
            } else {
                if (otpSent) {
                    res = await dispatch(verifyOtp({
                        mobileNumber: formData.mobileNumber,
                        otp: formData.otp
                    })).unwrap();
                } else {
                    res = await dispatch(sendOtp({
                        mobileNumber: formData.mobileNumber
                    })).unwrap();
                    setOtpSent(true);
                    return;
                }
            }

            if (res.success) {
                navigate(res.redirectTo || '/');
            } else {
                setErrors({ apiError: res.message || 'Authentication failed' });
            }
        } catch (error) {
            setErrors({ apiError: error.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthMethod = () => {
        setAuthMethod(prev => prev === 'password' ? 'otp' : 'password');
        setOtpSent(false);
        setFormData(prev => ({ ...prev, password: '', otp: '' }));
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
                <p className="text-sm text-center text-gray-500 mt-1">
                    Or{' '}
                    <Link to="/signup" className="text-green-600 hover:underline">
                        create a new account
                    </Link>
                </p>

                {errors.apiError && (
                    <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                        <p className="text-sm text-red-700">{errors.apiError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* Mobile */}
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

                    {/* Password or OTP */}
                    {authMethod === 'password' ? (
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
                            <div className="text-right mt-2">
                                <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">Forgot password?</Link>
                            </div>
                        </div>
                    ) : (
                        otpSent && (
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2.5 text-gray-400">
                                        <FiMail className="h-5 w-5" />
                                    </span>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        maxLength="6"
                                        className={`w-full pl-10 pr-3 py-2 rounded-xl border ${errors.otp ? 'border-red-400' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 outline-none shadow-sm`}
                                    />
                                </div>
                                {errors.otp && (
                                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">
                                    OTP sent to +91 {formData.mobileNumber}
                                </p>
                            </div>
                        )
                    )}

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading
                                ? 'Processing...'
                                : authMethod === 'password'
                                    ? 'Sign in'
                                    : otpSent ? 'Verify OTP' : 'Send OTP'}
                            {!loading && <FiArrowRight />}
                        </button>
                    </div>
                </form>

                {/* Divider + Toggle Method */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={toggleAuthMethod}
                        className="mt-6 w-full py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
                    >
                        {authMethod === 'password' ? 'Sign in with OTP' : 'Sign in with Password'}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default SignIn