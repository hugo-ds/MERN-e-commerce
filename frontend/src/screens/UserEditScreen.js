import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../services/api'
import Meta from '../components/Meta'

// Edit user data.
const UserEditScreen = () => {
    const { id: userId } = useParams() // Get id from url.

    // Fetch user's details.
    const { isLoading: isLoadingUserDetails, isError: isErrorUserDetails, data: user } = useGetUserDetailsQuery(userId)

    // Declare update user's data mutation and its result data.
    const [updateUser, { isLoading: isLoadingUpdate, isError: isErrorUpdate, isSuccess: isSuccessUpdate }] =
        useUpdateUserMutation()

    const navigate = useNavigate()

    useEffect(() => {
        // When user's data is updated, go to users list page.
        if (isSuccessUpdate) {
            navigate('/admin/userlist')
        } else {
            if (user && user.name && user._id === userId) {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [navigate, user, userId, isSuccessUpdate])

    // Form data.
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    // Update user's data.
    const submitHandler = (e) => {
        e.preventDefault()
        updateUser({ _id: userId, name, email, isAdmin })
    }

    return (
        <>
            <Meta title='User Edit'></Meta>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {isLoadingUpdate && <Loader></Loader>}
                {isErrorUpdate && <Message>{isErrorUpdate}</Message>}
                {isLoadingUserDetails ? (
                    <Loader></Loader>
                ) : isErrorUserDetails ? (
                    <Message variant='danger'>{isErrorUserDetails}</Message>
                ) : (
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

                        <Form.Group controlId='isadmin' className='py-3'>
                            <Form.Check
                                type='checkbox'
                                label='Is Admin'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>

                        {/* Update user's data. */}
                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default UserEditScreen
