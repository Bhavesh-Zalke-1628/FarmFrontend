import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

// Initial state
const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    role: localStorage.getItem("role") || null,
    data: JSON.parse(localStorage.getItem("data")) || {},
    users: []
};

// ✅ Create Account
export const createAccount = createAsyncThunk("/signup", async (data, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/users/register", data),
            {
                pending: "Creating user...",
                success: "User created successfully 🎉",
                error: "Failed to create user 😞",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
});


// ✅ Getting all user
export const getAllUsers = createAsyncThunk("/all-users", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/users/get-all-users")
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
});

// ✅ Login
export const loginAccount = createAsyncThunk("/login", async (data, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/users/login-user", data),
            {
                pending: "Signing in...",
                success: "Signed in successfully 🎉",
                error: "Failed to sign in 😞",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Invalid credentials");
    }
});

// ✅ Send OTP
export const sendOtp = createAsyncThunk("/send-otp", async (data, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/users/auth/send-otp", data),
            {
                pending: "Sending OTP...",
                success: "OTP sent successfully ✅",
                error: "Failed to send OTP ❌",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
});

// ✅ Verify OTP
export const verifyOtp = createAsyncThunk("/verify-otp", async (data, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/users/auth/verify-otp", data),
            {
                pending: "Verifying OTP...",
                success: "OTP verified successfully 🎉",
                error: "Invalid OTP ❌",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
});

// ✅ Logout
export const logoutAccount = createAsyncThunk("/logout", async (_, { fulfillWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.get("/users/logout"),
            {
                pending: "Logging out...",
                success: "Logged out successfully ✅",
                error: "Failed to logout ❌",
            }
        );

        // Clear localStorage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("data");
        localStorage.removeItem("token");

        return res.data;

    } catch (error) {
        console.error("Logout error:", error);
        return fulfillWithValue(true); // Fulfill even if API fails
    }
});

// ✅ Update Profile
export const updateProfile = createAsyncThunk("/update-profile", async (formData, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.put("/users/update-profile", formData),
            {
                pending: "Updating profile...",
                success: "Profile updated successfully ✅",
                error: "Failed to update profile ❌",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
});


// ✅ Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(createAccount.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.role = action.payload.user.role;
                state.data = action.payload.user;

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", action.payload.user.role);
                localStorage.setItem("data", JSON.stringify(action.payload.user));
            })

            // Login
            .addCase(loginAccount.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.role = action.payload.data.user.role;
                state.data = action.payload.data.user;

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", action.payload.data.user.role);
                localStorage.setItem("data", JSON.stringify(action.payload.data.user));
                localStorage.setItem("token", action.payload.accessToken);
            })

            // Logout
            .addCase(logoutAccount.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.role = "";
                state.data = {};
            })

            // Update Profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.data = action.payload.data || {};
                localStorage.setItem("data", JSON.stringify(action.payload.data));
            })

            // gettting all users
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.users = action.payload.data || []
            })
    },
});

export default authSlice.reducer;
