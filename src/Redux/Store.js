import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slice/authSlice';
import storeSlice from './Slice/storeSlice';
import razorpaySlice from './Slice/paymentSlice';
import productSlice from './Slice/productSlice'
import cartSlice from './Slice/cartSlice'
import orderPaymentSlice from "./Slice/orderPaymentSlice"
import farmSlice from './Slice/farmSlice'
const store = configureStore({
    reducer: {
        auth: authSlice,
        store: storeSlice,
        payment: razorpaySlice,
        products: productSlice,
        cart: cartSlice,
        order: orderPaymentSlice,
        farm :farmSlice
    },
    devTools: process.env.NODE_ENV !== 'production', // Enable dev tools only in development
});

export default store;
