// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'

import { configureStore } from '@reduxjs/toolkit'

const initialState = {}

const store = configureStore({ reducer: {}, middleware: (getDefaultMiddleware) => getDefaultMiddleware(), devTools: true, initialState: initialState })

export default store
