import { Container, Row, Col } from 'react-bootstrap'

// Each page's footer.
const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className='text-center py-3'>Copyright &copy; ProShop </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
