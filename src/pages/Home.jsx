import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
    Thermometer, MapPin, Calendar, Tractor, CloudRain, Wind, Eye, Droplets,
    Sun, Cloud, CloudSnow, Zap, ShoppingCart, Star, TrendingUp, Leaf,
    Users, Award, ArrowRight, RefreshCw, AlertCircle, Heart, Filter,
    Search, Bell, Settings, Menu, X, ChevronDown, Grid, List, Package,
    Truck, Shield, Clock, Phone, Mail, Globe, ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../Redux/Slice/productSlice';

const WEATHER_API_KEY = 'c0767a98c8629fa2703381c21cef3eb6';

function EnhancedFarmDashboard() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState("Your Farm");
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoggedIn] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterCategory, setFilterCategory] = useState('all');
    const [favorites, setFavorites] = useState([]);
    const [notifications, setNotifications] = useState(3);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const { products = [] } = useSelector(state => state?.products || {});

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Real weather API call
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                        const { latitude, longitude } = coords;
                        try {
                            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`);
                            const weatherJson = await weatherRes.json();
                            setWeatherData(weatherJson);

                            const locRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`);
                            const locJson = await locRes.json();
                            if (locJson.length > 0) {
                                setLocationName(`${locJson[0].name}, ${locJson[0].country}`);
                            }
                        } catch (error) {
                            console.error('Weather API error:', error);
                            // Fallback to mock data
                            setWeatherData({
                                main: { temp: 24, humidity: 65, pressure: 1013, feels_like: 26 },
                                weather: [{ description: 'partly cloudy', icon: '02d', main: 'Clouds' }],
                                wind: { speed: 3.2, deg: 180 },
                                visibility: 10000,
                                clouds: { all: 40 }
                            });
                            setLocationName("Green Valley Farmlands");
                        }
                    });
                } else {
                    // Fallback for no geolocation
                    setWeatherData({
                        main: { temp: 24, humidity: 65, pressure: 1013, feels_like: 26 },
                        weather: [{ description: 'partly cloudy', icon: '02d', main: 'Clouds' }],
                        wind: { speed: 3.2, deg: 180 },
                        visibility: 10000,
                        clouds: { all: 40 }
                    });
                    setLocationName("Demo Farm Location");
                }

                dispatch(getAllProduct());
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    const temperatureData = useMemo(() => {
        if (!weatherData) return [];
        const base = weatherData.main.temp;
        return [
            { time: '6 AM', temp: base - 3, humidity: 75, windSpeed: 2.1 },
            { time: '9 AM', temp: base - 1, humidity: 68, windSpeed: 2.8 },
            { time: '12 PM', temp: base + 4, humidity: 55, windSpeed: 4.2 },
            { time: '3 PM', temp: base + 6, humidity: 48, windSpeed: 5.1 },
            { time: '6 PM', temp: base + 2, humidity: 60, windSpeed: 3.7 },
            { time: '9 PM', temp: base - 1, humidity: 70, windSpeed: 2.3 },
        ];
    }, [weatherData]);

    const cropData = [
        { name: 'Tomatoes', yield: 85, area: 2.5, color: '#ef4444' },
        { name: 'Wheat', yield: 92, area: 4.2, color: '#f59e0b' },
        { name: 'Corn', yield: 78, area: 3.1, color: '#10b981' },
        { name: 'Soybeans', yield: 88, area: 1.8, color: '#3b82f6' }
    ];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCategory === 'all' || product.category === filterCategory)
        );

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [products, searchTerm, filterCategory, sortBy]);

    const toggleFavorite = (productId) => {
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const WeatherIcon = ({ condition, size = 24 }) => {
        const iconProps = { size, className: "drop-shadow-sm" };
        switch (condition?.toLowerCase()) {
            case 'clear':
            case 'sunny':
                return <Sun {...iconProps} className="text-yellow-500 drop-shadow-sm" />;
            case 'clouds':
            case 'cloudy':
                return <Cloud {...iconProps} className="text-gray-500 drop-shadow-sm" />;
            case 'rain':
            case 'rainy':
                return <CloudRain {...iconProps} className="text-blue-500 drop-shadow-sm" />;
            case 'snow':
            case 'snowy':
                return <CloudSnow {...iconProps} className="text-blue-300 drop-shadow-sm" />;
            default:
                return <Sun {...iconProps} className="text-yellow-500 drop-shadow-sm" />;
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue", gradient = false }) => (
        <div className={`${gradient
            ? `bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`
            : `bg-white border border-${color}-100`
            } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-1 relative overflow-hidden`}>
            {gradient && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-xl ${gradient ? 'bg-white/20' : `bg-${color}-100`} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={28} className={gradient ? 'text-white' : `text-${color}-600`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center text-sm px-3 py-1 rounded-full ${gradient ? 'bg-white/20 text-white' :
                            trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
                            <span className="ml-1 font-medium">{Math.abs(trend)}%</span>
                        </div>
                    )}
                </div>
                <h3 className={`text-3xl font-black mb-2 ${gradient ? 'text-white' : 'text-gray-900'}`}>
                    {value}
                </h3>
                <p className={`text-sm font-medium mb-1 ${gradient ? 'text-white/90' : 'text-gray-700'}`}>
                    {title}
                </p>
                {subtitle && (
                    <p className={`text-xs ${gradient ? 'text-white/70' : 'text-gray-500'}`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20">
            {/* Enhanced Mobile-First Header */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"></div>
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-green-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8 lg:py-16">
                    {/* Mobile Menu Button */}
                    <div className="flex justify-between items-center lg:hidden mb-6">
                        <div className="flex items-center text-white">
                            <Leaf size={32} className="mr-2" />
                            <span className="text-xl font-bold">FarmWeather</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Bell size={24} className="text-white" />
                                {notifications > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="text-center lg:text-left mb-8 lg:mb-0 flex-1">
                            <div className="hidden lg:flex items-center justify-center lg:justify-start mb-6">
                                <Leaf className="mr-4 text-green-300 animate-bounce" size={48} />
                                <div>
                                    <h1 className="text-4xl lg:text-7xl font-black tracking-tight text-white leading-none">
                                        FarmWeather
                                    </h1>
                                    <p className="text-lg lg:text-2xl font-light text-green-200 mt-2">
                                        Smart Agriculture Dashboard
                                    </p>
                                </div>
                            </div>
                            <p className="text-lg lg:text-xl text-green-100 max-w-2xl leading-relaxed mb-6">
                                Transform your farming with AI-powered insights, real-time weather monitoring, and data-driven decisions for maximum productivity
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-green-200">
                                <div className="flex items-center">
                                    <MapPin size={18} className="mr-2" />
                                    <span className="text-sm font-medium">{locationName}</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-green-300 rounded-full"></div>
                                <div className="flex items-center">
                                    <Calendar size={18} className="mr-2" />
                                    <span className="text-sm font-medium">{currentTime.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Time Display */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl">
                                <div className="text-center">
                                    <div className="text-sm text-green-200 mb-2 font-medium">Current Time</div>
                                    <div className="text-2xl lg:text-4xl font-mono font-bold text-white">
                                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-xs text-green-300 mt-2">
                                        {currentTime.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ')[1]}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Weather Summary */}
                            {weatherData && (
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 flex items-center gap-3">
                                    <WeatherIcon condition={weatherData.weather[0].main} size={32} />
                                    <div className="text-white">
                                        <div className="text-2xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
                                        <div className="text-xs text-green-200 capitalize">{weatherData.weather[0].description}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Enhanced Navigation */}
            <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-1 lg:space-x-8">
                            {[
                                { id: 'overview', label: 'Overview', icon: Thermometer },
                                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                                { id: 'products', label: 'Marketplace', icon: ShoppingCart }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center px-3 lg:px-6 py-4 border-b-3 transition-all duration-300 font-medium ${activeTab === id
                                        ? 'border-green-500 text-green-600 bg-green-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} className="mr-2" />
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 lg:gap-4">
                            <div className="relative hidden lg:block">
                                <Bell size={20} className="text-gray-600 hover:text-green-600 cursor-pointer transition-colors" />
                                {notifications > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </div>
                            <Settings size={20} className="text-gray-600 hover:text-green-600 cursor-pointer transition-colors hidden lg:block" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content with Enhanced Animations */}
            <main className="max-w-7xl mx-auto px-4 py-6 lg:py-12">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Enhanced Weather Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-lg">
                                        <div className="h-16 bg-gray-200 rounded-xl mb-4"></div>
                                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </div>
                                ))
                            ) : weatherData ? (
                                <>
                                    <StatCard
                                        icon={Thermometer}
                                        title="Temperature"
                                        value={`${Math.round(weatherData.main.temp)}°C`}
                                        subtitle={`Feels like ${Math.round(weatherData.main.feels_like)}°C`}
                                        trend={2.3}
                                        color="red"
                                        gradient={true}
                                    />
                                    <StatCard
                                        icon={Droplets}
                                        title="Humidity"
                                        value={`${weatherData.main.humidity}%`}
                                        subtitle="Optimal for crops"
                                        trend={-1.2}
                                        color="blue"
                                    />
                                    <StatCard
                                        icon={Wind}
                                        title="Wind Speed"
                                        value={`${weatherData.wind.speed} m/s`}
                                        subtitle={`${weatherData.wind.deg}° direction`}
                                        trend={0.8}
                                        color="gray"
                                    />
                                    <StatCard
                                        icon={Eye}
                                        title="Visibility"
                                        value={`${(weatherData.visibility / 1000).toFixed(1)} km`}
                                        subtitle="Excellent conditions"
                                        color="green"
                                        gradient={true}
                                    />
                                </>
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                                    <p className="text-red-500 font-medium">Unable to fetch weather data</p>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Charts Section */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Temperature Chart */}
                            <div className="xl:col-span-2 bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center mb-4 sm:mb-0">
                                        <Calendar className="mr-3 text-green-600" />
                                        Today's Forecast
                                    </h2>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium">
                                        <RefreshCw size={16} />
                                        Refresh
                                    </button>
                                </div>
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={temperatureData}>
                                        <defs>
                                            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="time"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6b7280', fontWeight: 500 }}
                                        />
                                        <YAxis
                                            unit="°C"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6b7280', fontWeight: 500 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: 'none',
                                                borderRadius: '16px',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                fontWeight: 600
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="temp"
                                            stroke="#22c55e"
                                            strokeWidth={4}
                                            fill="url(#tempGradient)"
                                            dot={{ fill: '#22c55e', strokeWidth: 3, stroke: '#fff', r: 6 }}
                                            activeDot={{ r: 8, stroke: '#22c55e', strokeWidth: 3, fill: '#fff' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Crop Performance Chart */}
                            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center mb-6">
                                    <Package className="mr-3 text-green-600" />
                                    Crop Performance
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={cropData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="yield"
                                        >
                                            {cropData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2">
                                    {cropData.map((crop, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: crop.color }}></div>
                                                <span className="text-sm font-medium text-gray-700">{crop.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{crop.yield}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Recommendations with Priority System */}
                        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-6 lg:p-10 border border-green-200 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center">
                                    <Tractor className="mr-4 text-green-600" />
                                    AI-Powered Farming Recommendations
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock size={16} />
                                    <span>Updated {Math.floor(Math.random() * 5) + 1} min ago</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: "Optimal Irrigation Schedule",
                                        description: "Water your crops between 5-7 AM today for 85% efficiency gain",
                                        priority: "Critical",
                                        icon: Droplets,
                                        action: "Schedule Now",
                                        impact: "High water savings"
                                    },
                                    {
                                        title: "Pest Monitoring Alert",
                                        description: "Humidity at 65% increases pest risk. Deploy monitoring systems",
                                        priority: "High",
                                        icon: AlertCircle,
                                        action: "View Details",
                                        impact: "Crop protection"
                                    },
                                    {
                                        title: "Harvest Optimization",
                                        description: "Weather conditions perfect for harvesting in 48-72 hours",
                                        priority: "Medium",
                                        icon: Calendar,
                                        action: "Plan Harvest",
                                        impact: "Quality preservation"
                                    },
                                    {
                                        title: "Soil Enhancement",
                                        description: "Ideal conditions for organic matter incorporation",
                                        priority: "Low",
                                        icon: Tractor,
                                        action: "Learn More",
                                        impact: "Long-term health"
                                    }
                                ].map((rec, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
                                                    <rec.icon size={24} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{rec.title}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">{rec.impact}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                                rec.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                                    rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {rec.priority}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 leading-relaxed">{rec.description}</p>
                                        <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center group-hover:scale-105">
                                            {rec.action}
                                            <ChevronRight size={16} className="ml-2" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Enhanced Header with Search and Filters */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl lg:text-5xl font-black text-gray-800 mb-4">
                                Farm Fresh Marketplace 🛒
                            </h2>
                            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Discover premium quality products directly from sustainable local farms
                            </p>
                        </div>

                        {/* Advanced Search and Filter Bar */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                                {/* Search Bar */}
                                <div className="relative flex-1 w-full lg:w-auto">
                                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex items-center gap-4 w-full lg:w-auto">
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-medium bg-white"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="vegetables">Vegetables</option>
                                        <option value="fruits">Fruits</option>
                                        <option value="grains">Grains</option>
                                        <option value="dairy">Dairy</option>
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-medium bg-white"
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="price">Sort by Price</option>
                                        <option value="rating">Sort by Rating</option>
                                    </select>

                                    {/* View Toggle */}
                                    <div className="flex bg-gray-100 rounded-2xl p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
                                        >
                                            <Grid size={20} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
                                        >
                                            <List size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1'
                            }`}>
                            {filteredProducts.length > 0 ? filteredProducts.map(product => (
                                <div
                                    key={product._id}
                                    className={`bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border border-gray-100 ${viewMode === 'list' ? 'flex items-center' : ''
                                        }`}
                                >
                                    {/* Product Image */}
                                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-32' : 'h-56'}`}>
                                        <img
                                            src={product?.img?.secure_url || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop';
                                            }}
                                        />

                                        {/* Enhanced Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            {product.offerPercentage > 0 && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                    {product.offerPercentage}% OFF
                                                </span>
                                            )}
                                            {product.isOrganic && (
                                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                    ORGANIC
                                                </span>
                                            )}
                                        </div>

                                        {/* Favorite Button */}
                                        <button
                                            onClick={() => toggleFavorite(product._id)}
                                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 group-hover:scale-110"
                                        >
                                            <Heart
                                                size={18}
                                                className={`${favorites.includes(product._id) ? 'text-red-500 fill-current' : 'text-gray-600'} transition-colors`}
                                            />
                                        </button>

                                        {/* Stock Status */}
                                        <div className="absolute bottom-3 right-3">
                                            {product.outOfStock ? (
                                                <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                    OUT OF STOCK
                                                </span>
                                            ) : (
                                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                    IN STOCK
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg lg:text-xl font-bold text-gray-800 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            {product.company && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium ml-2">
                                                    {product.company}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {product.description}
                                        </p>

                                        {/* Rating */}
                                        {product.rating && (
                                            <div className="flex items-center mb-3">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600 ml-2 font-medium">
                                                    {product.rating} ({Math.floor(Math.random() * 200) + 50} reviews)
                                                </span>
                                            </div>
                                        )}

                                        {/* Price Section */}
                                        <div className="mb-4">
                                            {product.offerPercentage > 0 ? (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-black text-green-600">
                                                        ${(product.price * (1 - product.offerPercentage / 100)).toFixed(2)}
                                                    </span>
                                                    <span className="text-lg text-gray-500 line-through">
                                                        ${product.price}
                                                    </span>
                                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">
                                                        Save ${(product.price * product.offerPercentage / 100).toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-2xl font-black text-green-600">
                                                    ${product.price}
                                                </span>
                                            )}
                                        </div>

                                        {/* Additional Info */}
                                        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center">
                                                    <Truck size={14} className="mr-1" />
                                                    <span>Free delivery</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Shield size={14} className="mr-1" />
                                                    <span>Quality assured</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => console.log('Navigate to product', product._id)}
                                                disabled={product.outOfStock}
                                                className={`flex-1 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${product.outOfStock
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg hover:shadow-xl'
                                                    }`}
                                            >
                                                <ShoppingCart size={18} />
                                                {isLoggedIn
                                                    ? product.outOfStock ? "Out of Stock" : "Add to Cart"
                                                    : "View Details"}
                                            </button>

                                            {!product.outOfStock && (
                                                <button className="px-4 py-3 border-2 border-green-600 text-green-600 rounded-2xl font-bold hover:bg-green-600 hover:text-white transition-all duration-300">
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-16">
                                    <Package size={64} className="text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">No products found</h3>
                                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                </div>
                            )}
                        </div>

                        {/* Load More Button */}
                        {filteredProducts.length > 0 && (
                            <div className="text-center mt-12">
                                <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                                    Load More Products
                                    <ArrowRight size={20} className="ml-2 inline" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-5xl font-black text-gray-800 mb-4">
                                Farm Analytics Dashboard 📊
                            </h2>
                            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                                Comprehensive insights and data-driven recommendations for optimal farming operations
                            </p>
                        </div>

                        {/* Enhanced Analytics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={TrendingUp}
                                title="Crop Yield Efficiency"
                                value="94.2%"
                                subtitle="Above industry average"
                                trend={12.5}
                                color="green"
                                gradient={true}
                            />
                            <StatCard
                                icon={Droplets}
                                title="Water Conservation"
                                value="1,247L"
                                subtitle="Saved this week"
                                trend={-8.3}
                                color="blue"
                            />
                            <StatCard
                                icon={Award}
                                title="Quality Score"
                                value="98.5"
                                subtitle="Premium grade products"
                                trend={3.2}
                                color="purple"
                                gradient={true}
                            />
                            <StatCard
                                icon={Leaf}
                                title="Sustainability Index"
                                value="92.1"
                                subtitle="Eco-friendly practices"
                                trend={5.7}
                                color="green"
                            />
                        </div>

                        {/* Detailed Analytics Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Crop Yield Over Time */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <TrendingUp className="mr-3 text-green-600" />
                                    Crop Yield Trends
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={cropData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="yield" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Resource Usage */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Droplets className="mr-3 text-blue-600" />
                                    Resource Efficiency
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={temperatureData}>
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="windSpeed"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            dot={{ fill: '#3b82f6', r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Future Analytics Preview */}
                        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 lg:p-12 border border-blue-200 shadow-xl">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                                    <TrendingUp size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                                    Advanced Analytics Coming Soon
                                </h3>
                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    We're developing cutting-edge analytics including predictive modeling,
                                    AI-powered crop recommendations, and real-time optimization algorithms.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {[
                                        { icon: TrendingUp, title: "Predictive Analytics", desc: "Forecast yields and optimize planning" },
                                        { icon: Leaf, title: "AI Recommendations", desc: "Smart farming suggestions powered by ML" },
                                        { icon: Globe, title: "Market Intelligence", desc: "Real-time pricing and demand insights" }
                                    ].map((feature, index) => (
                                        <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
                                            <feature.icon size={32} className="text-blue-600 mx-auto mb-3" />
                                            <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                                            <p className="text-sm text-gray-600">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg">
                                        Get Early Access
                                    </button>
                                    <div className="flex items-center text-gray-600">
                                        <Bell size={20} className="mr-2" />
                                        <span className="font-medium">Notify me when available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

        
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
            
        </div>
    );
}

export default EnhancedFarmDashboard;
