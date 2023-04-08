import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useListOrdersQuery } from '../services/api'

// Show a list of all orders.
const OrderListScreen = () => {
    // Fetch orders list.
    const { isLoading, isError, data: orders } = useListOrdersQuery()

    // Get user login info.
    const { userInfo } = useSelector((state) => state.userLogin)

    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to login page if user isn't logged in or isn't an admin.
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        }
    }, [navigate, userInfo])

    return (
        <>
            <h1>Orders</h1>
            {isLoading ? (
                <Loader></Loader>
            ) : isError ? (
                <Message vairant='danger'>{isError}</Message>
            ) : orders ? (
                // Show a list of all orders.
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>USER</td>
                            <td>DATE</td>
                            <td>TOTAL</td>
                            <td>PAID</td>
                            <td>DELIVERED</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
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
                                    {/* Show order's details button. */}
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant='dark' className='btn-sm'>
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : null}
        </>
    )
}

export default OrderListScreen
