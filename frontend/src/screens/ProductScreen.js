import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../products'

const ProductScreen = ({ match }) => {
    // match.params.id == :id in the url
    // const product = products.find((p) => p._id === match.params.id)
    console.log(match)
    return (
        <div>
            {/* {product.name} */}
        </div>
    )
}

export default ProductScreen
