// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'

import { configureStore } from '@reduxjs/toolkit'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'

const reducer = {
    productList: productListReducer,
    productDetails: productDetailsReducer,
}

const initialState = {}

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true,
    initialState: initialState,
})

export default store
