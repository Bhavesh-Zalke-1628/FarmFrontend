import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Settings, Home, ShoppingBag, Info, BellIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { logoutAccount } from '../../Redux/Slice/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { isLoggedIn, data } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Smooth scroll to top when navigating
    const handleNavigation = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsDropdownOpen(false);
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            background: '#ffffff',
        });

        if (result.isConfirmed) {
            const res = await dispatch(logoutAccount());
            if (res?.payload) {
                navigate('/');
            }
        }
    };

    return (
        <>
            {/* Desktop Header (hidden on mobile) */}
            <nav className="hidden md:block bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center"
                    >
                        <Link
                            to="/"
                            className="flex items-center text-xl font-bold text-gray-900"
                        >
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg mr-2 shadow-md">
                                <LeafIcon />
                            </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700">
                                GreenFields
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="flex space-x-6">
                        <NavLink
                            to="/"
                            icon={<Home size={18} className="mr-2" />}
                            text="Home"
                        />
                        <NavLink
                            to="/products"
                            icon={<ShoppingBag size={18} className="mr-2" />}
                            text="Products"
                        />
                        <NavLink
                            to="/about"
                            icon={<Info size={18} className="mr-2" />}
                            text="About"
                        />
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Cart with badge animation */}
                        {isLoggedIn && (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative"
                            >
                                <Link
                                    to="/cart"
                                    className="text-gray-700 hover:text-green-600 transition-colors"
                                    aria-label="Shopping Cart"
                                >
                                    <ShoppingCart size={22} />
                                    {cartItems.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 text-white text-xs bg-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                                        >
                                            {cartItems.length}
                                        </motion.span>
                                    )}
                                </Link>
                            </motion.div>
                        )}

                        {/* Account Dropdown */}
                        <div ref={dropdownRef} className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center p-2 text-gray-700 hover:text-green-600 transition-colors"
                                aria-expanded={isDropdownOpen}
                                aria-label="User menu"
                            >
                                {!isLoggedIn ? (
                                    <>
                                        <User size={20} className="mr-1" />
                                        <span className="hidden sm:inline">Account</span>
                                    </>
                                ) : (
                                    <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-medium capitalize shadow-md">
                                        {data?.fullName?.charAt(0) || <User size={16} />}
                                    </div>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                                    >
                                        {isLoggedIn ? (
                                            <>
                                                <DropdownItem
                                                    to="/profile"
                                                    icon={<LayoutDashboard size={16} />}
                                                    text="Dashboard"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                />
                                                <DropdownItem
                                                    to="/settings"
                                                    icon={<Settings size={16} />}
                                                    text="Settings"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                />
                                                <div className="border-t border-gray-100"></div>
                                                <DropdownButton
                                                    onClick={handleLogout}
                                                    icon={<LogOut size={16} />}
                                                    text="Logout"
                                                    isDanger
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <DropdownItem
                                                    to="/login"
                                                    text="Login"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                />
                                                <DropdownItem
                                                    to="/signup"
                                                    text="Register"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                />
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Top Bar (just logo) */}
            <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <div>
                    <Link
                        to="/"
                        className="flex items-center text-xl font-bold text-gray-900 hover:opacity-90 transition-opacity"
                    >
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg mr-2 shadow-md hover:shadow-lg transition-shadow">
                            <LeafIcon className="w-5 h-5" />
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                            GreenFields
                        </span>
                    </Link>

                </div>

                <div className="flex items-center space-x-3">

                    <button className="p-1 text-gray-600 hover:text-green-600 transition-colors">
                        <BellIcon className="w-5 h-5" />
                    </button>
                    {isLoggedIn ? (
                        <>

                            <div className="flex items-center">
                                <span className="text-sm font-semibold text-gray-800 capitalize mr-2">
                                    {data?.fullName || 'User'}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 flex items-center justify-center text-green-700 font-medium text-xs">
                                    {data?.fullName?.charAt(0) || 'U'}
                                </div>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white shadow hover:shadow-md transition-all"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
                {/* Home */}
                <NavButton
                    onClick={() => handleNavigation('/')}
                    icon={<Home size={20} />}
                    label="Home"
                />

                {/* Products */}
                <NavButton
                    onClick={() => handleNavigation('/products')}
                    icon={<ShoppingBag size={20} />}
                    label="Products"
                />

                {/* About */}
                <NavButton
                    onClick={() => handleNavigation('/about')}
                    icon={<Info size={20} />}
                    label="About"
                />

                {/* Conditional items */}
                {isLoggedIn ? (
                    <>
                        {/* Cart */}
                        <NavButton
                            onClick={() => handleNavigation('/cart')}
                            icon={<ShoppingCart size={20} />}
                            label="Cart"
                            badge={cartItems.length}
                        />

                        {/* Profile Dropdown */}
                        <div ref={dropdownRef} className="relative">
                            <NavButton
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                icon={<User size={20} />}
                                label="Profile"
                            />

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                                    >
                                        <DropdownItem
                                            to="/profile"
                                            icon={<LayoutDashboard size={16} />}
                                            text="Dashboard"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <DropdownItem
                                            to="/settings"
                                            icon={<Settings size={16} />}
                                            text="Settings"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div className="border-t border-gray-100"></div>
                                        <DropdownButton
                                            onClick={handleLogout}
                                            icon={<LogOut size={16} />}
                                            text="Logout"
                                            isDanger
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <div ref={dropdownRef} className="relative">
                        <NavButton
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            icon={<User size={20} />}
                            label="Account"
                        />

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                                >
                                    <DropdownItem
                                        to="/login"
                                        text="Login"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <DropdownItem
                                        to="/signup"
                                        text="Register"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </>
    );
}

// Reusable Components
const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
);

const NavLink = ({ to, icon, text }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
            to={to}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors rounded-lg"
        >
            {icon}
            {text}
        </Link>
    </motion.div>
);

const NavButton = ({ onClick, icon, label, badge = 0 }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex flex-col items-center text-gray-700 hover:text-green-600 p-2 relative"
        aria-label={label}
    >
        {icon}
        {badge > 0 && (
            <span className="absolute -top-1 -right-1 text-white text-xs bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                {badge}
            </span>
        )}
        <span className="text-xs mt-1">{label}</span>
    </motion.button>
);

const DropdownItem = ({ to, icon, text, onClick }) => (
    <Link
        to={to}
        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={onClick}
    >
        {icon && <span className="mr-3 text-gray-500">{icon}</span>}
        {text}
    </Link>
);

const DropdownButton = ({ onClick, icon, text, isDanger = false }) => (
    <button
        onClick={onClick}
        className={`w-full text-left flex items-center px-4 py-3 text-sm ${isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
    >
        {icon && <span className={`mr-3 ${isDanger ? 'text-red-500' : 'text-gray-500'}`}>{icon}</span>}
        {text}
    </button>
);