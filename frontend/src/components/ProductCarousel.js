import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useListTopRatedProductsQuery } from '../services/api'
import Loader from './Loader'
import Message from './Message'

const ProductCarousel = () => {
    const { isLoading, isError, data: products } = useListTopRatedProductsQuery()

    return isLoading ? (
        <Loader></Loader>
    ) : isError ? (
        <Message>{isError}</Message>
    ) : products ? (
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
    ) : null
}

export default ProductCarousel
