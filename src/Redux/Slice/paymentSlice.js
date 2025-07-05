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
    paymentInitializing: false,
};

// ✅ Get Razorpay Key
export const getRazorPayId = createAsyncThunk(
    "razorpay/getId",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/payment/razorpay/getid");

            console.log(data)
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load Razorpay key"
            );
        }
    }
);

// ✅ Subscribe to Plan
export const purchaseCourseBundle = createAsyncThunk(
    "razorpay/purchase",
    async (_, { rejectWithValue }) => {
        try {
            const response = await toast.promise(
                axiosInstance.post("/payment/razorpay/subscribe"),
                {
                    pending: "Subscribing to plan...",
                    success: "Subscription successful 🎉",
                    error: "Subscription failed ❌",
                }
            );
            console.log(response.data)

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to complete subscription"
            );
        }
    }
);

// ✅ Verify Razorpay Payment
export const verifyUserPayment = createAsyncThunk(
    "razorpay/verify",
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await toast.promise(
                axiosInstance.post("/payment/razorpay/verify", paymentData),
                {
                    pending: "Verifying payment...",
                    success: "Payment verified successfully ✅",
                    error: "Payment verification failed ❌",
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Payment verification error"
            );
        }
    }
);

// ✅ Get All Payment Records
export const getPaymentRecord = createAsyncThunk(
    "razorpay/record",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/payment/razorpay/all");
            toast.success(data?.message || "Payments loaded successfully");
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch payment records"
            );
        }
    }
);

// ✅ Cancel Subscription
export const cancelCourseBundle = createAsyncThunk(
    "razorpay/cancel",
    async (_, { rejectWithValue }) => {
        try {
            const response = await toast.promise(
                axiosInstance.post("/payment/unsubscribe"),
                {
                    pending: "Cancelling subscription...",
                    success: "Subscription cancelled successfully ✅",
                    error: "Failed to cancel subscription ❌",
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Subscription cancellation failed"
            );
        }
    }
);

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.key = "";
            state.subscription_id = "";
            state.isPaymentVerified = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Razorpay Key
            .addCase(getRazorPayId.pending, (state) => {
                state.paymentInitializing = true;
                state.error = null;
            })
            .addCase(getRazorPayId.fulfilled, (state, { payload }) => {
                state.paymentInitializing = false;

                console.log(payload)
                state.key = payload?.data?.key || "";
            })
            .addCase(getRazorPayId.rejected, (state, { payload }) => {
                state.paymentInitializing = false;
                state.error = payload;
                toast.error(payload);
            })

            // Purchase Course Bundle
            .addCase(purchaseCourseBundle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(purchaseCourseBundle.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.subscription_id = payload?.subscription_id || "";
            })
            .addCase(purchaseCourseBundle.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
                toast.error(payload);
            })

            // Verify User Payment
            .addCase(verifyUserPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyUserPayment.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isPaymentVerified = payload?.success || false;
                state.status = payload?.store?.subscription?.status || "";
            })
            .addCase(verifyUserPayment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isPaymentVerified = false;
                state.error = payload;
                toast.error(payload);
            })

            // Get Payment Record
            .addCase(getPaymentRecord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPaymentRecord.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.allPayments = payload?.allPayments || {};
                state.finalMonths = payload?.finalMonths || {};
                state.monthlySalesRecord = payload?.monthlySalesRecord || [];
            })
            .addCase(getPaymentRecord.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
                toast.error(payload);
            })

            // Cancel Course Bundle
            .addCase(cancelCourseBundle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelCourseBundle.fulfilled, (state) => {
                state.isLoading = false;
                state.subscription_id = "";
                state.isPaymentVerified = false;
                state.status = "cancelled";
            })
            .addCase(cancelCourseBundle.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
                toast.error(payload);
            });
    },
});

export const { resetPaymentState } = razorpaySlice.actions;
export default razorpaySlice.reducer;