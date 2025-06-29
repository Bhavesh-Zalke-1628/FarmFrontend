import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import {
    cashOrder,
    createRazorpayOrder,
    getRazorpayKey,
    verifyOrderPayment
} from '../../Redux/Slice/orderPaymentSlice';
import { clearCart } from '../../Redux/Slice/cartSlice';
import { FaShoppingCart, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { MdPayment, MdLocationOn } from 'react-icons/md';
import Layout from '../../Layout/Layout';

function OrderPayment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const cart = useSelector(state => state.cart);
    const razorpayKey = useSelector(state => state.order?.key);
    const order = useSelector(state => state.order);
    const [loading, setLoading] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const {
        items = [],
        totalPrice = 0,
        totalQuantity = 0,
        totalDiscount = 0,
        tax = 0,
        finalPrice = 0
    } = state || cart;

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        zip: ''
    });

    const [errors, setErrors] = useState({
        fullName: false,
        phone: false,
        addressLine: false,
        city: false,
        state: false,
        zip: false
    });

    useEffect(() => {
        // Load saved address from localStorage if available
        const savedAddress = localStorage.getItem('savedAddress');
        if (savedAddress) {
            setAddress(JSON.parse(savedAddress));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    const validateAddress = () => {
        const newErrors = {
            fullName: !address.fullName.trim(),
            phone: !/^\d{10}$/.test(address.phone.trim()),
            addressLine: !address.addressLine.trim(),
            city: !address.city.trim(),
            state: !address.state.trim(),
            zip: !/^\d{6}$/.test(address.zip.trim())
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const saveAddressToLocalStorage = () => {
        localStorage.setItem('savedAddress', JSON.stringify(address));
    };

    const handleCODPayment = async () => {
        try {
            setLoading(true);
            const orderData = {
                items,
                totalPrice,
                totalQuantity,
                totalDiscount,
                tax,
                finalPrice,
                paymentMethod: 'cash',
                address
            };

            const res = await dispatch(cashOrder(finalPrice));
            console.log(res)

            if (res?.payload?.success) {
                saveAddressToLocalStorage();
                Swal.fire({
                    title: 'Order Placed Successfully!',
                    text: `Your order ID is: ${res.payload.data.orderId}`,
                    icon: 'success',
                    confirmButtonText: 'View Order',
                    customClass: {
                        confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg'
                    }
                }).then(() => {
                    dispatch(clearCart());
                    navigate('/order-summary', {
                        state: {
                            orderId: res.payload.data.orderId,
                            address,
                            items,
                            totalPrice,
                            totalDiscount,
                            tax,
                            finalPrice,
                            totalQuantity,
                            paymentMethod: 'cash'
                        }
                    });
                });
            } else {
                throw new Error(res?.payload?.message || 'COD order failed');
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Something went wrong during COD',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        try {
            setPaymentProcessing(true);

            // First get Razorpay key if not already available
            if (!razorpayKey) {
                const keyRes = await dispatch(getRazorpayKey());
                if (!keyRes?.payload?.success) throw new Error('Failed to get payment key');
            }


            const orderData = {
                items,
                totalPrice,
                totalQuantity,
                totalDiscount,
                tax,
                finalPrice,
                paymentMethod: 'Online',
                address
            };

            console.log(orderData)

            const orderRes = await dispatch(createRazorpayOrder(finalPrice));
            const { orderId, razorpayOrderId, amount, currency } = orderRes?.payload || {};

            if (!razorpayOrderId) throw new Error('Payment gateway error');

            const options = {
                key: razorpayKey,
                amount: amount,
                currency: currency,
                name: 'My Store',
                description: `Order #${orderId}`,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        const result = await dispatch(verifyOrderPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId,
                            amount
                        }));

                        if (result?.payload?.success) {
                            saveAddressToLocalStorage();
                            Swal.fire({
                                title: 'Payment Successful!',
                                text: `Order ID: ${orderId}\nPayment ID: ${response.razorpay_payment_id}`,
                                icon: 'success',
                                confirmButtonText: 'View Order',
                                customClass: {
                                    confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg'
                                }
                            }).then(() => {
                                dispatch(clearCart());
                                navigate('/order-summary', {
                                    state: {
                                        orderId,
                                        address,
                                        items,
                                        totalPrice,
                                        totalDiscount,
                                        tax,
                                        finalPrice,
                                        totalQuantity,
                                        paymentId: response.razorpay_payment_id,
                                        razorpayOrderId: response.razorpay_order_id,
                                        paymentMethod: 'Online'
                                    }
                                });
                            });
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Payment verification failed', err);
                        Swal.fire({
                            title: 'Payment Verification Failed',
                            text: 'Please contact support with your order details',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg'
                            }
                        });
                    } finally {
                        setPaymentProcessing(false);
                    }
                },
                prefill: {
                    name: address.fullName,
                    email: 'customer@example.com',
                    contact: address.phone
                },
                notes: {
                    address: `${address.addressLine}, ${address.city}, ${address.state}, ${address.zip}`
                },
                theme: { color: '#4f46e5' },
                modal: {
                    ondismiss: () => {
                        setPaymentProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Online payment error:', err);
            Swal.fire({
                title: 'Payment Error',
                text: err.message || 'Something went wrong with online payment',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg'
                }
            });
            setPaymentProcessing(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!validateAddress()) {
            Swal.fire({
                title: 'Incomplete Address',
                text: 'Please fill all address fields correctly',
                icon: 'warning',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg'
                }
            });
            return;
        }

        if (paymentMethod === 'COD') {
            await handleCODPayment();
        } else {
            await handleOnlinePayment();
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-gray-400 mb-6">
                        <FaShoppingCart className="inline-block text-5xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-green-600 hover:text-green-800 font-medium flex items-center"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Back to Cart
                        </button>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column */}
                        <div className="lg:w-2/3">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-2 rounded-full mr-3">
                                        <MdLocationOn className="text-green-600 text-xl" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    {[
                                        ['fullName', 'Full Name', 'text', true],
                                        ['phone', 'Phone Number', 'tel', true, 'Must be 10 digits'],
                                        ['addressLine', 'Street Address', 'text', true, '', 2],
                                        ['city', 'City', 'text', true],
                                        ['state', 'State/Province', 'text', true],
                                        ['zip', 'ZIP/Postal Code', 'text', true, 'Must be 6 digits']
                                    ].map(([key, placeholder, type = 'text', required = true, errorMessage = '', span = 1]) => (
                                        <div key={key} className={`${span === 2 ? 'md:col-span-2' : ''}`}>
                                            <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                                                {placeholder} {required && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                id={key}
                                                name={key}
                                                type={type}
                                                placeholder={placeholder}
                                                value={address[key]}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border ${errors[key] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-green-500 focus:border-green-500`}
                                                required={required}
                                            />
                                            {errors[key] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errorMessage || `${placeholder} is required`}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-2 rounded-full mr-3">
                                        <MdPayment className="text-green-600 text-xl" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div
                                        className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === 'COD' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setPaymentMethod('COD')}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="COD"
                                                checked={paymentMethod === 'COD'}
                                                onChange={() => { }}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                            />
                                            <div className="ml-3 flex items-center">
                                                <FaMoneyBillWave className="text-gray-600 mr-2" />
                                                <span className="block text-sm font-medium text-gray-700">
                                                    Cash on Delivery
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2 ml-7">
                                            Pay when you receive your order
                                        </p>
                                    </div>

                                    <div
                                        className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === 'Online' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setPaymentMethod('Online')}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Online"
                                                checked={paymentMethod === 'Online'}
                                                onChange={() => { }}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                            />
                                            <div className="ml-3 flex items-center">
                                                <FaCreditCard className="text-gray-600 mr-2" />
                                                <span className="block text-sm font-medium text-gray-700">
                                                    Online Payment
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2 ml-7">
                                            Secure payment with Razorpay
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaShoppingCart className="mr-2 text-green-600" />
                                    Order Summary
                                </h2>

                                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                    {items.map(item => {
                                        const originalTotal = item.price * item.quantity;
                                        const discountedTotal = originalTotal - (item.price * (item.offerPercentage || 0) / 100) * item.quantity;

                                        return (
                                            <div key={item.productId} className="py-4 flex justify-between">
                                                <div className="flex">
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img
                                                            src={item?.img?.secure_url || 'https://via.placeholder.com/150'}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                                        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        {item.offerPercentage > 0 && (
                                                            <div className="flex items-center mt-1">
                                                                <span className="text-sm line-through text-gray-400 mr-2">
                                                                    ₹{item.price.toFixed(2)}
                                                                </span>
                                                                <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                                                    {item.offerPercentage}% OFF
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.offerPercentage > 0 ? (
                                                        <div className="text-right">
                                                            <span>₹{discountedTotal.toFixed(2)}</span>
                                                            <div className="text-xs line-through text-gray-400">
                                                                ₹{originalTotal.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span>₹{originalTotal.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                                        <p>Subtotal ({totalQuantity} items)</p>
                                        <p>₹{totalPrice}</p>
                                    </div>

                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <p>Discounts</p>
                                            <p>-₹{totalDiscount}</p>
                                        </div>
                                    )}


                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <p>Shipping</p>
                                        <p>FREE</p>
                                    </div>

                                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4">
                                        <p>Order Total</p>
                                        <p>₹{finalPrice}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={loading || paymentProcessing}
                                    className={`w-full mt-6 ${loading || paymentProcessing ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-3 px-4 rounded-md shadow-sm transition duration-200 flex items-center justify-center`}
                                >
                                    {loading || paymentProcessing ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="mr-2" />
                                            {paymentMethod === 'COD' ? 'Place Order' : 'Pay Now'}
                                        </>
                                    )}
                                </button>

                                <p className="mt-4 text-center text-sm text-gray-500">
                                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default OrderPayment;