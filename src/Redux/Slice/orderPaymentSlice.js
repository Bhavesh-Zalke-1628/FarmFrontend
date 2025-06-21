import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../Helper/axiosInstance";

const initialState = {
    key: "",
    orderId: "",
    isPaymentVerified: false,
    orderDetails: {},
    isLoading: false,
    error: null,
};

// 1️⃣ Get Razorpay Key
export const getRazorpayKey = createAsyncThunk("orderPayment/key", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/order/razorpay/getid");
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get key");
    }
});

// 2️⃣ Create Razorpay Order
export const createRazorpayOrder = createAsyncThunk("orderPayment/createOrder", async (amount, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/order/razorpay/order", { amount });
        return await res.data?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Order creation failed");
    }
});

// 3️⃣ Verify Payment
export const verifyOrderPayment = createAsyncThunk("orderPayment/verify", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/order/razorpay/verify", data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
});


// cash order 
export const cashOrder = createAsyncThunk("orderPayment/cashOrder", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/order/cash-order", { amount: data });
        return res.data;

    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
})


const orderPaymentSlice = createSlice({
    name: "orderPayment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRazorpayKey.fulfilled, (state, action) => {
                state.key = action?.payload?.data?.key;
            })
            .addCase(createRazorpayOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRazorpayOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderId = action?.payload?.orderId;
                state.orderDetails = action?.payload;
            })
            .addCase(createRazorpayOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(verifyOrderPayment.fulfilled, (state, action) => {
                state.isPaymentVerified = action?.payload?.success;
            })
            .addCase(verifyOrderPayment.rejected, (state, action) => {
                state.isPaymentVerified = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export default orderPaymentSlice.reducer;
