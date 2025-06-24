import React from "react";

const ProductCard = ({ products, handleAddToCart, handleProductClick }) => {
    // Sort products: offer products first
    const sortedProducts = [...products].sort((a, b) => (b.offerPercentage || 0) - (a.offerPercentage || 0));
    console.log(products)
    const renderCard = (product) => {
        const discountedPrice = Math.round(
            product.price - (product.price * product.offerPercentage) / 100
        );

        return (
            <div
                key={product._id}
                className="min-w-[240px] sm:min-w-0 border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300 bg-white cursor-pointer"
                onClick={() => handleProductClick(product)}
            >
                <div className="h-48 overflow-hidden bg-gray-100 flex justify-center items-center">
                    {product?.img ? (
                        <img
                            src={product?.img?.secure_url}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                    ) : (
                        <div className="text-gray-400">No Image</div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    <h3 className="text-sm text-gray-600 mt-1">Stock: {product?.quantity}</h3>

                    <div className="flex items-center gap-2 mt-3">
                        {product.offerPercentage > 0 ? (
                            <>
                                <span className="text-green-700 font-bold text-lg">
                                    ₹{discountedPrice}
                                </span>
                                <span className="line-through text-sm text-gray-400">
                                    ₹{product.price}
                                </span>
                                <span className="text-sm text-red-600 font-semibold">
                                    ({product.offerPercentage}% OFF)
                                </span>
                            </>
                        ) : (
                            <span className="text-green-700 font-bold text-lg">
                                ₹{product.price}
                            </span>
                        )}
                    </div>

                    <button
                        className={`w-full mt-4 py-2 rounded transition ${product.outOfStock
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e, product);
                        }}
                        disabled={product.stock === 0}
                    >
                        {product.outOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
        );
    };

    const firstSeven = sortedProducts.slice(0, 7);
    const remaining = sortedProducts.slice(7);

    return (
        <>
            {/* Mobile Horizontal Scroll (first 7) */}
            <div className="sm:hidden overflow-x-auto px-2 py-4 hide-scrollbar">
                <div className="flex gap-4">{firstSeven.map(renderCard)}</div>
            </div>

            {/* Mobile Vertical Remaining */}
            <div className="sm:hidden flex flex-col gap-4 px-2 pb-4">
                {remaining.map(renderCard)}
            </div>

            {/* Desktop Grid (all products) */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 pb-6">
                {sortedProducts.map(renderCard)}
            </div>
        </>
    );
};

export default ProductCard;
