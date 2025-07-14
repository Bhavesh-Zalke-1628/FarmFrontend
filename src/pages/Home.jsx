import React, { useEffect, useState } from 'react';
import Layout from "../Layout/Layout";
import {
    Tractor, Sun, CloudRain, Droplet, Cloud, CloudSun,
    CloudLightning, CloudDrizzle, CloudSnow, Wind,
    MapPin, Navigation, Thermometer, Umbrella, Droplets,
    SunSnow, Sprout, Wheat, Trees, Calendar, Clock,
    AlertTriangle, Shield, CloudSunRain, GlassWater
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../Redux/Slice/productSlice';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import AiAgriAssistant from '../Component/AiAgriAssistant';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(8);
    const [weatherData, setWeatherData] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [weatherError, setWeatherError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationName, setLocationName] = useState('Your Farm Location');
    const [soilMoisture, setSoilMoisture] = useState(calculateRandomSoilMoisture());
    const [lastRainfall, setLastRainfall] = useState(calculateRandomRainfall());

    const { products } = useSelector(state => state?.products);
    const { isLoggedIn } = useSelector(state => state?.auth);

    // Helper functions for random farm data
    function calculateRandomSoilMoisture() {
        return Math.floor(Math.random() * 30) + 50; // 50-80%
    }

    function calculateRandomRainfall() {
        return (Math.random() * 10).toFixed(1); // 0-10mm
    }

    useEffect(() => {
        dispatch(getAllProduct());

        const handleResize = () => {
            setVisibleCount(window.innerWidth < 640 ? 4 : 8);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);

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
                    console.error("Geolocation error:", error);
                    setWeatherError("Location access denied. Using sample farm data.");
                    fetchSampleFarmData();
                }
            );
        } else {
            setWeatherError("Geolocation not supported. Using sample farm data.");
            fetchSampleFarmData();
        }
    }, []);

    const fetchLocationName = async (lat, lon) => {
        try {
            const apiKey = 'c0767a98c8629fa2703381c21cef3eb6';
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
            );


            if (!response.ok) throw new Error('Location name not available');

            const data = await response.json();
            if (data && data.length > 0) {
                setLocationName(`${data[0].name} Farmlands`);
            }
        } catch (error) {
            console.error("Error fetching location name:", error);
        }
    };

    const fetchWeatherData = async (lat, lon) => {
        setLoadingWeather(true);
        try {

            const apiKey = 'c0767a98c8629fa2703381c21cef3eb6'

            // Current weather with agricultural parameters
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );

            // 5-day forecast with 3-hour intervals
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );

            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('Weather data not available');
            }

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            const dailyForecasts = processForecastData(forecastData);

            setWeatherData({
                current: currentData,
                forecast: dailyForecasts
            });
            setLoadingWeather(false);

            // Update farm conditions based on weather
            updateFarmConditions(currentData);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeatherError("Unable to load live weather data");
            setLoadingWeather(false);
            fetchSampleFarmData();
        }
    };

    const fetchSampleFarmData = () => {
        const sampleForecast = [
            { day: "Today", icon: <CloudSun className="text-yellow-500" />, temp: 22, condition: "Partly Cloudy", rainChance: 20 },
            { day: "Tomorrow", icon: <CloudRain className="text-blue-500" />, temp: 19, condition: "Light Rain", rainChance: 70 },
            { day: "Wed", icon: <Sun className="text-yellow-500" />, temp: 25, condition: "Sunny", rainChance: 10 }
        ];

        setWeatherData({
            current: {
                main: { temp: 22, humidity: 65, pressure: 1012 },
                weather: [{ id: 801, main: "Clouds", description: "partly cloudy" }],
                wind: { speed: 3.5 }
            },
            forecast: sampleForecast
        });

        setSoilMoisture(65);
        setLastRainfall(2.4);
    };

    const updateFarmConditions = (currentWeather) => {
        // Simulate soil moisture changes based on weather
        const baseMoisture = currentWeather.weather[0].main.toLowerCase().includes('rain') ? 70 : 55;
        const variation = Math.floor(Math.random() * 15);
        setSoilMoisture(baseMoisture + variation);

        // Simulate rainfall data
        if (currentWeather.weather[0].main.toLowerCase().includes('rain')) {
            setLastRainfall((Math.random() * 15).toFixed(1));
        }
    };

    const processForecastData = (data) => {
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
                    date: date
                };
            }
        });

        return Object.values(forecastsByDay)
            .sort((a, b) => a.date - b.date)
            .slice(0, 3);
    };

    const getWeatherIcon = (weatherId, iconCode) => {
        if (weatherId === 800) {
            return iconCode.includes('n')
                ? <Cloud className="text-gray-400" />
                : <Sun className="text-yellow-500" />;
        }

        if (weatherId > 800) return <Cloud className="text-gray-500" />;
        if (weatherId >= 500 && weatherId < 600) return <CloudRain className="text-blue-500" />;
        if (weatherId >= 200 && weatherId < 300) return <CloudLightning className="text-purple-500" />;
        if (weatherId >= 300 && weatherId < 400) return <CloudDrizzle className="text-blue-400" />;
        if (weatherId >= 600 && weatherId < 700) return <CloudSnow className="text-blue-200" />;
        if (weatherId >= 700 && weatherId < 800) return <Wind className="text-gray-400" />;

        return <CloudSun className="text-gray-400" />;
    };

    const getFarmingRecommendations = () => {
        if (!weatherData?.current) return [];

        const recommendations = [];
        const { current } = weatherData;
        const temp = current.main.temp;
        const humidity = current.main.humidity;
        const rain = current.weather[0].main.toLowerCase().includes('rain');
        const windSpeed = current.wind.speed;

        // Temperature based
        if (temp < 5) {
            recommendations.push({
                icon: <AlertTriangle className="text-orange-500" />,
                text: "Frost warning! Protect sensitive crops tonight",
                urgency: "high"
            });
            recommendations.push({
                icon: <Shield className="text-blue-500" />,
                text: "Cover seedlings with frost cloth",
                urgency: "medium"
            });
        } else if (temp > 30) {
            recommendations.push({
                icon: <GlassWater className="text-blue-500" />,
                text: "Increase irrigation frequency - heat wave expected",
                urgency: "high"
            });
        }

        // Humidity based
        if (humidity > 75) {
            recommendations.push({
                icon: <Droplets className="text-blue-500" />,
                text: "High humidity - monitor for fungal diseases",
                urgency: "medium"
            });
        } else if (humidity < 40) {
            recommendations.push({
                icon: <Droplet className="text-red-500" />,
                text: "Low humidity - increase watering schedule",
                urgency: "medium"
            });
        }

        // Rain based
        if (rain) {
            recommendations.push({
                icon: <Umbrella className="text-blue-500" />,
                text: "Rain expected - delay fertilizer application",
                urgency: "low"
            });
        } else if (soilMoisture < 60) {
            recommendations.push({
                icon: <GlassWater className="text-blue-500" />,
                text: `Soil moisture low (${soilMoisture}%) - irrigate fields`,
                urgency: "medium"
            });
        }

        // Wind based
        if (windSpeed > 8) {
            recommendations.push({
                icon: <Wind className="text-gray-500" />,
                text: "High winds - secure greenhouse covers",
                urgency: "high"
            });
        }

        // Sort by urgency and limit to 5
        return recommendations
            .sort((a, b) => {
                const urgencyOrder = { high: 3, medium: 2, low: 1 };
                return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
            })
            .slice(0, 5);
    };

    const getPlantingAdvice = () => {
        if (!weatherData?.current) return [];

        const advice = [];
        const { current, forecast } = weatherData;
        const temp = current.main.temp;
        const forecastRain = forecast.some(day => day.condition.toLowerCase().includes('rain'));

        // General planting advice
        if (temp > 15 && temp < 25) {
            advice.push({
                icon: <Sprout className="text-green-500" />,
                text: "Ideal conditions for planting most vegetables"
            });
        }

        if (forecastRain) {
            advice.push({
                icon: <CloudSunRain className="text-blue-500" />,
                text: "Good window for planting water-intensive crops"
            });
        }

        // Seasonal advice
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) {
            advice.push({
                icon: <Sun className="text-yellow-500" />,
                text: "Spring planting: carrots, lettuce, peas"
            });
        } else if (month >= 5 && month <= 7) {
            advice.push({
                icon: <Sun className="text-red-500" />,
                text: "Summer planting: tomatoes, corn, beans"
            });
        } else if (month >= 8 && month <= 10) {
            advice.push({
                icon: <SunSnow className="text-blue-500" />,
                text: "Fall planting: garlic, onions, spinach"
            });
        }

        return advice.slice(0, 3);
    };

    const getRandomProducts = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const randomProducts = getRandomProducts(products, visibleCount);

    const handleRefreshLocation = () => {
        if (userLocation) {
            fetchWeatherData(userLocation.lat, userLocation.lon);
        }
    };

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
                        Welcome to <span className="text-yellow-200">FarmWeather</span> Dashboard
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Smart weather predictions and farming recommendations for your agricultural success
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate("/products")} className="bg-white text-green-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
                            Farm Products
                        </button>
                        <button className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition">
                            Farming Calendar
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Farm Weather Dashboard */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Farm Weather Intelligence
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Current Conditions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Thermometer className="text-red-500" /> Current Conditions
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <MapPin size={14} />
                                    <span>{locationName}</span>
                                </div>
                            </div>

                            {loadingWeather ? (
                                <div className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mb-4"></div>
                                    <p>Loading farm weather data...</p>
                                </div>
                            ) : weatherError ? (
                                <div className="text-center py-6 text-red-500">
                                    {weatherError}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 text-center py-4">
                                        <div className="text-5xl mb-2">
                                            {weatherData?.current && getWeatherIcon(
                                                weatherData.current.weather[0].id,
                                                weatherData.current.weather[0].icon
                                            )}
                                        </div>
                                        <p className="text-3xl font-bold">
                                            {Math.round(weatherData?.current?.main?.temp)}°C
                                        </p>
                                        <p className="text-gray-600 capitalize">
                                            {weatherData?.current?.weather[0]?.description}
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                                            <Droplet size={18} />
                                            <span className="font-semibold">Humidity</span>
                                        </div>
                                        <p className="text-2xl font-bold">
                                            {weatherData?.current?.main?.humidity}%
                                        </p>
                                    </div>

                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-600 mb-1">
                                            <Wind size={18} />
                                            <span className="font-semibold">Wind</span>
                                        </div>
                                        <p className="text-2xl font-bold">
                                            {weatherData?.current?.wind?.speed} m/s
                                        </p>
                                    </div>

                                    <div className="bg-amber-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                                            <Droplets size={18} />
                                            <span className="font-semibold">Soil Moisture</span>
                                        </div>
                                        <p className="text-2xl font-bold">
                                            {soilMoisture}%
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                                            <CloudRain size={18} />
                                            <span className="font-semibold">Last Rainfall</span>
                                        </div>
                                        <p className="text-2xl font-bold">
                                            {lastRainfall} mm
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Weather Forecast */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Calendar className="text-blue-500" /> 3-Day Forecast
                                </h3>
                                <button
                                    onClick={handleRefreshLocation}
                                    className="text-green-600 hover:text-green-800 transition flex items-center gap-1 text-sm"
                                >
                                    <Navigation size={16} />
                                    <span>Refresh</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {weatherData?.forecast?.map((day, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">
                                                {day.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold">{day.day}</p>
                                                <p className="text-sm text-gray-600 capitalize">{day.condition}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold">{day.temp}°C</p>
                                            <p className="text-sm text-blue-600 flex items-center justify-end gap-1">
                                                <Umbrella size={14} />
                                                <span>{day.rainChance}% rain</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                                    <Clock className="text-yellow-600" />
                                    <span>Best Farming Times</span>
                                </h4>
                                <ul className="space-y-2 text-sm text-yellow-800">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Morning (6-9am): Ideal for planting and light work</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Late afternoon (4-7pm): Best for watering</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Next 48 hours: {weatherData?.forecast?.[1]?.rainChance > 50 ?
                                            "Good for rain-fed crops" : "Optimal for spraying"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Farming Recommendations */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <Tractor className="text-green-500" /> Farming Actions
                            </h3>

                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="text-orange-500" />
                                    <span>Urgent Recommendations</span>
                                </h4>
                                <ul className="space-y-3">
                                    {getFarmingRecommendations()
                                        .filter(rec => rec.urgency === "high")
                                        .map((rec, i) => (
                                            <li key={i} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
                                                <div className="mt-0.5">{rec.icon}</div>
                                                <span className="text-red-800">{rec.text}</span>
                                            </li>
                                        ))}
                                    {getFarmingRecommendations().filter(rec => rec.urgency === "high").length === 0 && (
                                        <li className="text-green-700 bg-green-50 p-3 rounded-lg">
                                            No urgent actions needed
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Sprout className="text-green-500" />
                                    <span>Planting Advice</span>
                                </h4>
                                <ul className="space-y-3">
                                    {getPlantingAdvice().map((advice, i) => (
                                        <li key={i} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                                            <div className="mt-0.5">{advice.icon}</div>
                                            <span className="text-blue-800">{advice.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Wheat className="text-amber-500" />
                                    <span>Seasonal Tips</span>
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Test soil pH this week for optimal planting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Rotate crops to prevent soil depletion</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Order seeds for next season's planting</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section (same as before) */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Farm Products & Equipment
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
                            View All Farm Products
                            <span className="text-green-600 text-xl">→</span>
                        </button>
                    </div>
                </div>
            </section>

            <AiAgriAssistant />

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-700 to-green-600 text-white text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Need Personalized Farm Advice?
                    </h2>
                    <p className="mb-8 text-lg">
                        Our agricultural experts can provide customized recommendations for your specific crops and conditions.
                    </p>
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

export default Home;