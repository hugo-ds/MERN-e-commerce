import { Alert } from 'react-bootstrap'

// Message box.
// Props: color (variant) and message (children).
const Message = ({ variant, children }) => {
    return <Alert variant={variant}>{children}</Alert>
}

// Default color is red (danger).
Message.defaultProps = {
    variant: 'danger',
}

export default Message
