import { configureStore } from '@reduxjs/toolkit'
import { userLoginSlice } from './slices/userSlice'
import { cartSlice } from './slices/cartSlice'
import { api } from './services/api'

// Reducers: receive store and action, and modify the store.
const reducer = {
    cart: cartSlice.reducer,
    userLogin: userLoginSlice.reducer,
    [api.reducerPath]: api.reducer,
}

// Load initial values from local storage.
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {}

// Set states on load.
const preloadedState = {
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
    userLogin: { userInfo: userInfoFromStorage },
}

// Create store.
const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState: preloadedState,
})

export default store
