import React, { useEffect } from 'react';
import { DollarSign, ChevronRight, Search, Download, MoreHorizontal, CheckCircle, Clock, XCircle, User, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllOrderDetails } from '../Redux/Slice/orderDetailsSlice';

const OrdersPage = () => {
    // Sample order data
    const orders = [
        { id: '#ORD-7892', customer: 'Alex Johnson', date: 'Oct 15, 2023', amount: '$125.00', status: 'completed', payment: 'Paid' },
        { id: '#ORD-7891', customer: 'Sarah Miller', date: 'Oct 14, 2023', amount: '$89.50', status: 'pending', payment: 'Pending' },
        { id: '#ORD-7890', customer: 'Michael Chen', date: 'Oct 13, 2023', amount: '$234.00', status: 'completed', payment: 'Paid' },
        { id: '#ORD-7889', customer: 'Emily Wilson', date: 'Oct 12, 2023', amount: '$56.75', status: 'failed', payment: 'Failed' },
        { id: '#ORD-7888', customer: 'David Kim', date: 'Oct 11, 2023', amount: '$189.00', status: 'completed', payment: 'Paid' },
    ];

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { role, data } = useSelector(state => state?.auth)
    useEffect(() => {
        dispatch(getAllOrderDetails())
    }, [dispatch]);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const baseClasses = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium';

        switch (status) {
            case 'completed':
                return (
                    <span className={`${baseClasses} bg-green-100 text-green-800`}>
                        <CheckCircle size={12} /> Completed
                    </span>
                );
            case 'pending':
                return (
                    <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
                        <Clock size={12} /> Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className={`${baseClasses} bg-red-100 text-red-800`}>
                        <XCircle size={12} /> Failed
                    </span>
                );
            default:
                return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
        }
    };

    // Filter orders based on user role
    const filteredOrders = role === 'user'
        ? orders.filter(order => order.customer === 'Current User') // In a real app, you'd filter by actual user
        : orders;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            {role === 'admin' ? (
                                <Shield className="text-blue-600" size={24} />
                            ) : (
                                <User className="text-blue-600" size={24} />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {role === 'admin' ? 'Admin Order Dashboard' : 'My Orders'}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {role === 'admin'
                                    ? 'Manage all customer orders'
                                    : 'Track your recent orders'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {role === 'admin' && (
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                                <Download size={16} /> Export Report
                            </button>
                        )}
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${role === 'admin'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {role === 'admin' ? 'Add New Order' : 'Place New Order'}
                        </button>
                    </div>
                </div>

                {/* Filters Card - Only for admin */}
                {role === 'admin' && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>All Status</option>
                                <option>Completed</option>
                                <option>Pending</option>
                                <option>Failed</option>
                            </select>
                            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Last 30 days</option>
                                <option>Last 7 days</option>
                                <option>Last 24 hours</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Orders Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Table Header */}
                    <div className={`grid ${role === 'admin' ? 'grid-cols-12' : 'grid-cols-8'} bg-gray-50 p-4 text-sm font-medium text-gray-600 border-b border-gray-200`}>
                        <div className="col-span-4 md:col-span-3">Order ID</div>
                        {role === 'admin' && <div className="col-span-4 md:col-span-3">Customer</div>}
                        <div className="col-span-4 md:col-span-2 hidden md:block">Date</div>
                        <div className="col-span-4 md:col-span-2 hidden md:block">Amount</div>
                        <div className="col-span-4 md:col-span-1">Status</div>
                        {role === 'admin' && <div className="col-span-4 md:col-span-1">Payment</div>}
                        <div className="col-span-4 md:col-span-1"></div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className={`grid ${role === 'admin' ? 'grid-cols-12' : 'grid-cols-8'} p-4 text-sm items-center hover:bg-gray-50 transition-colors`}
                                >
                                    <div className="col-span-4 md:col-span-3 font-medium text-blue-600">{order.id}</div>
                                    {role === 'admin' && <div className="col-span-4 md:col-span-3">{order.customer}</div>}
                                    <div className="col-span-4 md:col-span-2 hidden md:block text-gray-500">{order.date}</div>
                                    <div className="col-span-4 md:col-span-2 hidden md:block font-medium">{order.amount}</div>
                                    <div className="col-span-4 md:col-span-1">
                                        <StatusBadge status={order.status} />
                                    </div>
                                    {role === 'admin' && (
                                        <div className="col-span-4 md:col-span-1">
                                            <span className={`text-xs px-2 py-1 rounded ${order.payment === 'Paid' ? 'bg-green-100 text-green-800' :
                                                order.payment === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {order.payment}
                                            </span>
                                        </div>
                                    )}
                                    <div className="col-span-4 md:col-span-1 flex justify-end">
                                        <button className="p-1 text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No orders found. {role === 'user' && 'Place your first order to get started!'}
                            </div>
                        )}
                    </div>

                    {/* Table Footer - Only show pagination if there are orders */}
                    {filteredOrders.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                                Showing 1 to {filteredOrders.length} of {filteredOrders.length} entries
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                                    Previous
                                </button>
                                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;