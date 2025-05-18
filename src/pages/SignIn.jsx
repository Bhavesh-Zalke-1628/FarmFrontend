import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginAccount, sendOtp, verifyOtp } from '../Redux/Slice/authSlice';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMobileSignIn, setIsMobileSignIn] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
        mobileNumber: '',
        otp: '',
    });

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignInData({ ...signInData, [name]: value });
    };

    // Email & Password Login
    async function loginUser(event) {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await dispatch(loginAccount({ mobileNumber: signInData.mobileNumber, password: signInData.password }))
            if (res.payload.success) {
                navigate('/');
            } else {
                setError(res.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    // Send OTP to Mobile
    async function handleSendOtp(event) {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await dispatch(sendOtp({ mobileNumber: signInData.mobileNumber })).unwrap();

            if (res.success) {
                setOtpSent(true);
            } else {
                setError(res.message || 'Failed to send OTP.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    // Verify OTP
    async function handleVerifyOtp(event) {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await dispatch(verifyOtp({ mobileNumber: signInData.mobileNumber, otp: signInData.otp })).unwrap();

            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.message || 'Invalid OTP. Try again.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    // Toggle between Email & Mobile Login
    const handleToggle = () => {
        setIsMobileSignIn(!isMobileSignIn);
        setOtpSent(false); // Reset OTP state
        setSignInData({
            password: '',
            mobileNumber: '',
            otp: '',
        });
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 sm:p-8">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {isMobileSignIn ? 'Sign in with OTP' : 'Sign in to your account'}
                        </h1>
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <form className="space-y-4" onSubmit={isMobileSignIn ? (otpSent ? handleVerifyOtp : handleSendOtp) : loginUser}>
                            {isMobileSignIn ? (
                                <>
                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="text"
                                            name="mobileNumber"
                                            placeholder="Enter your mobile number"
                                            className="bg-gray-50 border text-gray-900 rounded-lg p-2.5 w-full dark:bg-gray-700 dark:text-white"
                                            value={signInData.mobileNumber}
                                            onChange={handleChange}
                                            maxLength="10"
                                            required
                                        />
                                    </div>

                                    {/* OTP */}
                                    {otpSent && (
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                OTP
                                            </label>
                                            <input
                                                type="text"
                                                name="otp"
                                                placeholder="Enter OTP"
                                                className="bg-gray-50 border text-gray-900 rounded-lg p-2.5 w-full dark:bg-gray-700 dark:text-white"
                                                value={signInData.otp}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* OTP Buttons */}
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg p-2.5"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Email */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobileNumber"
                                            placeholder="99xxxxxxx"
                                            className="bg-gray-50 border text-gray-900 rounded-lg p-2.5 w-full dark:bg-gray-700 dark:text-white"
                                            value={signInData.mobileNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border text-gray-900 rounded-lg p-2.5 w-full dark:bg-gray-700 dark:text-white"
                                            value={signInData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Sign In Button */}
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg p-2.5"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </>
                            )}

                            {/* Toggle Option */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isMobileSignIn ? 'Back to ' : 'Sign in with '}
                                <span
                                    className="text-blue-600 cursor-pointer hover:underline"
                                    onClick={handleToggle}
                                >
                                    {isMobileSignIn ? 'Email & Password' : 'Mobile OTP'}
                                </span>
                            </p>

                            {/* Signup Link */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                    Sign up here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignIn;
