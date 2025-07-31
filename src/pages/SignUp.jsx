import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createAccount } from '../Redux/Slice/authSlice';
import { FiUser, FiSmartphone, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import Layout from '../Layout/Layout';

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
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
                navigate("/login");
            }
        } catch (error) {
            setErrors({ apiError: error.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '', color: '' };

        if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
        if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
        if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
        return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
                            <FiUser className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join us today</h1>
                        <p className="text-gray-600">Create your account and get started</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                        {/* Sign In Link */}
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        {/* Error Alert */}
                        {errors.apiError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 animate-shake">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-12 bg-red-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Error</p>
                                        <p className="text-sm text-red-600">{errors.apiError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div className="group">
                                <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <FiUser className="w-4 h-4" />
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${errors.fullName
                                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                                            : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'
                                            } placeholder-gray-400`}
                                    />
                                    {formData.fullName && !errors.fullName && (
                                        <FiCheckCircle className="absolute right-4 top-4 w-5 h-5 text-green-500" />
                                    )}
                                </div>
                                {errors.fullName && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            {/* Mobile Number */}
                            <div className="group">
                                <label htmlFor="mobileNumber" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <FiSmartphone className="w-4 h-4" />
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <input
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        type="tel"
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength="10"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${errors.mobileNumber
                                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                                            : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'
                                            } placeholder-gray-400`}
                                    />
                                    {formData.mobileNumber && !errors.mobileNumber && (
                                        <FiCheckCircle className="absolute right-4 top-4 w-5 h-5 text-green-500" />
                                    )}
                                </div>
                                {errors.mobileNumber && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        {errors.mobileNumber}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <FiLock className="w-4 h-4" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a secure password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3.5 pr-12 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${errors.password
                                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                                            : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'
                                            } placeholder-gray-400`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">Password strength</span>
                                            <span className={`text-xs font-medium ${passwordStrength.strength < 50 ? 'text-red-600' :
                                                passwordStrength.strength < 75 ? 'text-yellow-600' :
                                                    passwordStrength.strength < 100 ? 'text-blue-600' : 'text-green-600'
                                                }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full group relative flex items-center justify-center gap-2 py-4 px-6 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Terms and Privacy */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-center text-sm text-gray-600">
                                By creating an account, you agree to our{' '}
                                <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default SignUp;