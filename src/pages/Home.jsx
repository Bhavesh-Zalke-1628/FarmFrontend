import { useEffect } from 'react';
import Layout from '../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../Redux/Slice/productSlice';
import { Link } from 'react-router-dom';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.products);
    const { isLoggedIn } = useSelector((state) => state.auth);

    console.log(isLoggedIn)
    console.log(error)

    useEffect(() => {
        if (isLoggedIn) {

            dispatch(getAllProduct());
        }
    }, [dispatch]);

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

    return (
        <Layout>
            {/* Hero Section for All Users */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Our Marketplace</h1>
                    <p className="text-xl max-w-2xl mx-auto mb-8">
                        Discover fresh, locally grown products from farmers near you
                    </p>
                    {!isLoggedIn && (
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="px-6 py-3 bg-white text-green-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-green-700 transition-colors"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Products Section */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3">
                    {products?.length > 0 ? (
                        products.slice(0, 8).map((product) => (
                            <div
                                key={product._id}
                                className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer bg-white"
                                onClick={() => handleProductClick(product._id)}
                            >
                                <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-100">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="font-bold text-green-700 text-lg">Rs. {product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 text-sm line-through">
                                                Rs.{product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        className="w-full py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLoggedIn) {
                                                navigate('/login');
                                            } else {
                                                // Add to cart logic here
                                            }
                                        }}
                                    >
                                        {isLoggedIn ? 'Add to Cart' : 'Login to Purchase'}
                                    </button>
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
                            className="inline-block px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                )}
            </div>

            {/* Farmer Benefits Section */}
            {!isLoggedIn && (
                <div className="bg-gray-50 py-12 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Are you a farmer?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <h3 className="font-medium text-lg mb-2">Reach More Customers</h3>
                                <p className="text-gray-600">Connect with buyers across the region</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="font-medium text-lg mb-2">Fair Pricing</h3>
                                <p className="text-gray-600">Set your own prices and keep more of your profits</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                                    </svg>
                                </div>
                                <h3 className="font-medium text-lg mb-2">Easy Management</h3>
                                <p className="text-gray-600">Simple tools to manage your products and orders</p>
                            </div>
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                to="/farmer-register"
                                className="inline-block px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors"
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