import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'

const App = () => {
    return (
        <Router>
            <Header />
            <main className='py-3'>
                <Container>
                    <Routes>
                        <Route path='/' element={<HomeScreen />} exact />
                        <Route path='/product/:id' element={<ProductScreen />} />
                        <Route path='/login' element={<LoginScreen />} />
                        <Route path='/register' element={<RegisterScreen />} />
                        <Route path='/profile' element={<ProfileScreen />} />
                        <Route path='/shipping' element={<ShippingScreen />} />
                        <Route path='/payment' element={<PaymentScreen />} />
                        <Route path='/placeorder' element={<PlaceOrderScreen />} />
                        <Route path='/order/:id' element={<OrderScreen />} />
                        <Route path='/cart/'>
                            <Route path=':id' element={<CartScreen />} />
                            <Route path='' element={<CartScreen />} />
                        </Route>
                    </Routes>
                </Container>
            </main>
            <Footer />
        </Router>
    )
}

export default App
