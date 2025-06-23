import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaSearch } from "react-icons/fa";

import {
    Sun, CloudRain, Cloud, Thermometer, Leaf, Tractor, Sprout,
    Droplet, LineChart, BookOpen, CalendarDays, ShieldCheck,
    AlertTriangle, Droplets, CloudSun, CloudLightning, Wind,
    Smartphone, Database, HardDrive, BarChart2, Clipboard, Settings,
    ShoppingCart, User, LogOut, Package, Home, Users, AlertCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../Redux/Slice/productSlice';
import { logoutAccount } from '../Redux/Slice/authSlice';
import Swal from 'sweetalert2';
import AiAgriAssistant from '../Component/AiAgriAssistant';

// Color theme constants
const COLORS = {
    primary: '#2E7D32',       // Deep green
    secondary: '#689F38',     // Medium green
    accent: '#FF8F00',        // Orange for highlights
    background: '#F5F5F5',    // Light gray background
    card: '#FFFFFF',          // White cards
    text: '#263238',          // Dark gray text
    lightText: '#757575',     // Secondary text
    alert: '#D32F2F',         // Red for alerts
    success: '#388E3C',       // Green for success
    warning: '#F57C00',       // Orange for warnings
};

// Lazy-load react-apexcharts
const DynamicChart = lazy(() => import('react-apexcharts'));

const MaharashtraFarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [language, setLanguage] = useState('mr');
    const [showMarketplace, setShowMarketplace] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [weatherRef, weatherInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [marketRef, marketInView] = useInView({ threshold: 0.1, triggerOnce: true });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.products);
    const { isLoggedIn, data: user, role } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getAllProduct());
    }, [dispatch]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Determine user type
    const userType = role || 'guest'; // 'farmer', 'buyer', or 'guest'
    console.log(role)
    console.log(userType)
    // Mock data - replace with actual API calls
    const weatherData = [
        { day: 'सोम', condition: 'Sunny', temp: '32°C', rain: '10%', region: 'नाशिक' },
        { day: 'मंगळ', condition: 'Cloudy', temp: '30°C', rain: '30%', region: 'पुणे' },
        { day: 'बुध', condition: 'Rainy', temp: '28°C', rain: '80%', region: 'कोकण' },
        { day: 'गुरु', condition: 'Sunny', temp: '34°C', rain: '5%', region: 'मराठवाडा' },
        { day: 'शुक्र', condition: 'Sunny', temp: '36°C', rain: '0%', region: 'विदर्भ' },
    ];

    const cropPrices = [
        { crop: 'सोयाबीन', price: 5200, change: '+8%', trend: 'up', market: 'लातूर' },
        { crop: 'कापूस', price: 6800, change: '+3%', trend: 'up', market: 'यवतमाळ' },
        { crop: 'हरभरा', price: 7500, change: '-2%', trend: 'down', market: 'अकोला' },
    ];

    const marketTrends = {
        options: {
            chart: {
                type: 'area',
                height: 350,
                zoom: { enabled: false },
                toolbar: { show: false },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800
                }
            },
            colors: [COLORS.primary],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3
                }
            },
            xaxis: {
                categories: ['जाने', 'फेब्रु', 'मार्च', 'एप्रिल', 'मे', 'जून'],
                labels: {
                    style: {
                        colors: COLORS.text
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: COLORS.text
                    }
                }
            },
            tooltip: {
                enabled: true,
                theme: 'light',
                x: { show: false }
            },
        },
        series: [{ name: 'सोयाबीन भाव (₹/क्विंटल)', data: [5200, 5400, 5800, 5600, 5900, 6200] }],
    };

    const dangerColors = [
        "bg-red-600",
        "bg-yellow-600",
        "bg-orange-600",
        "bg-amber-600"
    ];

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
        });

        if (result.isConfirmed) {
            const res = await dispatch(logoutAccount());
            if (res?.payload?.success) {
                navigate('/login');
            }
        }
    };

    const getWeatherIcon = (cond) => ({
        Sunny: <Sun className="text-yellow-500" size={20} />,
        Rainy: <CloudRain className="text-blue-500" size={20} />,
        Cloudy: <Cloud className="text-gray-500" size={20} />,
        Thunder: <CloudLightning className="text-purple-500" size={20} />,
        Windy: <Wind className="text-gray-600" size={20} />,
    }[cond] || <Sun size={20} />);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="inline-block" />);
        if (hasHalf) stars.push(<FaStarHalfAlt key="half" className="inline-block" />);
        for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} className="inline-block" />);

        return stars;
    };

    const randomColorClass = dangerColors[Math.floor(Math.random() * dangerColors.length)];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen" style={{ backgroundColor: COLORS.primary }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                    <Tractor size={48} className="text-white" />
                </motion.div>
            </div>
        );
    }

    // Navigation items based on user type
    const getNavItems = () => {
        const baseItems = [
            { icon: <Smartphone size={20} />, label: language === 'mr' ? 'डॅशबोर्ड' : 'Dashboard', value: 'dashboard' },
            { icon: <Database size={20} />, label: language === 'mr' ? 'बाजार' : 'Market', value: 'market' },
        ];

        if (userType === 'farmer') {
            baseItems.push(
                { icon: <Package size={20} />, label: language === 'mr' ? 'माझी उत्पादने' : 'My Products', value: 'my-products' },
                { icon: <Users size={20} />, label: language === 'mr' ? 'खरेदीदार' : 'Buyers', value: 'buyers' }
            );
        } else if (userType === 'buyer') {
            baseItems.push(
                { icon: <ShoppingCart size={20} />, label: language === 'mr' ? 'ऑर्डर' : 'Orders', value: 'orders' },
                { icon: <Users size={20} />, label: language === 'mr' ? 'शेतकरी' : 'Farmers', value: 'farmers' }
            );
        }

        baseItems.push(
            { icon: <Clipboard size={20} />, label: language === 'mr' ? 'सल्ला' : 'Advice', value: 'advice' }
        );

        return baseItems;
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Header with new color theme */}
            <motion.header
                ref={headerRef}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : -50 }}
                transition={{ duration: 0.8 }}
                className="sticky top-0 z-50 shadow-lg"
                style={{ backgroundColor: COLORS.primary }}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center cursor-pointer space-x-2"
                        >
                            <Tractor size={24} className="text-white" />
                            <h1 className="text-xl font-bold text-white">
                                {language === 'mr' ? 'माय मराठी' : 'माय Marathi'}
                            </h1>
                        </motion.div>

                        {/* Marketplace Toggle Button */}
                        {userType !== 'farmer' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowMarketplace(!showMarketplace)}
                                className="hidden md:flex items-center gap-1 px-3 py-1 rounded-md text-white"
                                style={{ backgroundColor: COLORS.accent }}
                            >
                                <ShoppingCart size={18} />
                                <span>{showMarketplace ? 'Dashboard' : 'Marketplace'}</span>
                            </motion.button>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLanguage((lang) => (lang === 'mr' ? 'en' : 'mr'))}
                            className="px-3 py-1 text-sm rounded-md text-white"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            {language === 'mr' ? 'English' : 'मराठी'}
                        </motion.button>

                        {/* User Menu */}
                        <div className="relative ">
                            <div
                                className='flex gap-2 items-center cursor-pointer'
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-1 rounded-full"
                                    style={{ backgroundColor: COLORS.secondary }}
                                >
                                    <User size={20} className="text-white" />

                                </motion.button>
                                <p className=' capitalize text-white font-semibold'>{user && user?.fullName}</p>
                            </div>

                            {isLoggedIn && userMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                >
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    {userType === 'farmer' && (
                                        <Link
                                            to="/my-products"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Products
                                        </Link>
                                    )}
                                    {userType === 'buyer' && (
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Orders
                                        </Link>
                                    )}
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    <Link
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </Link>
                                </motion.div>
                            )}

                            {!isLoggedIn && userMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                >
                                    <Link
                                        to="/signup"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Register
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Login
                                    </Link>
                                </motion.div>
                            )}

                            {console.log(user)}
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-4">
                {userType !== 'farmer' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMarketplace(!showMarketplace)}
                        className="w-full py-2 rounded-lg text-white flex items-center justify-center gap-2"
                        style={{ backgroundColor: COLORS.accent }}
                    >
                        <ShoppingCart size={18} />
                        {showMarketplace ? 'Show Dashboard' : 'Show Marketplace'}
                    </motion.button>
                )}
            </div>

            <main className="container mx-auto px-4 py-6 pb-24">
                {/* Conditionally render content based on user type and state */}
                {userType === 'farmer' ? (
                    <FarmerDashboard
                        weatherRef={weatherRef}
                        weatherInView={weatherInView}
                        weatherData={weatherData}
                        getWeatherIcon={getWeatherIcon}
                        language={language}
                        marketRef={marketRef}
                        marketInView={marketInView}
                        cropPrices={cropPrices}
                        marketTrends={marketTrends}
                        COLORS={COLORS}
                        user={user}
                    />
                ) : showMarketplace ? (
                    <MarketplaceSection
                        products={products}
                        renderStars={renderStars}
                        randomColorClass={randomColorClass}
                        language={language}
                        userType={userType}
                    />
                ) : (
                    <DashboardSection
                        weatherRef={weatherRef}
                        weatherInView={weatherInView}
                        weatherData={weatherData}
                        getWeatherIcon={getWeatherIcon}
                        language={language}
                        marketRef={marketRef}
                        marketInView={marketInView}
                        cropPrices={cropPrices}
                        marketTrends={marketTrends}
                        COLORS={COLORS}
                        userType={userType}
                    />
                )}
            </main>

            {/* Bottom Navigation */}
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="fixed bottom-0 left-0 right-0 border-t py-2 px-4 shadow-lg z-40"
                style={{ backgroundColor: COLORS.primary }}
            >
                <div className="flex justify-around max-w-md mx-auto">
                    {getNavItems().map((item) => (
                        <motion.button
                            key={item.value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setActiveTab(item.value);
                                if (item.value === 'market') {
                                    setShowMarketplace(true);
                                } else {
                                    setShowMarketplace(false);
                                }
                                // Handle navigation for other tabs
                                if (item.value === 'my-products') {
                                    navigate('/my-products');
                                } else if (item.value === 'orders') {
                                    navigate('/orders');
                                }
                            }}
                            className="p-2 flex flex-col items-center transition-all"
                        >
                            <div className={activeTab === item.value ? 'text-white' : 'text-gray-300'}>
                                {item.icon}
                            </div>
                            <span
                                className="text-xs mt-1"
                                style={{ color: activeTab === item.value ? 'white' : '#E0E0E0' }}
                            >
                                {item.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </motion.nav>
        </div>
    );
};

// Farmer Dashboard Component
const FarmerDashboard = ({
    weatherRef,
    weatherInView,
    weatherData,
    getWeatherIcon,
    language,
    marketRef,
    marketInView,
    cropPrices,
    marketTrends,
    COLORS,
    user
}) => {
    return (
        <div>
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg shadow-md"
                style={{ backgroundColor: COLORS.secondary }}
            >
                <h1 className="text-xl font-bold text-white">
                    {language === 'mr' ? `नमस्कार, ${user?.name || 'शेतकरी'}!` : `Welcome, ${user?.name || 'Farmer'}!`}
                </h1>
                <p className="text-white text-sm">
                    {language === 'mr' ? 'तुमच्या शेतीच्या वाढीसाठी आमच्या साधनांचा वापर करा' : 'Use our tools to grow your farming business'}
                </p>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={<Package size={20} />}
                    value="5"
                    label={language === 'mr' ? 'सक्रिय उत्पादने' : 'Active Products'}
                    color={COLORS.primary}
                />
                <StatCard
                    icon={<ShoppingCart size={20} />}
                    value="12"
                    label={language === 'mr' ? 'एकूण ऑर्डर' : 'Total Orders'}
                    color={COLORS.accent}
                />
                <StatCard
                    icon={<Users size={20} />}
                    value="8"
                    label={language === 'mr' ? 'नियमित ग्राहक' : 'Regular Buyers'}
                    color={COLORS.success}
                />
            </div>

            {/* Weather and Market Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Weather Card */}
                <motion.div
                    ref={weatherRef}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: weatherInView ? 1 : 0, x: weatherInView ? 0 : -50 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{ backgroundColor: COLORS.card }}
                >
                    <div className="p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <CloudSun size={20} /> {language === 'mr' ? 'महाराष्ट्र हवामान' : 'Maharashtra Weather'}
                        </h2>
                        <Swiper
                            effect="cards"
                            grabCursor
                            modules={[EffectCards, Autoplay]}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            className="weather-swiper"
                        >
                            {weatherData.map((day, idx) => (
                                <SwiperSlide
                                    key={idx}
                                    className="rounded-lg p-4"
                                    style={{ backgroundColor: '#E8F5E9' }}
                                >
                                    <div className="text-center">
                                        <p className="text-sm font-medium" style={{ color: COLORS.text }}>{day.day}</p>
                                        <p className="text-xs" style={{ color: COLORS.lightText }}>{day.region}</p>
                                        <div className="my-3">{getWeatherIcon(day.condition)}</div>
                                        <p className="text-lg font-bold" style={{ color: COLORS.text }}>{day.temp}</p>
                                        <p className="text-xs capitalize" style={{ color: COLORS.lightText }}>{day.condition}</p>
                                        <p
                                            className="text-xs mt-2 rounded-full py-1 px-2 inline-block"
                                            style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}
                                        >
                                            {language === 'mr' ? 'पाऊस:' : 'Rain:'} {day.rain}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </motion.div>

                {/* Market Prices Card */}
                <motion.div
                    ref={marketRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: marketInView ? 1 : 0, y: marketInView ? 0 : 50 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{ backgroundColor: COLORS.card }}
                >
                    <div className="p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <BarChart2 size={20} /> {language === 'mr' ? 'मंडी भाव' : 'Market Prices'}
                        </h2>
                        <div className="space-y-3">
                            {cropPrices.map((crop, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex justify-between items-center pb-2 border-b"
                                    style={{ borderColor: '#E0E0E0' }}
                                >
                                    <div>
                                        <span className="font-medium" style={{ color: COLORS.text }}>{crop.crop}</span>
                                        <p className="text-xs" style={{ color: COLORS.lightText }}>{crop.market}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold" style={{ color: COLORS.text }}>₹{crop.price}</span>
                                        <span
                                            className="text-sm px-2 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: crop.trend === 'up' ? '#C8E6C9' : '#FFCDD2',
                                                color: crop.trend === 'up' ? COLORS.success : COLORS.alert
                                            }}
                                        >
                                            {crop.change}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
                <h2 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
                    {language === 'mr' ? 'द्रुत क्रिया' : 'Quick Actions'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ActionButton
                        icon={<Package size={20} />}
                        label={language === 'mr' ? 'नवीन उत्पादन जोडा' : 'Add New Product'}
                        onClick={() => { }}
                        color={COLORS.primary}
                    />
                    <ActionButton
                        icon={<ShoppingCart size={20} />}
                        label={language === 'mr' ? 'ऑर्डर पहा' : 'View Orders'}
                        onClick={() => { }}
                        color={COLORS.accent}
                    />
                    <ActionButton
                        icon={<LineChart size={20} />}
                        label={language === 'mr' ? 'नफा विश्लेषण' : 'Profit Analysis'}
                        onClick={() => { }}
                        color={COLORS.success}
                    />
                    <ActionButton
                        icon={<Users size={20} />}
                        label={language === 'mr' ? 'ग्राहक व्यवस्थापन' : 'Customer Management'}
                        onClick={() => { }}
                        color={COLORS.secondary}
                    />
                </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-xl shadow-lg overflow-hidden mb-6" style={{ backgroundColor: COLORS.card }}>
                <div className="p-6">
                    <h2 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
                        {language === 'mr' ? 'अलीकडील ऑर्डर' : 'Recent Orders'}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr style={{ borderBottomColor: '#E0E0E0' }}>
                                    <th className="text-left py-2 px-4">{language === 'mr' ? 'ऑर्डर आयडी' : 'Order ID'}</th>
                                    <th className="text-left py-2 px-4">{language === 'mr' ? 'उत्पादन' : 'Product'}</th>
                                    <th className="text-left py-2 px-4">{language === 'mr' ? 'ग्राहक' : 'Customer'}</th>
                                    <th className="text-left py-2 px-4">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                                    <th className="text-left py-2 px-4">{language === 'mr' ? 'किंमत' : 'Price'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3].map((order) => (
                                    <tr key={order} style={{ borderBottomColor: '#E0E0E0' }}>
                                        <td className="py-2 px-4">#ORD{100 + order}</td>
                                        <td className="py-2 px-4">{language === 'mr' ? 'सोयाबीन' : 'Soybean'}</td>
                                        <td className="py-2 px-4">Customer {order}</td>
                                        <td className="py-2 px-4">
                                            <span className="px-2 py-1 rounded-full text-xs"
                                                style={{ backgroundColor: '#C8E6C9', color: COLORS.success }}>
                                                {language === 'mr' ? 'पूर्ण' : 'Completed'}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">₹{5200 + (order * 200)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, value, label, color }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-4 rounded-lg shadow-sm flex items-center gap-4"
            style={{ backgroundColor: '#FFFFFF' }}
        >
            <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
                {React.cloneElement(icon, { color: color })}
            </div>
            <div>
                <p className="text-2xl font-bold" style={{ color: color }}>{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
            </div>
        </motion.div>
    );
};

// Action Button Component
const ActionButton = ({ icon, label, onClick, color }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="p-4 rounded-lg shadow-sm flex flex-col items-center gap-2"
            style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
        >
            {React.cloneElement(icon, { color: color })}
            <span className="text-sm font-medium" style={{ color: color }}>{label}</span>
        </motion.button>
    );
};

// Dashboard Section Component (for buyers/guests)
const DashboardSection = ({
    weatherRef,
    weatherInView,
    weatherData,
    getWeatherIcon,
    language,
    marketRef,
    marketInView,
    cropPrices,
    marketTrends,
    COLORS,
    userType
}) => {
    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                >
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="p-3 rounded-lg flex items-start gap-3"
                        style={{ backgroundColor: COLORS.warning, color: 'white' }}
                    >
                        <AlertTriangle size={18} className="mt-0.5" />
                        <p className="text-sm">
                            {language === 'mr' ? 'पुढील २ दिवसात पाऊस पडण्याची शक्यता - पिकांचे संरक्षण करा' : 'Rain expected next 2 days – protect your crops.'}
                        </p>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Weather Card */}
                <motion.div
                    ref={weatherRef}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: weatherInView ? 1 : 0, x: weatherInView ? 0 : -50 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{ backgroundColor: COLORS.card }}
                >
                    <div className="p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <CloudSun size={20} /> {language === 'mr' ? 'महाराष्ट्र हवामान' : 'Maharashtra Weather'}
                        </h2>
                        <Swiper
                            effect="cards"
                            grabCursor
                            modules={[EffectCards, Autoplay]}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            className="weather-swiper"
                        >
                            {weatherData.map((day, idx) => (
                                <SwiperSlide
                                    key={idx}
                                    className="rounded-lg p-4"
                                    style={{ backgroundColor: '#E8F5E9' }}
                                >
                                    <div className="text-center">
                                        <p className="text-sm font-medium" style={{ color: COLORS.text }}>{day.day}</p>
                                        <p className="text-xs" style={{ color: COLORS.lightText }}>{day.region}</p>
                                        <div className="my-3">{getWeatherIcon(day.condition)}</div>
                                        <p className="text-lg font-bold" style={{ color: COLORS.text }}>{day.temp}</p>
                                        <p className="text-xs capitalize" style={{ color: COLORS.lightText }}>{day.condition}</p>
                                        <p
                                            className="text-xs mt-2 rounded-full py-1 px-2 inline-block"
                                            style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}
                                        >
                                            {language === 'mr' ? 'पाऊस:' : 'Rain:'} {day.rain}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </motion.div>

                {/* Market Prices Card */}
                <motion.div
                    ref={marketRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: marketInView ? 1 : 0, y: marketInView ? 0 : 50 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{ backgroundColor: COLORS.card }}
                >
                    <div className="p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <BarChart2 size={20} /> {language === 'mr' ? 'मंडी भाव' : 'Market Prices'}
                        </h2>
                        <div className="space-y-3">
                            {cropPrices.map((crop, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex justify-between items-center pb-2 border-b"
                                    style={{ borderColor: '#E0E0E0' }}
                                >
                                    <div>
                                        <span className="font-medium" style={{ color: COLORS.text }}>{crop.crop}</span>
                                        <p className="text-xs" style={{ color: COLORS.lightText }}>{crop.market}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold" style={{ color: COLORS.text }}>₹{crop.price}</span>
                                        <span
                                            className="text-sm px-2 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: crop.trend === 'up' ? '#C8E6C9' : '#FFCDD2',
                                                color: crop.trend === 'up' ? COLORS.success : COLORS.alert
                                            }}
                                        >
                                            {crop.change}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 w-full py-2 text-white rounded-lg text-sm font-medium transition"
                            style={{ backgroundColor: COLORS.accent }}
                        >
                            {language === 'mr' ? 'सर्व भाव पहा' : 'View All Prices'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Market Trends Chart */}
                <div
                    className="rounded-xl shadow-lg overflow-hidden col-span-1 md:col-span-2 lg:col-span-1"
                    style={{ backgroundColor: COLORS.card }}
                >
                    <div className="p-6 h-full">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <LineChart size={20} /> {language === 'mr' ? 'सोयाबीन भाव रुझान' : 'Soybean Price Trends'}
                        </h2>
                        <div className="h-64">
                            <Suspense fallback={<div style={{ color: COLORS.text }}>{language === 'mr' ? 'लोड होत आहे...' : 'Loading...'}</div>}>
                                <DynamicChart
                                    options={marketTrends.options}
                                    series={marketTrends.series}
                                    type="area"
                                    height="100%"
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>

                {/* Farming Tools Card */}
                <div
                    className="rounded-xl shadow-lg overflow-hidden col-span-1"
                    style={{ backgroundColor: COLORS.card }}
                >
                    <div className="p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <HardDrive size={20} /> {language === 'mr' ? 'शेती साधने' : 'Farming Tools'}
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: <BarChart2 size={20} />, name: language === 'mr' ? 'नफा कॅल्क्युलेटर' : 'Profit Calculator', color: '#E8F5E9' },
                                { icon: <Droplet size={20} />, name: language === 'mr' ? 'सिंचन योजना' : 'Irrigation Plan', color: '#E3F2FD' },
                                { icon: <AlertTriangle size={20} />, name: language === 'mr' ? 'कीटक ओळख' : 'Pest ID', color: '#FFF3E0' },
                                { icon: <CalendarDays size={20} />, name: language === 'mr' ? 'पीक कॅलेंडर' : 'Crop Calendar', color: '#F3E5F5' },
                            ].map((tool, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ y: -5, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 rounded-lg flex flex-col items-center transition"
                                    style={{ backgroundColor: tool.color }}
                                >
                                    {tool.icon}
                                    <span className="text-sm font-medium mt-2" style={{ color: COLORS.text }}>
                                        {tool.name}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Farming Advice Card */}
                <div
                    className="rounded-xl shadow-lg overflow-hidden col-span-1 md:col-span-2"
                    style={{ backgroundColor: COLORS.card }}
                >
                    <div className="relative h-full">
                        <div
                            className="absolute inset-0 bg-[url('/farm-field.jpg')] bg-cover bg-center opacity-10"
                            style={{ filter: 'sepia(30%)' }}
                        ></div>
                        <div className="relative p-6 h-full">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                                <BookOpen size={20} /> {language === 'mr' ? 'शेती सल्ला' : 'Farm Advice'}
                            </h2>
                            <div className="space-y-4">
                                {[
                                    language === 'mr' ? 'ऑगस्ट महिन्यात सोयाबीनची लागवड करा' : 'Plant soybean in August',
                                    language === 'mr' ? 'ड्रिप सिंचन प्रणाली वापरून पाणी वाचवा' : 'Save water using drip irrigation',
                                    language === 'mr' ? 'कापूस पिकासाठी कीटकनाशकांचा योग्य वेळी वापर करा' : 'Use pesticides timely for cotton',
                                ].map((ad, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ x: 5 }}
                                        className="flex items-start gap-3 p-3 rounded-lg backdrop-blur-sm"
                                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                                    >
                                        <div
                                            className="p-1.5 rounded-full mt-0.5"
                                            style={{ backgroundColor: COLORS.secondary }}
                                        >
                                            <Sprout size={16} className="text-white" />
                                        </div>
                                        <p className="text-sm" style={{ color: COLORS.text }}>{ad}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' mt-2 shadow-lg'>
                <AiAgriAssistant
                    // language={language}
                    // userRegion={dashboardData.userRegion || "Maharashtra"}
                    // currentCrop={userType === 'farmer' ? user.farmDetails?.primaryCrop || "sugarcane" : "sugarcane"}
                />
            </div>
        </>
    );
};

// Marketplace Section Component
const MarketplaceSection = ({ products, renderStars, randomColorClass, language, userType }) => {
    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold" style={{ color: '#2E7D32' }}>
                    {language === 'mr' ? 'बाजार' : 'Marketplace'}
                </h1>
                <Link
                    to="/products"
                    className="text-green-700 hover:text-green-800 font-medium"
                >
                    {language === 'mr' ? 'सर्व उत्पादने पहा →' : 'View All Products →'}
                </Link>
            </div>

            {userType === 'guest' && (
                <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                    <div>
                        <p className="font-medium text-yellow-800">
                            {language === 'mr' ? 'पूर्ण वैशिष्ट्ये मिळवण्यासाठी साइन इन करा' : 'Sign in to access all features'}
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                            {language === 'mr' ? 'खरेदी करण्यासाठी, ऑर्डर ट्रॅक करण्यासाठी आणि शेतकऱ्यांशी थेट संपर्क साधण्यासाठी खाते तयार करा.' : 'Create an account to make purchases, track orders, and connect directly with farmers.'}
                        </p>
                        <div className="flex gap-3 mt-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                            >
                                {language === 'mr' ? 'साइन इन' : 'Sign In'}
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 border border-yellow-600 text-yellow-700 text-sm rounded hover:bg-yellow-50"
                            >
                                {language === 'mr' ? 'नोंदणी करा' : 'Register'}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-6">
                {products?.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product._id}
                            className="relative border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white transition-transform hover:-translate-y-2 hover:shadow-lg group cursor-pointer"
                        >
                            {/* Wishlist Icon */}
                            <div className="absolute top-3 right-3 z-10">
                                <button
                                    className="text-red-500 text-xl hover:scale-110 transition"
                                >
                                    <FaRegHeart />
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
                                        {language === 'mr' ? 'प्रतिमा उपलब्ध नाही' : 'No Image'}
                                    </div>
                                )}

                                {/* Low Stock Badge */}
                                {product.quantity < 10 && (
                                    <span
                                        className={`absolute top-3 left-3 ${randomColorClass} text-center text-white text-xs px-3 py-2 font-semibold rounded-full shadow-md animate-bounce`}
                                    >
                                        {language === 'mr' ? 'कमी स्टॉक' : 'Low Stock'}
                                    </span>
                                )}

                                {/* Quick View Button (hover only) */}
                                <button
                                    className="absolute bottom-3 right-3 bg-white text-gray-700 text-sm px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                                >
                                    <FaSearch className="inline-block mr-1" />
                                    {language === 'mr' ? 'द्रुत दृश्य' : 'Quick View'}
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex flex-col justify-between h-52">
                                <h3 className="text-lg font-semibold" style={{ color: '#263238' }}>
                                    {product.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 font-bold text-lg">₹{product.price}</span>
                                </div>

                                {/* Quantity */}
                                <div className="text-sm">
                                    {language === 'mr' ? 'प्रमाण:' : 'Quantity:'}{" "}
                                    <span
                                        className={`font-semibold ${product.quantity < 10 ? "text-red-600" : "text-gray-700"}`}
                                    >
                                        {product.quantity} {product.quantity < 10 && "🧯"}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                    {renderStars(product.rating || 4.5)}
                                    <span className="text-gray-500 text-xs ml-1">({product.rating || "4.5"})</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex items-center justify-center min-h-[200px]">
                        <p className="text-gray-500">
                            {language === 'mr' ? 'सध्या कोणतीही उत्पादने उपलब्ध नाहीत' : 'No products available at the moment.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Farmer Benefits Section - Only shown to guests and buyers */}
            {(userType === 'guest' || userType === 'buyer') && (
                <div className="bg-gray-50 py-12 mt-12 rounded-xl">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center" style={{ color: '#2E7D32' }}>
                            {language === 'mr' ? 'तुम्ही शेतकरी आहात?' : 'Are you a farmer?'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {[
                                {
                                    title: language === 'mr' ? 'अधिक ग्राहकांपर्यंत पोहोचा' : 'Reach More Customers',
                                    icon: (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    ),
                                    text: language === 'mr' ? 'प्रदेशभरातील खरेदीदारांशी जोडा' : 'Connect with buyers across the region'
                                },
                                {
                                    title: language === 'mr' ? 'वाजवी किंमत' : 'Fair Pricing',
                                    icon: (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    ),
                                    text: language === 'mr' ? 'तुमच्या स्वतःच्या किंमत सेट करा आणि अधिक नफा मिळवा' : 'Set your own prices and keep more of your profits'
                                },
                                {
                                    title: language === 'mr' ? 'सुलभ व्यवस्थापन' : 'Easy Management',
                                    icon: (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    ),
                                    text: language === 'mr' ? 'तुमच्या उत्पादने आणि ऑर्डर व्यवस्थापित करण्यासाठी सोपी साधने' : 'Simple tools to manage your products and orders'
                                }
                            ].map((benefit, i) => (
                                <div key={i} className="bg-white p-6 rounded-lg shadow-sm text-center h-full">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {benefit.icon}
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-lg mb-2" style={{ color: '#2E7D32' }}>{benefit.title}</h3>
                                    <p className="text-gray-600">{benefit.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                to="/farmer-register"
                                className="inline-block px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800"
                            >
                                {language === 'mr' ? 'शेतकरी म्हणून नोंदणी करा' : 'Register as a Farmer'}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaharashtraFarmerDashboard;