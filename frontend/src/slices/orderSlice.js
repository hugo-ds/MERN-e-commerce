import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

//================================================================================================================
//  Create an order
//================================================================================================================

export const createOrder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue, getState }) => {
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

        const { data } = await axios.post('/api/orders', order, config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const orderCreateSlice = createSlice({
    name: 'orderCreate',
    initialState: {
        loading: false,
        success: false,
        order: {},
        error: null,
    },
    reducers: {
        resetOrderCreate: (state) => {
            state.loading = false
            state.success = false
            state.order = {}
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.order = action.payload
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetOrderCreate } = orderCreateSlice.actions

//================================================================================================================
//  Get order details.
//================================================================================================================

export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async (id, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.get(`/api/orders/${id}`, config)
        const { data: clientId } = await axios.get('/api/config/paypal')

        return { payload: data, clientId }
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const orderDetailsSlice = createSlice({
    name: 'orderDetails',
    initialState: {
        loading: true,
        orderItems: [],
        shippingAddress: {},
        order: null,
        clientId: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false
                state.order = action.payload.payload
                state.clientId = action.payload.clientId
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

//================================================================================================================
//  Pay an order.
//================================================================================================================

export const payOrder = createAsyncThunk('order/payOrder', async (param, { rejectWithValue, getState }) => {
    const { orderId, paymentResult } = param

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

        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const orderPaySlice = createSlice({
    name: 'orderPay',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetOrderPay: (state) => {
            state.loading = false
            state.success = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(payOrder.pending, (state) => {
                state.loading = true
            })
            .addCase(payOrder.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetOrderPay } = orderPaySlice.actions

//================================================================================================================
//  Deliver an order.
//================================================================================================================

export const deliverOrder = createAsyncThunk('order/deliverOrder', async (order, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const orderDeliverSlice = createSlice({
    name: 'orderDeliver',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetOrderDeliver: (state) => {
            state.loading = false
            state.success = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deliverOrder.pending, (state) => {
                state.loading = true
            })
            .addCase(deliverOrder.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deliverOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetOrderDeliver } = orderDeliverSlice.actions

//================================================================================================================
//  List my order list.
//================================================================================================================

export const listMyOrders = createAsyncThunk('order/listMyOrders', async (_, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.get(`/api/orders/myorders`, config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const orderMyListSlice = createSlice({
    name: 'orderMyList',
    initialState: {
        loading: false,
        orders: [],
        error: null,
    },
    reducers: {
        resetOrderMyList: (state) => {
            state.loading = false
            state.orders = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listMyOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(listMyOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(listMyOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetOrderMyList } = orderMyListSlice.actions

//================================================================================================================
//  List all orders.
//================================================================================================================

export const listOrders = createAsyncThunk('order/listOrders', async (_, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.get(`/api/orders`, config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const orderListSlice = createSlice({
    name: 'orderList',
    initialState: {
        loading: false,
        orders: [],
        error: null,
    },
    reducers: {
        resetOrderList: (state) => {
            state.loading = false
            state.orders = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(listOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(listOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetOrderList } = orderListSlice.actions
