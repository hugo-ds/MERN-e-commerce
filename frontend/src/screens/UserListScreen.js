import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { deleteUser, listUsers } from '../slices/userSlice'
import { useDeleteUserMutation, useListUsersQuery } from '../services/api'

const UserListScreen = () => {
    // const { loading, error, users } = useSelector((state) => state.userList)
    const { isLoading: loading, isError: error, data: users } = useListUsersQuery()

    const { userInfo } = useSelector((state) => state.userLogin)

    // const { success } = useSelector((state) => state.userDelete)
    const [deleteUser, { isSuccess: success }] = useDeleteUserMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            // dispatch(listUsers())
        } else {
            navigate('/login')
        }
    }, [dispatch, navigate, userInfo, success])

    const delteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            // dispatch(deleteUser(id))
            deleteUser(id)
        }
    }

    return (
        <>
            <h1>Users</h1>
            {loading ? (
                <Loader></Loader>
            ) : error ? (
                <Message vairant='danger'>{error}</Message>
            ) : (
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
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='dark' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => delteHandler(user._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen
