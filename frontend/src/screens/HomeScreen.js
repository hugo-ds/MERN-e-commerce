import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../slices/productSlice'
import { useListProductQuery } from '../services/api'

const HomeScreen = () => {
    const { keyword = '', pageNumber = 1 } = useParams()

    const { isLoading: loading, isError: error, data } = useListProductQuery(keyword, pageNumber)

    // const { loading, error, products, pages, page } = useSelector((state) => state.productList)

    // const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(listProducts({ keyword, pageNumber }))
    // }, [dispatch, keyword, pageNumber])

    return (
        <>
            <Meta></Meta>
            {!keyword ? (
                <ProductCarousel></ProductCarousel>
            ) : (
                <Link className='btn btn-light my-3' to='/'>
                    Go Back
                </Link>
            )}
            <h1>Latest Products</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : data ? (
                <>
                    <Row>
                        {data.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''}></Paginate>
                </>
            ) : null}
        </>
    )
}

export default HomeScreen
