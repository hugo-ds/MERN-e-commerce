import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetUserDetailsQuery, useListMyOrdersQuery, useUpdateUserProfileMutation } from '../services/api'

// User's profile (list orders).
const ProfileScreen = () => {
    // Fetch user's data.
    const {
        isLoading: isLoadingUserDetails,
        isError: isErrorUserDetails,
        data: user,
        refetch: refetchGetUserDetails,
    } = useGetUserDetailsQuery('profile')

    // Declare update user profile mutation and its result data.
    const [updateUserProfile, { isSuccess: isSuccessUpdateProfile }] = useUpdateUserProfileMutation()

    // Fetch user's orders list.
    const {
        isLoading: isLoadingOrders,
        isError: isErrorOrders,
        data: orders,
        refetch: refetchListMyOrders,
    } = useListMyOrdersQuery()

    // Declare state variables. (Rerender happens when it's modified.)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    // Get user's login info.
    const { userInfo } = useSelector((state) => state.userLogin)

    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate('/login') // Force login.
        } else {
            // If thre is no user data or if profile update was successful, refetch user's data.
            if (!user || !user.name || isSuccessUpdateProfile) {
                refetchGetUserDetails('profile')
            } else {
                setName(user.name)
                setEmail(user.email)
            }
            refetchListMyOrders()
        }
    }, [userInfo, isSuccessUpdateProfile, user, navigate, refetchGetUserDetails, refetchListMyOrders])

    // Update user's profile.
    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            updateUserProfile({ _id: user._id, name, email, password })
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {isErrorUserDetails && <Message variant='danger'>{isErrorUserDetails}</Message>}
                {isSuccessUpdateProfile && <Message variant='isSuccessUpdateProfile'>Profile updated</Message>}
                {isLoadingUserDetails && <Loader></Loader>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='py-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email' className='py-3'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password' className='py-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='confirmPassword' className='py-3'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    {/* Update user's profile. */}
                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                {/* User's orders. */}
                <h2>My Orders</h2>
                {isLoadingOrders ? (
                    <Loader></Loader>
                ) : isErrorOrders ? (
                    <Message vairant='danger'>{isErrorOrders}</Message>
                ) : orders ? (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn-sm' variant='dark'>
                                                Details
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : null}
            </Col>
        </Row>
    )
}

export default ProfileScreen
