import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaShoppingCart, FaCreditCard, FaMoneyBillWave,
    FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaLock
} from 'react-icons/fa';
import { MdPayment, MdLocationOn, MdArrowBack } from 'react-icons/md';
import Layout from '../../Layout/Layout';
import { OrderSummary } from '../../Component/Comman/OrderSummary';
import {
    cashOrder,
    createRazorpayOrder,
    getRazorpayKey,
    verifyOrderPayment
} from '../../Redux/Slice/orderPaymentSlice';
import { clearCart, fetchCart } from '../../Redux/Slice/cartSlice';
import { createOrderDetails } from '../../Redux/Slice/orderDetailsSlice';

// Reusable Address Form Component
const AddressForm = ({
    address,
    errors,
    onChange,
    onSubmit,
    onBack
}) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100"
    >
        <div className="flex items-center mb-6">
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
                ['zip', 'ZIP/Postal Code', 'text', true, 'Must be 6 digits'],
                ['country', 'Country', 'text', false, '', 2]
            ].map(([key, placeholder, type, required, errorMessage, span]) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${span === 2 ? 'md:col-span-2' : ''}`}
                >
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                        {placeholder} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        id={key}
                        name={key}
                        type={type}
                        placeholder={placeholder}
                        value={address[key]}
                        onChange={onChange}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 transition ${errors[key] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                        required={required}
                        disabled={key === 'country'}
                    />
                    {errors[key] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errorMessage || `${placeholder} is required`}
                        </p>
                    )}
                </motion.div>
            ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
            {onBack && (
                <motion.button
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition flex items-center"
                >
                    <MdArrowBack className="w-5 h-5 mr-1" />
                    Back
                </motion.button>
            )}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-md flex items-center"
            >
                Continue to Payment
                <MdPayment className="ml-2" />
            </motion.button>
        </div>
    </motion.div>
);

// Payment Method Selection Component
const PaymentMethodSelection = ({
    paymentMethod,
    setPaymentMethod,
    onSubmit,
    onBack,
    isLoading
}) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
    >
        <div className="flex items-center mb-6">
            <div className="bg-green-100 p-2 rounded-full mr-3">
                <MdPayment className="text-green-600 text-xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
        </div>

        <div className="mt-6 space-y-4">
            {[
                {
                    id: 'cash',
                    icon: <FaMoneyBillWave className="text-gray-600 mr-2 text-lg" />,
                    title: 'Cash on Delivery',
                    description: 'Pay when you receive your order'
                },
                {
                    id: 'online',
                    icon: <FaCreditCard className="text-gray-600 mr-2 text-lg" />,
                    title: 'Online Payment',
                    description: 'Secure payment with Razorpay',
                    secureNote: 'Your payment is securely encrypted'
                }
            ].map((method) => (
                <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.01 }}
                    className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === method.id
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    onClick={() => setPaymentMethod(method.id)}
                >
                    <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${paymentMethod === method.id
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                            }`}>
                            {paymentMethod === method.id && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                        </div>
                        <div className="flex items-center">
                            {method.icon}
                            <div>
                                <span className="block text-sm font-medium text-gray-700">
                                    {method.title}
                                </span>
                                <p className="text-xs text-gray-500">
                                    {method.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    {method.secureNote && paymentMethod === method.id && (
                        <div className="mt-3 ml-8 flex items-center text-xs text-green-600">
                            <FaLock className="mr-1" />
                            <span>{method.secureNote}</span>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>

        <div className="mt-8 flex justify-between">
            <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition flex items-center"
            >
                <MdArrowBack className="w-5 h-5 mr-1" />
                Back to Address
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-md flex items-center disabled:opacity-70"
            >
                {isLoading ? (
                    <>
                        <FaSpinner className="animate-spin mr-2" />
                        Processing...
                    </>
                ) : (
                    <>
                        {paymentMethod === 'cash' ? 'Place Order' : 'Pay Now'}
                        <FaCheckCircle className="ml-2" />
                    </>
                )}
            </motion.button>
        </div>
    </motion.div>
);

function OrderPayment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const cart = useSelector(state => state.cart);
    const razorpayKey = useSelector(state => state?.order?.key);


    const [loading, setLoading] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const {
        items = [],
        netPrice = 0,
        shippingFee = 0,
        totalDiscount = 0,
        totalQuantity = 0,
        grandTotal = 0,
        totalPrice = 0
    } = state || cart;

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        zip: '',
        country: 'India'
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
        // Load saved address if exists
        const savedAddress = localStorage.getItem('savedAddress');
        if (savedAddress) {
            setAddress(JSON.parse(savedAddress));
        }
        // Cleanup if needed

    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
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

    console.log("totalPrice", totalPrice)

    const handleCashPayment = async () => {
        try {
            setLoading(true);
            const res = await dispatch(cashOrder(grandTotal));

            if (res?.payload?.success) {
                // saveAddressToLocalStorage();
                setActiveStep(3);

                await Swal.fire({
                    title: 'Order Placed Successfully!',
                    text: `Your order ID is: ${res.payload.data.orderId}`,
                    icon: 'success',
                    confirmButtonText: 'View Order',
                    customClass: {
                        confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition'
                    }
                });
                const data = {
                    orderId: res.payload.data._id,
                    orderPayment: 'cash',
                    products: items,
                    totalAmount: grandTotal,
                    deliveryAddress: address,
                    // totalDiscount,
                    // shippingFee,
                    // grandTotal,
                    // totalQuantity,
                    // netPrice,
                }

                dispatch(clearCart());
                dispatch(createOrderDetails(data))
                navigate('/order-summary', {
                    state: {
                        orderId: res.payload.data.orderId,
                        address,
                        items,
                        totalPrice,
                        totalDiscount,
                        shippingFee,
                        grandTotal,
                        totalQuantity,
                        netPrice,
                        paymentMethod: 'cash'
                    }
                });
            } else {
                throw new Error(res?.payload?.message || 'Cash order failed');
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Something went wrong during cash payment',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        try {
            // Check if Razorpay is ready
            // if (!razorpayLoaded) {
            //     Swal.fire({
            //         title: 'Loading Payment Gateway',
            //         text: 'Please wait while we prepare the payment system',
            //         icon: 'info',
            //         showConfirmButton: false,
            //         allowOutsideClick: false
            //     });
            //     return;
            // }

            // Fetch Razorpay key if not available
            if (!razorpayKey) {
                setPaymentProcessing(true);
                const keyResult = await dispatch(getRazorpayKey());

                if (!keyResult.payload?.data?.key) {
                    throw new Error('Failed to initialize payment gateway');
                }
            }

            setPaymentProcessing(true);

            // Create Razorpay order
            const orderRes = await dispatch(createRazorpayOrder(grandTotal));
            const { orderId, razorpayOrderId, amount, currency } = orderRes?.payload || {};


            if (!razorpayOrderId) {
                throw new Error('Failed to create payment order. Please try again.');
            }

            // Prepare payment options
            const options = {
                key: razorpayKey,
                amount: amount.toString(),
                currency,
                name: 'GreenFields Farm',
                description: `Order #${orderId}`,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verificationResult = await dispatch(
                            verifyOrderPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId,
                                amount
                            })
                        );



                        if (!verificationResult?.payload?.success) {
                            throw new Error('Payment verification failed');
                        }

                        // Payment successful
                        saveAddressToLocalStorage();
                        dispatch(clearCart());

                        await Swal.fire({
                            title: 'Payment Successful!',
                            html: `
                    <div class="text-left">
                      <p class="mb-2">Order ID: <strong>${orderId}</strong></p>
                      <p>Payment ID: <strong>${response.razorpay_payment_id}</strong></p>
                    </div>
                  `,
                            icon: 'success',
                            confirmButtonText: 'View Order Details',
                            customClass: {
                                confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                            }
                        });

                        navigate('/order-summary', {
                            state: {
                                orderId,
                                address,
                                items,
                                totalPrice,
                                totalDiscount,
                                shippingFee,
                                grandTotal,
                                totalQuantity,
                                netPrice,
                                paymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                paymentMethod: 'online'
                            }
                        });

                    } catch (verificationError) {
                        console.error('Payment verification failed:', verificationError);
                        Swal.fire({
                            title: 'Verification Failed',
                            text: 'Your payment was successful but verification failed. Please contact support with your payment details.',
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                    } finally {
                        setPaymentProcessing(false);
                    }
                },
                prefill: {
                    name: address.fullName || '',
                    email: 'customer@example.com',
                    contact: address.phone || ''
                },
                notes: {
                    address: `${address.addressLine || ''}, ${address.city || ''}, ${address.state || ''}, ${address.zip || ''}`
                },
                theme: { color: '#10b981' },
                modal: {
                    ondismiss: async () => {
                        setPaymentProcessing(false);
                        const { isConfirmed } = await Swal.fire({
                            title: 'Payment Incomplete',
                            text: 'You can complete your payment from your orders page',
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'Go to Orders',
                            cancelButtonText: 'Continue Shopping'
                        });

                        if (isConfirmed) {
                            navigate('/orders');
                        }
                    }
                }
            };

            // Validate options before opening
            if (!options.key || !options.order_id) {
                throw new Error('Payment configuration error');
            }

            // Open payment modal
            const rzp = new window.Razorpay(options);
            rzp.open();

            // Handle payment window close
            rzp.on('payment.failed', (response) => {
                console.error('Payment failed:', response.error);
                Swal.fire({
                    title: 'Payment Failed',
                    html: `
                <div class="text-left">
                  <p class="mb-2">Error: <strong>${response.error.description || 'Unknown error'}</strong></p>
                  <p>Order ID: <strong>${orderId}</strong></p>
                </div>
              `,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
                setPaymentProcessing(false);
            });

        } catch (error) {
            console.error('Payment processing error:', error);
            Swal.fire({
                title: 'Payment Error',
                text: error.message || 'Failed to process payment. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
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
                confirmButtonText: 'OK'
            });
            return;
        }

        if (paymentMethod === 'cash') {
            await handleCashPayment();
        } else {
            await handleOnlinePayment();
        }
    };

    const proceedToPayment = () => {
        if (!validateAddress()) {
            Swal.fire({
                title: 'Incomplete Address',
                text: 'Please fill all address fields correctly',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        setActiveStep(2);
    };

    if (items.length === 0) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center"
                    >
                        <div className="text-gray-400 mb-6">
                            <FaShoppingCart className="inline-block text-5xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/products')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md"
                        >
                            Continue Shopping
                        </motion.button>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <div className="flex items-center mb-8">
                        <motion.button
                            whileHover={{ x: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(-1)}
                            className="text-green-600 hover:text-green-800 font-medium flex items-center transition"
                        >
                            <MdArrowBack className="w-5 h-5 mr-1" />
                            Back to Cart
                        </motion.button>
                    </div>

                    {/* Checkout Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                        <p className="text-gray-600 mt-2">Complete your purchase in just a few steps</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transition-all duration-300"
                                style={{ width: `${(activeStep - 1) * 50}%` }}
                            ></div>

                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= step
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                            } font-semibold transition`}
                                    >
                                        {step}
                                    </div>
                                    <span className="text-xs mt-2 text-gray-600 font-medium">
                                        {step === 1 ? 'Address' : step === 2 ? 'Payment' : 'Complete'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Form */}
                        <div className="lg:w-2/3">
                            <AnimatePresence mode="wait">
                                {activeStep === 1 && (
                                    <AddressForm
                                        address={address}
                                        errors={errors}
                                        onChange={handleInputChange}
                                        onSubmit={proceedToPayment}
                                    />
                                )}

                                {activeStep === 2 && (
                                    <PaymentMethodSelection
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                        onSubmit={handleConfirmPayment}
                                        onBack={() => setActiveStep(1)}
                                        isLoading={loading || paymentProcessing}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:w-1/3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="sticky top-8"
                            >
                                <OrderSummary
                                    items={items}
                                    totalPrice={totalPrice}
                                    totalDiscount={totalDiscount}
                                    shippingFee={shippingFee}
                                    grandTotal={grandTotal}
                                    netPrice={netPrice}
                                />

                                {activeStep === 1 && address.addressLine && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                                    >
                                        <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                            <FaMapMarkerAlt className="text-green-500 mr-2" />
                                            Delivery Address
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            <p className="font-medium">{address.fullName}</p>
                                            <p>{address.addressLine}</p>
                                            <p>{address.city}, {address.state} {address.zip}</p>
                                            <p>{address.country}</p>
                                            <p className="mt-1">Phone: {address.phone}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default OrderPayment;