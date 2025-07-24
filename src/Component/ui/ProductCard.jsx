import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/Slice/cartSlice";
import { FaSpinner } from "react-icons/fa";

// --- Single Card, with its own image state ---
const ProductCardItem = ({ product, handleProductClick, isLoggedIn }) => {
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const discountedPrice = Math.round(product.price - (product.price * (product.offerPercentage || 0)) / 100);
    const isOutOfStock = product.quantity <= 0;

    const handleAddToCart = (e) => {
        e.stopPropagation(); // don't open modal when adding to cart
        if (product) {
            dispatch(addToCart(product));
        }
    };

    return (
        <div
            tabIndex={0}
            role="button"
            className="flex flex-col group border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-lg transition duration-300 cursor-pointer focus:ring-2 focus:ring-green-600"
            onClick={() => handleProductClick(product)}
            aria-label={product.name}
        >
            <div className="h-40 sm:h-48 overflow-hidden bg-gray-100 flex justify-center items-center relative">
                {product?.img?.secure_url ? (
                    <>
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaSpinner className="animate-spin text-green-500 text-2xl" />
                            </div>
                        )}
                        {imageError && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                Image not available
                            </div>
                        )}
                        <img
                            src={product.img.secure_url}
                            alt={product.name}
                            className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105 transition duration-300`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    </>
                ) : (
                    <div className="text-gray-400">No Image</div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-grow">{product.description}</p>
                <p className="text-sm text-gray-600 mt-1">Stock: {product.quantity}</p>
                <div className="flex items-center gap-2 mt-2 mb-2">
                    {product.offerPercentage > 0 ? (
                        <>
                            <span className="text-green-700 font-bold text-lg">₹{discountedPrice}</span>
                            <span className="line-through text-sm text-gray-400">₹{product.price}</span>
                            <span className="text-sm text-red-600 font-semibold">({product.offerPercentage}% OFF)</span>
                        </>
                    ) : (
                        <span className="text-green-700 font-bold text-lg">₹{product.price}</span>
                    )}
                </div>
                {isLoggedIn &&
                    <button
                        type="button"
                        className={`w-full mt-auto py-2 rounded transition text-sm font-medium ${isOutOfStock
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        tabIndex={0}
                    >
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                }
            </div>
        </div>
    );
};

// --- Main Responsive Card Container ---
const ProductCard = ({ products, handleProductClick }) => {
    const MAX_SCROLL_CARDS = 7;
    const { isLoggedIn } = useSelector(state => state?.auth);

    // Sort by offer
    const sortedProducts = [...products].sort(
        (a, b) => (b.offerPercentage || 0) - (a.offerPercentage || 0)
    );

    const firstFew = sortedProducts.slice(0, MAX_SCROLL_CARDS);
    const remaining = sortedProducts.slice(MAX_SCROLL_CARDS);

    return (
        <>
            {/* --- Mobile: Horizontal Scroll for Top Offers --- */}
            <div className="block sm:hidden">
                <div className="flex gap-4 overflow-x-auto hide-scrollbar px-2 py-4">
                    {firstFew.map((product) =>
                        <div className="w-64 flex-shrink-0" key={product._id}>
                            <ProductCardItem
                                product={product}
                                handleProductClick={handleProductClick}
                                isLoggedIn={isLoggedIn}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 px-2 pb-4">
                    {remaining.map((product) =>
                        <ProductCardItem
                            key={product._id}
                            product={product}
                            handleProductClick={handleProductClick}
                            isLoggedIn={isLoggedIn}
                        />
                    )}
                </div>
            </div>
            {/* --- Desktop: Grid for all products --- */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 pb-6">
                {sortedProducts.map((product) =>
                    <ProductCardItem
                        key={product._id}
                        product={product}
                        handleProductClick={handleProductClick}
                        isLoggedIn={isLoggedIn}
                    />
                )}
            </div>
        </>
    );
};

export default ProductCard;
