import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Sparkles, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogout } from '../../utils';

function AuthButtons({ isLoggedIn }) {
    const { data } = useSelector(state => state?.auth);
    const handleLogout = useLogout();

    // Dropdown state for mobile username
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    // Username or initial to display
    const fullName = data?.fullName || "User";
    const userInitial = (fullName[0] || "U").toUpperCase();

    return (
        <div className="flex flex-wrap items-center gap-3 relative">
            {!isLoggedIn ? (
                <div className="flex flex-wrap items-center gap-3 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50">
                    <Link to="/login" className="w-full sm:w-auto">
                        <button
                            type="button"
                            className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-400/50 transition-all duration-300 hover:scale-105 font-medium overflow-hidden w-full sm:w-auto justify-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                            <User size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="relative z-10 whitespace-nowrap">Sign In</span>
                        </button>
                    </Link>

                    <Link to="/signup" className="w-full sm:w-auto">
                        <button
                            type="button"
                            className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 hover:scale-105 font-medium overflow-hidden w-full sm:w-auto justify-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                            <Sparkles size={18} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                            <span className="relative z-10 whitespace-nowrap">Get Started</span>
                        </button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Welcome message on md+ */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200/50 whitespace-nowrap">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-emerald-700 font-medium text-sm capitalize truncate">
                            Welcome, {fullName}
                        </span>
                    </div>

                    {/* Mobile username button that toggles dropdown */}
                    <div className="md:hidden relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen((open) => !open)}
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                            // Styling similar to welcome message but clickable
                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200/50 whitespace-nowrap font-medium select-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            title={`Welcome, ${fullName}`}
                        >
                            <div className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white font-semibold rounded-full text-sm">
                                {userInitial}
                            </div>
                            <svg
                                className={`w-4 h-4 ml-1 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action buttons visible on all screen sizes */}
                    <div className="flex items-center gap-2 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50">
                        <Link to="/profile" className="hidden md:flex">
                            <button
                                type="button"
                                className="group flex items-center gap-2 px-4 py-2.5 text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-200 hover:scale-105 font-medium relative overflow-hidden whitespace-nowrap"
                                title="View Profile"
                            >
                                <div className="absolute inset-0 bg-emerald-100 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
                                <Shield size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10">Profile</span>
                            </button>
                        </Link>

                        <button
                            onClick={handleLogout}
                            type="button"
                            className="group flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-105 font-medium relative overflow-hidden whitespace-nowrap"
                            title="Sign out"
                        >
                            <div className="absolute inset-0 bg-red-100 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
                            <LogOut size={18} className="relative z-10 group-hover:-rotate-12 transition-transform duration-300" />
                            <span className="relative z-10">Sign Out</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AuthButtons;
