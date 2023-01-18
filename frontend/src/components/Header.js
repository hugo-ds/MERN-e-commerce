import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'
import { SearchBox } from './SearchBox'

const Header = () => {
    const dispatch = useDispatch()

    // Use "useSelector" to extract data from the "state".
    const { userInfo } = useSelector((state) => state.userLogin)

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>ProShop</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Col className='col'>
                            <SearchBox></SearchBox>
                        </Col>
                        <Col className='col-auto'>
                            <Nav>
                                <LinkContainer to='/cart'>
                                    <Nav.Link href='/cart'>
                                        <i className='fas fa-shopping-cart'></i> Cart
                                    </Nav.Link>
                                </LinkContainer>
                                {userInfo ? (
                                    <NavDropdown
                                        className='mr-auto'
                                        title={
                                            <span>
                                                <i className='fas fa-user'></i> {userInfo.name}
                                            </span>
                                        }
                                        id='username'
                                    >
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>Profile</NavDropdown.Item>
                                        </LinkContainer>
                                        {userInfo && userInfo.isAdmin && (
                                            <>
                                                <NavDropdown.Divider />
                                                <LinkContainer to='/admin/userlist'>
                                                    <NavDropdown.Item>Users</NavDropdown.Item>
                                                </LinkContainer>
                                                <LinkContainer to='/admin/productlist'>
                                                    <NavDropdown.Item>Products</NavDropdown.Item>
                                                </LinkContainer>
                                                <LinkContainer to='/admin/orderlist'>
                                                    <NavDropdown.Item>Orders</NavDropdown.Item>
                                                </LinkContainer>
                                            </>
                                        )}
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <LinkContainer to='/login'>
                                        <Nav.Link href='/login'>
                                            <i className='fas fa-user'></i> Sign In
                                        </Nav.Link>
                                    </LinkContainer>
                                )}
                            </Nav>
                        </Col>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
