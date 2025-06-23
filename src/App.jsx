import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/Signin';
import Checkout from './pages/Payment/CheckOut';
import AccessDenied from './pages/AccessDenied';
import FarmerDashboard from './pages/FarmerDashboard';
import AllProduct from './pages/Product/AllProduct';
import Cart from './pages/Cart/Cart';
import OrderPayment from './pages/Payment/OrderPayment';
import ThankYou from './Component/Comman/ThankYou';
import OrderSummary from './pages/Payment/OrderSummary';
import FarmerFancyHomePage from './pages/FarmerHomePage';

// Reusable wrapper for protected routes
const ProtectedRoute = ({ isAllowed, children }) => {
    return isAllowed ? children : <AccessDenied />;
};

function App() {
    const { isLoggedIn } = useSelector((state) => state.auth);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />

            {/* Protected Routes */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute isAllowed={isLoggedIn}>
                        <FarmerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/checkout"
                element={
                    <ProtectedRoute isAllowed={isLoggedIn}>
                        <Checkout />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/order-checkout"
                element={
                    <ProtectedRoute isAllowed={isLoggedIn}>
                        <OrderPayment />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/products"
                element={
                    <ProtectedRoute isAllowed={isLoggedIn}>
                        <AllProduct />
                    </ProtectedRoute>
                }
            />

            <Route
                path='/cart'
                element={
                    <ProtectedRoute isAllowed={isLoggedIn}>
                        <Cart />
                    </ProtectedRoute>
                }
            />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path='/order-summary' element={<OrderSummary />} />
            <Route path='/farmer-home' element={<FarmerFancyHomePage />} />

        </Routes>
    );
}

export default App;
