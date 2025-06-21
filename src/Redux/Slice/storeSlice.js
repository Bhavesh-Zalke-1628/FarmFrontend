import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
    isLoading: false,
    stores: [],
    store: {},
};

// 👉 GET STORE DETAILS (Conditional fetch)
export const getStoreDetails = createAsyncThunk(
    "store/getStoreDetails",
    async (id, { getState, rejectWithValue }) => {
        const existingStore = getState().store.store;

        // Don't refetch if we already have store data for the same ID
        if (existingStore && existingStore._id === id) {
            return { data: existingStore };
        }

        try {
            const res = await toast.promise(
                axiosInstance.get(`/store/get-store/${id}`),
                {
                    pending: "Fetching store data...",
                    success: "Store data fetched ✅",
                    error: "Failed to fetch store data ❌",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Server Error");
        }
    }
);

// 👉 CREATE STORE
export const createStore = createAsyncThunk(
    "store/createStore",
    async (data, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.post("/store/create-store", data),
                {
                    pending: "Creating store...",
                    success: "Store created successfully 🎉",
                    error: "Failed to create store ❌",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Server Error");
        }
    }
);

export const updateStore = createAsyncThunk(
    "store/updateStore",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.put(`/store/update-store/${id}`, data),
                {
                    pending: "Creating store...",
                    success: "Store created successfully 🎉",
                    error: "Failed to create store ❌",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Server Error");
        }
    }
);

const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        // Clear store manually
        clearStore: (state) => {
            state.store = {};
        }
    },
    extraReducers: (builder) => {
        builder
            // 👉 GET STORE DETAILS
            .addCase(getStoreDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStoreDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.store = action?.payload?.data[0];
            })
            .addCase(getStoreDetails.rejected, (state) => {
                state.isLoading = false;
            })

            // 👉 CREATE STORE
            .addCase(createStore.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createStore.fulfilled, (state, action) => {
                state.isLoading = false;
                state.store = action?.payload?.data; // store created data
            })
            .addCase(createStore.rejected, (state) => {
                state.isLoading = false;
            })

            // update 
            .addCase(updateStore.fulfilled, (state, action) => {
                state.store = action.payload.data
            })
    },
});

export const { clearStore } = storeSlice.actions;
export default storeSlice.reducer;
