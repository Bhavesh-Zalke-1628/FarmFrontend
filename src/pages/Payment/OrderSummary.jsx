import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSummary() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="text-center mt-20 text-gray-500">
                <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-green-600 font-semibold hover:underline"
                >
                    Browse Products →
                </button>
            </div>
        );
    }

    const { address, items, totalPrice, totalQuantity, paymentId, orderId } = state;

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow rounded-lg">
            <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">✅ Order Summary</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">📄 Payment Details</h2>
                <p><strong>Payment ID:</strong> {paymentId}</p>
                <p><strong>Order ID:</strong> {orderId}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">🏠 Shipping Address</h2>
                <p>{address.fullName}, {address.phone}</p>
                <p>{address.addressLine}, {address.city}, {address.state} - {address.zip}</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">🛒 Ordered Items</h2>
                {items.map((item) => (
                    <div key={item.productId} className="flex justify-between border-b py-2">
                        <p>{item.name} (x{item.quantity})</p>
                        <p className="font-semibold">₹{(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                ))}
                <div className="text-right mt-4 font-bold text-lg">
                    Total: ₹{totalPrice.toFixed(2)} for {totalQuantity} items
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={() => navigate('/products')}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    Continue Shopping →
                </button>
            </div>
        </div>
    );
}

export default OrderSummary;
