import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import PayPalBlock from '../components/PayPalBlock'
import Meta from '../components/Meta'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import {
    useDeliverOrderMutation,
    useGetOrderDetailsQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from '../services/api'

// Shows an order's data. User must be logged in to see this page.
const OrderScreen = () => {
    const { id: orderId } = useParams() // Get order id from url.

    // Fetch order's details.
    const { data: order, isLoading, isError, refetch: refetchGetOrderDetails } = useGetOrderDetailsQuery(orderId)

    // Fetch paypal client id.
    const { data: clientId } = useGetPaypalClientIdQuery()

    // Check
    const { isSuccess: isSuccessPay } = usePayOrderMutation()

    // Declare deliver an order function and its result data.
    const [deliverOrder, { isLoading: isLoadingDeliver, isSuccess: isSuccessDeliver }] = useDeliverOrderMutation(order)

    const navigate = useNavigate()

    // Extract login state from state.
    const { userInfo } = useSelector((state) => state.userLogin)
    useEffect(() => {
        // Force login.
        if (!userInfo) {
            navigate('/login')
        }
        // If there is no order, or payment or payment/deliver was successful, refetch order's details.
        if (!order || order._id !== orderId || isSuccessPay || isSuccessDeliver) {
            refetchGetOrderDetails()
        }
    }, [navigate, refetchGetOrderDetails, userInfo, order, orderId, isSuccessPay, isSuccessDeliver])

    // Change an order to delivered.
    const deliverHandler = () => {
        deliverOrder(order)
    }

    return isLoading ? (
        <Loader></Loader>
    ) : isError ? (
        <Message vairant='danger'>{isError}</Message>
    ) : order ? (
        <>
            <Meta title='Your order'></Meta>
            <h1>Order {orderId}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant='danger'>Not paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? (
                                <Message>Order is empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded></Image>
                                                </Col>
                                                <Col md={6}>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {/* Shows Paypal payment block if hasn't paid yet. */}
                            {!order.isPaid && clientId && (
                                <ListGroup.Item>
                                    <PayPalScriptProvider
                                        options={{
                                            'client-id': clientId,
                                        }}
                                    >
                                        <PayPalBlock totalPrice={order.totalPrice} orderId={orderId}></PayPalBlock>
                                    </PayPalScriptProvider>
                                </ListGroup.Item>
                            )}
                            {isLoadingDeliver && <Loader></Loader>}
                            {/* Shows a deliver button for admins only. */}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                        Mark as delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    ) : null
}

export default OrderScreen
