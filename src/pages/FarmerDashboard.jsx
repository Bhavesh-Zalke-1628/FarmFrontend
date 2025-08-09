import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
    Menu,
    X,
    Home,
    Store,
    LogOut,
    Leaf,
    DollarSign,
    Package,
    User,
    Settings,
    HelpCircle,
    ShoppingCart,
    Bell,
    Search,
    Sun,
    Moon,
    ChevronDown,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductManagementPage from "./Product/ProductManagement";
import ShowStore from "../Component/Store/ShowStore";
import DashboardOverview from "./DashboardOverview";
import Profile from "./Profile";
import OrdersPage from "./OrderPage";
import { useLogout } from "../utils";
import CropManagementCom from "../Component/Crops/CropManagement";

// CropManagement subpage
const CropManagement = () => (
    <>
        <CropManagementCom />
    </>
);

// EarningsReport subpage
const EarningsReport = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign size={20} className="text-white" />
                </div>
                Earnings Report
            </h1>
            <div className="flex gap-3">
                <select
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    aria-label="Select Time Range"
                >
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
                { title: "Total Revenue", value: "$12,345", change: "+15%", color: "from-green-500 to-emerald-500" },
                { title: "Net Profit", value: "$8,230", change: "+8%", color: "from-blue-500 to-cyan-500" },
                { title: "Expenses", value: "$4,115", change: "-3%", color: "from-purple-500 to-pink-500" },
                { title: "Growth", value: "23%", change: "+12%", color: "from-yellow-500 to-orange-500" },
            ].map((stat, index) => (
                <div
                    key={index}
                    className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                    <div
                        className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    >
                        <DollarSign size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
            ))}
        </div>
    </div>
);

const ProfilePage = () => <Profile />;

const NavItem = React.memo(
    ({ icon, label, active = false, danger = false, onClick, badge }) => (
        <li>
            <button
                onClick={onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden
                    ${active
                        ? "bg-gradient-to-r from-white/20 to-white/10 text-white font-medium shadow-lg backdrop-blur-sm border border-white/20"
                        : "hover:bg-white/10 text-green-100 hover:text-white hover:shadow-md"
                    }
                    ${danger ? "text-red-300 hover:text-red-200 hover:bg-red-500/10" : ""}`}
                aria-current={active ? "page" : undefined}
            >
                <span
                    className={`${active ? "text-white" : ""
                        } ${danger ? "text-red-300" : "text-green-200 group-hover:text-white"} transition-colors duration-300`}
                    aria-hidden="true"
                >
                    {icon}
                </span>
                <span className="font-medium">{label}</span>
                {badge && (
                    <span className="ml-auto px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full font-bold">
                        {badge}
                    </span>
                )}
                {active && (
                    <div className="absolute right-3 w-2 h-2 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
        </li>
    )
);

function FarmerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(() =>
        localStorage.getItem("farmerActiveTab") || "dashboard"
    );
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === "true" || false;
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: userData } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);
    const handleLogout = useLogout();

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        localStorage.setItem("farmerActiveTab", tab);
        setSidebarOpen(false);
    }, []);

    const handleHomeNavigation = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const toggleProfileDropdown = useCallback(() => {
        setShowProfileDropdown((prev) => !prev);
        setShowNotifications(false);
    }, []);

    const toggleNotifications = useCallback(() => {
        setShowNotifications((prev) => !prev);
        setShowProfileDropdown(false);
    }, []);

    const renderContent = useMemo(() => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardOverview />;
            case "store":
                return <ShowStore />;
            case "product":
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
                            <ProductManagementPage />
                        </div>
                    </div>
                );
            case "crops":
                return <CropManagement />;
            case "earnings":
                return <EarningsReport />;
            case "order":
                return <OrdersPage />;
            case "profile":
                return <ProfilePage />;
            default:
                return <DashboardOverview />;
        }
    }, [activeTab]);

    const mainNavItems = useMemo(
        () => [
            { icon: <Home size={18} />, label: "Home", onClick: handleHomeNavigation },
            { icon: <Sparkles size={18} />, label: "Dashboard", tab: "dashboard", badge: "New" },
            { icon: <Store size={18} />, label: "My Store", tab: "store" },
            { icon: <Package size={18} />, label: "Products", tab: "product" },
            { icon: <Leaf size={18} />, label: "Crops", tab: "crops" },
            { icon: <TrendingUp size={18} />, label: "Earnings", tab: "earnings" },
            {
                icon: <ShoppingCart size={18} />,
                label: "Orders",
                tab: "order",
                badge: cartItems.length > 0 ? cartItems.length : null,
            },
        ],
        [handleHomeNavigation, cartItems.length]
    );

    const secondaryNavItems = useMemo(
        () => [
            { icon: <User size={18} />, label: "Profile", tab: "profile" },
            { icon: <LogOut size={18} />, label: "Logout", onClick: handleLogout, danger: true },
        ],
        [handleLogout]
    );

    return (
        <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
            {/* Background with animated gradients */}
            <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 animate-gradient-shift" />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-green-800 via-green-700 to-emerald-800 text-white p-6 transform transition-all duration-500 ease-out backdrop-blur-xl border-r border-white/10
                    ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:relative md:translate-x-0 z-50`}
                aria-label="Sidebar Navigation"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm" />
                <div className="relative flex flex-col h-full">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-2xl">
                                    <Leaf size={24} className="text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">AgriDash</h2>
                                <p className="text-green-200 text-sm">Farmer Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 md:hidden backdrop-blur-sm"
                            aria-label="Close Sidebar"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <section
                        className="mb-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
                        aria-label="User Profile"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                                <User size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white capitalize">
                                    {userData?.fullName || "User"}
                                </h3>
                                <p className="text-green-200 text-sm">{userData?.email}</p>
                            </div>
                            <ChevronDown size={16} className="text-green-200" />
                        </div>
                    </section>

                    <nav
                        className="flex-1 overflow-y-auto scrollbar-hide"
                        aria-label="Main Navigation"
                    >
                        <div className="mb-6">
                            <h4 className="text-green-200 text-sm font-medium mb-3 uppercase tracking-wider">
                                Main Menu
                            </h4>
                            <ul className="space-y-2">
                                {mainNavItems.map((item, index) => (
                                    <NavItem
                                        key={index}
                                        icon={item.icon}
                                        label={item.label}
                                        active={activeTab === item.tab}
                                        onClick={item.onClick || (() => handleTabChange(item.tab))}
                                        danger={item.danger}
                                        badge={item.badge}
                                    />
                                ))}
                            </ul>
                        </div>
                    </nav>

                    <nav
                        className="pt-6 border-t border-white/20"
                        aria-label="Account Navigation"
                    >
                        <h4 className="text-green-200 text-sm font-medium mb-3 uppercase tracking-wider">
                            Account
                        </h4>
                        <ul className="space-y-2">
                            {secondaryNavItems.map((item, index) => (
                                <NavItem
                                    key={index}
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeTab === item.tab}
                                    onClick={item.onClick || (() => handleTabChange(item.tab))}
                                    danger={item.danger}
                                />
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative" tabIndex={-1}>
                <header className="relative p-4 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 md:hidden"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Open Sidebar"
                            >
                                <Menu size={20} />
                            </button>

                            <div className="relative hidden md:block">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    aria-hidden="true"
                                />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 w-64"
                                    aria-label="Search"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-300 rounded-xl hover:bg-white/60"
                                aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={toggleNotifications}
                                    className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-300 relative rounded-xl hover:bg-white/60"
                                    aria-haspopup="true"
                                    aria-expanded={showNotifications}
                                    aria-controls="notifications-dropdown"
                                >
                                    <Bell size={20} />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        3
                                    </span>
                                </button>

                                {showNotifications && (
                                    <div
                                        id="notifications-dropdown"
                                        className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-white/20 animate-slideDown"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        </div>
                                        {[1, 2, 3].map((notif) => (
                                            <div
                                                key={notif}
                                                className="px-4 py-3 hover:bg-white/60 transition-colors duration-200"
                                            >
                                                <p className="text-sm text-gray-800 font-medium">
                                                    New order received
                                                </p>
                                                <p className="text-xs text-gray-500">2 minutes ago</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => navigate("/cart")}
                                    className="p-2 text-gray-600 hover:text-green-600 transition-all duration-300 relative rounded-xl hover:bg-white/60 transform hover:scale-110"
                                    aria-label={`View Cart with ${cartItems.length} items`}
                                >
                                    <ShoppingCart size={20} />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-bounce">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center gap-3 p-2 text-gray-700 hover:text-green-600 transition-all duration-300 rounded-xl hover:bg-white/60"
                                    aria-haspopup="true"
                                    aria-expanded={showProfileDropdown}
                                    aria-controls="profile-dropdown"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <User size={18} />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <span className="block font-semibold capitalize text-sm">
                                            {userData?.fullName || "User"}
                                        </span>
                                        <span className="block text-xs text-gray-500">
                                            {userData?.role || "Farmer"}
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>

                                {showProfileDropdown && (
                                    <div
                                        id="profile-dropdown"
                                        className="absolute right-0 mt-2 w-56 bg-white/90 rounded-2xl shadow-2xl py-2 z-[9999] border border-white/20 animate-slideDown"
                                    >
                                        {/* <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-gray-800 capitalize">
                                                {userData?.fullName || "User"}
                                            </p>
                                            <p className="text-sm text-gray-500">{userData?.email}</p>
                                        </div> */}
                                        <button
                                            onClick={() => {
                                                handleTabChange("profile");
                                                setShowProfileDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/60 transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <User size={16} />
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/settings");
                                                setShowProfileDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/60 transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <Settings size={16} />
                                            Settings
                                        </button>
                                        <hr className="my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <section
                    className="flex-1 overflow-y-auto p-6 relative"
                    tabIndex={-1}
                    aria-live="polite"
                >
                    <div className="max-w-7xl mx-auto">{renderContent}</div>
                </section>
            </main>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes gradient-shift {
                    0%,
                    100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 8s ease infinite;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

export default React.memo(FarmerDashboard);
