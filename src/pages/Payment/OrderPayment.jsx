import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createRazorpayOrder, getRazorpayKey, verifyOrderPayment } from '../../Redux/Slice/orderPaymentSlice';
import { clearCart } from '../../Redux/Slice/cartSlice';

function OrderPayment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const cartState = useSelector((s) => s.cart);
    const data = state || cartState;

    const { items = [], totalPrice = 0, totalQuantity = 0 } = data;
    const { key: razorpayKey } = useSelector(state => state.order);

    console.log(razorpayKey)

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        city: '',
        state: '',
        zip: '',
        addressLine: ''
    });

    const handleInputChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const validateAddress = () => {
        return Object.values(address).every(val => val.trim() !== '');
    };

    const handleConfirmPayment = async () => {
        if (!validateAddress()) {
            Swal.fire('Error', 'Please fill all address fields', 'error');
            return;
        }

        if (paymentMethod === 'COD') {
            Swal.fire({
                title: 'Order Confirmed ✅',
                text: `Payment Method: Cash on Delivery`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/thank-you');
            });
        } else {
            const res = await dispatch(getRazorpayKey());
            console.log(res)
            if (res?.payload?.success) {
                await handleOnlinePayment();
            }
        }
    };

    const handleOnlinePayment = async () => {
        try {
            console.log(state?.totalPrice)
            const orderRes = await dispatch(createRazorpayOrder(state?.totalPrice))

            console.log(orderRes);

            const { orderId, amount, currency } = orderRes?.payload || {};

            console.log(orderId, amount, currency)

            if (!orderId) {
                Swal.fire('Error', 'Failed to create payment order', 'error');
                return;
            }

            console.log(razorpayKey )

            const options = {
                key: razorpayKey,
                amount,
                currency,
                name: 'My Store',
                description: 'Order Payment',
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const paymentDetails = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount,
                        };

                        const result = await dispatch(verifyOrderPayment(paymentDetails))

                        if (result?.payload?.success) {
                            Swal.fire({
                                title: 'Payment Successful ✅',
                                text: `Payment ID: ${response.razorpay_payment_id}`,
                                icon: 'success',
                                confirmButtonText: 'OK',
                            }).then(() => navigate('/thank-you'));
                        } else {
                            throw new Error("Verification failed");
                        }
                    } catch (err) {
                        console.error("Payment verification failed", err);
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
                theme: {
                    color: '#22c55e'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
            Swal.fire('Error', 'Something went wrong with Razorpay', 'error');
        }
    };



    if (items.length === 0) {
        return (
            <div className="text-center mt-20 text-gray-500">
                <h2 className="text-2xl font-bold mb-4">No items in your cart</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-green-600 font-semibold hover:underline"
                >
                    Browse Products →
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">🛒 Checkout & Payment</h1>

            {/* Order Items */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">📦 Order Items</h2>
                {items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center border-b py-3">
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-green-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <div className="mt-4 font-bold text-right text-lg">
                    Total: ₹{totalPrice.toFixed(2)} for {totalQuantity} items
                </div>
            </div>

            {/* Address */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">🏠 Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="fullName" placeholder="Full Name" className="border p-2 rounded" value={address.fullName} onChange={handleInputChange} />
                    <input name="phone" placeholder="Phone" className="border p-2 rounded" value={address.phone} onChange={handleInputChange} />
                    <input name="addressLine" placeholder="Address" className="border p-2 rounded col-span-2" value={address.addressLine} onChange={handleInputChange} />
                    <input name="city" placeholder="City" className="border p-2 rounded" value={address.city} onChange={handleInputChange} />
                    <input name="state" placeholder="State" className="border p-2 rounded" value={address.state} onChange={handleInputChange} />
                    <input name="zip" placeholder="ZIP" className="border p-2 rounded" value={address.zip} onChange={handleInputChange} />
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">💳 Payment Method</h2>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                        Cash on Delivery
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} />
                        Online Payment (Razorpay)
                    </label>
                </div>
            </div>

            {/* Confirm Button */}
            <div className="text-center">
                <button
                    onClick={handleConfirmPayment}
                    className="bg-green-600 text-white px-8 py-4 text-lg rounded-lg hover:bg-green-700 transition"
                >
                    ✅ Confirm & Pay
                </button>
            </div>
        </div>
    );
}

export default OrderPayment;
