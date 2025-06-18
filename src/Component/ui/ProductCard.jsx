import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onClick }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            className={i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-gray-900">₹{product.price}</span>
                    <button
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Add to cart functionality here
                        }}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;