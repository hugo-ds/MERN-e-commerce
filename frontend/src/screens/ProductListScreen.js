import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Paginate from '../components/Paginate'
import { useCreateProductMutation, useDeleteProductMutation, useListProductQuery } from '../services/api'

// Shows a list of all products. Must be logged in as an admin user to see this page.
const ProductListScreen = () => {
    // Declare delete a product mutation and its result data.
    const [deleteProduct, { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete }] =
        useDeleteProductMutation()

    // Declare create a sample product mutation and its result data.
    const [
        createProduct,
        { isLoading: isLoadingCreate, isError: isErrorCreate, isSuccess: successCreate, data: createdProduct },
    ] = useCreateProductMutation()

    const navigate = useNavigate()

    let { pageNumber = 1 } = useParams() // Get current page number from url.

    // Fetch product list.
    const { isLoading: isLoadingList, isError: isErrorList, data } = useListProductQuery('', pageNumber)

    // Get user's login info. Force login.
    const { userInfo } = useSelector((state) => state.userLogin)
    useEffect(() => {
        if (userInfo && !userInfo.isAdmin) {
            navigate('/login')
        }

        // When a sample product is created, redirect to edit page.
        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`)
        }
    }, [navigate, userInfo, isSuccessDelete, successCreate, createdProduct, pageNumber])

    // Delete a product.
    const deleteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            deleteProduct(id)
        }
    }

    // Create a sample product to be editted.
    const createProductHandler = () => {
        createProduct()
    }

    return (
        <>
            <Meta title='Product list'></Meta>
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
            {isLoadingCreate && <Loader></Loader>}
            {isErrorCreate && <Message>{isErrorCreate}</Message>}
            {isLoadingDelete && <Loader></Loader>}
            {isErrorDelete && <Message>{isErrorDelete}</Message>}
            {isLoadingList ? (
                <Loader></Loader>
            ) : isErrorList ? (
                <Message vairant='danger'>{isErrorList}</Message>
            ) : data ? (
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
                            {data.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        {/* Product edit button */}
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='dark' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                        {/* Product delete button */}
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true}></Paginate>
                </>
            ) : null}
        </>
    )
}

export default ProductListScreen
