import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

//================================================================================================================
//  List products
//================================================================================================================

// Action (Async)
export const listProducts = createAsyncThunk('product/listProducts', async (param, { rejectWithValue }) => {
    const { keyword = '', pageNumber = '' } = param

    try {
        const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)
        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

// Slice (Reducer)
export const productListSlice = createSlice({
    name: 'productList',
    initialState: {
        loading: false,
        products: [],
        pages: 1,
        page: 1,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listProducts.pending, (state) => {
                state.loading = true
                state.products = []
            })
            .addCase(listProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.pages = action.payload.pages
                state.page = action.payload.page
            })
            .addCase(listProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

//================================================================================================================
//  List products details
//================================================================================================================

export const listProductDetails = createAsyncThunk('product/listProductDetails', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/products/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState: {
        loading: false,
        product: { reviews: [] },
        error: null,
    },
    reducers: {
        setProductDetails: (state, action) => {
            state.product = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listProductDetails.pending, (state) => {
                state.loading = true
            })
            .addCase(listProductDetails.fulfilled, (state, action) => {
                state.loading = false
                state.product = action.payload
            })
            .addCase(listProductDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { setProductDetails } = productDetailsSlice.actions

//================================================================================================================
//  Delete a product
//================================================================================================================

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (id, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        await axios.delete(`/api/products/${id}`, config)
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const productDeleteSlice = createSlice({
    name: 'productDelete',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

//================================================================================================================
//  Create a product
//================================================================================================================

export const createProduct = createAsyncThunk('product/createProduct', async (_, { rejectWithValue, getState }) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.post('/api/products', {}, config)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const productCreateSlice = createSlice({
    name: 'productCreate',
    initialState: {
        loading: false,
        success: false,
        product: {},
        error: null,
    },
    reducers: {
        resetProductCreate: (state) => {
            state.loading = false
            state.success = false
            state.product = {}
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.product = action.payload
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetProductCreate } = productCreateSlice.actions

//================================================================================================================
//  Update a product
//================================================================================================================

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async (product, { rejectWithValue, dispatch, getState }) => {
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

            const { data } = await axios.put(`/api/products/${product._id}`, product, config)

            // Set product details state.
            dispatch(setProductDetails(data))

            return data
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message ? error.response.data.message : error.response
            )
        }
    }
)

export const productUpdateSlice = createSlice({
    name: 'productUpdate',
    initialState: {
        loading: false,
        success: false,
        product: {},
        error: null,
    },
    reducers: {
        resetProductUpdate: (state) => {
            state.loading = false
            state.success = false
            state.product = {}
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.product = action.payload
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetProductUpdate } = productUpdateSlice.actions

//================================================================================================================
//  Create a product review
//================================================================================================================

export const createProductReview = createAsyncThunk(
    'product/createProductReview',
    async (param, { rejectWithValue, getState }) => {
        const { id, review } = param

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

            await axios.post(`/api/products/${id}/reviews`, review, config)
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message ? error.response.data.message : error.response
            )
        }
    }
)

export const productCreateReviewSlice = createSlice({
    name: 'product/productCreateReview',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetProductCreateReview: (state) => {
            state.loading = false
            state.success = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProductReview.pending, (state) => {
                state.loading = true
            })
            .addCase(createProductReview.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(createProductReview.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetProductCreateReview } = productCreateReviewSlice.actions

//================================================================================================================
//  List top rated products
//================================================================================================================

export const listTopRatedProducts = createAsyncThunk('product/listTopRatedProducts', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/products/top')
        return data
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message ? error.response.data.message : error.response
        )
    }
})

export const productTopRatedSlice = createSlice({
    name: 'product/productTopRated',
    initialState: {
        loading: false,
        products: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listTopRatedProducts.pending, (state) => {
                state.loading = true
            })
            .addCase(listTopRatedProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(listTopRatedProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})
