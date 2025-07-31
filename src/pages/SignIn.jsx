import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginAccount, sendOtp, verifyOtp } from '../Redux/Slice/authSlice';
import { FiSmartphone, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import Layout from '../Layout/Layout';

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
        otp: '',
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
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
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
                res = await dispatch(
                    loginAccount({
                        mobileNumber: formData.mobileNumber,
                        password: formData.password,
                    })
                ).unwrap();
            } else {
                if (otpSent) {
                    res = await dispatch(
                        verifyOtp({
                            mobileNumber: formData.mobileNumber,
                            otp: formData.otp,
                        })
                    ).unwrap();
                } else {
                    res = await dispatch(
                        sendOtp({
                            mobileNumber: formData.mobileNumber,
                        })
                    ).unwrap();
                    setOtpSent(true);
                    return; // wait for OTP input next submit
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
        setAuthMethod((prev) => (prev === 'password' ? 'otp' : 'password'));
        setOtpSent(false);
        setFormData((prev) => ({ ...prev, password: '', otp: '' }));
        setErrors({});
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 sm:p-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center">Sign In</h2>
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Or{' '}
                        <Link to="/signup" className="font-medium text-green-600 hover:underline">
                            create a new account
                        </Link>
                    </p>

                    {errors.apiError && (
                        <div
                            role="alert"
                            className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
                        >
                            <p className="text-sm text-red-700">{errors.apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                        {/* Mobile Number Field */}
                        <div>
                            <label
                                htmlFor="mobileNumber"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mobile Number
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                    <FiSmartphone className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    id="mobileNumber"
                                    placeholder="9876543210"
                                    maxLength="10"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className={`block w-full rounded-xl border px-3 py-2 pl-10 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${errors.mobileNumber ? 'border-red-400' : 'border-gray-300'
                                        }`}
                                    aria-invalid={errors.mobileNumber ? 'true' : 'false'}
                                    aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
                                />
                            </div>
                            {errors.mobileNumber && (
                                <p
                                    className="mt-1 text-sm text-red-600"
                                    id="mobileNumber-error"
                                    role="alert"
                                >
                                    {errors.mobileNumber}
                                </p>
                            )}
                        </div>

                        {/* Password or OTP input */}
                        {authMethod === 'password' ? (
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                        <FiLock className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full rounded-xl border px-3 py-2 pl-10 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${errors.password ? 'border-red-400' : 'border-gray-300'
                                            }`}
                                        aria-invalid={errors.password ? 'true' : 'false'}
                                        aria-describedby={errors.password ? 'password-error' : undefined}
                                    />
                                </div>
                                {errors.password && (
                                    <p
                                        className="mt-1 text-sm text-red-600"
                                        id="password-error"
                                        role="alert"
                                    >
                                        {errors.password}
                                    </p>
                                )}
                                <div className="text-right mt-2">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-green-600 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            otpSent && (
                                <div>
                                    <label
                                        htmlFor="otp"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        OTP
                                    </label>
                                    <div className="relative mt-1">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                            <FiMail className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            maxLength={6}
                                            className={`block w-full rounded-xl border px-3 py-2 pl-10 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${errors.otp ? 'border-red-400' : 'border-gray-300'
                                                }`}
                                            aria-invalid={errors.otp ? 'true' : 'false'}
                                            aria-describedby={errors.otp ? 'otp-error' : undefined}
                                        />
                                    </div>
                                    {errors.otp && (
                                        <p
                                            className="mt-1 text-sm text-red-600"
                                            id="otp-error"
                                            role="alert"
                                        >
                                            {errors.otp}
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        OTP sent to +91 {formData.mobileNumber}
                                    </p>
                                </div>
                            )
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2 text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-green-700`}
                            >
                                {loading
                                    ? 'Processing...'
                                    : authMethod === 'password'
                                        ? 'Sign in'
                                        : otpSent
                                            ? 'Verify OTP'
                                            : 'Send OTP'}
                                {!loading && <FiArrowRight className="w-5 h-5" aria-hidden="true" />}
                            </button>
                        </div>
                    </form>

                    {/* Divider and Toggle Auth Method */}
                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500 select-none cursor-default">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={toggleAuthMethod}
                        type="button"
                        className="mt-6 w-full rounded-xl border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {authMethod === 'password' ? 'Sign in with OTP' : 'Sign in with Password'}
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default SignIn;
