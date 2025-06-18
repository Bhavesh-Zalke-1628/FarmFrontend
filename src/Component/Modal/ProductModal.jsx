import React from 'react';

function ProductModal({ product, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 w-full md:w-1/2 h-60 bg-gray-100 flex items-center justify-center">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                            />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>
                    <div className="flex flex-col justify-between w-full">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <div className="text-lg text-green-700 font-semibold mb-4">
                                Rs. {product.price}
                                {product.originalPrice && (
                                    <span className="text-gray-400 line-through ml-2 text-sm">
                                        Rs. {product.originalPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                // Add to cart logic
                                onClose();
                            }}
                            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
