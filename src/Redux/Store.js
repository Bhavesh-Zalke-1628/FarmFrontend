import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slice/authSlice.js'
import storeSlice from './Slice/storeSlice.js'
import razorpaySlice from './Slice/paymentSlice.js'
const store = configureStore({
    reducer: {
        auth: authSlice,
        store: storeSlice,
        payment: razorpaySlice
    },
    devTools: true
})


export default store