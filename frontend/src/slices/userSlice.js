import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

//================================================================================================================
//  Login
//================================================================================================================

export const login = createAsyncThunk('user/login', async (param, { rejectWithValue }) => {
    const { email, password } = param

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.post('/api/users/login', { email, password }, config)

        localStorage.setItem('userInfo', JSON.stringify(data))

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

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
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { logoutUser, loginUser } = userLoginSlice.actions

//================================================================================================================
//  Register user
//================================================================================================================

export const register = createAsyncThunk('user/register', async (param, { rejectWithValue, dispatch }) => {
    const { name, email, password } = param

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        // Register user
        const { data } = await axios.post('/api/users', { name, email, password }, config)

        // Then login
        dispatch(loginUser(data))

        localStorage.setItem('userInfo', JSON.stringify(data))

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const userRegisterSlice = createSlice({
    name: 'userRegister',
    initialState: {
        loading: false,
        userInfo: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

//================================================================================================================
//  Get user's details
//================================================================================================================

export const getUserDetails = createAsyncThunk('user/getUserDetails', async (id, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }
        const { data } = await axios.get(`/api/users/${id}`, config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: {
        loading: false,
        user: null,
        error: null,
    },
    reducers: {
        resetUserDetails: (state) => {
            state.loading = false
            state.user = null
            state.error = null
        },
        setUserDetails: (state, action) => {
            state.loading = false
            state.user = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetails.pending, (state) => {
                state.loading = true
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetUserDetails, setUserDetails } = userDetailsSlice.actions

//================================================================================================================
//  Update user's profile
//================================================================================================================

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (user, { rejectWithValue, getState, dispatch }) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState()

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }

            // Update user's profile.
            const { data } = await axios.put('/api/users/profile', user, config)

            // Login updated user.
            dispatch(loginUser(data))

            localStorage.setItem('userInfo', JSON.stringify(data))

            return data
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message ? error.response.data.message : error.response
            )
        }
    }
)

export const userUpdateProfileSlice = createSlice({
    name: 'userUpdateProfile',
    initialState: {
        loading: false,
        success: false,
        userInfo: null,
        error: null,
    },
    reducers: {
        resetUserUpdateProfile: (state) => {
            state.loading = false
            state.success = false
            state.userInfo = null
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.userInfo = action.payload
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetUserUpdateProfile } = userUpdateProfileSlice.actions

//================================================================================================================
//  List all users
//================================================================================================================

export const listUsers = createAsyncThunk('user/listUsers', async (_, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.get('/api/users', config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const userListSlice = createSlice({
    name: 'userList',
    initialState: {
        loading: false,
        users: [],
        error: null,
    },
    reducers: {
        resetUserList: (state) => {
            state.loading = false
            state.users = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listUsers.pending, (state) => {
                state.loading = true
            })
            .addCase(listUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(listUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetUserList } = userListSlice.actions

//================================================================================================================
//  Delete an user
//================================================================================================================

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        await axios.delete(`/api/users/${id}`, config)
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const userDeleteSlice = createSlice({
    name: 'userDelete',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

//================================================================================================================
//  Update a user
//================================================================================================================

export const updateUser = createAsyncThunk('user/updateUser', async (user, { rejectWithValue, getState, dispatch }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        // Update user
        const { data } = await axios.put(`/api/users/${user._id}`, user, config)

        // Then set user's new details.
        dispatch(setUserDetails(data))

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const userUpdateSlice = createSlice({
    name: 'userUpdate',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetUserUpdate: (state) => {
            state.loading = false
            state.success = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetUserUpdate } = userUpdateSlice.actions
