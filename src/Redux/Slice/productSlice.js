import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
    product: {},
    products: [],
    loading: false,
    error: false,
};

// Get All Products
export const getAllProduct = createAsyncThunk(
    "product/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/product/get-all-product");
            console.log(res.data?.data)
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

// Get Product By ID
export const getProductById = createAsyncThunk(
    "product/getById",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/product/get-product/${productId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
        }
    }
);

// Create Product
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
            return rejectWithValue(error.response?.data?.message || "Failed to create product");
        }
    }
);

// Update Product
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
            return rejectWithValue(error.response?.data?.message || "Failed to update product");
        }
    }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
    "product/delete",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.delete(`/product/delete-product/${productId}`),
                {
                    pending: "Deleting product...",
                    success: "Product deleted successfully",
                    error: "Failed to delete product ❌",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete product");
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clearProductState: (state) => {
            state.product = {};
            state.loading = false;
            state.error = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Products
            .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data || action.payload;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Get Product By ID
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data || action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Create Product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data || action.payload;
                state.products.unshift(action.payload.data || action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data || action.payload;
                state.products = state.products.map(product =>
                    product._id === action.payload._id ? action.payload.data || action.payload : product
                );
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(
                    product => product._id !== action.meta.arg
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;