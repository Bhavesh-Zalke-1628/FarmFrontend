import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    console.log(isLoggedIn)

    if (!isLoggedIn) {
        // ✅ Redirect to Sign In if not logged in
        return <Navigate to="/signin" />
    }

    // ✅ Allow access if logged in
    return children
}

export default ProtectedRoute
