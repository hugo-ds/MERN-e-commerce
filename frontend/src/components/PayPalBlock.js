import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { ListGroup } from 'react-bootstrap'
import Loader from '../components/Loader'
import { usePayOrderMutation } from '../services/api'

// Paypal payment block.
const PayPalBlock = ({ totalPrice, orderId }) => {
    // Paypal button related.
    const [{ isPending, isResolved }] = usePayPalScriptReducer()

    // Create order. Define the price to be paid.
    const onCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: totalPrice,
                    },
                },
            ],
        })
    }

    const [payOrder] = usePayOrderMutation()

    // After successful payment.
    const onApproveOrder = (data, actions) => {
        return actions.order.capture().then((details) => {
            payOrder({ orderId: orderId, paymentResult: details })
        })
    }

    return (
        <ListGroup.Item>
            {isPending || !isResolved ? (
                // Wating for script load.
                <Loader></Loader>
            ) : (
                // Successful script load.
                <PayPalButtons
                    createOrder={(data, actions) => onCreateOrder(data, actions)}
                    onApprove={(data, actions) => onApproveOrder(data, actions)}
                ></PayPalButtons>
            )}
        </ListGroup.Item>
    )
}

export default PayPalBlock
