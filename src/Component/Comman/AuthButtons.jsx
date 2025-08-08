import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Sparkles, Shield, ChevronDown } from 'lucide-react';
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
        <div className="flex items-center justify-end gap-2 lg:gap-3 w-full max-w-full">
            {!isLoggedIn ? (
                // Login/Signup buttons for non-authenticated users
                <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50">
                    <Link to="/login">
                        <button
                            type="button"
                            className="group relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-400/50 transition-all duration-300 hover:scale-105 font-medium overflow-hidden min-w-[80px] sm:min-w-[100px] lg:min-w-[120px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                            <User size={14} className="relative z-10 group-hover:rotate-12 transition-transform duration-300 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                            <span className="relative z-10 text-xs sm:text-sm lg:text-base whitespace-nowrap">Sign In</span>
                        </button>
                    </Link>

                    <Link to="/signup">
                        <button
                            type="button"
                            className="group relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 hover:scale-105 font-medium overflow-hidden min-w-[90px] sm:min-w-[120px] lg:min-w-[140px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                            <Sparkles size={14} className="relative z-10 group-hover:rotate-180 transition-transform duration-500 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                            <span className="relative z-10 text-xs sm:text-sm lg:text-base whitespace-nowrap">Get Started</span>
                        </button>
                    </Link>
                </div>
            ) : (
                // Authenticated user interface
                <div className="flex items-center gap-2 lg:gap-3 w-full max-w-full justify-end">
                    {/* Welcome message - shown on lg+ screens */}
                    <div className="hidden lg:flex items-center gap-2 px-3 xl:px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200/50 flex-shrink-0">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-emerald-700 font-medium text-sm capitalize truncate max-w-[120px] xl:max-w-[160px]">
                            Welcome, {fullName}
                        </span>
                    </div>

                    {/* User info section - responsive layout */}
                    <div className="flex items-center gap-2 flex-1 sm:flex-none min-w-0">
                        {/* Mobile & Tablet User Dropdown (xs to lg) */}
                        <div className="lg:hidden relative flex-1 sm:flex-none min-w-0" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((open) => !open)}
                                type="button"
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200/50 w-full sm:min-w-[140px] md:min-w-[160px] font-medium select-none focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 hover:from-emerald-100 hover:to-teal-100"
                                title={`Welcome, ${fullName}`}
                            >
                                <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-emerald-500 text-white font-semibold rounded-full text-xs sm:text-sm flex-shrink-0">
                                    {userInitial}
                                </div>
                                <span className="text-emerald-700 capitalize truncate flex-1 text-left text-sm sm:text-base min-w-0">
                                    {fullName}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 text-emerald-600 flex-shrink-0 sm:w-5 sm:h-5 ${dropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 sm:left-0 top-full mt-2 w-48 sm:w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white font-semibold rounded-full text-sm">
                                                {userInitial}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
                                                <p className="text-xs text-gray-500">Account Settings</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <Shield size={16} />
                                        <span className="font-medium text-sm">View Profile</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
                                    >
                                        <LogOut size={16} />
                                        <span className="font-medium text-sm">Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action buttons container */}
                        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 flex-shrink-0">
                            {/* Profile button - hidden on mobile, icon on tablet, full on desktop */}
                            <Link to="/profile" className="hidden sm:block">
                                <button
                                    type="button"
                                    className="group flex items-center gap-1.5 lg:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-200 hover:scale-105 font-medium relative overflow-hidden"
                                    title="View Profile"
                                >
                                    <div className="absolute inset-0 bg-emerald-100 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
                                    <Shield size={14} className="relative z-10 group-hover:rotate-12 transition-transform duration-300 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                                    <span className="relative z-10 hidden lg:inline text-sm font-medium whitespace-nowrap">Profile</span>
                                </button>
                            </Link>

                            {/* Logout button - always visible with responsive sizing */}
                            <button
                                onClick={handleLogout}
                                type="button"
                                className="group flex items-center gap-1.5 lg:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-105 font-medium relative overflow-hidden"
                                title="Sign out"
                            >
                                <div className="absolute inset-0 bg-red-100 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
                                <LogOut size={14} className="relative z-10 group-hover:-rotate-12 transition-transform duration-300 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                                <span className="relative z-10 hidden lg:inline text-sm font-medium whitespace-nowrap">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuthButtons;