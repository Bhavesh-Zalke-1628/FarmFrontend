import React, { useState } from "react";
import {
    Menu, X, Home, Store, LogOut, Leaf, DollarSign, Package,
    User, Settings, HelpCircle, BarChart2, ShoppingBag,
    PlusCircle, ShoppingCart
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount } from "../Redux/Slice/authSlice";
import ProductManagementPage from "./Product/ProductManagement";
import Swal from "sweetalert2";
import ShowStore from '../Component/Store/ShowStore'
import DashboardOverview from "./DashboardOverview";
import Profile from "./Profile";
import OrdersPage from "./OrderPage";

function FarmerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("farmerActiveTab") || "dashboard";
    });
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: userData } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);

    const handleTabChange = (tab) => {
        console.log(tab)
        setActiveTab(tab);
        localStorage.setItem("farmerActiveTab", tab);
        setSidebarOpen(false);
    };

    const handleHomeNavigation = () => {
        navigate("/");
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    async function handleLogout() {
        const result = await Swal.fire({
            title: 'Logout Confirmation',
            text: "Are you sure you want to logout?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        });

        if (result.isConfirmed) {
            localStorage.removeItem("farmerActiveTab");
            const res = await dispatch(logoutAccount());
            if (res?.payload?.success) {
                navigate("/");
            }
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardOverview />;
            case "store":
                return <ShowStore />;
            case "product":
                return <ProductManagement />;
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
    };

    const ProductManagement = () => (
        <div className="space-y-6">

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <ProductManagementPage />
            </div>
        </div>
    );

    const CropManagement = () => (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Leaf size={24} /> Crop Management
            </h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600">Crop management content goes here</p>
            </div>
        </div>
    );

    const EarningsReport = () => (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <DollarSign size={24} /> Earnings Report
            </h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600">Earnings report content goes here</p>
            </div>
        </div>
    );




    const ProfilePage = () => (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} /> My Profile
            </h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Profile />
            </div>
        </div>
    );

    const StatCard = ({ icon, title, value, change, color }) => {
        const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600',
        };

        return (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                    <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                        {icon}
                    </div>
                </div>
                <h3 className="text-gray-500 mt-3">{title}</h3>
                <p className="text-2xl font-bold mt-1">{value}</p>
                <p className="text-sm text-gray-500 mt-2">{change}</p>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-green-700 text-white p-5 transform transition-all duration-300 ease-in-out 
                    ${sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"} md:relative md:translate-x-0 z-50`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-white text-green-700 p-1 rounded-full">
                                <Leaf size={20} />
                            </span>
                            Farmer Panel
                        </h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 hover:bg-green-600 rounded-md md:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                            <NavItem
                                icon={<Home size={18} />}
                                label="Home"
                                onClick={handleHomeNavigation}
                            />
                            <NavItem
                                icon={<Home size={18} />}
                                label="Dashboard"
                                active={activeTab === "dashboard"}
                                onClick={() => handleTabChange("dashboard")}
                            />
                            <NavItem
                                icon={<Store size={18} />}
                                label="My Store"
                                active={activeTab === "store"}
                                onClick={() => handleTabChange("store")}
                            />
                            <NavItem
                                icon={<Package size={18} />}
                                label="Products"
                                active={activeTab === "product"}
                                onClick={() => handleTabChange("product")}
                            />
                            <NavItem
                                icon={<Leaf size={18} />}
                                label="Crops"
                                active={activeTab === "crops"}
                                onClick={() => handleTabChange("crops")}
                            />
                            <NavItem
                                icon={<DollarSign size={18} />}
                                label="Earnings"
                                active={activeTab === "earnings"}
                                onClick={() => handleTabChange("earnings")}
                            />
                            <NavItem
                                icon={<DollarSign size={18} />}
                                label="Orders"
                                active={activeTab === "order"}
                                onClick={() => handleTabChange("order")}
                            />
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-green-600">
                        <ul className="space-y-2">
                            <NavItem
                                icon={<User size={18} />}
                                label="Profile"
                                active={activeTab === "profile"}
                                onClick={() => handleTabChange("profile")}
                            />
                            <NavItem
                                icon={<Settings size={18} />}
                                label="Settings"
                                onClick={() => { }}
                            />
                            <NavItem
                                icon={<HelpCircle size={18} />}
                                label="Help"
                                onClick={() => { }}
                            />
                            <NavItem
                                icon={<LogOut size={18} />}
                                label="Logout"
                                onClick={handleLogout}
                                danger
                            />
                        </ul>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <div className="p-4 bg-white border-b flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        className="p-2 bg-green-700 text-white rounded-md md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Home Button */}
                    <button
                        onClick={handleHomeNavigation}
                        className="hidden md:flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </button>

                    {/* User Profile and Cart */}
                    <div className="flex items-center gap-4">
                        {/* Cart with Badge */}
                        <div className="relative">
                            <button
                                onClick={() => navigate("/cart")}
                                className="p-2 text-gray-700 hover:text-green-600 transition-colors relative"
                            >
                                <ShoppingCart size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={toggleProfileDropdown}
                                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                            >
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                                    <User size={16} />
                                </div>
                                <span className="hidden md:inline">{userData?.fullName || "User"}</span>
                            </button>

                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                    <button
                                        onClick={() => {
                                            handleTabChange("profile");
                                            setShowProfileDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/settings");
                                            setShowProfileDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

const NavItem = ({ icon, label, active = false, danger = false, onClick }) => {
    return (
        <li>
            <button
                onClick={onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${active ? 'bg-green-600 text-white font-medium' : 'hover:bg-green-600/20'}
                    ${danger ? 'text-red-300 hover:text-red-200' : ''}`}
            >
                <span className={`${active ? 'text-white' : ''} ${danger ? 'text-red-300' : 'text-green-200'}`}>
                    {icon}
                </span>
                <span>{label}</span>
                {active && (
                    <span className="ml-auto w-2 h-2 bg-yellow-400 rounded-full"></span>
                )}
            </button>
        </li>
    );
};

export default FarmerDashboard;