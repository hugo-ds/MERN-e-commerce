import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const addToCart = createAsyncThunk('cart/addToCart', async (param, { rejectWithValue, dispatch }) => {
    const { productId = '', qty = 0 } = param

    try {
        // Get selected product's data.
        const { data } = await axios.get(`/api/products/${productId}`)
        const item = {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
        }

        // Add selected item to cart.
        dispatch(addItem(item))
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        shippingAddress: {},
    },
    reducers: {
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

        removeFromCart: (state, action) => {
            // Remove the product (== action.payload).
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload // Data (action.payload) from the form.
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress))
        },

        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        },
    },
})

export const { addItem, removeFromCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions
