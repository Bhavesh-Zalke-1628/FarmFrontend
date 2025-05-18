import React, { useState } from "react";
import {
    Menu, X, Home, Store, LogOut, Leaf, DollarSign, Package,
} from "lucide-react";
import Layout from '../Layout/Layout';
import ShowStore from "../Component/Store/ShowStore";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount } from "../Redux/Slice/authSlice";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("farmerActiveTab") || "dashboard";
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("farmerActiveTab", tab);
        setSidebarOpen(false);
    };

    async function handleLogout() {
        localStorage.removeItem("farmerActiveTab");
        const res = await dispatch(logoutAccount());
        if (res?.payload?.success) {
            navigate("/");
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <h1 className="text-2xl font-bold">🌾 Welcome to Farmer Dashboard</h1>;
            case "store":
                return <ShowStore />;
            case "product":
                return <h1 className="text-2xl font-bold">📦 My Products</h1>;
            case "crops":
                return <h1 className="text-2xl font-bold">🌱 Manage Crops</h1>;
            case "earnings":
                return <h1 className="text-2xl font-bold">💰 Earnings Report</h1>;
            default:
                return <h1 className="text-2xl font-bold">Unknown Section</h1>;
        }
    };

    return (
        <Layout>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 w-64 bg-green-800 text-white p-5 transform transition-transform duration-300 ease-in-out 
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 z-50`}>
                    <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 md:hidden">
                        <X size={24} />
                    </button>

                    <h2 className="text-xl font-bold mb-6">🌾 Farmer Panel</h2>

                    <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                        <li
                            onClick={() => handleTabChange("dashboard")}
                            className={`flex items-center gap-2 cursor-pointer hover:text-yellow-300 ${activeTab === "dashboard" ? "text-yellow-300 font-semibold" : ""}`}
                        >
                            <Home size={20} /> Dashboard
                        </li>
                        <li
                            onClick={() => handleTabChange("store")}
                            className={`flex items-center gap-2 cursor-pointer hover:text-yellow-300 ${activeTab === "store" ? "text-yellow-300 font-semibold" : ""}`}
                        >
                            <Store size={20} /> My Store
                        </li>
                        <li
                            onClick={() => handleTabChange("product")}
                            className={`flex items-center gap-2 cursor-pointer hover:text-yellow-300 ${activeTab === "product" ? "text-yellow-300 font-semibold" : ""}`}
                        >
                            <Package size={20} /> Product
                        </li>
                        <li
                            onClick={() => handleTabChange("crops")}
                            className={`flex items-center gap-2 cursor-pointer hover:text-yellow-300 ${activeTab === "crops" ? "text-yellow-300 font-semibold" : ""}`}
                        >
                            <Leaf size={20} /> Crops
                        </li>
                        <li
                            onClick={() => handleTabChange("earnings")}
                            className={`flex items-center gap-2 cursor-pointer hover:text-yellow-300 ${activeTab === "earnings" ? "text-yellow-300 font-semibold" : ""}`}
                        >
                            <DollarSign size={20} /> Earnings
                        </li>
                        <li
                            onClick={() => {
                                handleLogout();
                                setSidebarOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer hover:text-red-300"
                        >
                            <LogOut size={20} /> Logout
                        </li>
                    </ul>
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Mobile Nav */}
                    <div className="p-4 bg-green-100 shadow md:hidden">
                        <button className="p-2 bg-green-700 text-white rounded-md" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">{renderContent()}</div>
                </div>
            </div>
        </Layout>
    );
}

export default FarmerDashboard;
