import { createSlice } from '@reduxjs/toolkit'

// Change cart state.
export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        shippingAddress: {},
    },
    reducers: {
        // Add an item to cart.  Update local storage.
        addItem: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((x) => x.product === item.product)

            // If item already exists, update it. Else add it.
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => (x.product === existItem.product ? item : x))
            } else {
                state.cartItems.push(item)
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        // Remove an item form cart. Update local storage.
        removeFromCart: (state, action) => {
            // Remove a product if == action.payload.
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        // Save shipping address info to state and local storage.
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload // Data (action.payload) from the form.
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress))
        },

        // Save payment method to state and local storage.
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        },

        // Empty cart.
        resetCart: (state) => {
            state.cartItems = []
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
    },
})

export const { addItem, removeFromCart, saveShippingAddress, savePaymentMethod, resetCart } = cartSlice.actions
