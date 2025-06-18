import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutAccount } from '../../Redux/Slice/authSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        });

        if (result.isConfirmed) {
            const res = await dispatch(logoutAccount());
            if (res?.payload?.success) {
                navigate('/login');
            }
        }
    };

    return (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
            <Link to="/" className="text-xl font-bold text-gray-900 flex items-center">
                <span className="bg-green-600 text-white p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </span>
                YourBrand
            </Link>

            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>
                <Link to="/products" className="text-gray-700 hover:text-green-600 transition-colors">Products</Link>
                <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">About</Link>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-700 hover:text-green-600 transition-colors relative">
                    <ShoppingCart size={20} />
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                    </span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="p-2 text-gray-700 hover:text-green-600 transition-colors flex items-center"
                    >
                        <User size={20} />
                        <span className="ml-1 hidden sm:inline">Account</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <LayoutDashboard size={16} className="mr-2" />
                                Dashboard
                            </Link>
                            <Link
                                to="/settings"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                onClick={() => setIsDropdownOpen(false)}
                            >
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
                        </div>
                    )}
                </div>

                <button className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors">
                    <Menu size={20} />
                </button>
            </div>
        </nav>
    );
}