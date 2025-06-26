import React, { useEffect, useState } from 'react';
import Layout from "../Layout/Layout";
import { Tractor, Sun, CloudRain, Droplet } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../Redux/Slice/productSlice';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(8); // default: desktop

    const { products } = useSelector(state => state?.products);
    const { isLoggedIn } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAllProduct());

        const handleResize = () => {
            setVisibleCount(window.innerWidth < 640 ? 4 : 8); // sm breakpoint (Tailwind)
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);

    // Shuffle and get visibleCount products
    const getRandomProducts = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const randomProducts = getRandomProducts(products, visibleCount);

    const weatherData = [
        { day: "Today", icon: <Sun className="text-yellow-500" />, temp: "28°C", condition: "Sunny" },
        { day: "Tomorrow", icon: <CloudRain className="text-blue-500" />, temp: "24°C", condition: "Light Rain" },
        { day: "Wed", icon: <Sun className="text-yellow-500" />, temp: "26°C", condition: "Partly Cloudy" }
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-400 text-white py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Welcome to <span className="text-yellow-200">GreenFields</span> Farm
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Fresh, organic, and sustainable produce directly from our farm to your doorstep.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate("/products")} className="bg-white text-green-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
                            Explore Products
                        </button>
                        <button className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition">
                            Farming Tips
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Products */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Our Premium Products
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {randomProducts.map((product, idx) => {
                            const discountedPrice = Math.round(
                                product.price - (product.price * product.offerPercentage) / 100
                            );

                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="border rounded-xl shadow hover:shadow-lg transition bg-gray-50 p-4 flex flex-col justify-between"
                                >
                                    <img
                                        src={product?.img?.secure_url || "https://via.placeholder.com/400x300"}
                                        alt={product.name}
                                        className="w-full h-40 object-cover rounded-md mb-4"
                                    />

                                    <h3 className="text-xl font-semibold text-green-700 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>

                                    {/* Price Section */}
                                    {product.offerPercentage > 0 ? (
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-500 line-through">₹{product.price}</div>
                                            <div className="text-lg font-bold text-green-600">
                                                ₹{discountedPrice}
                                                <span className="text-sm text-red-500 ml-2">({product.offerPercentage}% OFF)</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-lg font-bold text-green-600 mb-4">₹{product.price}</div>
                                    )}

                                    <button
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                    >
                                        {isLoggedIn ? 'Add to Cart' : 'View Details'}
                                    </button>
                                </motion.div>
                            );
                        })}

                    </div>

                    {/* View All Products Button */}
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => navigate("/products")}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-green-600 text-green-700 font-semibold rounded-md hover:bg-green-50 transition duration-200"
                        >
                            View All Products
                            <span className="text-green-600 text-xl">→</span>
                        </button>
                    </div>

                </div>
            </section>

            {/* Weather + Tips */}
            <section className="bg-green-50 py-16">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white shadow rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                            <Tractor className="text-green-600" /> Weather Forecast
                        </h3>
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            autoplay={{ delay: 3000 }}
                            pagination={{ clickable: true }}
                            modules={[Autoplay, Pagination]}
                        >
                            {weatherData.map((day, i) => (
                                <SwiperSlide key={i}>
                                    <div className="text-center py-6">
                                        <p className="text-lg font-medium">{day.day}</p>
                                        <div className="my-4 text-4xl">{day.icon}</div>
                                        <p className="text-2xl font-bold">{day.temp}</p>
                                        <p className="text-sm text-gray-500">{day.condition}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="bg-white shadow rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                            <Droplet className="text-blue-600" /> Farming Tips
                        </h3>
                        <ul className="space-y-3 text-gray-700 text-sm">
                            {[
                                "Water in the early morning for better absorption.",
                                "Soil moisture is 78% – adjust watering frequency.",
                                "Use drip irrigation to save water.",
                                "Watch forecasts to plan your watering.",
                                "Crop rotation boosts soil fertility.",
                                "Compost helps improve yield naturally."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-green-700 to-green-600 text-white text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready for Fresh, Organic Goodness?
                    </h2>
                    <p className="mb-8 text-lg">
                        Contact us today or explore our product range!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate("/products")} className="bg-white text-green-700 px-6 py-3 rounded font-bold hover:bg-gray-100 transition">
                            Shop Now
                        </button>
                        <button className="border border-white text-white px-6 py-3 rounded font-bold hover:bg-white/10 transition">
                            Contact Us
                        </button>
                    </div>
                </motion.div>
            </section>
        </Layout>
    );
}

export default Home;
