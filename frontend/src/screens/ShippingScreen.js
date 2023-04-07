import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../slices/cartSlice'

// Input shipping data.
const ShippingScreen = () => {
    const { shippingAddress } = useSelector((state) => state.cart)

    // Form data.
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Get user's login info.
    const { userInfo } = useSelector((state) => state.userLogin)

    useEffect(() => {
        if (!userInfo) {
            navigate('/login') // Force login.
        }
    }, [userInfo, navigate])

    // Save shipping address and go to next page.
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/payment')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address' className='py-3'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter address'
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='city' className='py-3'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter city'
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode' className='py-3'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='country' className='py-3'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {/* Save shipping address and go to next page. */}
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
