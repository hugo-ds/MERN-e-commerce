import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { useNavigate, useParams } from 'react-router-dom'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'

const ProductListScreen = () => {
    const dispatch = useDispatch()

    const { loading, error, products, page, pages } = useSelector((state) => state.productList)
    const { userInfo } = useSelector((state) => state.userLogin)
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = useSelector((state) => state.productDelete)

    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = useSelector((state) => state.productCreate)

    const navigate = useNavigate()

    let { pageNumber } = useParams()
    if (!pageNumber) {
        pageNumber = 1
    }

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })

        if (userInfo && !userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`)
        } else {
            dispatch(listProducts('', pageNumber))
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, pageNumber])

    const delteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader></Loader>}
            {errorCreate && <Message>{errorCreate}</Message>}
            {loadingDelete && <Loader></Loader>}
            {errorDelete && <Message>{errorDelete}</Message>}
            {loading ? (
                <Loader></Loader>
            ) : error ? (
                <Message vairant='danger'>{error}</Message>
            ) : (
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>NAME</td>
                                <td>PRICE</td>
                                <td>CATEGORY</td>
                                <td>BRAND</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='dark' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => delteHandler(product._id)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true}></Paginate>
                </>
            )}
        </>
    )
}

export default ProductListScreen
