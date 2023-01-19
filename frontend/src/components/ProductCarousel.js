import { useEffect } from 'react'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { listTopRatedProducts } from '../actions/productActions'
import Loader from './Loader'
import Message from './Message'

const ProductCarousel = () => {
    const { loading, error, products } = useSelector((state) => state.productTopRated)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(listTopRatedProducts())
    }, [dispatch])

    return loading ? (
        <Loader></Loader>
    ) : error ? (
        <Message>{error}</Message>
    ) : (
        <Carousel pause='hover' className='bg-dark'>
            {products.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid></Image>
                        <Carousel.Caption className='carousel-caption'>
                            <h2>
                                {product.name} (${product.price})
                            </h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel