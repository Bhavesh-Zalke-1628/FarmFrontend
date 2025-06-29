


// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//     fetchCart,
//     addToCart,
//     removeFromCart,
//     updateCartItemQuantity,
//     clearCart,
//     localAddToCart,
//     localRemoveFromCart,
//     localDecrementQuantity,
//     localClearCart
// } from '../../Redux/Slice/cartSlice';
// import { Link, useNavigate } from 'react-router-dom';
// import Layout from '../../Layout/Layout';
// import { toast } from 'react-toastify';

// function Cart() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const {
//         items,
//         totalQuantity,
//         totalPrice,
//         totalDiscount,
//         status,
//         error
//     } = useSelector(state => state.cart);

//     console.log(items)
//     const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

//     // Calculate final price after all discounts
//     const finalPrice = (totalPrice - totalDiscount);

//     useEffect(() => {
//         if (isLoggedIn) {
//             dispatch(fetchCart());
//         }
//     }, [dispatch, isLoggedIn]);

//     const handleIncrement = async (item) => {
//         try {
//             if (isLoggedIn) {
//                 await dispatch(addToCart({
//                     productId: item.productId,
//                     quantity: 1
//                 })).unwrap();
//             } else {
//                 dispatch(localAddToCart(item));
//                 toast.success("Item quantity increased");
//             }
//         } catch (error) {
//             toast.error(error.message || "Failed to update quantity");
//         }
//     };

//     const handleDecrement = async (productId) => {
//         try {
//             const item = items.find(i => i.productId === productId);
//             if (item.quantity <= 1) {
//                 await handleRemove(productId);
//                 return;
//             }

//             if (isLoggedIn) {
//                 await dispatch(updateCartItemQuantity({
//                     productId,
//                     quantity: item.quantity - 1
//                 })).unwrap();
//             } else {
//                 dispatch(localDecrementQuantity(productId));
//                 toast.success("Item quantity decreased");
//             }
//         } catch (error) {
//             toast.error(error.message || "Failed to update quantity");
//         }
//     };

//     const handleRemove = async (productId) => {
//         try {
//             if (isLoggedIn) {
//                 await dispatch(removeFromCart(productId)).unwrap();
//                 toast.success("Item removed from cart");
//             } else {
//                 dispatch(localRemoveFromCart(productId));
//                 toast.success("Item removed from cart");
//             }
//         } catch (error) {
//             toast.error(error.message || "Failed to remove item");
//         }
//     };

//     const handleClearCart = async () => {
//         try {
//             if (isLoggedIn) {
//                 await dispatch(clearCart()).unwrap();
//                 toast.success("Cart cleared successfully");
//             } else {
//                 dispatch(localClearCart());
//                 toast.success("Cart cleared successfully");
//             }
//         } catch (error) {
//             toast.error(error.message || "Failed to clear cart");
//         }
//     };

//     const handlePurchase = () => {
//         if (!isLoggedIn) {
//             toast.info("Please login to proceed to checkout");
//             navigate("/login", { state: { from: "/cart" } });
//             return;
//         }

//         navigate("/order-checkout", {
//             state: {
//                 items,
//                 totalPrice: totalPrice,
//                 totalQuantity,
//                 totalDiscount: totalDiscount,
//                 finalPrice
//             }
//         });
//     };

//     // Function to calculate discounted price for a single item
//     const getDiscountedPrice = (item) => {
//         const discount = item.offerPercentage ? (item.price * item.offerPercentage / 100) : 0;
//         return (item.price - discount) * item.quantity;
//     };

//     // Function to get original price for display
//     const getOriginalPrice = (item) => {
//         return (item.price * item.quantity);
//     };

//     if (status === 'loading') {
//         return (
//             <Layout>
//                 <div className="max-w-6xl mx-auto px-4 py-10 text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading your cart...</p>
//                 </div>
//             </Layout>
//         );
//     }

//     if (error) {
//         return (
//             <Layout>
//                 <div className="max-w-6xl mx-auto px-4 py-10 text-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <h3 className="text-xl font-medium text-gray-800 mt-4">Error loading cart</h3>
//                     <p className="text-gray-600 mt-2">{error}</p>
//                     <button
//                         onClick={() => dispatch(fetchCart())}
//                         className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </Layout>
//         );
//     }

//     return (
//         <Layout>
//             <div className="max-w-6xl mx-auto px-4 py-10">
//                 <div className="flex items-center justify-between mb-8">
//                     <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
//                         Your Shopping Cart ({totalQuantity})
//                     </h1>
//                     {items.length > 0 && (
//                         <button
//                             onClick={handleClearCart}
//                             className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Clear Cart
//                         </button>
//                     )}
//                 </div>

//                 {items.length === 0 ? (
//                     <div className="text-center py-20 bg-white rounded-lg shadow-sm">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                         </svg>
//                         <h2 className="text-2xl font-medium text-gray-700 mt-6">Your cart is empty</h2>
//                         <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet</p>
//                         <Link
//                             to="/products"
//                             className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                             </svg>
//                             Shop Now
//                         </Link>
//                     </div>
//                 ) : (
//                     <div className="flex flex-col lg:flex-row gap-8">
//                         {/* Cart Items */}
//                         <div className="lg:w-2/3 space-y-4">
//                             {items.map((item) => (
//                                 <div key={item.productId} className="flex flex-col sm:flex-row bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
//                                     <div className="sm:w-1/3">
//                                       {console.log(item)}
//                                         <img
//                                             src={item.img?.secure_url || 'https://via.placeholder.com/300x300?text=Product'}
//                                             alt={item.name}
//                                             className="w-full h-48 object-cover"
//                                         />
//                                     </div>
//                                     <div className="sm:w-2/3 p-4 flex flex-col justify-between">
//                                         <div>
//                                             <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
//                                             <div className="flex items-center mt-2">
//                                                 <span className="text-lg font-bold text-gray-900">
//                                                     ₹{(item.price - (item.price * (item.offerPercentage || 0) / 100))}
//                                                 </span>
//                                                 {item.offerPercentage > 0 && (
//                                                     <span className="ml-2 text-sm text-gray-500 line-through">₹{item.price}</span>
//                                                 )}
//                                             </div>
//                                             {item.offerPercentage > 0 && (
//                                                 <p className="text-green-600 text-sm mt-1">{item.offerPercentage}% OFF</p>
//                                             )}
//                                         </div>

//                                         <div className="mt-4 flex items-center justify-between">
//                                             <div className="flex items-center border border-gray-300 rounded-lg">
//                                                 <button
//                                                     onClick={() => handleDecrement(item.productId)}
//                                                     disabled={item.quantity <= 1}
//                                                     className={`px-3 py-1 text-lg ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
//                                                 >
//                                                     −
//                                                 </button>
//                                                 <span className="px-4 py-1 text-gray-800">{item.quantity}</span>
//                                                 <button
//                                                     onClick={() => handleIncrement(item)}
//                                                     className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     +
//                                                 </button>
//                                             </div>

//                                             <div className="text-right">
//                                                 <div className="flex flex-col items-end">
//                                                     <p className="text-lg font-bold text-gray-900">
//                                                         ₹{getDiscountedPrice(item)}
//                                                     </p>
//                                                     {item.offerPercentage > 0 && (
//                                                         <span className="text-xs text-gray-500 line-through">
//                                                             ₹{getOriginalPrice(item)}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 <button
//                                                     onClick={() => handleRemove(item.productId)}
//                                                     className="text-sm text-red-500 hover:text-red-700 flex items-center mt-1"
//                                                 >
//                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                                     </svg>
//                                                     Remove
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Order Summary */}
//                         <div className="lg:w-1/3">
//                             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4">
//                                 <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">Order Summary</h3>

//                                 <div className="space-y-3 mb-6">
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
//                                         <span className="font-medium">₹{totalPrice}</span>
//                                     </div>

//                                     <div className="flex justify-between">
//                                         <span className="text-gray-600">Discount</span>
//                                         <span className="text-green-600 font-medium">-₹{totalDiscount}</span>
//                                     </div>

//                                     <div className="flex justify-between">
//                                         <span className="text-gray-600">Delivery</span>
//                                         <span className="font-medium">FREE</span>
//                                     </div>

//                                     <div className="pt-3 border-t">
//                                         <div className="flex justify-between">
//                                             <span className="text-lg font-bold text-gray-800">Total Amount</span>
//                                             <div>
//                                                 <span className="text-lg font-bold text-gray-800">₹{finalPrice}</span>
//                                                 <p className="text-xs text-gray-500 text-right">Inclusive of all taxes</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={handlePurchase}
//                                     className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center"
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                                     </svg>
//                                     Proceed to Checkout
//                                 </button>

//                                 <div className="mt-4 flex items-center text-sm text-gray-500">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                     </svg>
//                                     Safe and Secure Payments
//                                 </div>
//                             </div>

//                             <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                                 <div className="flex">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                                     </svg>
//                                     <div>
//                                         <h4 className="font-medium text-yellow-800">Items in your cart have discounts!</h4>
//                                         <p className="text-xs text-yellow-600 mt-1">Discounts are already applied</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </Layout>
//     );
// }

// export default Cart;


import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    localAddToCart,
    localRemoveFromCart,
    localDecrementQuantity,
    localClearCart
} from '../../Redux/Slice/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../Layout/Layout';
import { toast } from 'react-toastify';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        items,
        totalQuantity,
        totalPrice,
        subTotal,
        totalDiscount,
        status,
        error
    } = useSelector(state => state.cart);

    const data = useSelector(state => state.cart);


    console.log(data)
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    // Calculate final price after all discounts
    const finalPrice = (totalPrice - totalDiscount);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchCart());
        }
    }, [dispatch, isLoggedIn]);

    const handleIncrement = async (item) => {
        try {
            if (isLoggedIn) {
                await dispatch(addToCart({
                    productId: item.productId,
                    quantity: 1
                })).unwrap();
            } else {
                dispatch(localAddToCart(item));
                toast.success("Item quantity increased");
            }
        } catch (error) {
            toast.error(error.message || "Failed to update quantity");
        }
    };

    const handleDecrement = async (productId) => {
        try {
            const item = items.find(i => i.productId === productId);
            if (item.quantity <= 1) {
                await handleRemove(productId);
                return;
            }

            if (isLoggedIn) {
                await dispatch(updateCartItemQuantity({
                    productId,
                    quantity: item.quantity - 1
                })).unwrap();
            } else {
                dispatch(localDecrementQuantity(productId));
                toast.success("Item quantity decreased");
            }
        } catch (error) {
            toast.error(error.message || "Failed to update quantity");
        }
    };

    const handleRemove = async (productId) => {
        try {
            if (isLoggedIn) {
                await dispatch(removeFromCart(productId)).unwrap();
                toast.success("Item removed from cart");
            } else {
                dispatch(localRemoveFromCart(productId));
                toast.success("Item removed from cart");
            }
        } catch (error) {
            toast.error(error.message || "Failed to remove item");
        }
    };

    const handleClearCart = async () => {
        try {
            if (isLoggedIn) {
                await dispatch(clearCart()).unwrap();
            } else {
                dispatch(localClearCart());
            }
        } catch (error) {
            toast.error(error.message || "Failed to clear cart");
        }
    };

    const handlePurchase = () => {
        if (!isLoggedIn) {
            toast.info("Please login to proceed to checkout");
            navigate("/login", { state: { from: "/cart" } });
            return;
        }

        navigate("/order-checkout", {
            state: {
                items,
                totalPrice: totalPrice,
                totalQuantity,
                totalDiscount: totalDiscount,
                finalPrice
            }
        });
    };

    // Function to calculate discounted price for a single item
    const getDiscountedPrice = (item) => {
        const discount = item.offerPercentage ? (item.price * item.offerPercentage / 100) : 0;
        return (item.price - discount) * item.quantity;
    };

    // Function to get original price for display
    const getOriginalPrice = (item) => {
        return (item.price * item.quantity);
    };

    if (status === 'loading') {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto px-4 py-10 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your cart...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto px-4 py-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-800 mt-4">Error loading cart</h3>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <button
                        onClick={() => dispatch(fetchCart())}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Retry
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Your Shopping Cart ({totalQuantity})
                    </h1>
                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Cart
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl font-medium text-gray-700 mt-6">Your cart is empty</h2>
                        <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="lg:w-2/3 space-y-4">
                            {items.map((item) => (
                                <div key={item.productId} className="flex flex-col sm:flex-row bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                                    <div className="sm:w-1/3">
                                        <img
                                            src={item.productId?.img?.secure_url || item.img?.secure_url || 'https://via.placeholder.com/300x300?text=Product'}
                                            alt={item.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="sm:w-2/3 p-4 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                                            <div className="flex items-center mt-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{(item.price - (item.price * (item.offerPercentage || 0) / 100))}
                                                </span>
                                                {item.offerPercentage > 0 && (
                                                    <span className="ml-2 text-sm text-gray-500 line-through">₹{item.price}</span>
                                                )}
                                            </div>
                                            {item.offerPercentage > 0 && (
                                                <p className="text-green-600 text-sm mt-1">{item.offerPercentage}% OFF</p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => handleDecrement(item.productId)}
                                                    disabled={item.quantity <= 1}
                                                    className={`px-3 py-1 text-lg ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    −
                                                </button>
                                                <span className="px-4 py-1 text-gray-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrement(item)}
                                                    className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₹{getDiscountedPrice(item)}
                                                    </p>
                                                    {item.offerPercentage > 0 && (
                                                        <span className="text-xs text-gray-500 line-through">
                                                            ₹{getOriginalPrice(item)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.productId)}
                                                    className="text-sm text-red-500 hover:text-red-700 flex items-center mt-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
                                        <span className="font-medium">₹{totalPrice}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-green-600 font-medium">-₹{totalDiscount}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="font-medium">FREE</span>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                            <div>
                                                <span className="text-lg font-bold text-gray-800 ml-10">₹{subTotal}</span>
                                                <p className="text-xs text-gray-500 text-right">Inclusive of all taxes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePurchase}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Proceed to Checkout
                                </button>

                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Safe and Secure Payments
                                </div>
                            </div>

                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-yellow-800">Items in your cart have discounts!</h4>
                                        <p className="text-xs text-yellow-600 mt-1">Discounts are already applied</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Cart;