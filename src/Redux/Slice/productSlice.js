import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
    product: {},
    products: [],
    totalCount: 0,
    loading: false,
    error: false,
};

// All async thunks
export const getAllProduct = createAsyncThunk(
    "product/getAll",
    async ({ limit = 10, skip = 0 }, { rejectWithValue }) => {
        console.log("hello")
        try {
            const res = await axiosInstance.get(`/product/get-all-product?limit=${limit}&skip=${skip}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

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

export const getProductByStoreId = createAsyncThunk(
    "product/getByStoreId",
    async (storeId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/product/get-store-product/${storeId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch store products");
        }
    }
);

export const createProduct = createAsyncThunk(
    "product/create",
    async ({ storeId, productData }, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.post(`/product/create-product/${storeId}`, productData, {
                    headers: { "Content-Type": "multipart/form-data" },
                }),
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

export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ productId, productData }, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.put(`/product/update-product/${productId}`, productData),
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

export const changeStockStatus = createAsyncThunk(
    "product/changeStockStatus",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.patch(`/product/change-stock-product/${productId}`),
                {
                    pending: "Toggling stock...",
                    success: "Stock status updated",
                    error: "Failed to update stock status",
                }
            );
            return { productId, updatedProduct: res.data.data || res.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update stock status");
        }
    }
);

export const updateProductQuantity = createAsyncThunk(
    "product/updateProductQuantity",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.patch(`/product/change-product-quantity/${productId}`, { quantity }),
                {
                    pending: "Updating quantity...",
                    success: "Product quantity updated",
                    error: "Failed to update quantity",
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
        }
    }
);

// Product Slice
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clearProductState: (state) => {
            state.product = {};
            state.products = [];
            state.totalCount = 0;
            state.loading = false;
            state.error = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // All products (pagination)
            .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.loading = false;
                const { products = [], totalCount = 0 } = action.payload?.data || {};
                state.products = products;
                state.totalCount = totalCount;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Single product
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

            // Products by store
            .addCase(getProductByStoreId.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getProductByStoreId.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data || [];
            })
            .addCase(getProductByStoreId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                const newProduct = action.payload.data || action.payload;
                state.product = newProduct;
                state.products.unshift(newProduct);
                state.totalCount += 1;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data || action.payload;
                state.product = updated;
                state.products = state.products.map((p) =>
                    p._id === updated._id ? updated : p
                );
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.meta.arg;
                state.products = state.products.filter(p => p._id !== deletedId);
                state.totalCount = Math.max(0, state.totalCount - 1);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Change stock
            .addCase(changeStockStatus.fulfilled, (state, action) => {
                const { productId, updatedProduct } = action.payload;
                state.products = state.products.map(p =>
                    p._id === productId ? updatedProduct : p
                );
            })
            .addCase(changeStockStatus.rejected, (state, action) => {
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Update quantity
            .addCase(updateProductQuantity.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateProductQuantity.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data || action.payload;
                state.products = state.products.map((p) =>
                    p._id === updated._id ? updated : p
                );
            })
            .addCase(updateProductQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
