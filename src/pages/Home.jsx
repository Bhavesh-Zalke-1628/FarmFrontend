import { useEffect } from 'react';
import Layout from '../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getAllProduct } from '../Redux/Slice/productSlice';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaSearch } from "react-icons/fa";
import { dangerColors } from '../Component/Constant';


function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.products);
    const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
        // if (isLoggedIn) {
        dispatch(getAllProduct());
        // }
    }, [dispatch, isLoggedIn]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                    <div className="w-10 h-10 border-4 border-t-4 border-t-green-700 border-gray-200 rounded-full animate-spin mb-5"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
                    <p className="text-red-500 mb-4">Error loading products. Please try again later.</p>
                    <button
                        onClick={() => dispatch(getAllProduct())}
                        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </Layout>
        );
    }

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} />);
        if (hasHalf) stars.push(<FaStarHalfAlt key="half" />);
        for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} />);

        return stars;
    };

    const randomColorClass = dangerColors[Math.floor(Math.random() * dangerColors.length)];


    return (
        <Layout>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Our Marketplace</h1>
                    <p className="text-xl max-w-2xl mx-auto mb-8">
                        Discover fresh, locally grown products from farmers near you
                    </p>
                    {!isLoggedIn && (
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="px-6 py-3 bg-white text-green-700 font-medium rounded-lg hover:bg-gray-100"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-green-700"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Products */}
            <div className="p-5 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Featured Products</h1>
                    {isLoggedIn && (
                        <Link
                            to="/products"
                            className="text-green-700 hover:text-green-800 font-medium"
                        >
                            View All Products →
                        </Link>
                    )}
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-6">
                    {products?.length > 0 ? (
                        products.slice(0, 8).map((product) => (
                            <div
                                key={product._id}
                                className="relative border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white transition-transform hover:-translate-y-2 hover:shadow-lg group cursor-pointer"
                                onClick={() => handleProductClick(product._id)}
                            >
                                {/* Wishlist Icon */}
                                <div className="absolute top-3 right-3 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // toggleWishlist(product._id); // Implement as needed
                                        }}
                                        className="text-red-500 text-xl hover:scale-110 transition"
                                    >
                                        {/* Replace with condition for liked/unliked */}
                                        <FaRegHeart />
                                        {/* <FaHeart /> if already in wishlist */}
                                    </button>
                                </div>

                                {/* Product Image */}
                                <div className="relative h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {product?.img ? (
                                        <img
                                            src={product?.img?.secure_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 text-sm">
                                            No Image
                                        </div>
                                    )}

                                    {/* Out of Stock Badge */}
                                    {product.outOfStock && (
                                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                                            Out of Stock
                                        </span>
                                    )}

                                    {/* Low Stock Badge */}
                                    {!product.outOfStock && product.quantity < 10 && (
                                        <span
                                            className={`absolute top-3 left-3 ${randomColorClass} text-center text-white text-xs px-3 py-2 font-semibold rounded-full shadow-md animate-bounce`}
                                        >
                                            Low Stock
                                        </span>
                                    )}


                                    {/* Quick View Button (hover only) */}
                                    <button
                                        className="absolute bottom-3 right-3 bg-white text-gray-700 text-sm px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // handleQuickView(product._id);
                                        }}
                                    >
                                        <FaSearch className="inline-block mr-1" /> Quick View
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4 flex flex-col justify-between h-52">

                                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                                    {/* <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p> */}
                                    
                                    {/* Price */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 font-bold text-lg">₹{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 line-through text-sm">
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div className="text-sm">
                                        Quantity:{" "}
                                        <span
                                            className={`font-semibold ${product.quantity < 10 ? "text-red-600" : "text-gray-700"
                                                }`}
                                        >
                                            {product.quantity} {product.quantity < 10 && "🧯"}
                                        </span>
                                    </div>

                                    {/* Rating (static or from product.rating) */}
                                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                        {renderStars(product.rating || 4.5)}
                                        <span className="text-gray-500 text-xs ml-1">({product.rating || "4.5"})</span>
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex items-center justify-center min-h-[200px]">
                            <p className="text-gray-500">No products available at the moment.</p>
                        </div>
                    )}
                </div>


                {/* Call-to-Action for Non-Logged-In Users */}
                {!isLoggedIn && (
                    <div className="mt-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Want to see more products?</h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Create an account to browse our full catalog and connect directly with farmers.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                )}
            </div>

            {/* Farmer Benefits Section */}
            {!isLoggedIn && (
                <div className="bg-gray-50 py-12 mt-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Are you a farmer?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Reach More Customers',
                                    icon: (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    ),
                                    text: 'Connect with buyers across the region'
                                },
                                {
                                    title: 'Fair Pricing',
                                    icon: (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    ),
                                    text: 'Set your own prices and keep more of your profits'
                                },
                                {
                                    title: 'Easy Management',
                                    icon: (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    ),
                                    text: 'Simple tools to manage your products and orders'
                                }
                            ].map((benefit, i) => (
                                <div key={i} className="bg-white p-6 rounded-lg shadow-sm text-center">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {benefit.icon}
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-gray-600">{benefit.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                to="/farmer-register"
                                className="inline-block px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800"
                            >
                                Register as a Farmer
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Home;
