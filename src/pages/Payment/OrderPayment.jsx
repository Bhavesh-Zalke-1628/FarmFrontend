import React, { useState } from 'react';
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
import Layout from '../../Layout/Layout';

function OrderPayment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const cart = useSelector(state => state.cart);
    const razorpayKey = useSelector(state => state.order.key);

    const {
        items = [],
        totalPrice = 0,
        totalQuantity = 0
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const validateAddress = () => Object.values(address).every(val => val.trim() !== '');

    const handleCODPayment = async () => {
        try {
            const confirm = await Swal.fire({
                title: 'Order Confirmed ✅',
                text: 'Payment Method: Cash on Delivery',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            if (confirm.isConfirmed) {
                const res = await dispatch(cashOrder(totalPrice));

                console.log("res", res)

                if (res?.payload?.success) {
                    Swal.fire({
                        title: 'Order Placed 🎉',
                        text: 'Your cash-on-delivery order has been successfully placed!',
                        icon: 'success',
                        confirmButtonText: 'See Order Summary'
                    }).then(() => {
                        dispatch(clearCart());
                        navigate('/order-summary');
                    });
                } else {
                    throw new Error('COD order failed');
                }
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong during COD', 'error');
        }
    };

    const handleOnlinePayment = async () => {
        try {
            const keyRes = await dispatch(getRazorpayKey());
            if (!keyRes?.payload?.success) throw new Error('Key fetch failed');

            const orderRes = await dispatch(createRazorpayOrder(totalPrice));
            const { orderId, amount, currency } = orderRes?.payload || {};

            if (!orderId) throw new Error('Razorpay order creation failed');

            const options = {
                key: razorpayKey,
                amount,
                currency,
                name: 'My Store',
                description: 'Order Payment',
                order_id: orderId,
                handler: async (response) => {
                    try {
                        const result = await dispatch(verifyOrderPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount
                        }));

                        if (result?.payload?.success) {
                            Swal.fire({
                                title: 'Payment Successful ✅',
                                text: `Payment ID: ${response.razorpay_payment_id}`,
                                icon: 'success',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                dispatch(clearCart());
                                navigate('/order-summary', {
                                    state: {
                                        address,
                                        items,
                                        totalPrice,
                                        totalQuantity,
                                        paymentId: response.razorpay_payment_id,
                                        orderId: response.razorpay_order_id
                                    }
                                });
                            });
                        }
                    } catch (err) {
                        console.error('Payment verification failed', err);
                        Swal.fire('Error', 'Payment verification failed', 'error');
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
                theme: { color: '#22c55e' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Online payment error:', err);
            Swal.fire('Error', 'Something went wrong with online payment', 'error');
        }
    };

    const handleConfirmPayment = () => {
        if (!validateAddress()) {
            Swal.fire('Error', 'Please fill all address fields', 'error');
            return;
        }

        paymentMethod === 'COD' ? handleCODPayment() : handleOnlinePayment();
    };

    if (items.length === 0) {
        return (
            <div className="text-center mt-20 text-gray-500">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-green-600 font-semibold hover:underline"
                >
                    Continue Shopping →
                </button>
            </div>
        );
    }

    return (

        <Layout>

            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Address + Payment */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">🏠 Shipping Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                ['fullName', 'Full Name'],
                                ['phone', 'Phone Number'],
                                ['addressLine', 'Street Address', 2],
                                ['city', 'City'],
                                ['state', 'State'],
                                ['zip', 'ZIP Code']
                            ].map(([key, placeholder, span = 1]) => (
                                <div className={`w-full ${span === 2 ? 'md:col-span-2' : ''}`} key={key}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{placeholder}</label>
                                    <input
                                        name={key}
                                        value={address[key]}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder={placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">💳 Payment Method</h2>
                        <div className="space-y-2">
                            {['COD', 'Online'].map((method) => (
                                <label key={method} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={() => setPaymentMethod(method)}
                                    />
                                    <span className="text-sm">
                                        {method === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <div className="text-right">
                        <button
                            onClick={handleConfirmPayment}
                            className="bg-green-600 hover:bg-green-700 transition text-white px-8 py-3 rounded-lg text-lg"
                        >
                            ✅ Confirm & Pay
                        </button>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="bg-white rounded-lg shadow p-6 sticky top-20 h-fit">
                    <h2 className="text-xl font-bold mb-4">🧾 Order Summary</h2>
                    {items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center py-2 border-b">
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-green-700">
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                    <div className="mt-4 text-right font-semibold">
                        <p>Total Items: {totalQuantity}</p>
                        <p className="text-xl mt-1 text-green-700">Total: ₹{totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </Layout>

    );
}

export default OrderPayment;
