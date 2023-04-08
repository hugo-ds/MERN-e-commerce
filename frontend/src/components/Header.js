import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { SearchBox } from './SearchBox'
import { logoutUser } from '../slices/userSlice'

// Each page's header.
const Header = () => {
    // Get user's login info.
    const { userInfo } = useSelector((state) => state.userLogin)

    const dispatch = useDispatch()

    // Logout current user.
    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        dispatch(logoutUser())
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>MERN Shop</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        {/* Search bar. */}
                        <Col className='col'>
                            <SearchBox></SearchBox>
                        </Col>
                        <Col className='col-auto'>
                            <Nav>
                                {/* Cart link. */}
                                <LinkContainer to='/cart'>
                                    <Nav.Link href='/cart'>
                                        <i className='fas fa-shopping-cart'></i> Cart
                                    </Nav.Link>
                                </LinkContainer>
                                {/* User menu link. */}
                                {userInfo ? (
                                    // If user is logged in, show user menu.
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
                                        {userInfo.isAdmin && (
                                            // If user is admin. Show admin menu too.
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
                                        {/* Logout current user. */}
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    // If user isn't logged in, show sign in link.
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
