import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaLock, FaShieldAlt, FaTag } from 'react-icons/fa';
import { RiSecurePaymentLine } from 'react-icons/ri';

const OrderSummary = ({
    totalQuantity,
    totalPrice,
    totalDiscount,
    shippingFee,
    grandTotal,
    onCheckout,
    netPrice,
    showCheckoutButton = true
}) => {
    const itemText = totalQuantity === 1 ? 'item' : 'items';

    return (
        <div className="w-full lg:w-auto lg:min-w-[350px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 sticky top-4"
            >
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b border-gray-100">
                    Order Summary
                </h3>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                    <div className="flex justify-between text-sm md:text-base">
                        <span className="text-gray-600">Subtotal ({totalQuantity} {itemText})</span>
                        <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                    </div>

                    {totalDiscount > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-between text-sm md:text-base"
                        >
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600 font-medium">-₹{totalDiscount.toLocaleString()}</span>
                        </motion.div>
                    )}

                    <div className="flex justify-between text-sm md:text-base">
                        <span className="text-gray-600">Net Price</span>
                        <span className="font-medium">₹{netPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm md:text-base">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">
                            {shippingFee > 0 ? (
                                `₹${shippingFee.toLocaleString()}`
                            ) : (
                                <span className="text-green-600">Free</span>
                            )}
                        </span>
                    </div>

                    <div className="pt-3 md:pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-base md:text-lg font-bold text-gray-800">Total Amount</span>
                            <div className="text-right">
                                <span className="text-base md:text-lg font-bold text-gray-800">₹{grandTotal.toLocaleString()}</span>
                                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {!onCheckout || showCheckoutButton && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCheckout}
                        className="w-full py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white text-sm md:text-base font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center"
                    >
                        <FaShoppingCart className="mr-2" />
                        Proceed to Checkout
                    </motion.button>
                )}

                <div className="mt-3 md:mt-4 flex flex-col sm:flex-row gap-3">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 flex items-center text-xs md:text-sm text-gray-600 bg-gray-50 p-2 md:p-3 rounded-lg"
                    >
                        <div className="flex items-center mr-2 md:mr-3 text-green-500">
                            <RiSecurePaymentLine className="text-lg md:text-xl mr-1 md:mr-2" />
                            <FaShieldAlt className="text-lg md:text-xl" />
                        </div>
                        <div>
                            <p className="font-medium">Safe and Secure Payments</p>
                            <p className="text-2xs md:text-xs text-gray-500">100% Payment Protection</p>
                        </div>
                    </motion.div>

                    {totalDiscount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex-1 bg-yellow-50 border border-yellow-200 rounded-lg p-2 md:p-3"
                        >
                            <div className="flex">
                                <div className="text-yellow-500 mr-2 md:mr-3">
                                    <FaTag className="text-lg md:text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-xs md:text-sm font-medium text-yellow-800">You're saving ₹{totalDiscount.toLocaleString()}!</h4>
                                    <p className="text-2xs md:text-xs text-yellow-600 mt-1">
                                        Discounts applied
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 md:mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4"
            >
                <div className="flex items-center">
                    <div className="text-blue-500 mr-2 md:mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xs md:text-sm font-medium text-blue-800">Estimated Delivery</h4>
                        <p className="text-2xs md:text-xs text-blue-600 mt-1">
                            {shippingFee > 0 ? '2-3 business days' : '3-5 business days'}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export { OrderSummary };