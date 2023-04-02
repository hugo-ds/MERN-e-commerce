import { configureStore } from '@reduxjs/toolkit'
import {
    userLoginSlice,
    userRegisterSlice,
    userDetailsSlice,
    userUpdateProfileSlice,
    userListSlice,
    userDeleteSlice,
    userUpdateSlice,
} from './slices/userSlice'
import {
    orderCreateSlice,
    orderDetailsSlice,
    orderMyListSlice,
    orderPaySlice,
    orderDeliverSlice,
    orderListSlice,
} from './slices/orderSlice'
import {
    productDetailsSlice,
    productListSlice,
    productDeleteSlice,
    productCreateSlice,
    productUpdateSlice,
    productCreateReviewSlice,
    productTopRatedSlice,
} from './slices/productSlice'
import { cartSlice } from './slices/cartSlice'
import { api } from './services/api'

// Reducers: receive store and action, and modify the store.
const reducer = {
    productList: productListSlice.reducer,
    productDetails: productDetailsSlice.reducer,
    productDelete: productDeleteSlice.reducer,
    productCreate: productCreateSlice.reducer,
    productUpdate: productUpdateSlice.reducer,
    productCreateReview: productCreateReviewSlice.reducer,
    productTopRated: productTopRatedSlice.reducer,

    cart: cartSlice.reducer,

    userLogin: userLoginSlice.reducer,
    userRegister: userRegisterSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    userUpdateProfile: userUpdateProfileSlice.reducer,
    userList: userListSlice.reducer,
    userDelete: userDeleteSlice.reducer,
    userUpdate: userUpdateSlice.reducer,

    orderCreate: orderCreateSlice.reducer,
    orderDetails: orderDetailsSlice.reducer,
    orderPay: orderPaySlice.reducer,
    orderDeliver: orderDeliverSlice.reducer,
    orderMyList: orderMyListSlice.reducer,
    orderList: orderListSlice.reducer,

    [api.reducerPath]: api.reducer,
}

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {}

const preloadedState = {
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
    userLogin: { userInfo: userInfoFromStorage },
}

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState: preloadedState,
})

export default store
