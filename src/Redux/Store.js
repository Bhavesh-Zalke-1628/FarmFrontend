// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import {
//     persistStore,
//     persistReducer,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // uses localStorage


// // Slices
// import authSlice from './Slice/authSlice';
// import storeSlice from './Slice/storeSlice';
// import razorpaySlice from './Slice/paymentSlice';
// import productSlice from './Slice/productSlice';
// import cartSlice from './Slice/cartSlice';
// import orderPaymentSlice from "./Slice/orderPaymentSlice";
// import farmSlice from './Slice/farmSlice';

// // Combine reducers
// const rootReducer = combineReducers({
//     auth: authSlice,
//     store: storeSlice,
//     payment: razorpaySlice,
//     products: productSlice,
//     cart: cartSlice,
//     order: orderPaymentSlice,
//     farm: farmSlice
// });

// // redux-persist config
// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage,
// };

// // persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Create the store
// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }),
//     devTools: process.env.NODE_ENV !== 'production',
// });

// // Create persistor
// export const persistor = persistStore(store);

// // Export store
// export default store;



import { configureStore } from "@reduxjs/toolkit";


//  Slices
import authSlice from './Slice/authSlice';
import storeSlice from './Slice/storeSlice';
import razorpaySlice from './Slice/paymentSlice';
import productSlice from './Slice/productSlice';
import cartSlice from './Slice/cartSlice';
import orderPaymentSlice from "./Slice/orderPaymentSlice";
import farmSlice from './Slice/farmSlice';
import cropsSlice from './Slice/cropsSlice'


const store = configureStore({
    reducer: {
        auth: authSlice,
        store: storeSlice,
        payment: razorpaySlice,
        products: productSlice,
        cart: cartSlice,
        order: orderPaymentSlice,
        farm: farmSlice,
        crops: cropsSlice
    },
    devTools: true
})

export default store;
