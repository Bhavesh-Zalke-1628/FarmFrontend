import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, LogOut, LayoutDashboard, Settings, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { logoutAccount } from '../../Redux/Slice/authSlice';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { isLoggedIn, data } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        });

        if (result.isConfirmed) {
            const res = await dispatch(logoutAccount());
            if (res?.payload?.success) navigate('/');
        }
    };

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center text-xl font-bold text-gray-900">
                    <span className="bg-green-600 text-white p-1 rounded mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </span>
                    GreenFields
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
                    <Link to="/products" className="text-gray-700 hover:text-green-600">Products</Link>
                    <Link to="/about" className="text-gray-700 hover:text-green-600">About</Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn && (
                        <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
                            <ShoppingCart size={22} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-2 text-white text-xs bg-green-600 rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Account */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center p-2 text-gray-700 hover:text-green-600"
                        >
                            {!isLoggedIn ? (
                                <>
                                    <User size={20} className="mr-1" />
                                    <span className="hidden sm:inline">Account</span>
                                </>
                            ) : (
                                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold capitalize">
                                    {data?.fullName?.[0]}
                                </div>
                            )}
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 py-1">
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                            <LayoutDashboard size={16} className="mr-2" />
                                            Dashboard
                                        </Link>
                                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                            <Settings size={16} className="mr-2" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                                        <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-4 pb-4 bg-white border-t space-y-2">
                    <Link to="/" className="block text-gray-700 hover:text-green-600">Home</Link>
                    <Link to="/products" className="block text-gray-700 hover:text-green-600">Products</Link>
                    <Link to="/about" className="block text-gray-700 hover:text-green-600">About</Link>
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="block text-gray-700 hover:text-green-600">Login</Link>
                            <Link to="/signup" className="block text-gray-700 hover:text-green-600">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="block text-gray-700 hover:text-green-600">Dashboard</Link>
                            <Link to="/settings" className="block text-gray-700 hover:text-green-600">Settings</Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left text-red-600 hover:bg-gray-50 px-2 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
