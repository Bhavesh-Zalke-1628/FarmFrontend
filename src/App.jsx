import React from 'react';
import { Route, Router, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/Signin';
import FarmerDashboard from './pages/FarmerDashboard';
import Checkout from './pages/Payment/CheckOut';

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />

                <Route path='/profile' element={<FarmerDashboard />}></Route>
                <Route path='/checkout' element={<Checkout />}></Route>
            </Routes>
        </>
    );
}

export default App;
