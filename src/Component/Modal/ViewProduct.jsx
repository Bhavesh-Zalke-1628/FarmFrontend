import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductById } from '../../Redux/Slice/productSlice';
import { addToCart } from '../../Redux/Slice/cartSlice';

function ViewProduct({ productId, onClose }) {
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector(state => state.products);
    const cartCount = useSelector(state => state.cart.count);
    const [quantity, setQuantity] = useState(1);
    console.log(product)

    useEffect(() => {
        if (productId) {
            dispatch(getProductById(productId));
            setQuantity(1);
        }
    }, [productId, dispatch]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ product, quantity }));
        }
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    if (!productId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-black"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* Content */}
                {loading && <p className="text-center">Loading product...</p>}
                {error && <p className="text-center text-red-500">Error: {error}</p>}

                {!loading && !error && product && (
                    <>
                        <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                        <img
                            src={product.imageUrl || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-64 object-cover rounded mb-4"
                        />
                        <p className="text-lg mb-1">
                            <strong>Price:</strong> ₹{product.price}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={decrement}
                                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                            >
                                −
                            </button>
                            <span className="text-lg font-medium">{quantity}</span>
                            <button
                                onClick={increment}
                                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                            >
                                +
                            </button>
                        </div>

                        {/* Total Price */}
                        <p className="text-lg mb-4">
                            <strong>Total:</strong> ₹{(product.price * quantity).toFixed(2)}
                        </p>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                        >
                            Add {quantity} to Cart
                        </button>

                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Items in cart: <strong>{cartCount}</strong>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewProduct;
