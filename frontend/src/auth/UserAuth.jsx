import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/user.context'

const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (user) {
            setLoading(false)
            // If user is on landing page or login/register pages, redirect to home
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
                navigate('/home')
            }
        } else {
            // No authenticated user, redirect to landing page
            navigate('/')
            setLoading(false)
        }
    }, [user, location.pathname, navigate])

    if (loading) {
        return <div>Loading...</div>
    }

    return <>{children}</>
}

export default UserAuth