import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingCart, FaBox, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Layout from '../../Layout/Layout';

function OrderSummary() {
    const { state } = useLocation();
    const {
        orderId,
        address,
        items,
        totalPrice,
        netPrice,
        totalDiscount,
        totalQuantity,
        paymentMethod,
        paymentId,
        shippingFee,
        razorpayOrderId,
        grandTotal,
    } = state || {};

    console.log(state)
    console.log(netPrice)

    const navigate = useNavigate()
    if (!orderId) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
                        <p className="text-gray-600 mt-2">The order you're looking for doesn't exist</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Order Confirmation Header */}
                        <div className="bg-green-50 p-6 text-center border-b border-green-100">
                            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-800">Order Confirmed</h1>
                            <p className="text-gray-600 mt-2">Thank you for your purchase!</p>

                            <div className="mt-6 bg-white rounded-lg p-4 inline-block shadow-sm">
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

                        {/* Order Details */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Shipping Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <MdLocationOn className="text-green-500 mr-2" />
                                        Shipping Information
                                    </h2>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">{address.fullName}</p>
                                        <p className="text-gray-600">{address.addressLine}</p>
                                        <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                                        <p className="text-gray-600 mt-2">Phone: {address.phone}</p>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        {paymentMethod === 'COD' ? (
                                            <FaMoneyBillWave className="text-green-500 mr-2" />
                                        ) : (
                                            <FaCreditCard className="text-green-500 mr-2" />
                                        )}
                                        Payment Method
                                    </h2>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">
                                            {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                                        </p>
                                        {paymentMethod === 'Online' && (
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

                            {/* Order Items */}
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaShoppingCart className="text-green-500 mr-2" />
                                    Order Items ({totalQuantity})
                                </h2>
                                <div className="border rounded-lg divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <div key={index} className="p-4 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                                                    <img
                                                        src={item.img?.secure_url || 'https://via.placeholder.com/150'}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right  ">
                                                <p className="font-medium">
                                                    ₹{(item.price * item.quantity)}
                                                </p>
                                                {item.offerPercentage > 0 && (
                                                    <p className="text-green-600 text-sm">
                                                        Saved ₹{((item.price * item.offerPercentage / 100) * item.quantity)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mt-8 border-t pt-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaBox className="text-green-500 mr-2" />
                                    Order Summary
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">₹{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discounts</span>
                                        <span className="text-green-600">-₹{totalDiscount}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Net Price </span>
                                        <span className="font-medium">₹{netPrice}</span>

                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">₹{shippingFee ? shippingFee : "Free"}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3 mt-3">
                                        <span className="font-semibold text-gray-800">Total</span>
                                        <span className="font-bold text-lg">₹{grandTotal}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => window.print()}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mr-4"
                                >
                                    Print Receipt
                                </button>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default OrderSummary;