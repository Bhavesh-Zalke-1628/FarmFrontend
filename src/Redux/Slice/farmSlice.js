import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const OPENWEATHER_API_KEY = 'c0767a98c8629fa2703381c21cef3eb6';
const BACKEND_API_URL = 'http://localhost:5001/api';

export const fetchFarmData = createAsyncThunk(
    'farm/fetchData',
    async (coords, { rejectWithValue }) => {
        try {
            const { lat, lon } = coords;

            // Fetch weather data
            const weatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
            );

            // Fetch crop recommendations from your Python backend
            const analysisResponse = await axios.post(`${BACKEND_API_URL}/full-analysis`, {
                location: { lat, lon }
            });

            console.log("analysisResponse", analysisResponse)

            // Process data
            const currentWeather = weatherResponse.data.list[0];
            const forecast = weatherResponse.data.list.slice(0, 8).map(item => ({
                datetime: item.dt_txt,
                temp: item.main.temp,
                humidity: item.main.humidity,
                conditions: item.weather[0].description
            }));

            return {
                location: weatherResponse.data.city.name,
                current: {
                    temperature: currentWeather.main.temp,
                    humidity: currentWeather.main.humidity,
                    rainfall: calculateRainfall(weatherResponse.data.list.slice(0, 8))
                },
                forecast,
                recommendations: analysisResponse.data.recommended_crops,
                soilMoisture: Math.floor(Math.random() * 30) + 50,
                lastRainfall: (Math.random() * 10).toFixed(1)
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

function calculateRainfall(forecastItems) {
    return forecastItems.reduce((total, item) => {
        return total + (item.rain ? item.rain['3h'] || 0 : 0);
    }, 0);
}

const initialState = {
    locationName: 'Your Farm Location',
    weather: null,
    recommendations: [],
    soilMoisture: null,
    lastRainfall: null,
    loading: false,
    error: null
};

const farmSlice = createSlice({
    name: 'farm',
    initialState,
    reducers: {
        setLocationName: (state, action) => {
            state.locationName = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFarmData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFarmData.fulfilled, (state, action) => {
                state.loading = false;
                state.weather = {
                    current: action.payload.current,
                    forecast: action.payload.forecast
                };
                state.recommendations = action.payload.recommendations;
                state.soilMoisture = action.payload.soilMoisture;
                state.lastRainfall = action.payload.lastRainfall;
                state.locationName = action.payload.location;
            })
            .addCase(fetchFarmData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setLocationName } = farmSlice.actions;
export default farmSlice.reducer;