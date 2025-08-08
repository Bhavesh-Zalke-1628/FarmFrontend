import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-toastify";

// Configuration constants
const SHIPPING_RULES = {
    FREE_SHIPPING_THRESHOLD: 1000, // Free shipping for orders over ₹1000
    TIERED_SHIPPING: [
        { min: 0, max: 500, fee: 50 },    // ₹50 for orders under ₹500
        { min: 500, max: 1000, fee: 30 }, // ₹30 for orders between ₹500-₹1000
    ],
    MINIMUM_ORDER: 200, // Minimum order amount
};

// Initial state
const initialState = {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
    totalQuantity: JSON.parse(localStorage.getItem("cartTotalQuantity")) || 0,
    grandTotal: JSON.parse(localStorage.getItem("grandTotal")) || 0,
    totalPrice: JSON.parse(localStorage.getItem("cartTotalPrice")) || 0,
    totalDiscount: JSON.parse(localStorage.getItem("cartTotalDiscount")) || 0,
    shippingFee: JSON.parse(localStorage.getItem("shippingFee")) || 0,
    netPrice: JSON.parse(localStorage.getItem("netPrice")) || 0,
    status: "idle",
    error: null
};

// Helper function to calculate shipping fee
const calculateShippingFee = (netPrice) => {
    if (netPrice >= SHIPPING_RULES.FREE_SHIPPING_THRESHOLD) {
        return 0;
    }

    for (const tier of SHIPPING_RULES.TIERED_SHIPPING) {
        if (netPrice >= tier.min && netPrice < tier.max) {
            return tier.fee;
        }
    }

    return 0;
};

// Helper function to recalculate all totals
const recalculateTotals = (state) => {
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalDiscount = 0;

    // Calculate basic totals
    state.items.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
        totalDiscount += (item.price * (item.offerPercentage || 0) / 100) * item.quantity;
    });

    // Calculate net price after discounts
    const netPrice = Math.max(0, totalPrice - totalDiscount);

    // Calculate shipping fee
    let shippingFee = 0;
    if (netPrice >= SHIPPING_RULES.MINIMUM_ORDER) {
        shippingFee = calculateShippingFee(netPrice);
    } else {
        // Apply penalty for orders below minimum
        shippingFee = calculateShippingFee(netPrice) + 50;
    }

    // Calculate grand total
    const grandTotal = netPrice + shippingFee;

    // Update state
    state.totalQuantity = totalQuantity;
    state.totalPrice = totalPrice;
    state.totalDiscount = totalDiscount;
    state.netPrice = netPrice;
    state.shippingFee = shippingFee;
    state.grandTotal = grandTotal;

    // Persist to localStorage
    localStorage.setItem("cartItems", JSON.stringify(state.items));
    localStorage.setItem("cartTotalQuantity", JSON.stringify(totalQuantity));
    localStorage.setItem("cartTotalPrice", JSON.stringify(totalPrice));
    localStorage.setItem("cartTotalDiscount", JSON.stringify(totalDiscount));
    localStorage.setItem("netPrice", JSON.stringify(netPrice));
    localStorage.setItem("shippingFee", JSON.stringify(shippingFee));
    localStorage.setItem("grandTotal", JSON.stringify(grandTotal));
};

// Async Thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/cart");
        return res.data;

    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
});

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

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId, { rejectWithValue }) => {
    try {
        const res = await toast.promise(
            axiosInstance.delete(`/cart/remove/${productId}`),
            {
                pending: "Removing item...",
                // success: "Item removed successfully ✅",
                error: "Failed to remove item ❌",
            }
        );
        return { productId, data: res.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
});

export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ productId, quantity }, { rejectWithValue }) => {
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
    }
);

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
        localClearCart(state) {            state.items = [];
            recalculateTotals(state);
        },
        applyCoupon(state, action) {
            // Implement coupon logic here
            // This would modify the totalDiscount
            recalculateTotals(state);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCart.fulfilled, (state, action) => {

                const cart = action.payload?.data?.cart;
                state.items = cart?.items || [];
                recalculateTotals(state);
                state.status = "succeeded";
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

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

            .addCase(removeFromCart.fulfilled, (state, action) => {
                const { productId } = action.payload;
                state.items = state.items.filter(item => item.productId !== productId);
                recalculateTotals(state);
            })

            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                const item = state.items.find(item => item.productId === productId);
                if (item) {
                    item.quantity = quantity;
                    recalculateTotals(state);
                }
            })
            .addCase(clearCart.fulfilled, (state) => {
                // Reset all cart-related state values
                state.items = [];
                state.totalQuantity = 0;
                state.grandTotal = 0;
                state.totalPrice = 0;
                state.totalDiscount = 0;
                state.shippingFee = 0;
                state.netPrice = 0;

                // Clear all cart-related localStorage items
                localStorage.removeItem("cartItems");
                localStorage.removeItem("cartTotalQuantity");
                localStorage.removeItem("cartTotalPrice");
                localStorage.removeItem("cartTotalDiscount");
                localStorage.removeItem("grandTotal");
                localStorage.removeItem("shippingFee");
                localStorage.removeItem("netPrice");
            })

            .addCase(syncCart.fulfilled, (state, action) => {
                state.items = action.payload.items || state.items;
                recalculateTotals(state);
            });
    }
});

export const {
    localAddToCart,
    localRemoveFromCart,
    localDecrementQuantity,
    localClearCart,
    applyCoupon
} = cartSlice.actions;

export default cartSlice.reducer;