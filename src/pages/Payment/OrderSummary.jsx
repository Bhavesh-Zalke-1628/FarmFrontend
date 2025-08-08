// src/pages/OrderSummary.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaCheckCircle,
    FaShoppingCart,
    FaBox,
    FaCreditCard,
    FaMoneyBillWave,
    FaPrint,
    FaArrowLeft
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Layout from '../../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOrder } from '../../Redux/Slice/orderDetailsSlice';




function OrderSummary() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [dispatch]);

    const {
        orderId,
        address = {},
        items = [],
        totalPrice = 0,
        netPrice = 0,
        totalDiscount = 0,
        totalQuantity = 0,
        paymentMethod = 'cash',
        paymentId,
        shippingFee = 0,
        razorpayOrderId,
        grandTotal = 0,
    } = state || {};

    if (!orderId) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="bg-red-100 p-4 rounded-full inline-flex mb-4">
                            <FaShoppingCart className="text-red-500 text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            The order you're looking for doesn't exist or may have been moved
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition flex items-center mx-auto"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Shopping
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0">
                <div className="max-w-4xl mx-auto print:max-w-full">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden print:shadow-none print:rounded-none">
                        <div className="bg-green-50 p-6 text-center border-b border-green-100 print:p-4">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <FaCheckCircle className="text-green-500 text-4xl" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Order Confirmed</h1>
                            <p className="text-gray-600 mt-2">Thank you for your purchase!</p>

                            <div className="mt-6 bg-white rounded-lg p-4 inline-block shadow-sm print:hidden">
                                <div className="flex items-center justify-center">
                                    <span className="font-medium text-gray-700">Order ID:</span>
                                    <span className="font-mono ml-2 text-gray-900">{orderId}</span>
                                </div>
                                {paymentId && (
                                    <div className="mt-2 flex items-center justify-center">
                                        <span className="font-medium text-gray-700">Payment ID:</span>
                                        <span className="font-mono ml-2 text-gray-900">{paymentId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 print:p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <MdLocationOn className="text-green-500 mr-2" />
                                        Shipping Information
                                    </h2>
                                    <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:p-0">
                                        <p className="font-medium">{address.fullName || 'Not provided'}</p>
                                        <p className="text-gray-600">{address.addressLine || '-'}</p>
                                        <p className="text-gray-600">
                                            {address.city || ''}, {address.state || ''} {address.zip || ''}
                                        </p>
                                        <p className="text-gray-600">{address.country || 'India'}</p>
                                        <p className="text-gray-600 mt-2">Phone: {address.phone || '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        {paymentMethod === 'cash' ? (
                                            <FaMoneyBillWave className="text-green-500 mr-2" />
                                        ) : (
                                            <FaCreditCard className="text-green-500 mr-2" />
                                        )}
                                        Payment Method
                                    </h2>
                                    <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:p-0">
                                        <p className="font-medium">
                                            {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                                        </p>
                                        {paymentMethod !== 'cash' && (
                                            <p className="text-gray-600 mt-1">Status: Paid</p>
                                        )}
                                        {razorpayOrderId && (
                                            <p className="text-gray-600 text-sm mt-1">
                                                Razorpay Order ID: {razorpayOrderId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 print:mt-4">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaShoppingCart className="text-green-500 mr-2" />
                                    Order Items ({totalQuantity})
                                </h2>
                                <div className="border rounded-lg divide-y divide-gray-200 print:border-0">
                                    {items.map((item, index) => (
                                        <div key={index} className="p-4 flex justify-between items-center print:p-2">
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4 print:w-12 print:h-12">
                                                    <img
                                                        src={item.img?.secure_url || 'https://via.placeholder.com/150'}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800 print:text-sm">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm print:text-xs">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium print:text-sm">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                                {item.offerPercentage > 0 && (
                                                    <p className="text-green-600 text-sm print:text-xs">
                                                        Saved {formatCurrency((item.price * item.offerPercentage / 100) * item.quantity)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 border-t pt-6 print:mt-4 print:pt-2">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center print:text-base">
                                    <FaBox className="text-green-500 mr-2" />
                                    Order Summary
                                </h2>
                                <div className="space-y-2 print:space-y-1">
                                    <div className="flex justify-between print:text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between print:text-sm">
                                        <span className="text-gray-600">Discounts</span>
                                        <span className="text-green-600">-{formatCurrency(totalDiscount)}</span>
                                    </div>
                                    <div className="flex justify-between print:text-sm">
                                        <span className="text-gray-600">Net Price</span>
                                        <span className="font-medium">{formatCurrency(netPrice)}</span>
                                    </div>
                                    <div className="flex justify-between print:text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">
                                            {shippingFee ? formatCurrency(shippingFee) : 'Free'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3 mt-3 print:pt-1 print:mt-1">
                                        <span className="font-semibold text-gray-800 print:text-base">Total</span>
                                        <span className="font-bold text-lg print:text-base">
                                            {formatCurrency(grandTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mr-4 inline-flex items-center"
                                >
                                    <FaPrint className="mr-2" />
                                    Print Receipt
                                </button>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg inline-flex items-center"
                                >
                                    Continue Shopping
                                </button>
                            </div>

                            <div className="hidden print:block mt-8 text-center text-sm text-gray-500">
                                <p>Thank you for shopping with us!</p>
                                <p className="mt-1">For any queries, contact support@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default OrderSummary;
