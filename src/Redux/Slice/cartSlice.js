import { createAsyncThunk, createSlice, original } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

// Initial state
const initialState = {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
    totalQuantity: JSON.parse(localStorage.getItem("cartTotalQuantity")) || 0,
    subTotal: JSON.parse(localStorage.getItem("subTotal")) || 0,
    totalPrice: JSON.parse(localStorage.getItem("cartTotalPrice")) || 0,
    totalDiscount: JSON.parse(localStorage.getItem("cartTotalDiscount")) || 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

// Helper function to recalculate totals
const recalculateTotals = (state) => {
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalDiscount = 0;

    state.items.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
        totalDiscount += (item.price * (item.offerPercentage || 0) / 100) * item.quantity;
    });

    state.totalQuantity = totalQuantity;
    state.totalPrice = totalPrice;
    state.totalDiscount = totalDiscount;

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(state.items));
    localStorage.setItem("cartTotalQuantity", JSON.stringify(totalQuantity));
    localStorage.setItem("cartTotalPrice", JSON.stringify(totalPrice));
    localStorage.setItem("cartTotalDiscount", JSON.stringify(totalDiscount));
};

// ✅ Fetch cart from backend
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/cart");
        console.log(res.data.data)
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
});

// ✅ Add to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (product, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/cart/add", product),
            {
                pending: "Adding to cart...",
                success: "Added to cart successfully 🎉",
                error: "Failed to add to cart 😞",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
});

// ✅ Remove from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.delete(`/cart/remove/${productId}`),
            {
                pending: "Removing item...",
                success: "Item removed successfully ✅",
                error: "Failed to remove item ❌",
            }
        );
        return { productId, data: res.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
});

// ✅ Update quantity
export const updateCartItemQuantity = createAsyncThunk("cart/updateQuantity", async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.put(`/cart/update/${productId}`, { quantity }),
            {
                pending: "Updating quantity...",
                success: "Quantity updated successfully ✅",
                error: "Failed to update quantity ❌",
            }
        );
        return { productId, quantity, data: res.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
    }
});

// ✅ Clear cart
export const clearCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.delete("/cart/clear"),
            {
                pending: "Clearing cart...",
                success: "Cart cleared successfully ✅",
                error: "Failed to clear cart ❌",
            }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
});

// ✅ Sync cart with backend
export const syncCart = createAsyncThunk("cart/syncCart", async (cartData, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/cart/sync", cartData);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to sync cart");
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Local cart actions (for offline support)
        localAddToCart(state, action) {
            const product = action.payload;
            const existingItem = state.items.find(item => item.productId === product.productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    ...product,
                    quantity: 1,
                    offerPercentage: product.offerPercentage || 0
                });
            }
            recalculateTotals(state);
        },
        localRemoveFromCart(state, action) {
            const productId = action.payload;
            state.items = state.items.filter(item => item.productId !== productId);
            recalculateTotals(state);
        },
        localDecrementQuantity(state, action) {
            const productId = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.items = state.items.filter(item => item.productId !== productId);
                }
                recalculateTotals(state);
            }
        },
        localClearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            state.totalDiscount = 0;
            localStorage.removeItem("cartItems");
            localStorage.removeItem("cartTotalQuantity");
            localStorage.removeItem("cartTotalPrice");
            localStorage.removeItem("cartTotalDiscount");
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCart.fulfilled, (state, action) => {

                console.log(action.payload?.data?.cart?.summary)

                state.status = "succeeded";
                state.items = action.payload?.data?.cart?.items || [];
                state.totalQuantity = action.payload.data?.cart?.summary?.totalQuantity || 0;
                state.totalPrice = action.payload?.data?.cart?.summary?.totalPrice || 0;
                state.totalDiscount = action.payload?.data?.cart?.summary?.totalDiscount || 0;
                state.subTotal = action.payload?.data?.cart?.summary?.netPrice || 0
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Add to cart
            .addCase(addToCart.fulfilled, (state, action) => {
                const product = action.payload;
                const existingItem = state.items.find(item => item.productId === product.productId);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.items.push({
                        ...product,
                        quantity: 1,
                        offerPercentage: product.offerPercentage || 0
                    });
                }
                recalculateTotals(state);
            })

            // Remove from cart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const { productId } = action.payload;
                state.items = state.items.filter(item => item.productId !== productId);
                recalculateTotals(state);
            })

            // Update quantity
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                const item = state.items.find(item => item.productId === productId);
                if (item) {
                    item.quantity = quantity;
                    recalculateTotals(state);
                }
            })

            // Clear cart
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalQuantity = 0;
                state.totalPrice = 0;
                state.totalDiscount = 0;
                localStorage.removeItem("cartItems");
                localStorage.removeItem("cartTotalQuantity");
                localStorage.removeItem("cartTotalPrice");
                localStorage.removeItem("cartTotalDiscount");
            })

            // Sync cart
            .addCase(syncCart.fulfilled, (state, action) => {
                state.items = action.payload.items || state.items;
                state.totalQuantity = action.payload.totalQuantity || state.totalQuantity;
                state.totalPrice = action.payload.totalPrice || state.totalPrice;
                state.totalDiscount = action.payload.totalDiscount || state.totalDiscount;
                recalculateTotals(state);
            });
    }
});

export const {
    localAddToCart,
    localRemoveFromCart,
    localDecrementQuantity,
    localClearCart
} = cartSlice.actions;

export default cartSlice.reducer;