// const OrderSummary = ({
//     totalQuantity,
//     totalPrice,
//     totalDiscount,
//     shippingFee,
//     grandTotal,
//     onCheckout,
//     netPrice
// }) => (
//     <div className="lg:w-1/3">
//         <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">Order Summary</h3>

//             <div className="space-y-3 mb-6">
//                 <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
//                     <span className="font-medium">₹{totalPrice}</span>
//                 </div>

//                 <div className="flex justify-between">
//                     <span className="text-gray-600">Discount</span>
//                     <span className="text-green-600 font-medium">-₹{totalDiscount}</span>
//                 </div>

//                 <div className="flex justify-between">
//                     <span className="text-gray-600">Net Price</span>
//                     <span className="font-medium">₹{netPrice}</span>
//                 </div>

//                 <div className="flex justify-between">
//                     <span className="text-gray-600">Delivery</span>
//                     <span className="font-medium">{shippingFee > 0 ? `₹${shippingFee}` : "Free"}</span>
//                 </div>

//                 <div className="pt-3 border-t">
//                     <div className="flex justify-between">
//                         <span className="text-lg font-bold text-gray-800">Total Amount</span>
//                         <div>
//                             <span className="text-lg font-bold text-gray-800 ml-10">₹{grandTotal}</span>
//                             <p className="text-xs text-gray-500 text-right">Inclusive of all taxes</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <button
//                 onClick={onCheckout}
//                 className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//                 Proceed to Checkout
//             </button>

//             <div className="mt-4 flex items-center text-sm text-gray-500">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 Safe and Secure Payments
//             </div>
//         </div>

//         <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="flex">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//                 <div>
//                     <h4 className="font-medium text-yellow-800">Items in your cart have discounts!</h4>
//                     <p className="text-xs text-yellow-600 mt-1">Discounts are already applied</p>
//                 </div>
//             </div>
//         </div>
//     </div>
// );


// export { OrderSummary }


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
        <div className=" mt-3 w-fit">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Order Summary</h3>

                <div className="space-y-4 mb-6 ">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal ({totalQuantity} {itemText})</span>
                        <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                    </div>

                    {/* Discount */}
                    {totalDiscount > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-between"
                        >
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600 font-medium">-₹{totalDiscount.toLocaleString()}</span>
                        </motion.div>
                    )}

                    {/* Net Price */}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Net Price</span>
                        <span className="font-medium">₹{netPrice.toLocaleString()}</span>
                    </div>

                    {/* Delivery */}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">
                            {shippingFee > 0 ? (
                                `₹${shippingFee.toLocaleString()}`
                            ) : (
                                <span className="text-green-600">Free</span>
                            )}
                        </span>
                    </div>

                    {/* Total Amount */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Total Amount</span>
                            <div className="text-right">
                                <span className="text-lg font-bold text-gray-800">₹{grandTotal.toLocaleString()}</span>
                                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {showCheckoutButton && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCheckout}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center"
                    >
                        <FaShoppingCart className="mr-2" />
                        Proceed to Checkout
                    </motion.button>
                )}

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg"
                >
                    <div className="flex items-center mr-3 text-green-500">
                        <RiSecurePaymentLine className="text-xl mr-2" />
                        <FaShieldAlt className="text-xl" />
                    </div>
                    <div>
                        <p className="font-medium">Safe and Secure Payments</p>
                        <p className="text-xs text-gray-500">100% Payment Protection</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Discount Banner */}
            {totalDiscount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                    <div className="flex">
                        <div className="text-yellow-500 mr-3">
                            <FaTag className="text-xl" />
                        </div>
                        <div>
                            <h4 className="font-medium text-yellow-800">You're saving ₹{totalDiscount.toLocaleString()}!</h4>
                            <p className="text-xs text-yellow-600 mt-1">
                                Discounts have been applied to your order
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Delivery Estimate */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
                <div className="flex items-center">
                    <div className="text-blue-500 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-medium text-blue-800">Estimated Delivery</h4>
                        <p className="text-xs text-blue-600 mt-1">
                            {shippingFee > 0 ? '2-3 business days' : '3-5 business days'}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export { OrderSummary };