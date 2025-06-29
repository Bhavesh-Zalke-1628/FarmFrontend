import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, LogOut, LayoutDashboard, Settings, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAccount } from '../../Redux/Slice/authSlice';
import Swal from 'sweetalert2';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);
    const dropdownRef = useRef(null);

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
        });

        if (result.isConfirmed) {
            const res = await dispatch(logoutAccount());
            console.log(res)
            if (res?.payload?.success) navigate('/');
        }
    };

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="bg-green-600 text-white p-1 rounded mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </span>
                        GreenFields
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
                        <Link to="/products" className="text-gray-700 hover:text-green-600">Products</Link>
                        <Link to="/about" className="text-gray-700 hover:text-green-600">About</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn && (
                            <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
                                <ShoppingCart size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Account Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 text-gray-700 hover:text-green-600 flex items-center"
                            >
                                <User size={20} />
                                <span className="ml-1 hidden sm:inline">Account</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                                    {isLoggedIn ? (
                                        <>
                                            <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                                <LayoutDashboard size={16} className="mr-2" />
                                                Dashboard
                                            </Link>
                                            <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                                <Settings size={16} className="mr-2" />
                                                Settings
                                            </Link>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                                                <LogOut size={16} className="mr-2" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Login
                                            </Link>
                                            <Link to="/signup" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-700 hover:text-green-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMobileMenuOpen && (
                    <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow border-t">
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
                                <button onClick={handleLogout} className="block w-full text-left text-red-600 hover:bg-gray-50 px-2 py-1 rounded">Logout</button>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}
