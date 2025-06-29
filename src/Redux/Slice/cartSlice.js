import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // array of { productId, name, price, quantity, offerPercentage }
    totalQuantity: 0,
    totalPrice: 0,      // Total of original prices
    totalDiscount: 0,   // Total discount amount
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const product = action.payload; // { productId, name, price, offerPercentage }
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

            // Recalculate all totals
            recalculateTotals(state);
        },

        removeFromCart(state, action) {
            const productId = action.payload;
            state.items = state.items.filter(item => item.productId !== productId);
            recalculateTotals(state);
        },

        decrementQuantity(state, action) {
            const productId = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    // Remove item if quantity would become 0
                    state.items = state.items.filter(item => item.productId !== productId);
                }
                recalculateTotals(state);
            }
        },

        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            state.totalDiscount = 0;
        },
    },
});

// Helper function to recalculate all totals
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
};

export const { addToCart, removeFromCart, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;