import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { deliverOrder, getOrderDetails } from '../actions/orderActions'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'
import PayPalBlock from '../components/PayPalBlock'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const OrderScreen = () => {
    const { id: orderId } = useParams()

    const { order, loading, error, clientId } = useSelector((state) => state.orderDetails)

    // Rename loading to loadingPay and success to successPay
    const { success: successPay } = useSelector((state) => state.orderPay)

    const { loading: loadingDeliver, success: successDeliver } = useSelector((state) => state.orderDeliver)
    const { userInfo } = useSelector((state) => state.userLogin)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        // Force login.
        if (!userInfo) {
            navigate('/login')
        }
        // If there is no order, or payment or deliver was successful.
        if (!order || order._id !== orderId || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        }
    }, [navigate, userInfo, dispatch, order, orderId, successPay, successDeliver])

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return loading ? (
        <Loader></Loader>
    ) : error ? (
        <Message vairant='danger'>{error}</Message>
    ) : (
        <>
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

                            {!order.isPaid && (
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
                            {loadingDeliver && <Loader></Loader>}
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
    )
}

export default OrderScreen
