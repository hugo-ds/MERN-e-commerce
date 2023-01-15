import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts, deleteProduct } from '../actions/productActions'
import { useNavigate } from 'react-router-dom'

const ProductListScreen = () => {
    const dispatch = useDispatch()

    const { loading, error, products } = useSelector((state) => state.productList)
    const { userInfo } = useSelector((state) => state.userLogin)
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = useSelector((state) => state.productDelete)

    const navigate = useNavigate()

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listProducts())
        } else {
            navigate('/login')
        }
    }, [dispatch, navigate, userInfo, successDelete])

    const delteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = (product) => {
        //
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
            {loadingDelete && <Loader></Loader>}
            {errorDelete && <Message>{errorDelete}</Message>}
            {loading ? (
                <Loader></Loader>
            ) : error ? (
                <Message vairant='danger'>{error}</Message>
            ) : (
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
            )}
        </>
    )
}

export default ProductListScreen
