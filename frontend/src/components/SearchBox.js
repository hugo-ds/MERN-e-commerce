import React, { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
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
        <InputGroup>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search products...'
                className='mr-sm-2 ml-sm-5'
            ></Form.Control>

            <Button type='submit' variant='outline-success' className='p-2' onClick={submitHandler}>
                Search
            </Button>
        </InputGroup>
    )
}
