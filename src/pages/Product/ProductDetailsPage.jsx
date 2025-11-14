import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../Layout/Layout';
import { getAllProduct } from '../../Redux/Slice/productSlice';
import { addToCart } from '../../Redux/Slice/cartSlice';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products, loading } = useSelector(state => state?.products);
    const { isLoggedIn } = useSelector(state => state?.auth);
    const product = products?.find(p => p._id === id);

    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(getAllProduct());
        }
    }, [dispatch, products]);

    const handleQuantityChange = (type) => {
        // Prevent action if product data isn't loaded yet
        if (!product) return;

        setQuantity(prev => {
            let newQuantity = prev;

            if (type === 'inc') {
                // Don't exceed available stock
                newQuantity = prev < product.quantity ? prev + 1 : prev;

                // Show notification if trying to exceed stock
                if (newQuantity === prev && prev < product.quantity) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Maximum quantity reached',
                        text: `You can't add more than ${product.quantity} items of this product.`,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            } else if (type === 'dec') {
                // Don't go below 1
                newQuantity = Math.max(1, prev - 1);
            }

            // Return the new quantity
            return newQuantity;
        });
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please login to add items to your cart.',
                confirmButtonText: 'Go to Login',
                showCancelButton: true,
                cancelButtonText: 'Continue Browsing'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        if (product.quantity === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Out of Stock',
                text: 'Sorry, this product is currently unavailable.',
            });
            return;
        }

        dispatch(addToCart({
            ...product,
            productId: product._id,
            quantity,
            price: product.offerPercentage > 0 ?
                Math.round(product.price - (product.price * product.offerPercentage) / 100) :
                product.price
        }));

    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-500" />);
            }
        }

        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-2 text-gray-600 text-sm">({rating.toFixed(1)})</span>
            </div>
        );
    };

    if (loading || !products) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
                    >
                        Browse Products
                    </button>
                </div>
            </Layout>
        );
    }

    const discountedPrice = product.offerPercentage > 0 ?
        Math.round(product.price - (product.price * product.offerPercentage) / 100) :
        product.price;

    // Sample product images (in a real app, this would come from your product data)
    const productImages = [
        product?.img?.secure_url || "https://via.placeholder.com/500x400",
        "https://via.placeholder.com/500x400/cccccc?text=Product+2",
        "https://via.placeholder.com/500x400/eeeeee?text=Product+3",
        "https://via.placeholder.com/500x400/f5f5f5?text=Product+4"
    ];

    return (
        <Layout>
            {/* Breadcrumb Navigation */}
            <div className="max-w-6xl mx-auto px-4 pt-6">
                <nav className="flex items-center text-sm text-gray-600 mb-4">
                    <span
                        className="hover:text-green-600 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        Home
                    </span>
                    <span className="mx-2">/</span>
                    <span
                        className="hover:text-green-600 cursor-pointer"
                        onClick={() => navigate('/products')}
                    >
                        Products
                    </span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-xs">
                        {product.name}
                    </span>
                </nav>
            </div>

            {/* Product Details */}
            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Thumbnails */}
                    <div className="hidden md:flex flex-col gap-2 w-20">
                        {productImages.map((img, index) => (
                            <div
                                key={index}
                                className={`border-2 rounded-md overflow-hidden cursor-pointer transition ${activeImageIndex === index ? 'border-green-500' : 'border-transparent'}`}
                                onClick={() => {
                                    setActiveImageIndex(index);
                                    setLoadingImage(true);
                                }}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-20 object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="relative bg-white p-4 rounded-lg shadow-md flex-1">
                        {loadingImage && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                            </div>
                        )}
                        <img
                            src={productImages[activeImageIndex]}
                            alt={product.name}
                            className={`w-full h-96 object-contain rounded ${loadingImage ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setLoadingImage(false)}
                            loading="eager"
                        />

                        {/* Image Navigation (mobile) */}
                        <div className="md:hidden flex justify-between mt-2">
                            <button
                                onClick={() => {
                                    setActiveImageIndex(prev => (prev - 1 + productImages.length) % productImages.length);
                                    setLoadingImage(true);
                                }}
                                className="p-2 bg-gray-100 rounded-full"
                            >
                                <FaChevronLeft />
                            </button>
                            <div className="flex items-center space-x-1">
                                {productImages.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`inline-block w-2 h-2 rounded-full ${activeImageIndex === index ? 'bg-green-600' : 'bg-gray-300'}`}
                                    ></span>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setActiveImageIndex(prev => (prev + 1) % productImages.length);
                                    setLoadingImage(true);
                                }}
                                className="p-2 bg-gray-100 rounded-full"
                            >
                                <FaChevronRight />
                            </button>
                        </div>

                        {/* Offer Badge */}
                        {product.offerPercentage > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {product.offerPercentage}% OFF
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        {renderStars(4.5)}
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer ml-2">
                            128 reviews
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        {product.offerPercentage > 0 ? (
                            <>
                                <span className="text-3xl font-bold text-green-700 mr-2">₹{discountedPrice}</span>
                                <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                                <span className="ml-2 text-sm text-red-500">Save ₹{product.price - discountedPrice}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-green-700">₹{product.price}</span>
                        )}
                    </div>

                    {/* Availability */}
                    <div className="mb-6">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.quantity > 0 ?
                                `In Stock (${product.quantity} available)` :
                                'Out of Stock'}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description || 'No description available for this product.'}
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Key Features */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Features</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>100% Organic and Pesticide-Free</li>
                            <li>Freshly Harvested from Local Farms</li>
                            <li>Rich in Nutrients and Vitamins</li>
                            <li>Eco-Friendly Packaging</li>
                            <li>Direct from Farm to Your Doorstep</li>
                        </ul>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <div className="flex items-center">
                            <button
                                onClick={() => handleQuantityChange('dec')}
                                className="border border-gray-300 rounded-l-md px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                disabled={quantity <= 1}
                            >
                                <IoIosArrowDown className={`${quantity <= 1 ? 'text-gray-400' : 'text-gray-700'}`} />
                            </button>
                            <div className="border-t border-b border-gray-300 px-4 py-2 bg-white text-center w-16">
                                {quantity}
                            </div>
                            <button
                                onClick={() => handleQuantityChange('inc')}
                                className="border border-gray-300 rounded-r-md px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                disabled={quantity >= product.quantity}
                            >
                                <IoIosArrowUp className={`${quantity >= product.quantity ? 'text-gray-400' : 'text-gray-700'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            className={`px-6 py-3 rounded-md font-medium transition ${product.quantity === 0 ?
                                'bg-gray-400 cursor-not-allowed' :
                                'bg-green-600 hover:bg-green-700 text-white'}`}
                        >
                            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button className="px-6 py-3 border border-green-600 text-green-600 rounded-md font-medium hover:bg-green-50 transition">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button className="py-4 px-1 border-b-2 font-medium text-sm border-green-500 text-green-600">
                            Description
                        </button>
                        <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                            Specifications
                        </button>
                        <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                            Reviews (128)
                        </button>
                    </nav>
                </div>
                <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                        {product.description || 'No detailed description available.'}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                    </p>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600"><span className="font-medium">Category:</span> {product.category || 'Organic Vegetables'}</p>
                            <p className="text-gray-600"><span className="font-medium">Weight:</span> 500g</p>
                        </div>
                        <div>
                            <p className="text-gray-600"><span className="font-medium">Farm Location:</span> Maharashtra, India</p>
                            <p className="text-gray-600"><span className="font-medium">Harvest Date:</span> Within last 3 days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            <div className="max-w-6xl mx-auto px-4 py-12 bg-gray-50 rounded-lg mb-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                        View All Products →
                    </button>
                </div>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    modules={[Autoplay, Navigation]}
                    className="relative"
                >
                    {products
                        .filter(p => p._id !== product._id)
                        .slice(0, 8) // Limit to 8 recommended products
                        .map((item) => (
                            <SwiperSlide key={item._id}>
                                <div
                                    className="border rounded-xl shadow-sm hover:shadow-md transition p-4 bg-white cursor-pointer h-full flex flex-col"
                                    onClick={() => {
                                        navigate(`/product/${item._id}`);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    <div className="relative pb-[75%] mb-4">
                                        <img
                                            src={item?.img?.secure_url || "https://via.placeholder.com/300x200"}
                                            alt={item.name}
                                            className="absolute top-0 left-0 w-full h-full object-cover rounded"
                                            loading="lazy"
                                        />
                                        {item.offerPercentage > 0 && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {item.offerPercentage}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2 flex-grow">{item.description}</p>
                                    <div className="mt-auto">
                                        {item.offerPercentage > 0 ? (
                                            <div>
                                                <span className="text-green-600 font-bold">₹{Math.round(item.price - (item.price * item.offerPercentage) / 100)}</span>
                                                <span className="text-gray-500 text-sm line-through ml-2">₹{item.price}</span>
                                            </div>
                                        ) : (
                                            <span className="text-green-600 font-bold">₹{item.price}</span>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}

                    <div className="swiper-button-next bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"></div>
                    <div className="swiper-button-prev bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"></div>
                </Swiper>
            </div>
        </Layout>
    );
}

export default ProductDetailsPage;