import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export const SearchBox = () => {
    const [keyword, setKeyword] = useState('')

    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
    }

    return (
        // d-flex class aligns text field and button.
        <Form onSubmit={submitHandler} className='d-flex'>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search products...'
                className='mr-sm-2 ml-sm-5'
            ></Form.Control>

            <Button type='submit' variant='outline-success' className='p-2'>
                Search
            </Button>
        </Form>
    )
}
