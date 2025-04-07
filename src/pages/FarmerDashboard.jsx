import React, { useState } from "react";
import {
    Menu, X, Home, Store, LogOut, Leaf, DollarSign
} from "lucide-react";
import Layout from '../Layout/Layout';
import ShowStore from "../Component/Store/ShowStore";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount } from "../Redux/Slice/authSlice";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");

    const navigate = useNavigate()
    const dispatch = useDispatch()
    async function handleLogout() {
        const res = await dispatch(logoutAccount())
        console.log(res)
        if (res?.payload?.success) {
            navigate("/")
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <h1 className="text-2xl font-bold">🌾 Welcome to Farmer Dashboard</h1>;
            case "store":
                return <ShowStore />;
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
                    <ul className="space-y-4">
                        <li onClick={() => setActiveTab("dashboard")} className="flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                            <Home size={20} /> Dashboard
                        </li>
                        <li onClick={() => setActiveTab("store")} className="flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                            <Store size={20} /> My Store
                        </li>
                        <li onClick={() => setActiveTab("crops")} className="flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                            <Leaf size={20} /> Crops
                        </li>
                        <li onClick={() => setActiveTab("earnings")} className="flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                            <DollarSign size={20} /> Earnings
                        </li>
                        <li onClick={handleLogout} className="flex items-center gap-2 cursor-pointer hover:text-red-300">
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
