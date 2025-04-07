import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slice/authSlice';
import storeSlice from './Slice/storeSlice';
import razorpaySlice from './Slice/paymentSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        store: storeSlice,
        payment: razorpaySlice,
    },
    devTools: process.env.NODE_ENV !== 'production', // Enable dev tools only in development
});

export default store;
