import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    removeFromCart,
    decrementQuantity,
    addToCart,
    clearCart
} from '../../Redux/Slice/cartSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Cart() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);
    const { state } = useLocation()
    const handleIncrement = (item) => {
        console.log(item)
        if (item?.quantity > 0) {
            dispatch(addToCart({ ...item, productId: item.productId, price: item.price }));
        }

    };

    const handleDecrement = (productId) => {
        dispatch(decrementQuantity(productId));
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handlePurchase = () => {
        navigate("/order-checkout", { state: { items, totalPrice, totalQuantity } })
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center mb-10 text-green-800 animate-pulse">
                🛍️ Your Shopping Cart
            </h1>

            {items.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p className="text-lg mb-3">Your cart is empty 😢</p>
                    <Link to="/products" className="text-green-600 font-semibold hover:underline">
                        Browse Products &rarr;
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.img?.secure_url || 'https://via.placeholder.com/100x100?text=Product'}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg shadow-sm border"
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                                        <p className="text-gray-600">Price: ₹{item.price}</p>
                                        <div className="flex items-center mt-3 space-x-3">
                                            <button
                                                onClick={() => handleDecrement(item.productId)}
                                                disabled={item.quantity <= 1}
                                                className={`px-3 py-1 rounded-full text-lg font-bold ${item.quantity <= 1
                                                    ? 'bg-gray-300 text-white cursor-not-allowed'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                                    }`}
                                            >−</button>
                                            <span className="text-lg font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncrement(item)}
                                                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-lg font-bold text-gray-800"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right mt-4 sm:mt-0">
                                    <p className="text-xl font-bold text-green-700">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="mt-2 text-sm text-red-600 hover:underline hover:text-red-800 transition"
                                        title="Remove from cart"
                                    >
                                        ❌ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="mt-12 bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200">
                        <h3 className="text-2xl font-extrabold text-green-800 mb-6 text-center">
                            🧾 Cart Summary
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg font-medium">
                            <div className="flex justify-between">
                                <span>Total Items:</span>
                                <span>{totalQuantity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Price:</span>
                                <span className="text-green-700 font-bold">₹{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                            <button
                                onClick={handleClearCart}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 w-full sm:w-auto"
                            >
                                🗑️ Clear Cart
                            </button>
                            <button
                                onClick={handlePurchase}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 w-full sm:w-auto"
                            >
                                ✅ Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
