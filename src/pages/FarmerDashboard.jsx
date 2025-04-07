import React, { useState } from "react";
import Swal from "sweetalert2";
import { Menu, X, Home, Store, LogOut, Leaf, DollarSign } from "lucide-react";
import { Button } from "@mui/material";
import Layout from '../Layout/Layout';
import CreateStoreModal from "../Component/Modal/CreateStoreModel";

function FarmerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateStore = () => {
        Swal.fire({
            title: "Pay ₹1000 to Create Store",
            text: "To create your store, a payment of ₹1000 is required. Proceed with the payment to complete the setup.",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Proceed to Payment",
        }).then((result) => {
            if (result.isConfirmed) {
                setShowCreateForm(true);
            }
        });
    };

    return (
        <Layout>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 w-64 bg-green-800 text-white p-5 transform transition-transform duration-300 ease-in-out 
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 z-50`}
                >
                    {/* Close button for mobile */}
                    <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 md:hidden">
                        <X size={24} />
                    </button>

                    <h2 className="text-xl font-bold">🌾 Farmer Panel</h2>
                    <ul className="mt-6 space-y-4">
                        <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                            <Home size={20} /> Dashboard
                        </li>
                        <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                            <Store size={20} /> My Store
                        </li>
                        <li className="flex items-center gap-2 cursor-pointer hover:text-red-400">
                            <Leaf size={20} /> Crops
                        </li>
                        <li className="flex items-center gap-2 cursor-pointer hover:text-red-400">
                            <DollarSign size={20} /> Earnings
                        </li>
                        <li className="flex items-center gap-2 cursor-pointer hover:text-red-400">
                            <LogOut size={20} /> Logout
                        </li>
                    </ul>
                </div>

                {/* Overlay for sidebar in mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Navbar for mobile */}
                    <div className="p-4 bg-green-100 shadow md:hidden">
                        <button className="p-2 bg-green-700 text-white rounded-md" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Main dashboard content */}
                    <div className="p-6 flex flex-col items-center">
                        <h1 className="text-2xl font-bold">Welcome to Farmer Dashboard</h1>
                        <Button
                            className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-lg"
                            onClick={handleCreateStore}
                            variant="contained"
                        >
                            Create Store
                        </Button>
                    </div>

                    {/* Modal for Store Creation */}
                    <CreateStoreModal open={showCreateForm} handleClose={() => setShowCreateForm(false)} />
                </div>
            </div>
        </Layout>
    );
}

export default FarmerDashboard;
