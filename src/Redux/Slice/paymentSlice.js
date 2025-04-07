import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

// ✅ Get Razorpay Key
export const getRazorPayId = createAsyncThunk("razorpay/getId", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/payment/razorpay/getid");
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to load Razorpay key");
    }
});

// ✅ Subscribe to Plan
export const purchaseCourseBundle = createAsyncThunk("razorpay/purchase", async (_, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            (async () => await axiosInstance.post("/payment/razorpay/subscribe"))(),
            {
                pending: "Subscribing...",
                success: "Subscription successful 🎉",
                error: "Subscription failed ❌",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to subscribe");
    }
});

// ✅ Verify Razorpay Payment
export const verifyUserPayment = createAsyncThunk("razorpay/verify", async (data, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            (async () => await axiosInstance.post("/payment/razorpay/verify", data))(),
            {
                pending: "Verifying payment...",
                success: "Payment verified ✅",
                error: "Verification failed ❌",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Verification error");
    }
});

// ✅ Get All Payment Records
export const getPaymentRecord = createAsyncThunk("razorpay/record", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/payment/razorpay/all");
        toast.success(res.data?.msg || "Payments loaded");
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch payments");
    }
});

// ✅ Cancel Subscription
export const cancelCourseBundle = createAsyncThunk("razorpay/cancel", async (_, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            (async () => await axiosInstance.post("/payment/unsubscribe"))(),
            {
                pending: "Unsubscribing...",
                success: "Subscription cancelled ✅",
                error: "Cancellation failed ❌",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to cancel subscription");
    }
});

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRazorPayId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.key = action?.payload?.data?.key;
            })
            .addCase(getRazorPayId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            .addCase(purchaseCourseBundle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subscription_id = action.payload?.data?.subscription_id;
            })
            .addCase(purchaseCourseBundle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            .addCase(verifyUserPayment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isPaymentVerified = action.payload?.success;
                state.status = action.payload?.store?.subscription?.status || "";
            })
            .addCase(verifyUserPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.isPaymentVerified = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            .addCase(getPaymentRecord.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allPayments = action.payload?.allPayments || {};
                state.finalMonths = action.payload?.finalMonths || {};
                state.monthlySalesRecord = action.payload?.monthlySalesRecord || [];
            })
            .addCase(getPaymentRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

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
    },
});

export default razorpaySlice.reducer;
