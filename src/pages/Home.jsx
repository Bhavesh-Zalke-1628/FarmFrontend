import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from "../Layout/Layout";
import {
    Tractor, Sun, CloudRain, Droplet, Cloud, CloudSun, CloudLightning, CloudDrizzle,
    CloudSnow, Wind, MapPin, Navigation, Thermometer, Umbrella, Droplets, SunSnow,
    Sprout, Wheat, Calendar, Clock, AlertTriangle, Shield, CloudSunRain, GlassWater
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../Redux/Slice/productSlice';
import { motion } from 'framer-motion';
import AiAgriAssistant from '../Component/AiAgriAssistant';

const WEATHER_API_KEY = 'c0767a98c8629fa2703381c21cef3eb6';

function calculateRandomSoilMoisture() { return Math.floor(Math.random() * 30) + 50; } // 50-80%
function calculateRandomRainfall() { return (Math.random() * 10).toFixed(1); } // 0-10mm

function getWeatherIcon(weatherId, iconCode) {
    if (weatherId === 800)
        return iconCode?.includes('n')
            ? <Cloud className="text-gray-400" />
            : <Sun className="text-yellow-500" />;
    if (weatherId > 800) return <Cloud className="text-gray-500" />;
    if (weatherId >= 500 && weatherId < 600) return <CloudRain className="text-blue-500" />;
    if (weatherId >= 200 && weatherId < 300) return <CloudLightning className="text-purple-500" />;
    if (weatherId >= 300 && weatherId < 400) return <CloudDrizzle className="text-blue-400" />;
    if (weatherId >= 600 && weatherId < 700) return <CloudSnow className="text-blue-200" />;
    if (weatherId >= 700 && weatherId < 800) return <Wind className="text-gray-400" />;
    return <CloudSun className="text-gray-400" />;
}

// ========== Main Home Component ==========
function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products } = useSelector(state => state.products);
    const { isLoggedIn } = useSelector(state => state.auth);

    // State for weather/location
    const [weatherData, setWeatherData] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [weatherError, setWeatherError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationName, setLocationName] = useState('Your Farm Location');
    const [soilMoisture, setSoilMoisture] = useState(() => calculateRandomSoilMoisture());
    const [lastRainfall, setLastRainfall] = useState(() => calculateRandomRainfall());

    // Responsive product grid count
    const [visibleCount, setVisibleCount] = useState(() => window.innerWidth < 640 ? 4 : 8);

    // RESPONSIVE: track window size for product grid
    useEffect(() => {
        const handleResize = () => setVisibleCount(window.innerWidth < 640 ? 4 : 8);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch products once
    useEffect(() => {
        dispatch(getAllProduct({ limit: 8, skip: 0 }));
    }, [dispatch]);

    // Fetch location/weather
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lon: longitude });
                    await fetchLocationName(latitude, longitude);
                    fetchWeatherData(latitude, longitude);
                },
                (error) => {
                    setWeatherError("Location access denied. Using sample farm data.");
                    fetchSampleFarmData();
                }
            );
        } else {
            setWeatherError("Geolocation not supported. Using sample farm data.");
            fetchSampleFarmData();
        }
        // eslint-disable-next-line
    }, []);

    // Get location name
    const fetchLocationName = useCallback(async (lat, lon) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                if (data?.length > 0) setLocationName(`${data[0].name} Farmlands`);
            }
        } catch { /* No-op */ }
    }, []);

    // Fetch weather data
    const fetchWeatherData = useCallback(async (lat, lon) => {
        setLoadingWeather(true);
        try {
            const [currRes, forecastRes] = await Promise.all([
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`),
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`)
            ]);
            if (!currRes.ok || !forecastRes.ok) throw new Error();
            const currentData = await currRes.json();
            const forecastData = await forecastRes.json();
            const dailyForecasts = processForecastData(forecastData);
            setWeatherData({ current: currentData, forecast: dailyForecasts });
            setLoadingWeather(false);
            updateFarmConditions(currentData);
        } catch {
            setWeatherError("Unable to load live weather data");
            setLoadingWeather(false);
            fetchSampleFarmData();
        }
    }, []);

    // Sample data fetch fallback
    const fetchSampleFarmData = useCallback(() => {
        setWeatherData({
            current: { main: { temp: 22, humidity: 65, pressure: 1012 }, weather: [{ id: 801, main: "Clouds", description: "partly cloudy" }], wind: { speed: 3.5 } },
            forecast: [
                { day: "Today", icon: <CloudSun className="text-yellow-500" />, temp: 22, condition: "Partly Cloudy", rainChance: 20 },
                { day: "Tomorrow", icon: <CloudRain className="text-blue-500" />, temp: 19, condition: "Light Rain", rainChance: 70 },
                { day: "Wed", icon: <Sun className="text-yellow-500" />, temp: 25, condition: "Sunny", rainChance: 10 }
            ]
        });
        setSoilMoisture(65);
        setLastRainfall(2.4);
    }, []);

    // Update "lastRainfall" and "soilMoisture" when weather changes
    const updateFarmConditions = useCallback((currentWeather) => {
        const main = currentWeather.weather[0].main.toLowerCase();
        setSoilMoisture(main.includes('rain') ? 70 + Math.floor(Math.random() * 10) : 55 + Math.floor(Math.random() * 10));
        setLastRainfall(main.includes('rain') ? (Math.random() * 15).toFixed(1) : calculateRandomRainfall());
    }, []);

    // Process forecast (group by day, get unique days)
    function processForecastData(data) {
        const forecastsByDay = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (!forecastsByDay[day]) {
                forecastsByDay[day] = {
                    day,
                    temp: Math.round(item.main.temp),
                    condition: item.weather[0].main,
                    icon: getWeatherIcon(item.weather[0].id, item.weather[0].icon),
                    rainChance: item.pop ? Math.round(item.pop * 100) : 0,
                    date
                };
            }
        });
        return Object.values(forecastsByDay)
            .sort((a, b) => a.date - b.date)
            .slice(0, 3);
    };

    // Memoize recommendations for performance
    const farmingRecommendations = useMemo(() => {
        if (!weatherData?.current) return [];
        const { temp, humidity } = weatherData.current.main;
        const rain = weatherData.current.weather[0].main.toLowerCase().includes('rain');
        const windSpeed = weatherData.current.wind.speed;
        const recs = [];
        if (temp < 5) recs.push({ icon: <AlertTriangle className="text-orange-500" />, text: "Frost warning! Protect sensitive crops tonight", urgency: "high" });
        if (temp < 5) recs.push({ icon: <Shield className="text-blue-500" />, text: "Cover seedlings with frost cloth", urgency: "medium" });
        if (temp > 30) recs.push({ icon: <GlassWater className="text-blue-500" />, text: "Increase irrigation frequency - heat wave expected", urgency: "high" });
        if (humidity > 75) recs.push({ icon: <Droplets className="text-blue-500" />, text: "High humidity - monitor for fungal diseases", urgency: "medium" });
        if (humidity < 40) recs.push({ icon: <Droplet className="text-red-500" />, text: "Low humidity - increase watering schedule", urgency: "medium" });
        if (rain) recs.push({ icon: <Umbrella className="text-blue-500" />, text: "Rain expected - delay fertilizer application", urgency: "low" });
        else if (soilMoisture < 60) recs.push({ icon: <GlassWater className="text-blue-500" />, text: `Soil moisture low (${soilMoisture}%) - irrigate fields`, urgency: "medium" });
        if (windSpeed > 8) recs.push({ icon: <Wind className="text-gray-500" />, text: "High winds - secure greenhouse covers", urgency: "high" });
        // Urgency sort
        return recs.sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.urgency] - { high: 3, medium: 2, low: 1 }[a.urgency])).slice(0, 5);
    }, [weatherData, soilMoisture]);

    const plantingAdvice = useMemo(() => {
        if (!weatherData?.current) return [];
        const { temp } = weatherData.current.main;
        const forecastRain = weatherData.forecast?.some(day => day.condition.toLowerCase().includes('rain'));
        const advice = [];
        if (temp > 15 && temp < 25) advice.push({ icon: <Sprout className="text-green-500" />, text: "Ideal conditions for planting most vegetables" });
        if (forecastRain) advice.push({ icon: <CloudSunRain className="text-blue-500" />, text: "Good window for planting water-intensive crops" });
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) advice.push({ icon: <Sun className="text-yellow-500" />, text: "Spring planting: carrots, lettuce, peas" });
        else if (month >= 5 && month <= 7) advice.push({ icon: <Sun className="text-red-500" />, text: "Summer planting: tomatoes, corn, beans" });
        else if (month >= 8 && month <= 10) advice.push({ icon: <SunSnow className="text-blue-500" />, text: "Fall planting: garlic, onions, spinach" });
        return advice.slice(0, 3);
    }, [weatherData]);

    // Memo for random products, stable on render (recomposed if products or visibleCount changes)
    const randomProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, visibleCount);
    }, [products, visibleCount]);

    // Handlers
    const handleRefreshLocation = useCallback(() => {
        if (userLocation) fetchWeatherData(userLocation.lat, userLocation.lon);
    }, [userLocation, fetchWeatherData]);

    // --- Render ---
    return (
        <Layout>
            {/* Hero */}
            <section className="bg-gradient-to-br from-green-600 to-green-400 text-white py-20 text-center">
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Welcome to <span className="text-yellow-200">FarmWeather</span> Dashboard
                    </h1>
                    <p className="text-lg md:text-xl mb-8">Smart weather predictions and farming recommendations for your agricultural success</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate("/products")} className="bg-white text-green-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">Farm Products</button>
                        <button className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition">Farming Calendar</button>
                    </div>
                </motion.div>
            </section>

            {/* Weather Dashboard */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Farm Weather Intelligence</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Current Conditions */}
                        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Thermometer className="text-red-500" />Current Conditions</h3>
                                <span className="flex items-center gap-1 text-sm text-gray-600"><MapPin size={14} />{locationName}</span>
                            </div>
                            {loadingWeather ? (
                                <div className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mb-4"></div>
                                    <p>Loading farm weather data...</p>
                                </div>
                            ) : weatherError ? (
                                <div className="text-center py-6 text-red-500">{weatherError}</div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 text-center py-4">
                                        <div className="text-5xl mb-2">
                                            {weatherData?.current && getWeatherIcon(weatherData.current.weather[0].id, weatherData.current.weather[0].icon)}
                                        </div>
                                        <p className="text-3xl font-bold">{Math.round(weatherData?.current?.main?.temp)}°C</p>
                                        <p className="text-gray-600 capitalize">{weatherData?.current?.weather[0]?.description}</p>
                                    </div>
                                    <WeatherStat icon={<Droplet size={18} />} label="Humidity" value={weatherData?.current?.main?.humidity + "%"} color="blue" />
                                    <WeatherStat icon={<Wind size={18} />} label="Wind" value={weatherData?.current?.wind?.speed + " m/s"} color="green" />
                                    <WeatherStat icon={<Droplets size={18} />} label="Soil Moisture" value={soilMoisture + "%"} color="amber" />
                                    <WeatherStat icon={<CloudRain size={18} />} label="Last Rainfall" value={lastRainfall + " mm"} color="purple" />
                                </div>
                            )}
                        </div>

                        {/* Weather Forecast */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Calendar className="text-blue-500" /> 3-Day Forecast
                                </h3>
                                <button onClick={handleRefreshLocation} className="text-green-600 hover:text-green-800 transition flex items-center gap-1 text-sm">
                                    <Navigation size={16} /> <span>Refresh</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {weatherData?.forecast?.map((day, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{day.icon}</div>
                                            <div>
                                                <p className="font-bold">{day.day}</p>
                                                <p className="text-sm text-gray-600 capitalize">{day.condition}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold">{day.temp}°C</p>
                                            <p className="text-sm text-blue-600 flex items-center justify-end gap-1">
                                                <Umbrella size={14} /><span>{day.rainChance}% rain</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <BestFarmingTimes forecast={weatherData?.forecast} />
                        </div>

                        {/* Farming Recommendations */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <Tractor className="text-green-500" /> Farming Actions
                            </h3>
                            <div className="mb-6">
                                <SectionList
                                    title="Urgent Recommendations"
                                    icon={<AlertTriangle className="text-orange-500" />}
                                    items={farmingRecommendations.filter(rec => rec.urgency === "high")}
                                    emptyText="No urgent actions needed"
                                    itemClass="bg-red-50 text-red-800"
                                />
                            </div>
                            <div className="mb-6">
                                <SectionList
                                    title="Planting Advice"
                                    icon={<Sprout className="text-green-500" />}
                                    items={plantingAdvice}
                                    itemClass="bg-blue-50 text-blue-800"
                                />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Wheat className="text-amber-500" /> Seasonal Tips</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><span>•</span> <span>Test soil pH this week for optimal planting</span></li>
                                    <li className="flex items-start gap-2"><span>•</span> <span>Rotate crops to prevent soil depletion</span></li>
                                    <li className="flex items-start gap-2"><span>•</span> <span>Order seeds for next season's planting</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Farm Products & Equipment</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {randomProducts.map((product) => {
                            const discountedPrice = Math.round(product.price - (product.price * product.offerPercentage) / 100);
                            return (
                                <motion.div key={product._id} whileHover={{ y: -5 }} className="border rounded-xl shadow hover:shadow-lg transition bg-gray-50 p-4 flex flex-col justify-between">
                                    <img
                                        src={product?.img?.secure_url || "https://via.placeholder.com/400x300"}
                                        alt={product.name}
                                        className="w-full h-40 object-cover rounded-md mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-green-700 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
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
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => navigate("/products")}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-green-600 text-green-700 font-semibold rounded-md hover:bg-green-50 transition duration-200"
                        >
                            View All Farm Products <span className="text-green-600 text-xl">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* AI Assistant */}
            <AiAgriAssistant />

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-700 to-green-600 text-white text-center">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Personalized Farm Advice?</h2>
                    <p className="mb-8 text-lg">Our agricultural experts can provide customized recommendations for your specific crops and conditions.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate("/consultation")} className="bg-white text-green-700 px-6 py-3 rounded font-bold hover:bg-gray-100 transition">
                            Book Consultation
                        </button>
                        <button className="border border-white text-white px-6 py-3 rounded font-bold hover:bg-white/10 transition">
                            Join Farmer Community
                        </button>
                    </div>
                </motion.div>
            </section>
        </Layout>
    );
}

// --- Small Subcomponents for DRYness ---
function WeatherStat({ icon, label, value, color }) {
    return (
        <div className={`bg-${color}-50 p-3 rounded-lg`}>
            <div className={`flex items-center gap-2 text-${color}-600 mb-1`}>
                {icon}<span className="font-semibold">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
function BestFarmingTimes({ forecast = [] }) {
    return (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                <Clock className="text-yellow-600" /> <span>Best Farming Times</span>
            </h4>
            <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2"><span>•</span> <span>Morning (6-9am): Ideal for planting and light work</span></li>
                <li className="flex items-start gap-2"><span>•</span> <span>Late afternoon (4-7pm): Best for watering</span></li>
                <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                        Next 48 hours: {forecast[1]?.rainChance > 50 ? "Good for rain-fed crops" : "Optimal for spraying"}
                    </span>
                </li>
            </ul>
        </div>
    );
}
function SectionList({ title, icon, items, emptyText, itemClass }) {
    return (
        <>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">{icon}<span>{title}</span></h4>
            <ul className="space-y-3">
                {items?.length > 0
                    ? items.map((item, i) => (
                        <li key={i} className={`flex items-start gap-3 ${itemClass} p-3 rounded-lg`}>
                            <div className="mt-0.5">{item.icon}</div>
                            <span>{item.text}</span>
                        </li>
                    ))
                    : emptyText && (<li className="text-green-700 bg-green-50 p-3 rounded-lg">{emptyText}</li>)
                }
            </ul>
        </>
    );
}

export default Home;
