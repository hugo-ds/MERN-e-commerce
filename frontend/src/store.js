import { configureStore } from '@reduxjs/toolkit'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'

const reducer = {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
}

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
console.log(cartItemsFromStorage)

const preloadedState = {
    cart: { cartItems: cartItemsFromStorage },
}

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true,
    preloadedState: preloadedState,
})

export default store
