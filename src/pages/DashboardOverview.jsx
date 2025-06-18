import React from 'react';
import {
    Package, Leaf, DollarSign, ShoppingBag,
    BarChart2, PlusCircle, Clock, CheckCircle,
    AlertCircle, ArrowUp, ArrowDown
} from 'lucide-react';

const DashboardOverview = ({ userData }) => {
    // Sample data - replace with actual data from your API
    const stats = [
        { icon: <Package size={24} />, title: "Total Products", value: "24", change: "+3 this week", trend: "up", color: "blue" },
        { icon: <Leaf size={24} />, title: "Active Crops", value: "5", change: "2 ready for harvest", trend: "neutral", color: "green" },
        { icon: <DollarSign size={24} />, title: "This Month Earnings", value: "₹12,450", change: "+15% from last month", trend: "up", color: "purple" },
        { icon: <ShoppingBag size={24} />, title: "Pending Orders", value: "7", change: "3 new today", trend: "down", color: "orange" }
    ];

    const recentActivities = [
        { id: 1, icon: <CheckCircle size={16} className="text-green-500" />, title: "Order Completed", description: "Order #1234 for 5kg Tomatoes", time: "2 hours ago" },
        { id: 2, icon: <AlertCircle size={16} className="text-yellow-500" />, title: "Crop Alert", description: "Wheat needs watering", time: "5 hours ago" },
        { id: 3, icon: <Package size={16} className="text-blue-500" />, title: "New Product Added", description: "Organic Potatoes", time: "Yesterday" }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">🌾 Welcome back, {userData?.fullName || "Farmer"}!</h1>
                    <p className="text-gray-600">Here's what's happening with your farm today</p>
                </div>
                <div className="text-sm bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                    Last login: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between">
                            <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                                {stat.icon}
                            </div>
                            {stat.trend === "up" && (
                                <span className="text-green-500 flex items-center">
                                    <ArrowUp size={16} className="mr-1" />
                                    {stat.change}
                                </span>
                            )}
                            {stat.trend === "down" && (
                                <span className="text-red-500 flex items-center">
                                    <ArrowDown size={16} className="mr-1" />
                                    {stat.change}
                                </span>
                            )}
                            {stat.trend === "neutral" && (
                                <span className="text-gray-500 text-sm">{stat.change}</span>
                            )}
                        </div>
                        <h3 className="text-gray-500 mt-3">{stat.title}</h3>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <BarChart2 size={20} /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                                <div className="p-2 bg-gray-50 rounded-full">
                                    {activity.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-medium">{activity.title}</p>
                                        <span className="text-xs text-gray-500 flex items-center">
                                            <Clock size={12} className="mr-1" />
                                            {activity.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <BarChart2 size={20} /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex flex-col items-center justify-center transition-colors">
                            <PlusCircle size={24} className="text-green-600 mb-2" />
                            <span>Add Product</span>
                        </button>
                        <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center justify-center transition-colors">
                            <Leaf size={24} className="text-blue-600 mb-2" />
                            <span>Add Crop</span>
                        </button>
                        <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center justify-center transition-colors">
                            <Package size={24} className="text-purple-600 mb-2" />
                            <span>Inventory</span>
                        </button>
                        <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg flex flex-col items-center justify-center transition-colors">
                            <DollarSign size={24} className="text-yellow-600 mb-2" />
                            <span>Add Sale</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4">Upcoming Tasks</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" />
                                <span>Water the wheat field</span>
                            </div>
                            <span className="text-sm text-gray-500">Tomorrow AM</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" />
                                <span>Harvest tomatoes</span>
                            </div>
                            <span className="text-sm text-gray-500">In 2 days</span>
                        </div>
                    </div>
                </div>

                {/* Weather Widget */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4">Weather Forecast</h3>
                    <div className="flex items-center justify-between">
                        <div className="text-4xl">☀️</div>
                        <div>
                            <p className="text-2xl font-bold">28°C</p>
                            <p className="text-gray-500">Sunny</p>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Humidity: 45%</p>
                            <p>Wind: 10 km/h</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function for color classes
const getColorClasses = (color) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };
    return colors[color] || 'bg-gray-50 text-gray-600';
};

export default DashboardOverview;