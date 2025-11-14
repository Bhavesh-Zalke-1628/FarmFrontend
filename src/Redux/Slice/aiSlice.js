// src/Redux/Slices/aiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";

// 🔹 Thunks
export const getLocationInsights = createAsyncThunk(
    "ai/locationInsights",
    async (location, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/ai/location-insights", { location });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "AI service error");
        }
    }
);

export const getCropForecast = createAsyncThunk(
    "ai/cropForecast",
    async ({ crop, location }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/ai/crop-forecast", { crop, location });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "AI forecast error");
        }
    }
);

export const getPestAdvisory = createAsyncThunk(
    "ai/pestAdvisory",
    async ({ crop, region }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/ai/pest-advisory", { crop, region });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "AI pest advisory error");
        }
    }
);

// 🔹 Separate State for Each Thunk
const initialState = {
    locationInsights: {
        data: null,
        loading: false,
        error: null,
    },
    cropForecast: {
        data: null,
        loading: false,
        error: null,
    },
    pestAdvisory: {
        data: null,
        loading: false,
        error: null,
    },
};

const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 🌦 LOCATION INSIGHTS
        builder
            .addCase(getLocationInsights.pending, (state) => {
                state.locationInsights.loading = true;
                state.locationInsights.error = null;
            })
            .addCase(getLocationInsights.fulfilled, (state, action) => {
                state.locationInsights.loading = false;
                state.locationInsights.data = action.payload;
            })
            .addCase(getLocationInsights.rejected, (state, action) => {
                state.locationInsights.loading = false;
                state.locationInsights.error = action.payload;
            });

        // 🌾 CROP FORECAST
        builder
            .addCase(getCropForecast.pending, (state) => {
                state.cropForecast.loading = true;
                state.cropForecast.error = null;
            })
            .addCase(getCropForecast.fulfilled, (state, action) => {
                state.cropForecast.loading = false;
                state.cropForecast.data = action.payload;
            })
            .addCase(getCropForecast.rejected, (state, action) => {
                state.cropForecast.loading = false;
                state.cropForecast.error = action.payload;
            });

        // 🐛 PEST ADVISORY
        builder
            .addCase(getPestAdvisory.pending, (state) => {
                state.pestAdvisory.loading = true;
                state.pestAdvisory.error = null;
            })
            .addCase(getPestAdvisory.fulfilled, (state, action) => {
                state.pestAdvisory.loading = false;
                state.pestAdvisory.data = action.payload;
            })
            .addCase(getPestAdvisory.rejected, (state, action) => {
                state.pestAdvisory.loading = false;
                state.pestAdvisory.error = action.payload;
            });
    },
});

export default aiSlice.reducer;
