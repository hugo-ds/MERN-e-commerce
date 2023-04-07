import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { useCreateProductReviewMutation, useListProductDetailsQuery } from '../services/api'

// Product details.
const ProductScreen = () => {
    const [qty, setQty] = useState(1) // Default quantity is 1.
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    // Get user's login info.
    const { userInfo } = useSelector((state) => state.userLogin)

    // Declare create product review mutation and its result data
    const [createProductReview, { isError: errorProductReview, isSuccess: successProductReview }] =
        useCreateProductReviewMutation()

    const { id } = useParams() // Get id from url.

    // Fetch product details.
    const {
        isLoading: loading,
        isError: error,
        data: product,
        refetch: refetchListProductDetails,
    } = useListProductDetailsQuery(id)

    const navigate = useNavigate()

    // Add a product detail.
    useEffect(() => {
        if (successProductReview) {
            alert('Review submitted.')
            setRating(0)
            setComment('')
            refetchListProductDetails() // Fetch updated review.
        }
    }, [refetchListProductDetails, successProductReview])

    // Add the product to the cart.
    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }

    // Create a product review.
    const submitHandler = (e) => {
        e.preventDefault()
        createProductReview({ id, review: { rating, comment } })
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                Go Back
            </Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : product ? (
                <>
                    <Meta title={product.name}></Meta>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid></Image>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating
                                        value={Number(product.rating)}
                                        text={`${product.numReviews} reviews`}
                                    ></Rating>
                                </ListGroup.Item>
                                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price</Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status</Col>
                                            <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control
                                                        as='select'
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}
                                                    >
                                                        {[...Array(product.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    {/* Add product to cart */}
                                    <ListGroup.Item>
                                        <Button
                                            onClick={addToCartHandler}
                                            className='btn-block'
                                            type='button'
                                            disabled={product.countInStock === 0}
                                        >
                                            Add To Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message variant='info'>No reviews</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={Number(review.rating)}></Rating>
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {errorProductReview && <Message>{errorProductReview}</Message>}
                                    {/* Can add a review if is logged in. */}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button type='submit' variant='primary' className='my-3'>
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        // If isn't logged in, ask to login.
                                        <Message variant='info'>
                                            Please <Link to='/login'>sign in</Link> to write a review.
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            ) : null}
        </>
    )
}

export default ProductScreen
