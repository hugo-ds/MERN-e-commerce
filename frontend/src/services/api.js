import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setProductDetails } from '../slices/productSlice'
import { addItem } from '../slices/cartSlice'
import { loginUser, setUserDetails } from '../slices/userSlice'

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            // Inject headers on every request.
            const {
                userLogin: { userInfo },
            } = getState()

            if (userInfo && userInfo.token) {
                headers.set('authorization', `Bearer ${userInfo.token}`)
            }

            return headers
        },
    }),

    //reducerPath: 'api',
    tagTypes: ['Product', 'Order', 'Paypal', 'User'],

    endpoints: (build) => ({
        //-------------------------------------
        // Product queries.
        //-------------------------------------
        listProduct: build.query({
            query: (keyword = '', pageNumber = '') => `/products?keyword=${keyword}&pageNumber=${pageNumber}`,
            providesTags: (result) =>
                result
                    ? // successful query
                      [
                          ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
                          // addUserがあったときのために特別なタグを用意する。
                          { type: 'Product', id: 'LIST' },
                      ]
                    : // エラーがあった場合でもユーザ追加をしたタイミングで再データ取得をする。
                      [{ type: 'Product', id: 'LIST' }],
            // providesTags: function (result) {
            //     let r = [
            //         ...result.products.map(({ _id }) => ({ type: 'Product', _id })),
            //         // addUserがあったときのために特別なタグを用意する。
            //         { type: 'Product', id: 'LIST' },
            //     ]
            //     console.log(r)
            //     return [{ type: 'Product', id: 'LIST' }]
            // },
        }),

        listProductDetails: build.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id: id }],
        }),

        deleteProduct: build.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

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
        updateProduct: build.mutation({
            query: (product) => ({
                url: `/products/${product._id}`,
                method: 'PUT',
                body: product,
            }),
            // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
            // that newly created post could show up in any lists.
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled

                    // Set product details state.
                    dispatch(setProductDetails(data))
                    return data
                } catch {}
            },
        }),

        createProductReview: build.mutation({
            query: ({ id, review }) => ({
                url: `/products/${id}/reviews`,
                method: 'POST',
                body: review,
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Product', id: id }],
        }),

        listTopRatedProducts: build.query({
            query: () => '/products/top',
            providesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        //-------------------------------------
        // Cart queries.
        //-------------------------------------
        // addToCart: build.query({
        //     query: ({ productId = '', qty = 0 }) => `/products/${productId}`,
        //     providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],

        //     // Receive args, destructure to get 'qty'
        //     async onQueryStarted({ productId, qty }, { dispatch, queryFulfilled }) {
        //         try {
        //             const { data } = await queryFulfilled

        //             const item = {
        //                 product: data._id,
        //                 name: data.name,
        //                 image: data.image,
        //                 price: data.price,
        //                 countInStock: data.countInStock,
        //                 qty,
        //             }

        //             // Add selected item to cart.
        //             dispatch(addItem(item))
        //         } catch {}
        //     },
        // }),

        //-----------------------------------------
        //  Order queries.
        //-----------------------------------------
        createOrder: build.mutation({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: [{ type: 'Order', id: 'LIST' }],
        }),

        getOrderDetails: build.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id: id }],
        }),

        getPaypalClientId: build.query({
            query: () => ({ url: '/config/paypal', responseHandler: (response) => response.text() }),

            providesTags: [{ type: 'Paypal' }],
        }),

        payOrder: build.mutation({
            query: ({ orderId, paymentResult }) => ({
                url: `/orders/${orderId}/pay`,
                method: 'PUT',
                body: paymentResult,
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
        }),

        deliverOrder: build.mutation({
            query: (order) => ({
                url: `/orders/${order._id}/deliver`,
                method: 'PUT',
                body: {},
            }),
            invalidatesTags: (result, error, order) => [{ type: 'Order', id: order._id }],
        }),

        listMyOrders: build.query({
            query: () => `/orders/myorders`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Order', id: _id })), { type: 'Order', id: 'LIST' }]
                    : [{ type: 'Order', id: 'LIST' }],
        }),

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
        login: build.mutation({
            query: ({ email, password }) => ({
                url: '/users/login',
                method: 'POST',
                body: { email, password },
            }),
            // invalidatesTags: (result, error, { email }) => [
            //     { type: 'User', id: result._id },
            //     { type: 'User', id: 'LIST' },
            // ],
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    // Wait for user login.
                    const { data } = await queryFulfilled

                    dispatch(loginUser(data)) // Then login. (Update state)
                    localStorage.setItem('userInfo', JSON.stringify(data))
                    return data
                } catch {}
            },
        }),

        // Need? getUserInfo: build.query({

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

            // Use api.endpoints.postCredentials.matchFulfilled in extra reducers?
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    // Wait for user registration.
                    const { data } = await queryFulfilled

                    dispatch(loginUser(data)) // Then login. (Update state)
                    localStorage.setItem('userInfo', JSON.stringify(data))
                } catch {}
            },
        }),

        getUserDetails: build.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id: id }],
        }),

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

                    localStorage.setItem('userInfo', JSON.stringify(data))
                } catch {}
            },
        }),

        listUsers: build.query({
            query: () => '/users',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'User', id: _id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        deleteUser: build.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'User', id }],
        }),

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

            // Use api.endpoints.postCredentials.matchFulfilled in extra reducers?
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    // Wait for user update.
                    const { data } = await queryFulfilled

                    // Then set user's new details.
                    dispatch(setUserDetails(data))
                } catch {}
            },
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
