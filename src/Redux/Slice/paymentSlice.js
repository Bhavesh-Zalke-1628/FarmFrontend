import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../Helper/axiosInstance";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: [],
    status: "",
    isLoading: false,
    error: null,
};


// api
// http://localhost:4000/api/v1/payment/razorpay/getid

// ✅ Get Razorpay Key
export const getRazorPayId = createAsyncThunk("/razorpay/getId", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/payment/razorpay/getid');
        return res.data;
    } catch (error) {
        return rejectWithValue("Failed to load Razorpay key");
    }
});

// ✅ Purchase Course Bundle
export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async (_, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post('/payment/razorpay/subscribe'),
            {
                pending: "Subscribing to bundle...",
                success: "Subscription successful 🎉",
                error: "Failed to subscribe ❌"
            }
        );

        console.log(res)
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to purchase bundle");
    }
});

// ✅ Verify Payment
export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post('/payment/razorpay/verify', {
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_subscription_id: data.razorpay_subscription_id,
                razorpay_signature: data.razorpay_signature
            }),
            {
                pending: "Verifying payment...",
                success: "Payment verified ✅",
                error: "Verification failed ❌"
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Payment verification failed");
    }
});

// ✅ Get Payment Record
export const getPaymentRecord = createAsyncThunk("/payments/record", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('http://localhost:5000/api/payment?count=100');
        toast.success(res?.data?.msg || "Payment records loaded");
        return res.data;
    } catch (error) {
        return rejectWithValue("Failed to fetch payment records");
    }
});

// ✅ Cancel Subscription
export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async (_, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/payment/unsubscribe"),
            {
                pending: "Unsubscribing...",
                success: "Unsubscribed successfully ✅",
                error: "Failed to unsubscribe ❌"
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.msg || "Failed to cancel subscription");
    }
});

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Razorpay ID
            .addCase(getRazorPayId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
                state.key = action?.payload?.data?.getId;
            })
            .addCase(getRazorPayId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Purchase
            .addCase(purchaseCourseBundle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
                state.subscription_id = action?.payload?.subscription_id;
            })
            .addCase(purchaseCourseBundle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Verify
            .addCase(verifyUserPayment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isPaymentVerified = action?.payload?.success;
                state.status = action?.payload?.subscription?.status;
            })
            .addCase(verifyUserPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.isPaymentVerified = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Payment Record
            .addCase(getPaymentRecord.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allPayments = action?.payload?.allPayments;
                state.finalMonths = action?.payload?.finalMonths;
                state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
            })
            .addCase(getPaymentRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Cancel
            .addCase(cancelCourseBundle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelCourseBundle.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(cancelCourseBundle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    }
});

export default razorpaySlice.reducer;
