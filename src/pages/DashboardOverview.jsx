
import React, { useEffect } from 'react';
import {
    Package, Leaf, DollarSign, ShoppingBag,
    BarChart2, PlusCircle, Clock, CheckCircle,
    AlertCircle, ArrowUp, ArrowDown, User, Users
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../Redux/Slice/authSlice';

const DashboardOverview = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { role, data: userData, users } = useSelector(state => state?.auth)
    const { orders } = useSelector(state => state.orderDetails)
    const isAdmin = role === "admin";
    const isFarmer = role === "farmer";
    console.log(users.length)
    console.log(orders)
    useEffect(() => {
        const res = dispatch(getAllUsers())
    }, [dispatch])
    const stats = isAdmin ? [
        { icon: <Users size={24} />, title: "Total Farmers", value: users.length, change: "+12 new", trend: "up", color: "blue" },
        { icon: <ShoppingBag size={24} />, title: "All Orders", value: orders.length, change: "+18 this week", trend: "up", color: "purple" },
        { icon: <DollarSign size={24} />, title: "Platform Revenue", value: "₹2,600", change: "+25%", trend: "up", color: "green" },
        { icon: <Leaf size={24} />, title: "Products Listed", value: "320", change: "4 new today", trend: "neutral", color: "orange" },
    ] : [
        { icon: <Package size={24} />, title: "My Products", value: "24", change: "+3 this week", trend: "up", color: "blue" },
        { icon: <Leaf size={24} />, title: "Active Crops", value: "5", change: "2 ready for harvest", trend: "neutral", color: "green" },
        { icon: <DollarSign size={24} />, title: "This Month Earnings", value: "₹12,450", change: "+15%", trend: "up", color: "purple" },
        { icon: <ShoppingBag size={24} />, title: "My Orders", value: "7", change: "3 new today", trend: "down", color: "orange" }
    ];

    const recentActivities = isAdmin ? [
        { id: 1, icon: <CheckCircle size={16} className="text-green-500" />, title: "New User Registered", description: "Farmer Ramesh joined", time: "2 hrs ago" },
        { id: 2, icon: <AlertCircle size={16} className="text-red-500" />, title: "Order Failed", description: "Order #4567 payment error", time: "5 hrs ago" },
        { id: 3, icon: <Package size={16} className="text-blue-500" />, title: "Product Approved", description: "Organic Carrots", time: "Yesterday" }
    ] : [
        { id: 1, icon: <CheckCircle size={16} className="text-green-500" />, title: "Order Completed", description: "Order #1234 for 5kg Tomatoes", time: "2 hours ago" },
        { id: 2, icon: <AlertCircle size={16} className="text-yellow-500" />, title: "Crop Alert", description: "Wheat needs watering", time: "5 hours ago" },
        { id: 3, icon: <Package size={16} className="text-blue-500" />, title: "New Product Added", description: "Organic Potatoes", time: "Yesterday" }
    ];

    const quickActions = isAdmin ? [
        { icon: <Users size={24} />, label: "Manage Users", bg: "bg-blue-50", color: "text-blue-600" },
        { icon: <ShoppingBag size={24} />, label: "View Orders", bg: "bg-purple-50", color: "text-purple-600" },
        { icon: <Leaf size={24} />, label: "Review Products", bg: "bg-green-50", color: "text-green-600" },
        { icon: <DollarSign size={24} />, label: "Transactions", bg: "bg-yellow-50", color: "text-yellow-600" },
    ] : [
        { icon: <PlusCircle size={24} />, label: "Add Product", bg: "bg-green-50", color: "text-green-600" },
        { icon: <Leaf size={24} />, label: "Add Crop", bg: "bg-blue-50", color: "text-blue-600" },
        { icon: <Package size={24} />, label: "Inventory", bg: "bg-purple-50", color: "text-purple-600" },
        { icon: <DollarSign size={24} />, label: "Add Sale", bg: "bg-yellow-50", color: "text-yellow-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isAdmin ? '👋 Welcome Admin,' : '🌾 Welcome back,'} {userData?.fullName || "User"}!
                    </h1>
                    <p className="text-gray-600">
                        {isAdmin ? "Here's the latest platform stats" : "Here's what's happening with your farm today"}
                    </p>
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

            {/* Main Grid */}
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
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                className={`p-4 hover:bg-opacity-80 rounded-lg flex flex-col items-center justify-center transition ${action.bg} ${action.color}`}
                            >
                                {action.icon}
                                <span className="mt-2">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

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
