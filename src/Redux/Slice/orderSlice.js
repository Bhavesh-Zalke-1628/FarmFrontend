import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/axiosInstance"

const initialState = {
    orders: [],
    loading: false,
    error: null
}


export const getAllOrders = createAsyncThunk(
    "/orders/get", async () => {
        try {
            const res = await axiosInstance.get("/order-details")
            return res.data;
        } catch (error) {
            console.log(error)
        }
    }
)

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrders.pending((state, action) => {
                state.loading = true
                state.error = null
            }))
            .addCase(getAllOrders.fulfilled((state, action) => {
                state.loading = false
                state.orders = action.payload
            })).addCase(getAllOrders.pending((state, action) => {
                state.loading = false
                state.error = "Failed to load orders" || null
            }))

    }


})