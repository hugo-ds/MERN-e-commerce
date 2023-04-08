import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useRegisterMutation } from '../services/api'
import Meta from '../components/Meta'

// User registration.
const RegisterScreen = () => {
    const location = useLocation() // Get url.
    // Get redirect page.
    const redirect = location.search ? location.search.split('=')[1] : '/'

    const [register, { isLoading, isError }] = useRegisterMutation()

    // Get user's login info.
    const { userInfo } = useSelector((state) => state.userLogin)

    const navigate = useNavigate()

    useEffect(() => {
        // If is already logged in, redirect.
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, navigate, redirect])

    // Form data.
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    // Register new user.
    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            register({ name, email, password })
        }
    }

    return (
        <>
            <Meta title='Registration'></Meta>

            <FormContainer>
                <h1>Sign Up</h1>
                {message && <Message variant='danger'>{message}</Message>}
                {isError && <Message variant='danger'>{isError}</Message>}
                {isLoading && <Loader></Loader>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='py-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email' className='py-3'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password' className='py-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='confirmPassword' className='py-3'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    {/* Register new user. */}
                    <Button type='submit' variant='primary'>
                        Register
                    </Button>
                </Form>
                {/* Redirect to login page if already have an acount. */}
                <Row className='py-3'>
                    <Col>
                        Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                    </Col>
                </Row>
            </FormContainer>
        </>
    )
}

export default RegisterScreen
