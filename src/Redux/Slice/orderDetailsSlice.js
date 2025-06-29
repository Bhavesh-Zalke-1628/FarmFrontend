import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";

const initialState = {
    orders: [],
    customerOrders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
    status: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
};

// Async Thunks
export const createOrderDetails = createAsyncThunk(
    "orderDetails/createDetails",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/order-details/create-order-details", data);
            return res.data?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Order creation failed");
        }
    }
);

export const getAllOrderDetails = createAsyncThunk(
    "orderDetails/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/order-details");
            return res.data?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

export const getOrderDetailsByCustomerId = createAsyncThunk(
    "orderDetails/getByCustomerId",
    async (customerId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/order-details/customer/${customerId}`);
            return res.data?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch customer orders");
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "orderDetails/updateStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/order-details/${orderId}/status`, { status });
            return res.data?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update order status");
        }
    }
);

export const deleteOrderDetails = createAsyncThunk(
    "orderDetails/delete",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/order-details/${orderId}`);
            return res.data?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete order");
        }
    }
);

// Slice
const orderDetailsSlice = createSlice({
    name: "orderDetails",
    initialState,
    reducers: {
        resetOrderDetailsState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Order Details
            .addCase(createOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.status = 'loading';
            })
            .addCase(createOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.status = 'succeeded';
                state.orders.unshift(action.payload);
                state.currentOrder = action.payload;
            })
            .addCase(createOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            })

            // Get All Order Details
            .addCase(getAllOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(getAllOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getAllOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            })

            // Get Orders by Customer ID
            .addCase(getOrderDetailsByCustomerId.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(getOrderDetailsByCustomerId.fulfilled, (state, action) => {
                state.loading = false;
                state.customerOrders = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getOrderDetailsByCustomerId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            })

            // Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.status = 'loading';
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.status = 'succeeded';
                state.orders = state.orders.map(order =>
                    order._id === action.payload._id ? action.payload : order
                );
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            })

            // Delete Order
            .addCase(deleteOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.status = 'loading';
            })
            .addCase(deleteOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.status = 'succeeded';
                state.orders = state.orders.filter(order => order._id !== action.payload._id);
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = null;
                }
            })
            .addCase(deleteOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            });
    }
});

// Export actions and reducer
export const { resetOrderDetailsState, clearCurrentOrder } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;