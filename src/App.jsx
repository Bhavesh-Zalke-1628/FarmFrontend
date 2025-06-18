import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/Signin';
import Checkout from './pages/Payment/CheckOut';
import AccessDenied from './pages/AccessDenied';
import { useSelector } from 'react-redux';
// import UserDashboard from './pages/FarmerDashboard';
import FarmerDashboard from './pages/FarmerDashboard';


function App() {
    const { isLoggedIn } = useSelector(state => state?.auth);

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<SignIn />} />

            <Route
                path='/profile'
                element={isLoggedIn ? <FarmerDashboard /> : <AccessDenied />}
            />
            <Route
                path='/checkout'
                element={isLoggedIn ? <Checkout /> : <AccessDenied />}
            />
        </Routes>
    );
}

export default App;
