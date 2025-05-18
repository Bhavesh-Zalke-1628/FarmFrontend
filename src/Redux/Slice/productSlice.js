import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
    product: {},
    products: [],
    loading: false,
    error: false,
};

// ✅ Create Product
export const createProduct = createAsyncThunk(
    "product/create",
    async ({ storeId, ...productData }, { rejectWithValue }) => {
        try {


            const res = await toast.promise(
                axiosInstance.post(`/product/create-product/${storeId}`, productData),
                {
                    pending: "Creating product...",
                    success: "Product created successfully 🎉",
                    error: "Failed to create product 😞",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// ✅ Get All Products
export const getAllProduct = createAsyncThunk(
    "product/getAll",
    async ({ rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/product/get-all-product`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);



// ✅ Get Product By ID
export const getProductById = createAsyncThunk(
    "product/getById",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/product/get-product/${productId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// ✅ Update Product
export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ productId, updateData }, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.put(`/product/update-product/${productId}`, updateData),
                {
                    pending: "Updating product...",
                    success: "Product updated successfully ✅",
                    error: "Failed to update product ❌",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// ✅ Delete Product
export const deleteProduct = createAsyncThunk(
    "product/delete",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.delete(`/product/delete-product/${productId}`),
                {
                    pending: "Deleting product...",
                    error: "Failed to delete product ❌",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// ✅ Product Slice
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Create
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                console.log(action.payload)
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(action.payload);
            })

            // Get All
            .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(action.payload);
            })

            // Get By ID
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(action.payload);
            })

            // Update
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(action.payload);
            })

            // Delete
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                toast.success("Deleted successfully");
                // Optional: Remove from `products` list
                state.products = state.products.filter(p => p._id !== action.meta.arg);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(action.payload);
            });
    },
});

export default productSlice.reducer;
