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

// ✅ Lazy Loaded Product Fetch
export const getAllProduct = createAsyncThunk(
    "product/getAll",
    async ({ limit = 10, skip = 0 }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/product/get-all-product?limit=${limit}&skip=${skip}`);
            return res.data; // expected { data: { products: [], totalCount } }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

// Get Single Product
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

// Get Products by Store ID
export const getProductByStoreId = createAsyncThunk(
    "product/getstoreById",
    async (storeId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/product/get-store-product/${storeId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
        }
    }
);

// Create Product
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

// Update Product
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

// Toggle Stock Status
export const changeStockStatus = createAsyncThunk(
    "product/changeStockStatus",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await toast.promise(
                axiosInstance.patch(`/product/change-stock-product/${productId}`)
            );
            return { productId, updatedProduct: res.data.data || res.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update stock status");
        }
    }
);

// Update Product Quantity
export const updateProductQuantity = createAsyncThunk(
    "products/updateProductQuantity",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(
                `/product/change-product-quantity/${productId}`,
                { quantity }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update quantity");
        }
    }
);

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
            // ✅ Get All Products (Pagination)
            .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.loading = false;

                const response = action.payload?.data || {};
                const newProducts = response.products || [];
                const totalCount = response.totalCount || 0;

                // ✅ Replace the whole page — don't append
                state.products = newProducts;
                state.totalCount = totalCount;
            })

            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Get by ID
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

            // Create
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                const newProduct = action.payload.data || action.payload;
                state.product = newProduct;
                state.products.unshift(newProduct);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
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

            // Delete
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.meta.arg;
                state.products = state.products.filter(p => p._id !== deletedId);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Change Stock Status
            .addCase(changeStockStatus.fulfilled, (state, action) => {
                const { productId, updatedProduct } = action.payload;
                state.products = state.products.map(p =>
                    p._id === productId ? updatedProduct : p
                );
            })
            .addCase(changeStockStatus.rejected, (state, action) => {
                toast.error(action.payload);
                state.error = action.payload;
            })

            // Update Quantity
            .addCase(updateProductQuantity.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateProductQuantity.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data;
                state.products = state.products.map((p) =>
                    p._id === updated._id ? updated : p
                );
            })
            .addCase(updateProductQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Store Products
            .addCase(getProductByStoreId.fulfilled, (state, action) => {
                state.products = action.payload.data;
            });
    },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
