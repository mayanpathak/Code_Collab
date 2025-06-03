import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'

const UserAuth = ({ children }) => {
  const { user, loading } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login')
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    )
  }

  // If user is not authenticated, don't render children (will redirect)
  if (!user) {
    return null
  }

  // User is authenticated, render the protected component
  return children
}

export default UserAuth