// src/MaharashtraFarmerDashboard.jsx

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

import {
    Sun, CloudRain, Cloud, Thermometer, Leaf, Tractor, Sprout,
    Droplet, LineChart, BookOpen, CalendarDays, ShieldCheck,
    AlertTriangle, Droplets, CloudSun, CloudLightning, Wind,
    Smartphone, Database, HardDrive, BarChart2, Clipboard, Settings
} from 'lucide-react';

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
    const [isLoading, setIsLoading] = useState(true);

    const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [weatherRef, weatherInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [marketRef, marketInView] = useInView({ threshold: 0.1, triggerOnce: true });

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

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const getWeatherIcon = (cond) => ({
        Sunny: <Sun className="text-yellow-500" size={20} />,
        Rainy: <CloudRain className="text-blue-500" size={20} />,
        Cloudy: <Cloud className="text-gray-500" size={20} />,
        Thunder: <CloudLightning className="text-purple-500" size={20} />,
        Windy: <Wind className="text-gray-600" size={20} />,
    }[cond] || <Sun size={20} />);

    if (isLoading) {
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
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center cursor-pointer space-x-2"
                    >
                        <Tractor size={24} className="text-white" />
                        <h1 className="text-xl font-bold text-white">
                            {language === 'mr' ? 'माय मराठी' : 'माय Marathi'}
                        </h1>
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLanguage((lang) => (lang === 'mr' ? 'en' : 'mr'))}
                        className="px-3 py-1 text-sm rounded-md text-white"
                        style={{ backgroundColor: COLORS.secondary }}
                    >
                        {language === 'mr' ? 'English' : 'मराठी'}
                    </motion.button>
                </div>
            </motion.header>

            <main className="container mx-auto px-4 py-6 pb-24">
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

                {activeTab === 'dashboard' && (
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
                                            style={{ backgroundColor: '#E8F5E9' }} // Light green background
                                        >
                                            <div className="text-center">
                                                <p className="text-sm font-medium" style={{ color: COLORS.text }}>{day.day}</p>
                                                <p className="text-xs" style={{ color: COLORS.lightText }}>{day.region}</p>
                                                <div className="my-3">{getWeatherIcon(day.condition)}</div>
                                                <p className="text-lg font-bold" style={{ color: COLORS.text }}>{day.temp}</p>
                                                <p className="text-xs capitalize" style={{ color: COLORS.lightText }}>{day.condition}</p>
                                                <p
                                                    className="text-xs mt-2 rounded-full py-1 px-2 inline-block"
                                                    style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }} // Light blue for rain info
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
                    {[
                        { icon: <Smartphone size={20} />, label: language === 'mr' ? 'डॅशबोर्ड' : 'Dashboard', value: 'dashboard' },
                        { icon: <Database size={20} />, label: language === 'mr' ? 'बाजार' : 'Market', value: 'market' },
                        { icon: <Clipboard size={20} />, label: language === 'mr' ? 'सल्ला' : 'Advice', value: 'advice' },
                    ].map((item) => (
                        <motion.button
                            key={item.value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setActiveTab(item.value)}
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

export default MaharashtraFarmerDashboard;