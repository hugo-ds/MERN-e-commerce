import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useDeleteUserMutation, useListUsersQuery } from '../services/api'

// List of all users. Admin only.
const UserListScreen = () => {
    // Fetch list of all users.
    const { isLoading, isError, data: users } = useListUsersQuery()

    // Declare delete a user mutation.
    const [deleteUser] = useDeleteUserMutation()

    const navigate = useNavigate()

    // Get user's login info.
    const { userInfo } = useSelector((state) => state.userLogin)

    useEffect(() => {
        // Force login. Admin only.
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        }
    }, [navigate, userInfo])

    // Delete a user.
    const deleteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            deleteUser(id)
        }
    }

    return (
        <>
            <h1>Users</h1>
            {isLoading ? (
                <Loader></Loader>
            ) : isError ? (
                <Message vairant='danger'>{isError}</Message>
            ) : users ? (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>NAME</td>
                            <td>EMAIL</td>
                            <td>ADMIN</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <i className='fas fa-check' style={{ color: 'green' }}></i>
                                    ) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}
                                </td>
                                <td>
                                    {/* Edit a user */}
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='dark' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    {/* Delete a user. */}
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : null}
        </>
    )
}

export default UserListScreen
