import { createSlice } from '@reduxjs/toolkit'

// User's login state.
export const userLoginSlice = createSlice({
    name: 'userLogin',
    initialState: {
        loading: false,
        userInfo: null,
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.loading = false
            state.userInfo = null
            state.error = null
        },
        loginUser: (state, action) => {
            state.loading = false
            state.userInfo = action.payload
        },
    },
})

export const { logoutUser, loginUser } = userLoginSlice.actions
