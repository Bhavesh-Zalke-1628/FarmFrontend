import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // array of { productId, name, price, quantity }
    totalQuantity: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const product = action.payload; // { productId, name, price }
            const existingItem = state.items.find(item => item.productId === product.productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }

            state.totalQuantity += 1;
            state.totalPrice += product.price;
        },

        removeFromCart(state, action) {
            const productId = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.productId === productId);
            if (existingItemIndex !== -1) {
                const item = state.items[existingItemIndex];
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;
                state.items.splice(existingItemIndex, 1);
            }
        },

        decrementQuantity(state, action) {
            const productId = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity -= 1;
                state.totalQuantity -= 1;
                state.totalPrice -= existingItem.price;

                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter(item => item.productId !== productId);
                }
            }
        },

        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        },
    },
});

export const { addToCart, removeFromCart, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
