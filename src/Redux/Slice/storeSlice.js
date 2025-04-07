import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
    isLoading: false,
    stores: [],
    store: {},

}


export const createStore = createAsyncThunk('/create-store', async (data) => {
    try {
        console.log(data)
        const res = await toast.promise(
            axiosInstance.post('/store/create-store', data),
            {
                pending: "Creating user...",
                success: "User created successfully 🎉",
                error: "Failed to create user 😞"
            }
        );
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
})



const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

    }
})


export default storeSlice.reducer