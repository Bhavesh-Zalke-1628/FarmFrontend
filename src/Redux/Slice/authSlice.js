import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === "true",
    role: localStorage.getItem('role') || "",
    data: JSON.parse(localStorage.getItem('data')) || {},
};

// ✅ Create Account Thunk
export const createAccount = createAsyncThunk("/signup", async (data, { rejectWithValue }) => {
    try {
        console.log(data)
        const res = await toast.promise(
            axiosInstance.post('/users/register', data),
            {
                pending: "Creating user...",
                success: "User created successfully 🎉",
                error: "Failed to create user 😞"
            }
        );
        console.log(res)
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
});


// ✅ Login Thunk (Fixed rejectWithValue issue)
export const loginAccount = createAsyncThunk("/login", async (data, { rejectWithValue }) => {
    try {
        console.log("🔹 Sending Login Request:", data);
        const res = await toast.promise(
            axiosInstance.post('/users/login-user', data),
            {
                pending: "Signing user...",
                success: "Sign in successfully 🎉",
                error: "Failed to sign in 😞"
            }
        );

        console.log("✅ Login Response:", res.data);

        return await (res).data;
    } catch (error) {
        console.error("❌ Login Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || "Invalid credentials");
    }
});


// ✅ Send OTP Thunk
export const sendOtp = createAsyncThunk("/send-otp", async (data, { rejectWithValue }) => {
    try {
        console.log(data)
        const res = await toast.promise(
            axiosInstance.post('/users/auth/send-otp', data),
            {
                pending: "Sending OTP...",
                success: "OTP sent successfully ✅",
                error: "Failed to send OTP ❌"
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
});

// ✅ Verify OTP Thunk
export const verifyOtp = createAsyncThunk("/verify-otp", async (data, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post('/users/auth/verify-otp', data),
            {
                pending: "Verifying OTP...", success: "OTP verified successfully 🎉",
                error: "Invalid OTP ❌"
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
});

// ✅ Auth Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
            state.role = "";
            state.data = {};

            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('role');
            localStorage.removeItem('data');
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoggedIn = true;
                state.role = action.payload.user.role;
                state.data = action.payload.user;

                localStorage.setItem('isLoggedIn', "true");
                localStorage.setItem('role', action.payload.user.role);
                localStorage.setItem('data', JSON.stringify(action.payload.user));
            })
            .addCase(loginAccount.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoggedIn = true;
                state.role = action.payload.data.user.role;
                state.data = action.payload.data.user;

                localStorage.setItem('isLoggedIn', "true");
                localStorage.setItem('role', action.payload.data.user.role);
                localStorage.setItem('data', JSON.stringify(action.payload.data.user));
                localStorage.setItem('token', action.payload.accessToken);
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
