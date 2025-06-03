import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/user.context'

// Structured logging helper for development debugging
const logger = {
    info: (message, context = {}) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[${new Date().toISOString()}] AUTH-INFO: ${message}`, context);
        }
    },
    warn: (message, context = {}) => {
        console.warn(`[${new Date().toISOString()}] AUTH-WARN: ${message}`, context);
    },
    error: (message, context = {}) => {
        console.error(`[${new Date().toISOString()}] AUTH-ERROR: ${message}`, context);
    }
};

const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    
    // Refs to prevent navigation loops and duplicate effects
    const hasNavigated = useRef(false)
    const lastUserState = useRef(null)
    const lastPathname = useRef(null)

    useEffect(() => {
        try {
            // Clear any previous auth errors
            if (authError) {
                setAuthError(null)
            }

            // Check if user state or pathname actually changed to prevent unnecessary operations
            const userChanged = lastUserState.current !== user
            const pathChanged = lastPathname.current !== location.pathname
            
            if (!userChanged && !pathChanged && !loading) {
                // No meaningful change, skip processing
                return
            }

            // Update refs
            lastUserState.current = user
            lastPathname.current = location.pathname

            // Reset navigation flag if pathname changed externally
            if (pathChanged) {
                hasNavigated.current = false
            }

            // Log current auth state for debugging
            logger.info('Auth state evaluation', {
                hasUser: !!user,
                userId: user?._id || user?.id || 'none',
                email: user?.email || 'none',
                currentPath: location.pathname,
                hasNavigated: hasNavigated.current,
                userChanged,
                pathChanged
            })

            if (user) {
                // User is authenticated
                setLoading(false)
                
                // Prevent navigation loops
                if (!hasNavigated.current) {
                    // Check if user is on pages they shouldn't be on when authenticated
                    const redirectPages = ['/', '/login', '/register']
                    
                    if (redirectPages.includes(location.pathname)) {
                        logger.info('Redirecting authenticated user to home', {
                            userId: user._id || user.id,
                            email: user.email,
                            fromPath: location.pathname
                        })
                        
                        hasNavigated.current = true
                        navigate('/home', { replace: true })
                    }
                }
            } else {
                // No authenticated user
                logger.info('No authenticated user found', {
                    currentPath: location.pathname,
                    hasNavigated: hasNavigated.current
                })
                
                // Prevent navigation loops
                if (!hasNavigated.current && location.pathname !== '/') {
                    logger.info('Redirecting unauthenticated user to landing page', {
                        fromPath: location.pathname
                    })
                    
                    hasNavigated.current = true
                    navigate('/', { replace: true })
                }
                
                setLoading(false)
            }
        } catch (error) {
            // Handle any errors in the auth logic gracefully
            logger.error('Error in auth effect', {
                error: error.message,
                stack: error.stack,
                currentPath: location.pathname,
                hasUser: !!user
            })
            
            setAuthError('An error occurred during authentication. Please refresh the page.')
            setLoading(false)
        }
    }, [user, location.pathname, navigate, authError, loading])

    // Handle context errors gracefully
    useEffect(() => {
        try {
            // Validate that UserContext is properly provided
            if (user === undefined && !loading) {
                logger.warn('UserContext may not be properly initialized', {
                    currentPath: location.pathname
                })
            }
        } catch (contextError) {
            logger.error('Error accessing UserContext', {
                error: contextError.message,
                currentPath: location.pathname
            })
            
            setAuthError('Authentication system error. Please refresh the page.')
            setLoading(false)
        }
    }, [user, loading, location.pathname])

    // Loading state with enhanced accessibility
    if (loading) {
        logger.info('Displaying loading state', {
            currentPath: location.pathname
        })
        
        return (
            <div 
                role="status" 
                aria-live="polite"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                    fontSize: '16px'
                }}
            >
                Loading...
            </div>
        )
    }

    // Error state with user-friendly message
    if (authError) {
        logger.error('Displaying auth error state', {
            error: authError,
            currentPath: location.pathname
        })
        
        return (
            <div 
                role="alert"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                    padding: '20px',
                    textAlign: 'center'
                }}
            >
                <div style={{ color: '#dc3545', marginBottom: '16px', fontSize: '16px' }}>
                    {authError}
                </div>
                <button 
                    onClick={() => {
                        logger.info('User triggered page refresh from auth error')
                        window.location.reload()
                    }}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Refresh Page
                </button>
            </div>
        )
    }

    // Successfully authenticated - render children
    logger.info('Rendering protected content', {
        userId: user?._id || user?.id || 'unknown',
        email: user?.email || 'unknown',
        currentPath: location.pathname
    })

    return <>{children}</>
}

export default UserAuth