import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createAccount } from '../Redux/Slice/authSlice';

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [signUpData, setSignUpData] = useState({
        fullName: '',
        mobileNumber: '',
        password: '',
    });

    console.log(signUpData)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUpData({ ...signUpData, [name]: value });
    };

    async function createNewAccount(event) {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await dispatch(createAccount(signUpData)).unwrap(); // Ensures proper error handling
            console.log(res)


            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <form className="space-y-4 md:space-y-6" onSubmit={createNewAccount}>
                            {/* Full Name */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    id="fullName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="John Doe"
                                    value={signUpData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>



                            {/* Mobile Number */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    id="mobileNumber"
                                    placeholder="Enter your mobile number"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={signUpData.mobileNumber}
                                    onChange={handleChange}
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    required
                                />
                            </div>


                            {/* Password */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={signUpData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create an Account'}
                            </button>

                            {/* Already have an account */}
                            <p className="text-sm font-light mt-2 text-gray-500 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link to="/signin" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                    Login here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;