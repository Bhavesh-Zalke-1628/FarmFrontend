import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    X,
    Store,
    Package,
    Calendar,
    Tag,
    Star,
    Heart,
    Share2,
    Minus,
    Plus,
    Truck,
    Shield,
    RotateCcw
} from 'lucide-react';

function ProductModal({ product, onClose }) {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    // Mock images array (in real app, this would come from product data)
    const productImages = product?.img?.secure_url ? [product.img.secure_url] : [];

    const handleAddToCart = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        onClose();
    };

    const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const originalPrice = product.offerPercentage
        ? Math.round(product.price / (1 - product.offerPercentage / 100))
        : null;

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.keyCode === 27) onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>ID: {product._id}</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>4.5</span>
                                <span className="text-gray-400">(127 reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`p-2 rounded-full transition-colors ${isWishlisted
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group">
                                {product?.img?.secure_url ? (
                                    <img
                                        src={product.img.secure_url}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <Package className="w-24 h-24 mb-4" />
                                        <span className="text-lg">No Image Available</span>
                                    </div>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {!product.outOfStock && (
                                    <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                        <Package className="w-3 h-3" />
                                        In Stock
                                    </span>
                                )}
                                {product.offerPercentage && (
                                    <span className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {product.offerPercentage}% OFF
                                    </span>
                                )}
                                <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                    <Store className="w-3 h-3" />
                                    {product.company || 'ABC'}
                                </span>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Price Section */}
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-green-600">
                                        ₹{product.price}
                                    </span>
                                    {originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            ₹{originalPrice}
                                        </span>
                                    )}
                                </div>
                                {product.offerPercentage && (
                                    <p className="text-green-600 font-medium">
                                        You save ₹{originalPrice - product.price} ({product.offerPercentage}% off)
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description || "Experience premium quality with this carefully crafted product designed to meet your needs."}
                                </p>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Package className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-500">Stock</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        {product.quantity} units
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-500">Added</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 hover:bg-gray-50 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-2 hover:bg-gray-50 transition-colors"
                                            disabled={quantity >= product.quantity}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Total: ₹{product.price * quantity}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading || product.outOfStock}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${product.outOfStock
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Adding to Cart...
                                        </>
                                    ) : product.outOfStock ? (
                                        'Out of Stock'
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart - ₹{product.price * quantity}
                                        </>
                                    )}
                                </button>

                                {/* Service Info */}
                                <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
                                    <div className="flex flex-col items-center gap-1 p-2">
                                        <Truck className="w-5 h-5 text-green-600" />
                                        <span>Fast Delivery</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 p-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        <span>Secure Payment</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 p-2">
                                        <RotateCcw className="w-5 h-5 text-orange-600" />
                                        <span>Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="border-t border-gray-100">
                        <div className="px-6 py-4">
                            <div className="flex gap-6 border-b border-gray-200">
                                {['details', 'specifications', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                                            ? 'border-green-600 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="py-4">
                                {activeTab === 'details' && (
                                    <div className="space-y-4">
                                        {product.content?.targetPests?.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Target Pests</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.content.targetPests.map((pest, index) => (
                                                        <span key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                                                            {pest}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {product.content?.usageAreas?.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Usage Areas</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.content.usageAreas.map((area, index) => (
                                                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {product.content?.activeIngredients?.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Active Ingredients</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.content.activeIngredients.map((ingredient, index) => (
                                                        <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                                                            {ingredient}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'specifications' && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Product ID</span>
                                                <span className="font-medium">{product._id}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Company</span>
                                                <span className="font-medium">{product.company || 'ABC'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="text-center text-gray-500 py-8">
                                        <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No reviews yet. Be the first to review this product!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
