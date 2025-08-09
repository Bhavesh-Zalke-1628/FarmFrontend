import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { X } from "lucide-react";

const initialState = {
    crops: [],
    loading: false,
    error: null,
};

// 📌 GET All Crops
export const getAllCrops = createAsyncThunk("crops/getAll", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/crops/get-crops");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch crops");
    }
});

// 📌 ADD Crop
export const addCrop = createAsyncThunk("crops/add", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/crops/add-crop", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to add crop");
    }
});

// 📌 UPDATE Crop
export const updateCrop = createAsyncThunk("crops/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put(`/crops/update-crop/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to update crop");
    }
});

// 📌 DELETE Crop
export const deleteCrop = createAsyncThunk("crops/delete", async (id, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/crops/delete-crop/${id}`);
        return id; // return the deleted crop ID for filtering in state
    } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to delete crop");
    }
});

const cropsSlice = createSlice({
    name: "crops",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ GET All Crops
            .addCase(getAllCrops.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCrops.fulfilled, (state, action) => {
                console.log(action.payload)
                state.crops = action.payload.data || [];
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllCrops.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ ADD Crop
            .addCase(addCrop.fulfilled, (state, action) => {
                state.crops.push(action.payload.data);
            })

            // ✅ UPDATE Crop
            .addCase(updateCrop.fulfilled, (state, action) => {
                const index = state.crops.findIndex((c) => c._id === action.payload.data._id);
                if (index !== -1) {
                    state.crops[index] = action.payload.data;
                }
            })

            // ✅ DELETE Crop
            .addCase(deleteCrop.fulfilled, (state, action) => {
                state.crops = state.crops.filter((c) => c._id !== action.payload);
            });
    },
});

export default cropsSlice.reducer;
