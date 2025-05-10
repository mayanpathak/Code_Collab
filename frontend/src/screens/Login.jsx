// import React, { useState, useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { UserContext } from '../context/user.context'
// import axios from '../config/axios'

// const Login = () => {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState('')
//     const { setUser, clearUser } = useContext(UserContext)
//     const navigate = useNavigate()

//     function submitHandler(e) {
//         e.preventDefault()
//         setError('') // Clear any previous errors
//         clearUser() // Clear any existing user data

//         axios.post('/users/login', {
//             email,
//             password
//         }).then((res) => {
//             if (res.data.user && res.data.token) {
//                 localStorage.setItem('token', res.data.token)
//                 setUser(res.data.user)
//                 navigate('/home')
//             } else {
//                 throw new Error('Invalid response from server')
//             }
//         }).catch((err) => {
//             setError(err.response?.data?.error || 'Login failed. Please check your credentials and try again.')
//             clearUser() // Clear user data on error
//         })
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-900">
//             <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//                 <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
//                 {error && (
//                     <div className="mb-4 p-3 bg-red-500 text-white rounded">
//                         {error}
//                     </div>
//                 )}
//                 <form onSubmit={submitHandler}>
//                     <div className="mb-4">
//                         <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
//                         <input
//                             onChange={(e) => setEmail(e.target.value)}
//                             type="email"
//                             id="email"
//                             className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter your email"
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
//                         <input
//                             onChange={(e) => setPassword(e.target.value)}
//                             type="password"
//                             id="password"
//                             className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter your password"
//                             required
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         Login
//                     </button>
//                 </form>
//                 <p className="text-gray-400 mt-4">
//                     Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default Login
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    // Listen for API errors
    useEffect(() => {
        const handleApiError = (event) => {
            setError(event.detail.message);
            setIsLoading(false);
        };

        window.addEventListener('api_error', handleApiError);
        
        return () => {
            window.removeEventListener('api_error', handleApiError);
        };
    }, []);

    function submitHandler(e) {
        e.preventDefault();
        setError(''); // Clear any previous errors
        clearUser(); // Clear any existing user data
        setIsLoading(true);

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            setIsLoading(false);
            if (res.data.user) {
                // No need to manually save token - server sets it as an HTTP-only cookie
                setUser(res.data.user);
                navigate('/home');
            } else {
                throw new Error('Invalid response from server');
            }
        }).catch((err) => {
            setIsLoading(false);
            if (err.code === 'ERR_NETWORK') {
                setError('Unable to connect to the server. Please check if the server is running.');
            } else {
                setError(err.response?.data?.error || 'Login failed. Please check your credentials and try again.');
            }
            clearUser(); // Clear user data on error
        });
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-4">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/2 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <motion.div 
                className="bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-gray-800/50"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="flex items-center justify-center mb-6"
                    variants={itemVariants}
                >
                    <div className="p-3 bg-indigo-600 rounded-xl">
                        <LogIn size={30} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white ml-3">Sign In</h2>
                </motion.div>

                <motion.p 
                    className="text-gray-400 text-center mb-6"
                    variants={itemVariants}
                >
                    Welcome back! Please sign in to continue
                </motion.p>

                {error && (
                    <motion.div 
                        className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle className="mr-2 flex-shrink-0" size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={submitHandler}>
                    <motion.div className="mb-5" variants={itemVariants}>
                        <label className="block text-indigo-300 mb-2 font-medium" htmlFor="email">Email</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Mail size={18} />
                            </span>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                                className="w-full p-3 pl-10 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="your.email@example.com"
                                required
                        />
                    </div>
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block text-indigo-300 mb-2 font-medium" htmlFor="password">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Lock size={18} />
                            </span>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                                className="w-full p-3 pl-10 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="••••••••••••"
                                required
                        />
                    </div>
                        <div className="flex justify-end mt-2">
                            <motion.button
                                type="button"
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                whileHover={{ scale: 1.05 }}
                            >
                                Forgot password?
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 flex items-center justify-center"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>

                <motion.div 
                    className="mt-8 text-center"
                    variants={itemVariants}
                >
                    <p className="text-gray-400 mb-4">Or continue with</p>
                    <div className="flex justify-center space-x-4">
                        <motion.div 
                            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 cursor-pointer"
                            whileHover={{ scale: 1.1, backgroundColor: '#1f2937' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </motion.div>
                        <motion.div 
                            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 cursor-pointer"
                            whileHover={{ scale: 1.1, backgroundColor: '#1f2937' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </motion.div>
                        <motion.div 
                            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 cursor-pointer"
                            whileHover={{ scale: 1.1, backgroundColor: '#1f2937' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div 
                    className="mt-8 border-t border-gray-800 pt-6 text-center"
                    variants={itemVariants}
                >
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <motion.span
                            whileHover={{ color: '#a5b4fc' }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                                Sign up
                            </Link>
                        </motion.span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;