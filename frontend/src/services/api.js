import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { loginUser } from '../slices/userSlice.js'

// Define fetch functions.
export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            // Inject headers on every request.
            const {
                userLogin: { userInfo },
            } = getState()

            // Add user token to request header.
            if (userInfo && userInfo.token) {
                headers.set('authorization', `Bearer ${userInfo.token}`)
            }

            return headers
        },
    }),

    //reducerPath: 'api',
    // Cache tags.
    tagTypes: ['Product', 'Order', 'User'],

    endpoints: (build) => ({
        //-------------------------------------
        // Product queries.
        //-------------------------------------
        // Fetch all products.
        listProduct: build.query({
            query: (keyword = '', pageNumber = '') => `/products?keyword=${keyword}&pageNumber=${pageNumber}`,
            providesTags: (result) =>
                result
                    ? // Successful query
                      [
                          ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
                          // add tag for addUser
                          { type: 'Product', id: 'LIST' },
                      ]
                    : // if error, refetch after add user
                      [{ type: 'Product', id: 'LIST' }],
        }),

        // Fetch a product data.
        listProductDetails: build.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id: id }],
        }),

        // Delete a product.
        deleteProduct: build.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        // Create a sample product.
        createProduct: build.mutation({
            query: () => ({
                url: '/products',
                method: 'POST',
                body: {},
            }),
            // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
            // that newly created post could show up in any lists.
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        // TODO: fix bug (see todo list)
        // Update a product.
        updateProduct: build.mutation({
            query: (product) => ({
                url: `/products/${product._id}`,
                method: 'PUT',
                body: product,
            }),
            // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
            // that newly created post could show up in any lists.
            invalidatesTags: (result, error, product) => [
                { type: 'Product', id: product._id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        // Create new product review.
        createProductReview: build.mutation({
            query: ({ id, review }) => ({
                url: `/products/${id}/reviews`,
                method: 'POST',
                body: review,
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Product', id: id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        // Fetch 3 top rated products.
        listTopRatedProducts: build.query({
            query: () => '/products/top',
            providesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        //-----------------------------------------
        //  Order queries.
        //-----------------------------------------
        // Create an order.
        createOrder: build.mutation({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: [{ type: 'Order', id: 'LIST' }],
        }),

        // Fetch an order's details.
        getOrderDetails: build.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id: id }],
        }),

        // Fetch Paypal client id.
        getPaypalClientId: build.query({
            query: () => ({ url: '/config/paypal', responseHandler: (response) => response.text() }),
        }),

        // Pay an order.
        payOrder: build.mutation({
            query: ({ orderId, paymentResult }) => ({
                url: `/orders/${orderId}/pay`,
                method: 'PUT',
                body: paymentResult,
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
        }),

        // Mark an order as delivered.
        deliverOrder: build.mutation({
            query: (order) => ({
                url: `/orders/${order._id}/deliver`,
                method: 'PUT',
                body: {},
            }),
            invalidatesTags: (result, error, order) => [{ type: 'Order', id: order._id }],
        }),

        // Fetch user's all orders.
        listMyOrders: build.query({
            query: () => `/orders/myorders`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Order', id: _id })), { type: 'Order', id: 'LIST' }]
                    : [{ type: 'Order', id: 'LIST' }],
        }),

        // Fetch app's all orders.
        listOrders: build.query({
            query: () => `/orders`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Order', id: _id })), { type: 'Order', id: 'LIST' }]
                    : [{ type: 'Order', id: 'LIST' }],
        }),

        //-------------------------------------
        // User queries.
        //-------------------------------------
        // Login a user.
        login: build.mutation({
            query: ({ email, password }) => ({
                url: '/users/login',
                method: 'POST',
                body: { email, password },
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    // Wait for user login.
                    const { data } = await queryFulfilled

                    // Then login. (Update state)
                    dispatch(loginUser(data))

                    // Save login info in local storage.
                    localStorage.setItem('userInfo', JSON.stringify(data))
                    return data
                } catch {}
            },
        }),

        // Register new user.
        register: build.mutation({
            query: ({ name, email, password }) => ({
                url: '/users',
                method: 'POST',
                body: { name, email, password },
            }),
            invalidatesTags: (result, error, email) => [
                { type: 'User', id: result._id },
                { type: 'User', id: 'LIST' },
            ],

            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    // Wait for user registration.
                    const { data } = await queryFulfilled

                    // Then login. (Update state)
                    dispatch(loginUser(data))

                    // Save login info in local storage.
                    localStorage.setItem('userInfo', JSON.stringify(data))
                } catch {}
            },
        }),

        // Fetch user's details.
        getUserDetails: build.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id: id }],
        }),

        // Update user's profile.
        updateUserProfile: build.mutation({
            query: (user) => ({
                url: '/users/profile',
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: (result, error, user) => [
                { type: 'User', id: user._id },
                { type: 'User', id: 'LIST' },
            ],

            async onQueryStarted(user, { queryFulfilled, dispatch }) {
                try {
                    // Wait for user update.
                    const { data } = await queryFulfilled

                    // Login updated user.
                    dispatch(loginUser(data))

                    // Save login info in local storage.
                    localStorage.setItem('userInfo', JSON.stringify(data))
                } catch {}
            },
        }),

        // Fetch all users.
        listUsers: build.query({
            query: () => '/users',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'User', id: _id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        // Delete a user.
        deleteUser: build.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // Update a user.
        updateUser: build.mutation({
            query: (user) => ({
                url: `/users/${user._id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: (result, error, user) => [
                { type: 'User', id: user._id },
                { type: 'User', id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useListProductQuery,
    useListProductDetailsQuery,
    useDeleteProductMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useCreateProductReviewMutation,
    useListTopRatedProductsQuery,
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
    useDeliverOrderMutation,
    useListMyOrdersQuery,
    useListOrdersQuery,
    useLoginMutation,
    useRegisterMutation,
    useGetUserDetailsQuery,
    useUpdateUserProfileMutation,
    useListUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} = api
